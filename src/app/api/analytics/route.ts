export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AnalyticsEvent, AnalyticsSummary } from "@/types/analytics";
import { verifyAdminRequest } from "@/lib/auth";
import { getTrustedIp, checkGenericRateLimit } from "@/lib/rateLimit";

const PERSISTENT_ANALYTICS_PATH = path.join(process.cwd(), "storage", "analytics.json");
const ANALYTICS_FILE_PATH = process.env.ANALYTICS_PATH
  ? path.resolve(process.env.ANALYTICS_PATH)
  : fs.existsSync(path.dirname(PERSISTENT_ANALYTICS_PATH))
  ? PERSISTENT_ANALYTICS_PATH
  : path.join(process.cwd(), "src", "data", "analytics.json");

async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    if (fs.existsSync(ANALYTICS_FILE_PATH)) {
      const data = await fs.promises.readFile(ANALYTICS_FILE_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read analytics file:", err);
  }
  return [];
}

async function writeEvents(events: AnalyticsEvent[]): Promise<boolean> {
  try {
    const dir = path.dirname(ANALYTICS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    // Prune events older than 60 days
    const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const filtered = events.filter((e) => new Date(e.timestamp).getTime() > cutoff);

    const tempFile = `${ANALYTICS_FILE_PATH}.tmp.${Date.now()}`;
    await fs.promises.writeFile(tempFile, JSON.stringify(filtered), "utf8");
    await fs.promises.rename(tempFile, ANALYTICS_FILE_PATH);
    return true;
  } catch (err) {
    console.error("Failed to write analytics file:", err);
    return false;
  }
}

// Sequential queue to prevent race conditions on concurrent analytics writes
let analyticsWriteQueue = Promise.resolve<any>(null);

async function appendEventAtomically(event: AnalyticsEvent): Promise<void> {
  const task = async () => {
    const currentEvents = await readEvents();
    currentEvents.push(event);
    await writeEvents(currentEvents);
  };
  analyticsWriteQueue = analyticsWriteQueue.then(task, task);
  return analyticsWriteQueue;
}

export async function GET(req: Request) {
  try {
    // 🔒 Security: Only authenticated admin can view analytics
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz Erişim: Analitik verilerini görüntülemek için admin girişi gereklidir." },
        { status: 401 }
      );
    }

    const events = await readEvents();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const startOfMonth = Date.now() - 30 * 24 * 60 * 60 * 1000;

    let todayVisits = 0;
    let weekVisits = 0;
    let monthVisits = 0;
    let totalVisits = 0;

    const dailyMap = new Map<string, number>();
    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    // Pre-populate last 7 days with 0 counts
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dailyMap.set(key, 0);
    }

    const productViewsMap = new Map<string, { id: string; name: string; count: number; categoryId?: string }>();
    const hoursCount = new Array(24).fill(0);
    const languages = { tr: 0, en: 0 };
    const tableMap = new Map<string, number>();

    for (const ev of events) {
      const evTime = new Date(ev.timestamp).getTime();
      const evDate = new Date(ev.timestamp);

      if (ev.type === "visit") {
        totalVisits++;
        if (evTime >= startOfToday) todayVisits++;
        if (evTime >= startOfWeek) weekVisits++;
        if (evTime >= startOfMonth) monthVisits++;

        const dateKey = `${evDate.getFullYear()}-${String(evDate.getMonth() + 1).padStart(2, "0")}-${String(evDate.getDate()).padStart(2, "0")}`;
        if (dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
        }

        const h = evDate.getHours();
        if (h >= 0 && h < 24) hoursCount[h]++;

        if (ev.lang === "en") languages.en++;
        else languages.tr++;

        if (ev.table) {
          tableMap.set(ev.table, (tableMap.get(ev.table) || 0) + 1);
        }
      }

      if (ev.type === "product_view" && ev.productId && ev.productName) {
        const existing = productViewsMap.get(ev.productId);
        if (existing) {
          existing.count++;
        } else {
          productViewsMap.set(ev.productId, {
            id: ev.productId,
            name: ev.productName,
            count: 1,
            categoryId: ev.categoryId,
          });
        }
      }
    }

    const dailyVisits = Array.from(dailyMap.entries()).map(([dateStr, count]) => {
      const d = new Date(dateStr);
      const label = `${d.getDate()} ${dayNames[d.getDay()]}`;
      return { date: dateStr, label, count };
    });

    const topProducts = Array.from(productViewsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const hourlyDistribution = hoursCount.map((count, hour) => ({ hour, count }));

    const tableVisits = Array.from(tableMap.entries())
      .map(([table, count]) => ({ table: `Masa ${table}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const summary: AnalyticsSummary = {
      todayVisits,
      weekVisits,
      monthVisits,
      totalVisits,
      dailyVisits,
      topProducts,
      hourlyDistribution,
      languages,
      tableVisits,
    };

    return NextResponse.json({ success: true, data: summary });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Bilinmeyen sunucu hatası";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 🛡️ Rate limit: max 30 events per minute per IP
    const clientIp = getTrustedIp(req);
    const rateCheck = checkGenericRateLimit(`analytics:${clientIp}`, 30, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "İstek limiti aşıldı. Lütfen biraz bekleyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    // 🛡️ Sanitize and length-limit inputs
    const type = body.type === "product_view" ? "product_view" : "visit";
    const pathStr = typeof body.path === "string" ? body.path.slice(0, 100) : "/";
    const tableStr = typeof body.table === "string" ? body.table.slice(0, 20).replace(/[^a-zA-Z0-9-]/g, "") : undefined;
    const productIdStr = typeof body.productId === "string" ? body.productId.slice(0, 64) : undefined;
    const productNameStr = typeof body.productName === "string" ? body.productName.slice(0, 200) : undefined;
    const categoryIdStr = typeof body.categoryId === "string" ? body.categoryId.slice(0, 64) : undefined;
    const langStr = body.lang === "en" ? "en" : "tr";

    const event: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: new Date().toISOString(),
      path: pathStr,
      table: tableStr,
      productId: productIdStr,
      productName: productNameStr,
      categoryId: categoryIdStr,
      lang: langStr,
    };

    await appendEventAtomically(event);

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Hata oluştu";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // 🔒 Security: Only authenticated admin can wipe analytics
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz Erişim: Analitik verilerini sıfırlamak için admin yetkisi gereklidir." },
        { status: 401 }
      );
    }

    const task = async () => {
      await writeEvents([]);
    };
    analyticsWriteQueue = analyticsWriteQueue.then(task, task);
    await analyticsWriteQueue;

    return NextResponse.json({ success: true, message: "Tüm analiz verileri sıfırlandı." });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Hata oluştu";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
