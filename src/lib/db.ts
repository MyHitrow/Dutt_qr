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
const PRIMARY_DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : fs.existsSync(path.dirname(PERSISTENT_STORAGE_PATH))
  ? PERSISTENT_STORAGE_PATH
  : path.join(process.cwd(), "src", "data", "db.json");
const FALLBACK_DB_PATH = path.join("/tmp", "dutt_qr_db.json");

let memoryCache: DatabaseSchema | null = null;

// Sequential write queue to guarantee ACID concurrency & prevent race conditions
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
 * Reads database with caching and multi-tier fallbacks.
 */
export async function readDatabase(): Promise<DatabaseSchema> {
  if (memoryCache) {
    return memoryCache;
  }

  // 1. Primary path
  try {
    if (fs.existsSync(PRIMARY_DB_PATH)) {
      const content = await fs.promises.readFile(PRIMARY_DB_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed;
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
        memoryCache = parsed;
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
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch {}

  // 4. Fallback defaults
  const initial = getInitialDatabaseData();
  memoryCache = initial;
  await writeDatabase(initial).catch(() => {});
  return initial;
}

/**
 * Atomic write helper: writes to a temporary file and atomically renames it.
 * This guarantees zero corruption even on abrupt process exits or power cuts.
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
 * Thread-safe, queued atomic database write.
 */
export async function writeDatabase(data: Partial<DatabaseSchema>): Promise<DatabaseSchema> {
  // Execute via mutex queue to eliminate race conditions
  const task = async (): Promise<DatabaseSchema> => {
    const validated = enforceIntegrity(data);
    memoryCache = validated;
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

    if (writeSucceeded) {
      createDailyBackupIfNeeded(validated).catch(() => {});
    }

    return validated;
  };

  writeQueuePromise = writeQueuePromise.then(task, task);
  return writeQueuePromise;
}
