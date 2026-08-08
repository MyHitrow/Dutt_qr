"use client";
import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Clock, Calendar } from "lucide-react";

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
            {t(fixMenu.dayName, lang)} {lang === "tr" ? "Fix Menü" : "Fix Menu"}
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

      {/* Hero Banner Card — 16:9 Aspect Ratio (Pure Graphic Mode) */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden shadow-card group transition-transform active:scale-[0.99] border"
        style={{
          background: "var(--dut-card)",
          borderColor: "var(--dut-divider)",
        }}
      >
        {fixMenu.imageUrl ? (
          /* Pure Full Graphic Banner (Zero overlay obstruction) */
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={fixMenu.imageUrl}
              alt={t(fixMenu.title, lang)}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              priority
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
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
