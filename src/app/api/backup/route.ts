export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listBackups, createManualBackup, restoreBackup } from "@/lib/backup";
import { readDatabase, writeDatabase, invalidateCache } from "@/lib/db";
import fs from "fs";
import path from "path";
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
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Yedekler listelenirken hata oluştu";
    return NextResponse.json({ success: false, error }, { status: 500 });
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
      const data = await readDatabase();
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
      // DAT-004: Atomic write through writeDatabase queue & lock
      await writeDatabase(restoredData);
      invalidateCache();

      return NextResponse.json({
        success: true,
        message: "Yedek başarıyla geri yüklendi. Verileriniz güncellendi.",
        data: restoredData,
      });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem." }, { status: 400 });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Yedekleme işlemi başarısız";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
