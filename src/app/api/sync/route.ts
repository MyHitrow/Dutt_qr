export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  mockVenueSettings,
  mockCategories,
  mockProducts,
  mockDailyFixMenus,
} from "@/data/mockMenuData";

// Primary and fallback database file paths
const PERSISTENT_STORAGE_PATH = path.join(process.cwd(), "storage", "db.json");
const PRIMARY_DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : fs.existsSync(path.dirname(PERSISTENT_STORAGE_PATH))
  ? PERSISTENT_STORAGE_PATH
  : path.join(process.cwd(), "src", "data", "db.json");
const FALLBACK_DB_PATH = path.join("/tmp", "dutt_qr_db.json");

import { createDailyBackupIfNeeded } from "@/lib/backup";

// In-memory cache for sub-millisecond response times across requests
let memoryCache: any = null;

function getInitialData() {
  return {
    venue: mockVenueSettings,
    categories: mockCategories,
    products: mockProducts,
    dailyFixMenus: mockDailyFixMenus,
  };
}

async function readDatabase(): Promise<any> {
  if (memoryCache) {
    return memoryCache;
  }

  // 1. Try reading primary database path (e.g. /app/storage/db.json or src/data/db.json)
  try {
    if (fs.existsSync(PRIMARY_DB_PATH)) {
      const content = await fs.promises.readFile(PRIMARY_DB_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed;
        // Background auto-backup check
        createDailyBackupIfNeeded(parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read from PRIMARY_DB_PATH:", err);
  }

  // 2. If primary doesn't exist yet, try to seed from src/data/db.json
  const seedPath = path.join(process.cwd(), "src", "data", "db.json");
  if (PRIMARY_DB_PATH !== seedPath && fs.existsSync(seedPath)) {
    try {
      const content = await fs.promises.readFile(seedPath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed;
        // Write to primary path immediately so future updates persist
        await writeDatabase(parsed).catch(() => {});
        return parsed;
      }
    } catch (err) {
      console.warn("Could not seed from src/data/db.json:", err);
    }
  }

  // 3. Try reading fallback /tmp/dutt_qr_db.json
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

  // 4. If nothing exists, initialize with mockMenuData and save to disk
  const initial = getInitialData();
  memoryCache = initial;
  await writeDatabase(initial).catch(() => {});
  return initial;
}

async function writeDatabase(data: any): Promise<boolean> {
  memoryCache = data;
  const jsonStr = JSON.stringify(data, null, 2);

  // 1. Try writing to primary path
  try {
    const dir = path.dirname(PRIMARY_DB_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(PRIMARY_DB_PATH, jsonStr, "utf8");
    // Background auto-backup on save
    createDailyBackupIfNeeded(data).catch(() => {});
    return true;
  } catch (err) {
    console.warn("Could not write to PRIMARY_DB_PATH, trying fallback:", err);
  }

  // 2. Try writing to fallback /tmp path
  try {
    await fs.promises.writeFile(FALLBACK_DB_PATH, jsonStr, "utf8");
    return true;
  } catch (err) {
    console.error("Could not write to FALLBACK_DB_PATH either:", err);
    return false;
  }
}

export async function GET() {
  try {
    const data = await readDatabase();
    return NextResponse.json({ success: true, data, source: "local-file-db" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, data: getInitialData(), error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const currentData = await readDatabase();
    const mergedData = {
      venue: body.venue ? { ...currentData.venue, ...body.venue } : currentData.venue,
      categories: body.categories !== undefined ? body.categories : currentData.categories,
      products: body.products !== undefined ? body.products : currentData.products,
      dailyFixMenus: body.dailyFixMenus !== undefined ? body.dailyFixMenus : currentData.dailyFixMenus,
    };

    const saved = await writeDatabase(mergedData);
    return NextResponse.json({ success: true, data: mergedData, saved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const initial = getInitialData();
    await writeDatabase(initial);
    return NextResponse.json({ success: true, message: "Database reset to initial defaults." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
