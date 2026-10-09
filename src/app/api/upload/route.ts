export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

import { verifyAdminRequest } from "@/lib/auth";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB limit

/**
 * Validates file buffer magic bytes against trusted image headers.
 * Explicitly rejects SVG, executables, scripts, and polyglot files.
 */
function isValidImageBuffer(buf: Buffer): boolean {
  if (buf.length < 12) return false;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) &&
    buf[5] === 0x61
  ) {
    return true;
  }

  // WEBP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    // 🔒 SECURITY CHECK: Ensure caller is authenticated admin
    const isAuthorized = verifyAdminRequest(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz Erişim: Görsel yüklemek için admin girişi gereklidir." },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "Dosya bulunamadı" }, { status: 400 });
      }
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      const base64Data = body.image || body.imageBase64 || body.data;
      if (!base64Data || typeof base64Data !== "string") {
        return NextResponse.json({ success: false, error: "Geçersiz görsel verisi" }, { status: 400 });
      }
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(base64Data, "base64");
      }
    } else {
      return NextResponse.json({ success: false, error: "Desteklenmeyen içerik türü" }, { status: 400 });
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ success: false, error: "Görsel verisi çözülemedi" }, { status: 400 });
    }

    // 🛡️ Security Check: File Size Limit (Max 8MB)
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Dosya boyutu çok yüksek (Maksimum 8MB yüklenebilir)." },
        { status: 413 }
      );
    }

    // 🛡️ Security Check: Binary Magic Bytes Inspection (Anti-MIME-Spoofing & Anti-XSS)
    if (!isValidImageBuffer(buffer)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz dosya biçimi! Yalnızca gerçek JPEG, PNG, WebP ve GIF dosyaları kabul edilir (SVG veya yabancı dosyalar güvenlik nedeniyle engellenmiştir).",
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const filename = `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Optimize with sharp under timeout control to protect against decompression bombs
    await Promise.race([
      sharp(buffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(filepath),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Görsel optimizasyonu zaman aşımına uğradı (Sharp timeout)")), 20_000)
      ),
    ]);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Görsel yüklenirken bir hata oluştu";
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
