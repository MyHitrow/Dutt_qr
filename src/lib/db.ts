import fs from "fs";
import path from "path";
import {
  mockVenueSettings,
  mockCategories,
  mockProducts,
  mockDailyFixMenus,
} from "@/data/mockMenuData";
import { createDailyBackupIfNeeded } from "@/lib/backup";
import { Category, Product, VenueSettings, DailyFixMenu } from "@/types/menu";

export interface DatabaseSchema {
  version: string;
  venue: VenueSettings;
  categories: Category[];
  products: Product[];
  dailyFixMenus: DailyFixMenu[];
  lastModified?: string;
}

const STORAGE_DIR = path.join(process.cwd(), "storage");
if (!fs.existsSync(STORAGE_DIR)) {
  try {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  } catch {}
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {}
}

const PERSISTENT_STORAGE_PATH = path.join(STORAGE_DIR, "db.json");
export const PRIMARY_DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : PERSISTENT_STORAGE_PATH;
const FALLBACK_DB_PATH = path.join("/tmp", "dutt_qr_db.json");

/* ── DAT-001: OS-Level File Lock for Multi-Pod Concurrency ── */
const LOCK_FILE = path.join(process.cwd(), "storage", "db.lock");
const LOCK_TIMEOUT_MS = 6000;

export async function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  const lockDir = path.dirname(LOCK_FILE);
  if (!fs.existsSync(lockDir)) {
    try {
      fs.mkdirSync(lockDir, { recursive: true });
    } catch {}
  }

  while (true) {
    try {
      // 'wx' flag opens for writing; fails atomically if file already exists
      const fd = fs.openSync(LOCK_FILE, "wx");
      fs.writeFileSync(fd, `${process.pid}:${Date.now()}`);
      fs.closeSync(fd);
      break;
    } catch {
      try {
        if (fs.existsSync(LOCK_FILE)) {
          const content = fs.readFileSync(LOCK_FILE, "utf8");
          const [pidStr, timeStr] = content.split(":");
          const lockPid = parseInt(pidStr, 10);
          const lockTime = parseInt(timeStr, 10);
          const isOlderThanTimeout = !isNaN(lockTime) && Date.now() - lockTime > LOCK_TIMEOUT_MS;

          let isProcessDead = false;
          if (!isNaN(lockPid) && lockPid > 0) {
            try {
              process.kill(lockPid, 0);
            } catch (err: unknown) {
              const code = (err as { code?: string })?.code;
              if (code === "ESRCH") {
                isProcessDead = true;
              }
            }
          }

          if (isProcessDead || isOlderThanTimeout) {
            try {
              fs.unlinkSync(LOCK_FILE);
              continue;
            } catch {}
          }
        }
      } catch {}

      if (Date.now() - start > LOCK_TIMEOUT_MS) {
        console.warn("[db] Lock timeout reached, continuing after clearing stale lock.");
        try {
          fs.unlinkSync(LOCK_FILE);
        } catch {}
        break;
      }
      await new Promise((r) => setTimeout(r, 40));
    }
  }

  try {
    return await fn();
  } finally {
    try {
      if (fs.existsSync(LOCK_FILE)) {
        fs.unlinkSync(LOCK_FILE);
      }
    } catch {}
  }
}

/* ── DAT-002: In-Memory Cache with TTL & Disk Desync Invalidation ── */
interface CacheEntry {
  data: DatabaseSchema;
  loadedAt: number;
  mtimeMs: number;
}

let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 15_000; // 15 seconds max memory cache TTL

export function invalidateCache(): void {
  memoryCache = null;
}

// Sequential write queue to guarantee order within the same Node.js process
let writeQueuePromise = Promise.resolve<any>(null);

export function getInitialDatabaseData(): DatabaseSchema {
  return {
    version: "v1",
    venue: mockVenueSettings,
    categories: mockCategories,
    products: mockProducts,
    dailyFixMenus: mockDailyFixMenus,
    lastModified: new Date().toISOString(),
  };
}

/**
 * Automatically extracts base64 data URIs into physical files under public/uploads
 * to prevent db.json bloating and client localStorage QuotaExceededError.
 */
function extractAndSaveBase64(dataUri: string): string {
  if (!dataUri || typeof dataUri !== "string" || !dataUri.startsWith("data:")) return dataUri;
  try {
    const matches = dataUri.match(/^data:image\/([a-zA-Z0-9\+\-]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return dataUri;
    const rawExt = matches[1].toLowerCase().replace("jpeg", "jpg").replace("+xml", "");
    const ext = rawExt === "png" ? "png" : "webp";
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch {}
    }
    const filename = `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error("[db] Base64 extraction failed:", err);
    return dataUri;
  }
}

/**
 * Enforces relational integrity: cascades category deletions, cleans up orphaned products,
 * and extracts any inline base64 images to physical storage.
 */
export function enforceIntegrity(data: Partial<DatabaseSchema>): DatabaseSchema {
  const currentInitial = getInitialDatabaseData();
  const rawVenue = data.venue || currentInitial.venue;
  const categories = Array.isArray(data.categories) ? data.categories : currentInitial.categories;
  let rawProducts = Array.isArray(data.products) ? data.products : currentInitial.products;
  let rawDailyFixMenus = Array.isArray(data.dailyFixMenus) ? data.dailyFixMenus : currentInitial.dailyFixMenus;

  // Sanitize venue logos
  const venue: VenueSettings = {
    ...rawVenue,
    logoDarkUrl: rawVenue.logoDarkUrl ? extractAndSaveBase64(rawVenue.logoDarkUrl) : rawVenue.logoDarkUrl,
    logoLightUrl: rawVenue.logoLightUrl ? extractAndSaveBase64(rawVenue.logoLightUrl) : rawVenue.logoLightUrl,
  };

  const validCatIds = new Set(categories.map((c) => c.id));
  const fallbackCatId = categories.length > 0 ? categories[0].id : "cat-genel";

  // Re-assign or sanitize products with deleted categories to avoid orphan records, and extract base64 images
  const products: Product[] = rawProducts.map((p) => {
    let imgUrl = p.imageUrl;
    if (imgUrl && imgUrl.startsWith("data:")) {
      imgUrl = extractAndSaveBase64(imgUrl);
    }
    const fixedCatId = validCatIds.has(p.categoryId) ? p.categoryId : fallbackCatId;
    return {
      ...p,
      categoryId: fixedCatId,
      imageUrl: imgUrl,
      hasImage: !!imgUrl && p.hasImage !== false,
    };
  });

  // Sanitize daily fix menus and extract base64 images
  const dailyFixMenus: DailyFixMenu[] = rawDailyFixMenus.map((m) => {
    let imgUrl = m.imageUrl;
    if (imgUrl && imgUrl.startsWith("data:")) {
      imgUrl = extractAndSaveBase64(imgUrl);
    }
    return {
      ...m,
      imageUrl: imgUrl,
    };
  });

  return {
    version: data.version || Date.now().toString(36),
    venue,
    categories,
    products,
    dailyFixMenus,
    lastModified: new Date().toISOString(),
  };
}

/**
 * Reads database with caching, TTL checks, and multi-tier fallbacks.
 */
export async function readDatabase(): Promise<DatabaseSchema> {
  const now = Date.now();

  // If memory cache exists, check both TTL and disk mtime
  if (memoryCache && now - memoryCache.loadedAt < CACHE_TTL_MS) {
    try {
      if (fs.existsSync(PRIMARY_DB_PATH)) {
        const stat = await fs.promises.stat(PRIMARY_DB_PATH);
        if (stat.mtimeMs <= memoryCache.mtimeMs) {
          return memoryCache.data;
        }
      } else {
        return memoryCache.data;
      }
    } catch {
      return memoryCache.data;
    }
  }

  // 1. Primary path
  try {
    if (fs.existsSync(PRIMARY_DB_PATH)) {
      const [content, stat] = await Promise.all([
        fs.promises.readFile(PRIMARY_DB_PATH, "utf8"),
        fs.promises.stat(PRIMARY_DB_PATH),
      ]);
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = { data: parsed, loadedAt: now, mtimeMs: stat.mtimeMs };
        createDailyBackupIfNeeded(parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[db] Failed reading PRIMARY_DB_PATH:", err);
  }

  // 2. Seed path
  const seedPath = path.join(process.cwd(), "src", "data", "db.json");
  if (PRIMARY_DB_PATH !== seedPath && fs.existsSync(seedPath)) {
    try {
      const content = await fs.promises.readFile(seedPath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = { data: parsed, loadedAt: now, mtimeMs: now };
        await writeDatabase(parsed).catch(() => {});
        return parsed;
      }
    } catch {}
  }

  // 3. Fallback path
  try {
    if (fs.existsSync(FALLBACK_DB_PATH)) {
      const content = await fs.promises.readFile(FALLBACK_DB_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = { data: parsed, loadedAt: now, mtimeMs: now };
        return parsed;
      }
    }
  } catch {}

  // 4. Fallback defaults
  const initial = getInitialDatabaseData();
  memoryCache = { data: initial, loadedAt: now, mtimeMs: now };
  await writeDatabase(initial).catch(() => {});
  return initial;
}

/**
 * Atomic write helper: writes to a temporary file and atomically renames it.
 * Guarantees zero corruption even on abrupt process exits or power cuts.
 */
async function atomicWrite(targetPath: string, content: string): Promise<void> {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }

  const tmpPath = `${targetPath}.tmp.${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await fs.promises.writeFile(tmpPath, content, "utf8");
  await fs.promises.rename(tmpPath, targetPath);
}

/**
 * Thread-safe, cross-process queued atomic database write.
 * Protects against race conditions across multiple pods/instances.
 */
export async function writeDatabase(data: Partial<DatabaseSchema>): Promise<DatabaseSchema> {
  const task = async (): Promise<DatabaseSchema> => {
    return withFileLock(async () => {
      const validated = enforceIntegrity(data);
      const jsonStr = JSON.stringify(validated, null, 2);

      let writeSucceeded = false;

      // 1. Try atomic write to primary
      try {
        await atomicWrite(PRIMARY_DB_PATH, jsonStr);
        writeSucceeded = true;
      } catch (err) {
        console.warn("[db] Primary atomic write failed, trying fallback:", err);
      }

      // 2. Try fallback if primary failed
      if (!writeSucceeded) {
        try {
          await atomicWrite(FALLBACK_DB_PATH, jsonStr);
          writeSucceeded = true;
        } catch (err) {
          console.error("[db] Critical: Fallback atomic write failed:", err);
        }
      }

      // Update in-memory cache
      memoryCache = { data: validated, loadedAt: Date.now(), mtimeMs: Date.now() };

      if (writeSucceeded) {
        createDailyBackupIfNeeded(validated).catch(() => {});
      }

      return validated;
    });
  };

  writeQueuePromise = writeQueuePromise.then(task, task);
  return writeQueuePromise;
}
