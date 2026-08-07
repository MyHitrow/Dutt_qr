"use client";

import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Clock, Sparkles, Calendar, Utensils } from "lucide-react";

interface DailyFixMenuBannerProps {
  fixMenu: DailyFixMenu;
  lang: Language;
}

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({
  fixMenu,
  lang,
}) => {
  return (
    <div className="w-full px-4 pt-2 pb-3">
      <div className="max-w-md mx-auto relative rounded-3xl bg-[#1C1C1E] border border-menuBorder p-5 overflow-hidden shadow-card group transition-all">
        {/* Soft Purple Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          {/* Text Content Details */}
          <div className="flex-1 space-y-2 min-w-0">
            <span className="text-[11px] font-medium tracking-wide text-content-secondary block">
              {fixMenu.dayName[lang]} {lang === "tr" ? "Günün Öne Çıkan Fix Menüsü" : "Today's Featured Menu"}
            </span>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-content-primary leading-tight group-hover:text-brand-purple transition-colors">
              {fixMenu.title[lang]}
            </h2>

            <p className="text-xs text-content-secondary font-light line-clamp-2 leading-relaxed">
              {fixMenu.subtitle[lang]}
            </p>

            {/* Minimal Icon Badges (Matching reference UI) */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-purpleDark/50 border border-brand-purple/20 text-brand-purple text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>00:01 - 23:59</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-purpleDark/50 border border-brand-purple/20 text-brand-purple text-xs font-mono font-bold">
                <Utensils className="w-3.5 h-3.5" />
                <span>{fixMenu.price} {fixMenu.currency}</span>
              </div>
            </div>
          </div>

          {/* Right Banner Food Photo */}
          {fixMenu.imageUrl && (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-menuBorder shadow-xl">
              <Image
                src={fixMenu.imageUrl}
                alt={fixMenu.title[lang]}
                fill
                sizes="128px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
