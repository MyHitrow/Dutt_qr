export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const isValid = verifyAdminRequest(req);
  if (!isValid) {
    return NextResponse.json(
      { success: false, authenticated: false, message: "Oturum süresi dolmuş veya geçersiz." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    message: "Admin oturumu aktif ve güvenli.",
  });
}
