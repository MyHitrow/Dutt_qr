export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
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

    if (!buffer) {
      return NextResponse.json({ success: false, error: "Görsel verisi çözülemedi" }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const filename = `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Optimize with sharp: max 800x800, WebP with transparency support, quality 82
    await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(filepath);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
