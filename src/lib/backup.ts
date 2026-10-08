import fs from "fs";
import path from "path";

export interface BackupItem {
  filename: string;
  type: "daily" | "manual";
  date: string;
  sizeBytes: number;
  sizeFormatted: string;
  productCount?: number;
  categoryCount?: number;
}

export function getStorageDir(): string {
  const customDbPath = process.env.DB_PATH;
  if (customDbPath) {
    return path.dirname(path.resolve(customDbPath));
  }
  const persistentStorage = path.join(process.cwd(), "storage");
  if (fs.existsSync(persistentStorage)) {
    return persistentStorage;
  }
  return path.join(process.cwd(), "src", "data");
}

export function getBackupDir(): string {
  const base = getStorageDir();
  return path.join(base, "backups");
}

export async function ensureBackupDir(): Promise<string> {
  const dir = getBackupDir();
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
    try {
      await fs.promises.chmod(dir, 0o777);
    } catch {}
  }
  return dir;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Creates an automatic daily backup if one doesn't exist for today.
 * Rotates and removes backups older than 30 days.
 */
export async function createDailyBackupIfNeeded(data: any): Promise<boolean> {
  try {
    const backupDir = await ensureBackupDir();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const filename = `db_daily_${today}.json`;
    const targetPath = path.join(backupDir, filename);

    if (fs.existsSync(targetPath)) {
      return false; // Already backed up today
    }

    const payload = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(targetPath, payload, "utf8");
    try {
      await fs.promises.chmod(targetPath, 0o777);
    } catch {}

    // Cleanup backups older than 30 days
    await pruneOldBackups(backupDir, 30);
    return true;
  } catch (err) {
    console.warn("Auto backup warning:", err);
    return false;
  }
}

/**
 * Creates a manual backup on demand.
 */
export async function createManualBackup(data: any): Promise<string> {
  const backupDir = await ensureBackupDir();
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, "-");
  const filename = `db_manual_${dateStr}.json`;
  const targetPath = path.join(backupDir, filename);

  const payload = JSON.stringify(data, null, 2);
  await fs.promises.writeFile(targetPath, payload, "utf8");
  try {
    await fs.promises.chmod(targetPath, 0o777);
  } catch {}

  return filename;
}

/**
 * List all available backup files sorted by creation date descending.
 */
export async function listBackups(): Promise<BackupItem[]> {
  try {
    const backupDir = await ensureBackupDir();
    const files = await fs.promises.readdir(backupDir);
    const result: BackupItem[] = [];

    for (const file of files) {
      if (!file.endsWith(".json") || !file.startsWith("db_")) continue;
      const filePath = path.join(backupDir, file);
      const stat = await fs.promises.stat(filePath);

      let productCount: number | undefined;
      let categoryCount: number | undefined;

      try {
        const raw = await fs.promises.readFile(filePath, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.products)) productCount = parsed.products.length;
        if (Array.isArray(parsed?.categories)) categoryCount = parsed.categories.length;
      } catch {}

      result.push({
        filename: file,
        type: file.includes("daily") ? "daily" : "manual",
        date: stat.mtime.toISOString(),
        sizeBytes: stat.size,
        sizeFormatted: formatBytes(stat.size),
        productCount,
        categoryCount,
      });
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error("List backups error:", err);
    return [];
  }
}

/**
 * Restores a backup file to current active database.
 */
export async function restoreBackup(filename: string): Promise<any> {
  const backupDir = await ensureBackupDir();
  const safeFilename = path.basename(filename);
  const sourcePath = path.join(backupDir, safeFilename);

  if (!fs.existsSync(sourcePath)) {
    throw new Error("Yedek dosyası bulunamadı.");
  }

  const raw = await fs.promises.readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || !parsed.products || !parsed.categories) {
    throw new Error("Geçersiz yedek dosyası yapısı.");
  }

  return parsed;
}

async function pruneOldBackups(backupDir: string, maxDays: number) {
  try {
    const files = await fs.promises.readdir(backupDir);
    const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(backupDir, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.mtimeMs < cutoff) {
        await fs.promises.unlink(filePath).catch(() => {});
      }
    }
  } catch {}
}
