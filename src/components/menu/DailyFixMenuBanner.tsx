"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Clock, Calendar } from "lucide-react";

interface DailyFixMenuBannerProps {
  dailyFixMenus: DailyFixMenu[];
  lang: Language;
}

const t = (obj: { tr: string; en: string }, lang: Language): string =>
  obj[lang as "tr" | "en"] ?? obj.en;

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({ dailyFixMenus, lang }) => {
  const todayOfWeek = new Date().getDay();
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(todayOfWeek);

  if (!dailyFixMenus || dailyFixMenus.length === 0) return null;

  // Active fix menu for the selected day of week
  const currentMenu = dailyFixMenus.find(m => m.dayOfWeek === selectedDayOfWeek) || dailyFixMenus[0];
  const isToday = currentMenu.dayOfWeek === todayOfWeek;

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? (lang === "tr" ? "Günaydın 👋" : "Good morning 👋")
    : hour < 17
    ? (lang === "tr" ? "İyi öğlenler 👋" : "Good afternoon 👋")
    : (lang === "tr" ? "İyi akşamlar 👋" : "Good evening 👋");

  // Sorted days of week order (Pazartesi: 1 ... Pazar: 0)
  const sortedDaysOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="w-full px-4 pt-3 pb-2 max-w-lg mx-auto space-y-3">
      {/* Greeting & Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-light" style={{ color: "var(--dut-text2)" }}>{greeting}</p>
          <h2 className="text-lg font-bold leading-tight mt-0.5" style={{ color: "var(--dut-text)" }}>
            {t(currentMenu.dayName, lang)} {lang === "tr" ? "Fix Menü" : "Fix Menu"}
          </h2>
        </div>
        {isToday && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono"
            style={{
              background: "rgba(99,211,145,0.15)",
              color: "var(--dut-success)",
              border: "1px solid rgba(99,211,145,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--dut-success)" }} />
            <span>{lang === "tr" ? "Bugün" : "Today"}</span>
          </div>
        )}
      </div>

      {/* 7 Days Selector Bar (Pzt, Sal, Çar, Per, Cum, Cmt, Pzr) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {sortedDaysOrder.map((dayNum) => {
          const menu = dailyFixMenus.find(m => m.dayOfWeek === dayNum);
          if (!menu) return null;
          const isSelected = selectedDayOfWeek === dayNum;
          const isDayToday = dayNum === todayOfWeek;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setSelectedDayOfWeek(dayNum)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all flex-shrink-0 active:scale-95 shadow-xs"
              style={{
                background: isSelected ? "rgba(166,108,255,0.18)" : "var(--dut-card)",
                borderColor: isSelected ? "var(--dut-purple)" : "var(--dut-divider)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: isSelected ? "var(--dut-purple-lt)" : "var(--dut-text3)",
              }}
            >
              {isDayToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              <span>{t(menu.dayName, lang).substring(0, 3)}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Banner Card */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden shadow-card group transition-all active:scale-[0.99] border"
        style={{
          background: "var(--dut-card)",
          borderColor: "var(--dut-divider)",
        }}
      >
        {currentMenu.imageUrl ? (
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={currentMenu.imageUrl}
              alt={t(currentMenu.title, lang)}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              priority
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              unoptimized={currentMenu.imageUrl.startsWith("data:") || currentMenu.imageUrl.startsWith("blob:")}
            />
            {/* Gradient text overlay at bottom for title & price */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#A66CFF]/30 text-white backdrop-blur-xs">
                  {t(currentMenu.dayName, lang)} {lang === "tr" ? "Fix Menü" : "Fix Menu"}
                </span>
                {currentMenu.price > 0 && (
                  <span className="text-sm font-bold font-mono text-white">
                    {currentMenu.price} {currentMenu.currency}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-tight">{t(currentMenu.title, lang)}</h3>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-light">{t(currentMenu.subtitle, lang)}</p>
            </div>
          </div>
        ) : (
          <div className="p-5 relative overflow-hidden space-y-3" style={{ background: "linear-gradient(135deg, rgba(166,108,255,0.12) 0%, var(--dut-card) 100%)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#A66CFF]/20 text-[#C7A8FF]">
                {t(currentMenu.dayName, lang)}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-dut3">
                <Clock className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span>00:01 – 23:59</span>
              </div>
            </div>
            <h3 className="text-lg font-bold leading-tight" style={{ color: "var(--dut-text)" }}>
              {t(currentMenu.title, lang)}
            </h3>
            <p className="text-xs font-light leading-relaxed" style={{ color: "var(--dut-text2)" }}>
              {t(currentMenu.subtitle, lang)}
            </p>
            {currentMenu.price > 0 && (
              <div className="pt-1">
                <span className="text-sm font-bold font-mono" style={{ color: "var(--dut-purple-lt)" }}>
                  {currentMenu.price} {currentMenu.currency}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
