export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { checkAdminCredentials, signAdminToken, revokeAdminToken } from "@/lib/auth";
import { getTrustedIp, checkAuthLock, recordAuthFailure, resetAuthLock } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const clientIp = getTrustedIp(req);

    // 1. Persistent Brute-force protection check
    const lockStatus = await checkAuthLock(clientIp);
    if (lockStatus.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: `Güvenlik Koruması: Çok fazla hatalı deneme yapıldı. Lütfen ${lockStatus.waitSeconds} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    const isAuthorized = checkAdminCredentials(username, password);

    if (isAuthorized) {
      // Reset failed attempts on success
      await resetAuthLock(clientIp);

      // Issue 8-hour token
      const token = signAdminToken(username || "admin", 0.33);

      const res = NextResponse.json({
        success: true,
        message: "Giriş başarılı",
      });

      // Set hardened httpOnly cookie (SameSite=strict, 8h expiry)
      res.cookies.set("dut_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return res;
    }

    // 2. Track failed attempt persistently
    const failStatus = await recordAuthFailure(clientIp);
    if (failStatus.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: "5 kez hatalı şifre girildi. Güvenlik nedeniyle erişim 60 saniye kilitlendi.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: `Kullanıcı adı veya şifre hatalı! (Kalan deneme hakkı: ${failStatus.attemptsLeft})`,
      },
      { status: 401 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Giriş sırasında hata oluştu";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  // Revoke the token if present in cookies or Authorization header
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/dut_admin_token=([^;]+)/);
  const tokenFromCookie = match && match[1] ? decodeURIComponent(match[1].trim()) : null;

  const authHeader = req.headers.get("authorization");
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : null;

  const tokenToRevoke = tokenFromCookie || tokenFromHeader;
  if (tokenToRevoke) {
    await revokeAdminToken(tokenToRevoke);
  }

  const res = NextResponse.json({ success: true, message: "Çıkış yapıldı" });
  res.cookies.delete("dut_admin_token");
  res.cookies.delete("dut_admin_session");
  return res;
}
