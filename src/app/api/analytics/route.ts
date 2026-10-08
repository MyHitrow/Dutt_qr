export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AnalyticsEvent, AnalyticsSummary } from "@/types/analytics";

const ANALYTICS_FILE_PATH = process.env.ANALYTICS_PATH
  ? path.resolve(process.env.ANALYTICS_PATH)
  : path.join(process.cwd(), "src", "data", "analytics.json");

// Helper to seed realistic baseline data if file is new
function generateSeedEvents(): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [];
  const now = new Date();
  const sampleProducts = [
    { id: "p-levrek-marin", name: "Vişneli Levrek Marin", cat: "cat-soguk" },
    { id: "p-atom", name: "Sıcak Atom", cat: "cat-soguk" },
    { id: "p-ahtapot", name: "Izgara Ege Ahtapotu", cat: "cat-sicak" },
    { id: "p-yeni-seri", name: "Yeni Rakı Yeni Seri 70cl", cat: "cat-raki" },
    { id: "p-beylerbeyi", name: "Beylerbeyi Göbek 70cl", cat: "cat-raki" },
    { id: "p-karides-guvec", name: "Tereyağlı Karides Güveç", cat: "cat-sicak" },
    { id: "p-haydari", name: "Nane Yağlı Haydari", cat: "cat-soguk" },
    { id: "p-gavurdagi", name: "Cevizli Gavurdağı Salatası", cat: "cat-salata" },
  ];

  // Generate for past 7 days
  for (let d = 6; d >= 0; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    // 35 to 85 visits per day
    const dayVisits = 45 + Math.floor(Math.sin(d) * 15) + (d === 0 ? 32 : (d === 1 || d === 2 ? 40 : 20));

    for (let i = 0; i < dayVisits; i++) {
      // Skew hours towards dinner time (19:00 - 00:00)
      const hour = Math.random() < 0.75 
        ? 19 + Math.floor(Math.random() * 5) 
        : 12 + Math.floor(Math.random() * 6);
      
      const evtTime = new Date(dayDate);
      evtTime.setHours(hour, Math.floor(Math.random() * 60), 0);

      const tableNum = Math.floor(Math.random() * 18) + 1;
      const lang = Math.random() < 0.85 ? "tr" : "en";

      events.push({
        id: `seed-v-${d}-${i}`,
        type: "visit",
        timestamp: evtTime.toISOString(),
        table: Math.random() < 0.4 ? String(tableNum) : undefined,
        lang,
      });

      // Also add some product views
      if (Math.random() < 0.65) {
        const prod = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        events.push({
          id: `seed-p-${d}-${i}`,
          type: "product_view",
          timestamp: evtTime.toISOString(),
          productId: prod.id,
          productName: prod.name,
          categoryId: prod.cat,
          table: Math.random() < 0.4 ? String(tableNum) : undefined,
          lang,
        });
      }
    }
  }

  return events;
}

async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    if (fs.existsSync(ANALYTICS_FILE_PATH)) {
      const data = await fs.promises.readFile(ANALYTICS_FILE_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read analytics file:", err);
  }

  // Initialize with seed events
  const seed = generateSeedEvents();
  await writeEvents(seed).catch(() => {});
  return seed;
}

async function writeEvents(events: AnalyticsEvent[]): Promise<boolean> {
  try {
    const dir = path.dirname(ANALYTICS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    // Prune events older than 45 days to keep JSON lightweight
    const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
    const filtered = events.filter((e) => new Date(e.timestamp).getTime() > cutoff);

    await fs.promises.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(filtered), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write analytics file:", err);
    return false;
  }
}

export async function GET() {
  try {
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
    // Pre-populate last 7 days
    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
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
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const event: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: body.type === "product_view" ? "product_view" : "visit",
      timestamp: new Date().toISOString(),
      path: body.path || "/",
      table: body.table,
      productId: body.productId,
      productName: body.productName,
      categoryId: body.categoryId,
      lang: body.lang === "en" ? "en" : "tr",
    };

    const currentEvents = await readEvents();
    currentEvents.push(event);
    await writeEvents(currentEvents);

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
