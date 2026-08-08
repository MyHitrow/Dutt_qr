"use client";
import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Clock, Calendar, Sparkles } from "lucide-react";

interface DailyFixMenuBannerProps {
  fixMenu: DailyFixMenu;
  lang: Language;
}

const t = (obj: { tr: string; en: string }, lang: Language): string =>
  obj[lang as "tr" | "en"] ?? obj.en;

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({ fixMenu, lang }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? (lang === "tr" ? "Günaydın 👋" : "Good morning 👋")
    : hour < 17
    ? (lang === "tr" ? "İyi öğlenler 👋" : "Good afternoon 👋")
    : (lang === "tr" ? "İyi akşamlar 👋" : "Good evening 👋");

  return (
    <div className="w-full px-4 pt-3 pb-2 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-light" style={{ color: "var(--dut-text2)" }}>{greeting}</p>
          <h2 className="text-lg font-bold leading-tight mt-0.5" style={{ color: "var(--dut-text)" }}>
            {lang === "tr" ? "Günün Öne Çıkan Konsepti" : "Today's Featured Concept"}
          </h2>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono"
          style={{
            background: "rgba(166,108,255,0.15)",
            color: "var(--dut-purple-lt)",
            border: "1px solid rgba(166,108,255,0.3)",
          }}
        >
          <Calendar className="w-3 h-3" />
          <span>{t(fixMenu.dayName, lang)}</span>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden shadow-card group transition-transform active:scale-[0.99] border"
        style={{
          background: "var(--dut-card)",
          borderColor: "var(--dut-divider)",
        }}
      >
        {/* Full Image Banner */}
        {fixMenu.imageUrl ? (
          <div className="relative w-full h-48 sm:h-56">
            <Image
              src={fixMenu.imageUrl}
              alt={t(fixMenu.title, lang)}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlaid on Banner Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-[#A66CFF] text-[#101011]">
                  {t(fixMenu.dayName, lang)} {lang === "tr" ? "Özel Menü" : "Special Menu"}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-[#A66CFF]" />
                  <span>00:01 – 23:59</span>
                </div>
              </div>

              <h3 className="text-white text-lg font-extrabold leading-tight shadow-sm">
                {t(fixMenu.title, lang)}
              </h3>

              {fixMenu.subtitle && (
                <p className="text-white/80 text-xs line-clamp-2 font-light leading-relaxed">
                  {t(fixMenu.subtitle, lang)}
                </p>
              )}

              {fixMenu.price > 0 && (
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-white font-extrabold font-mono text-base bg-[#A66CFF]/30 px-3 py-1 rounded-xl backdrop-blur-md border border-[#A66CFF]/40">
                    {fixMenu.price} {fixMenu.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Text Fallback when no image uploaded */
          <div className="p-5 relative overflow-hidden space-y-3" style={{ background: "linear-gradient(135deg, rgba(166,108,255,0.12) 0%, var(--dut-card) 100%)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#A66CFF]/20 text-[#C7A8FF]">
                {t(fixMenu.dayName, lang)}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-dut3">
                <Clock className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span>00:01 – 23:59</span>
              </div>
            </div>
            <h3 className="text-lg font-bold leading-tight" style={{ color: "var(--dut-text)" }}>
              {t(fixMenu.title, lang)}
            </h3>
            <p className="text-xs font-light leading-relaxed" style={{ color: "var(--dut-text2)" }}>
              {t(fixMenu.subtitle, lang)}
            </p>
            {fixMenu.price > 0 && (
              <div className="pt-1">
                <span className="text-sm font-bold font-mono" style={{ color: "var(--dut-purple-lt)" }}>
                  {fixMenu.price} {fixMenu.currency}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
