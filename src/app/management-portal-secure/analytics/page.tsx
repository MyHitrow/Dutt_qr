"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, Eye, Sparkles, RefreshCw,
  Globe2, QrCode, Clock, Flame, ChevronRight, Layers, Trash2,
} from "lucide-react";
import { AnalyticsSummary } from "@/types/analytics";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/analytics", { credentials: "include" });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        "DİKKAT: Tüm analitik verilerini sıfırlamak istediğinize emin misiniz? Tüm sayaçlar sıfırlanacak ve sadece gerçek masalardan gelen yeni okutmalar sayılacaktır."
      )
    ) {
      try {
        setIsRefreshing(true);
        await fetch("/api/analytics", { method: "DELETE", credentials: "include" });
        await fetchAnalytics();
      } catch (err) {
        console.error("Failed to reset:", err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Calculate highest daily visits for chart scaling
  const maxDailyCount = Math.max(1, ...(data?.dailyVisits.map((d) => d.count) || [1]));

  // Calculate peak hour
  const peakHourItem = data?.hourlyDistribution
    ? [...data.hourlyDistribution].sort((a, b) => b.count - a.count)[0]
    : null;

  const topProduct = data?.topProducts?.[0];

  const totalVisitsCount = (data?.languages.tr || 0) + (data?.languages.en || 0);
  const trPercent = totalVisitsCount > 0 ? Math.round(((data?.languages.tr || 0) / totalVisitsCount) * 100) : 0;
  const enPercent = totalVisitsCount > 0 ? 100 - trPercent : 0;
  const hasDailyTraffic = (data?.dailyVisits || []).some((d) => d.count > 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--dut-text)" }}>
              Trafik & Menü Analitiği
            </h1>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
              style={{ background: "rgba(166,108,255,0.15)", color: "var(--dut-purple-lt)" }}
            >
              GERÇEK ZAMANLI VERİ
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
            Masalardaki QR okutma sıklığı, en çok ilgi gören lezzetler ve servis trafiği özeti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 text-rose-400 hover:bg-rose-500/10"
            style={{ borderColor: "rgba(255,107,107,0.3)" }}
            title="Sayaçları Sıfırla"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verileri Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: "var(--dut-card)",
              borderColor: "var(--dut-divider)",
              color: "var(--dut-text)",
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dut-purple)", borderTopColor: "transparent" }} />
          <p className="text-xs font-mono" style={{ color: "var(--dut-text3)" }}>Analitik verileri yükleniyor...</p>
        </div>
      ) : !data ? (
        <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--dut-divider)", background: "var(--dut-card)" }}>
          <p className="text-sm" style={{ color: "var(--dut-text3)" }}>Veri bulunamadı veya henüz trafik oluşmadı.</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Bugünkü Ziyaret */}
            <div
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all dut-glass-card"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: "var(--dut-text3)" }}>
                  Bugünkü QR Okutma
                </span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-500/15 text-purple-400">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: "var(--dut-text)" }}>
                  {data.todayVisits}
                </span>
                <p className="text-[10px] mt-0.5 text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Canlı Servis Trafiği
                </p>
              </div>
            </div>

            {/* 2. Bu Haftaki Toplam */}
            <div
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all dut-glass-card"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: "var(--dut-text3)" }}>
                  Son 7 Günlük Ziyaret
                </span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/15 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: "var(--dut-text)" }}>
                  {data.weekVisits}
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--dut-text3)" }}>
                  Bu ay toplam: <strong className="font-mono text-white/80">{data.monthVisits}</strong>
                </p>
              </div>
            </div>

            {/* 3. En Çok İlgi Gören Lezzet */}
            <div
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all dut-glass-card"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: "var(--dut-text3)" }}>
                  En Popüler Ürün
                </span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm sm:text-base font-bold line-clamp-1" style={{ color: "var(--dut-text)" }}>
                  {topProduct ? topProduct.name : "Veri Yok"}
                </span>
                <p className="text-[10px] mt-0.5 font-mono text-amber-300">
                  {topProduct ? `${topProduct.count} kez incelendi` : "—"}
                </p>
              </div>
            </div>

            {/* 4. Zirve Saati */}
            <div
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all dut-glass-card"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: "var(--dut-text3)" }}>
                  En Yoğun Servis Saati
                </span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: "var(--dut-text)" }}>
                  {peakHourItem && peakHourItem.count > 0 ? `${String(peakHourItem.hour).padStart(2, "0")}:00` : "—"}
                </span>
                <p className="text-[10px] mt-0.5 text-emerald-400">
                  {peakHourItem && peakHourItem.count > 0 ? "Akşam Masaları Zirve Noktası" : "Henüz trafik oluşmadı"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Son 7 Günlük Ziyaret Grafiği */}
            <div
              className="lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between dut-glass-card"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                    Son 7 Günlük QR Menü Trafiği
                  </h2>
                  <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                    Gün bazında menü açılma ve taranma istatistikleri
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A66CFF]" />
                  <span className="text-[10px] font-mono" style={{ color: "var(--dut-text3)" }}>Ziyaretçi Sayısı</span>
                </div>
              </div>

              {/* Bar Chart Visualizer */}
              <div className="pt-6 pb-2">
                <div className="h-48 flex items-end gap-2 sm:gap-4 justify-between border-b" style={{ borderColor: "var(--dut-divider)" }}>
                  {data.dailyVisits.map((day) => {
                    const isZero = day.count === 0;
                    const heightPercent = isZero ? 4 : Math.max(16, Math.round((day.count / maxDailyCount) * 100));
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <span className={`text-[10px] font-mono font-bold transition-opacity ${isZero ? "opacity-30 text-white/40" : "opacity-0 group-hover:opacity-100 text-purple-300"}`}>
                          {day.count}
                        </span>
                        <div
                          className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 relative ${isZero ? "bg-white/5 group-hover:bg-white/10" : "group-hover:brightness-125"}`}
                          style={{
                            height: isZero ? "4px" : `${heightPercent}%`,
                            background: isZero
                              ? "rgba(255,255,255,0.08)"
                              : "linear-gradient(180deg, #A66CFF 0%, rgba(166,108,255,0.3) 100%)",
                            boxShadow: isZero ? "none" : "0 0 14px rgba(166,108,255,0.25)",
                          }}
                        />
                        <span className="text-[11px] font-medium tracking-tight mt-1" style={{ color: "var(--dut-text3)" }}>
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Dil Dağılımı & Turist Oranı */}
            <div
              className="p-5 rounded-2xl border flex flex-col justify-between dut-glass-card space-y-4"
              style={{ borderColor: "var(--dut-divider)" }}
            >
              <div>
                <h2 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                  Müşteri Dil Dağılımı
                </h2>
                <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                  Menüyü inceleyen yerli ve yabancı misafir tercihleri
                </p>
              </div>

              <div className="space-y-4 py-2">
                {/* Visual Ratio Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-white/5">
                  {totalVisitsCount > 0 ? (
                    <>
                      <div className="bg-[#A66CFF] h-full transition-all" style={{ width: `${trPercent}%` }} />
                      <div className="bg-[#60A5FA] h-full transition-all" style={{ width: `${enPercent}%` }} />
                    </>
                  ) : (
                    <div className="bg-white/10 h-full w-full" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
                      <span>🇹🇷 Türkçe</span>
                    </div>
                    <p className="text-xl font-bold font-mono mt-1" style={{ color: "var(--dut-text)" }}>
                      %{trPercent}
                    </p>
                    <span className="text-[10px]" style={{ color: "var(--dut-text3)" }}>{data.languages.tr} Ziyaret</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
                      <span>🇬🇧 İngilizce</span>
                    </div>
                    <p className="text-xl font-bold font-mono mt-1" style={{ color: "var(--dut-text)" }}>
                      %{enPercent}
                    </p>
                    <span className="text-[10px]" style={{ color: "var(--dut-text3)" }}>{data.languages.en} Ziyaret</span>
                  </div>
                </div>
              </div>

              {/* Misafir Ziyaret Özeti */}
              <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
                <span>Toplam Ziyaret Kaydı:</span>
                <strong className="font-mono text-purple-300 font-bold">{totalVisitsCount} Okutma</strong>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Top Products Ranking */}
          <div
            className="p-5 rounded-2xl border dut-glass-card"
            style={{ borderColor: "var(--dut-divider)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                  En Çok İncelenen Lezzetler (Top 8 Lider Tablosu)
                </h2>
                <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                  Müşterilerin masada detayını en çok açıp incelediği tabaklar ve içecekler
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                Popülerlik Sıralaması
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {data.topProducts.length === 0 ? (
                <div className="col-span-1 md:col-span-2 text-center py-8 rounded-xl border border-dashed border-white/10">
                  <p className="text-xs" style={{ color: "var(--dut-text3)" }}>
                    Henüz ürün detayı açılmadı. Müşteriler masada lezzetleri tıkladıkça popüler ürünler burada gerçek zamanlı sıralanacaktır.
                  </p>
                </div>
              ) : (
                data.topProducts.map((p, index) => {
                  const maxProductView = data.topProducts[0]?.count || 1;
                  const ratio = Math.round((p.count / maxProductView) * 100);
                  return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-all hover:border-purple-500/40"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--dut-divider)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                          index === 0
                            ? "bg-amber-500 text-black shadow-md"
                            : index === 1
                            ? "bg-slate-300 text-black"
                            : index === 2
                            ? "bg-amber-700 text-white"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: "var(--dut-text)" }}>
                          {p.name}
                        </p>
                        <div className="w-24 sm:w-32 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-purple-300">
                        {p.count}
                      </span>
                      <span className="text-[10px] block" style={{ color: "var(--dut-text3)" }}>
                        görüntülenme
                      </span>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
