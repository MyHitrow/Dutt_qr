export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// In-memory brute-force protection tracking failed attempts per IP
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function POST(req: Request) {
  try {
    // Basic IP detection from headers
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-client";

    const now = Date.now();
    const record = failedAttempts.get(clientIp);

    // Check if client is currently locked out
    if (record && record.lockedUntil > now) {
      const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          message: `Güvenlik Koruması: Çok fazla hatalı deneme yapıldı. Lütfen ${waitSeconds} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    const validUsernames = (
      process.env.ADMIN_USERNAMES || "admin,dutt,duttmeyhane"
    )
      .split(",")
      .map((u) => u.trim().toLowerCase());

    const validPasswords = (
      process.env.ADMIN_PASSWORDS || "dutt123,DuttMersin.2026!"
    )
      .split(",")
      .map((p) => p.trim());

    const isUserValid = validUsernames.includes((username || "").trim().toLowerCase());
    const isPassValid = validPasswords.includes((password || "").trim());

    if (isUserValid && isPassValid) {
      // Reset failed attempts on success
      failedAttempts.delete(clientIp);

      const res = NextResponse.json({ success: true, message: "Giriş başarılı" });
      res.cookies.set("dut_admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    // Track failed attempt
    const currentCount = (record?.count || 0) + 1;
    if (currentCount >= 5) {
      // Lock for 60 seconds
      failedAttempts.set(clientIp, { count: currentCount, lockedUntil: now + 60 * 1000 });
      return NextResponse.json(
        {
          success: false,
          message: "5 kez hatalı şifre girildi. Güvenlik nedeniyle erişim 60 saniye kilitlendi.",
        },
        { status: 429 }
      );
    } else {
      failedAttempts.set(clientIp, { count: currentCount, lockedUntil: 0 });
    }

    return NextResponse.json(
      {
        success: false,
        message: `Kullanıcı adı veya şifre hatalı! (Kalan deneme hakkı: ${5 - currentCount})`,
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Giriş sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Çıkış yapıldı" });
  res.cookies.delete("dut_admin_session");
  return res;
}
