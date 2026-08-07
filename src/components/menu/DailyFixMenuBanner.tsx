"use client";
import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Clock, Utensils } from "lucide-react";

interface DailyFixMenuBannerProps {
  fixMenu: DailyFixMenu;
  lang: Language;
}

const t = (obj: { tr: string; en: string }, lang: Language): string =>
  obj[lang as "tr" | "en"] ?? obj.en;

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({ fixMenu, lang }) => {
  return (
    <div className="w-full px-4 pt-2 pb-3">
      <div className="max-w-md mx-auto relative rounded-[20px] bg-[#1D1D1F] border border-white/[0.06] p-4 overflow-hidden shadow-card group transition-all">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A66CFF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <span className="text-[11px] font-medium tracking-wide text-[#96969D] block">
              {t(fixMenu.dayName, lang)} — {lang === "tr" ? "Günün Fix Menüsü" : "Today's Special Menu"}
            </span>
            <h2 className="text-[#F7F7F8] text-lg font-bold leading-tight group-hover:text-[#C7A8FF] transition-colors">
              {t(fixMenu.title, lang)}
            </h2>
            <p className="text-[#68686E] text-xs line-clamp-2 leading-relaxed">
              {t(fixMenu.subtitle, lang)}
            </p>
            <div className="pt-1 flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#302341]/50 border border-[#A66CFF]/20 text-[#A66CFF] text-[11px] font-semibold">
                <Clock className="w-3 h-3" />
                <span>00:01 – 23:59</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#302341]/50 border border-[#A66CFF]/20 text-[#A66CFF] text-[11px] font-mono font-bold">
                <Utensils className="w-3 h-3" />
                <span>{fixMenu.price} {fixMenu.currency}</span>
              </div>
            </div>
          </div>

          {fixMenu.imageUrl && (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-white/[0.06] shadow-xl">
              <Image
                src={fixMenu.imageUrl}
                alt={t(fixMenu.title, lang)}
                fill
                sizes="112px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
