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

import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Yetkisiz Erişim: Admin girişi gereklidir." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const downloadFilename = searchParams.get("download");

    if (downloadFilename) {
      // Security: prevent directory traversal
      const safeName = path.basename(downloadFilename);
      const backupDir = path.join(process.cwd(), "storage", "backups");
      const filePath = path.join(backupDir, safeName);

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, error: "Yedek dosyası bulunamadı." }, { status: 404 });
      }

      const fileContent = await fs.promises.readFile(filePath, "utf8");
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${safeName}"`,
        },
      });
    }

    const backups = await listBackups();
    return NextResponse.json({ success: true, backups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Yetkisiz Erişim: Admin girişi gereklidir." }, { status: 401 });
    }
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
