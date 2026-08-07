"use client";

import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";
import { Calendar, Sparkles, Clock } from "lucide-react";

interface DailyFixMenuBannerProps {
  fixMenu: DailyFixMenu;
  lang: Language;
}

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({
  fixMenu,
  lang,
}) => {
  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="max-w-md mx-auto relative rounded-2xl bg-surface-card border border-menuBorder p-4 overflow-hidden shadow-card purple-corner-tr group transition-all">
        {/* Glow Effect Background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-purple/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          {/* Text Content Details */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-400">
              <Calendar className="w-3 h-3" />
              <span>
                {fixMenu.dayName[lang]} {lang === "tr" ? "Gününe Özel Fix Menü" : "Special Fix Menu"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold text-content-primary leading-tight group-hover:text-brand-purple transition-colors">
              {fixMenu.title[lang]}
            </h2>

            <p className="text-xs text-content-secondary font-light line-clamp-2 leading-relaxed">
              {fixMenu.subtitle[lang]}
            </p>

            <div className="pt-1 flex items-center gap-3">
              <span className="font-mono text-base font-bold text-brand-purple">
                {fixMenu.price} {fixMenu.currency}
              </span>
              <span className="text-[10px] text-content-muted flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-brand-purple" />
                00:01 - 23:59
              </span>
            </div>
          </div>

          {/* Banner Right Image (Matching reference banner) */}
          {fixMenu.imageUrl && (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-menuBorder shadow-md">
              <Image
                src={fixMenu.imageUrl}
                alt={fixMenu.title[lang]}
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
