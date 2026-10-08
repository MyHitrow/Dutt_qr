export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsernames = (
      process.env.ADMIN_USERNAMES || "admin,dutt,duttmeyhane"
    )
      .split(",")
      .map((u) => u.trim().toLowerCase());

    const validPasswords = (
      process.env.ADMIN_PASSWORDS || "dutt123,123456,admin123,admin"
    )
      .split(",")
      .map((p) => p.trim());

    const isUserValid = validUsernames.includes((username || "").trim().toLowerCase());
    const isPassValid = validPasswords.includes((password || "").trim());

    if (isUserValid && isPassValid) {
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

    return NextResponse.json(
      { success: false, message: "Kullanıcı adı veya şifre hatalı!" },
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
