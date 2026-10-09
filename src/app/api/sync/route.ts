export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readDatabase, writeDatabase, getInitialDatabaseData } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientVersion =
      searchParams.get("v") || req.headers.get("if-none-match")?.replace(/"/g, "");

    const data = await readDatabase();
    const currentVersion = data.version || "v1";

    // PERF-001: True HTTP 304 Not Modified — saves server CPU and mobile bandwidth
    if (clientVersion && clientVersion === currentVersion) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: `"${currentVersion}"`,
          "Cache-Control": "public, max-age=5, stale-while-revalidate=30",
        },
      });
    }

    return NextResponse.json(
      { success: true, data, version: currentVersion, source: "atomic-queued-db" },
      {
        headers: {
          ETag: `"${currentVersion}"`,
          "Cache-Control": "public, max-age=5, stale-while-revalidate=30",
        },
      }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Sync read error";
    return NextResponse.json(
      { success: false, data: getInitialDatabaseData(), error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 🔒 SECURITY CHECK: Ensure caller has valid Admin Auth
    const isAuthorized = verifyAdminRequest(req);
    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Yetkisiz Erişim: Bu işlemi gerçekleştirmek için admin girişi gereklidir.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Geçersiz veri gönderildi" },
        { status: 400 }
      );
    }

    const currentData = await readDatabase();
    const newVersion = Date.now().toString(36);

    const mergedData = {
      ...currentData,
      version: newVersion,
      venue: body.venue ? { ...currentData.venue, ...body.venue } : currentData.venue,
      categories: body.categories !== undefined ? body.categories : currentData.categories,
      products: body.products !== undefined ? body.products : currentData.products,
      dailyFixMenus:
        body.dailyFixMenus !== undefined ? body.dailyFixMenus : currentData.dailyFixMenus,
      lastModified: new Date().toISOString(),
    };

    const saved = await writeDatabase(mergedData);
    return NextResponse.json({ success: true, data: saved, version: newVersion });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Sync write error";
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // 🔒 SECURITY CHECK: Admin verification
    const isAuthorized = verifyAdminRequest(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz Erişim: Sıfırlama yetkiniz bulunmamaktadır." },
        { status: 401 }
      );
    }

    const initial = getInitialDatabaseData();
    await writeDatabase(initial);
    return NextResponse.json({ success: true, message: "Veritabanı güvenle varsayılana sıfırlandı." });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Sync delete error";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
