export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listBackups, createManualBackup, restoreBackup } from "@/lib/backup";
import fs from "fs";
import path from "path";

// Path to write database
const PERSISTENT_STORAGE_PATH = path.join(process.cwd(), "storage", "db.json");
const PRIMARY_DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : fs.existsSync(path.dirname(PERSISTENT_STORAGE_PATH))
  ? PERSISTENT_STORAGE_PATH
  : path.join(process.cwd(), "src", "data", "db.json");

export async function GET() {
  try {
    const backups = await listBackups();
    return NextResponse.json({ success: true, backups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action;

    if (action === "create") {
      // Read current DB and create backup
      if (!fs.existsSync(PRIMARY_DB_PATH)) {
        return NextResponse.json({ success: false, error: "Aktif veritabanı bulunamadı." }, { status: 400 });
      }
      const raw = await fs.promises.readFile(PRIMARY_DB_PATH, "utf8");
      const data = JSON.parse(raw);
      const filename = await createManualBackup(data);
      const backups = await listBackups();

      return NextResponse.json({
        success: true,
        message: "Yedek başarıyla oluşturuldu.",
        filename,
        backups,
      });
    }

    if (action === "restore") {
      const filename = body?.filename;
      if (!filename) {
        return NextResponse.json({ success: false, error: "Dosya adı belirtilmedi." }, { status: 400 });
      }

      const restoredData = await restoreBackup(filename);
      // Write to PRIMARY_DB_PATH
      const dir = path.dirname(PRIMARY_DB_PATH);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }
      await fs.promises.writeFile(PRIMARY_DB_PATH, JSON.stringify(restoredData, null, 2), "utf8");

      return NextResponse.json({
        success: true,
        message: "Yedek başarıyla geri yüklendi. Sayfa yenilendiğinde verileriniz güncellenecektir.",
        data: restoredData,
      });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
