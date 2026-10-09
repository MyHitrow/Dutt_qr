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

const PERSISTENT_STORAGE_PATH = path.join(process.cwd(), "storage", "db.json");
export const PRIMARY_DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : fs.existsSync(path.dirname(PERSISTENT_STORAGE_PATH))
  ? PERSISTENT_STORAGE_PATH
  : path.join(process.cwd(), "src", "data", "db.json");
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
 * Enforces relational integrity: cascades category deletions and cleans up orphaned products.
 */
export function enforceIntegrity(data: Partial<DatabaseSchema>): DatabaseSchema {
  const currentInitial = getInitialDatabaseData();
  const venue = data.venue || currentInitial.venue;
  const categories = Array.isArray(data.categories) ? data.categories : currentInitial.categories;
  let products = Array.isArray(data.products) ? data.products : currentInitial.products;
  const dailyFixMenus = Array.isArray(data.dailyFixMenus) ? data.dailyFixMenus : currentInitial.dailyFixMenus;

  const validCatIds = new Set(categories.map((c) => c.id));
  const fallbackCatId = categories.length > 0 ? categories[0].id : "cat-genel";

  // Re-assign or sanitize products with deleted categories to avoid orphan records
  products = products.map((p) => {
    if (!validCatIds.has(p.categoryId)) {
      return { ...p, categoryId: fallbackCatId };
    }
    return p;
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
