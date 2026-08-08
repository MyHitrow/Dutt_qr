"use client";
import React from "react";
import Image from "next/image";
import { DailyFixMenu, Language } from "@/types/menu";

interface DailyFixMenuBannerProps {
  dailyFixMenus: DailyFixMenu[];
  lang: Language;
}

export const DailyFixMenuBanner: React.FC<DailyFixMenuBannerProps> = ({ dailyFixMenus, lang }) => {
  if (!dailyFixMenus || dailyFixMenus.length === 0) return null;

  const todayOfWeek = new Date().getDay();
  // Automatically select today's fix menu if active, or the first active fix menu
  const currentMenu = dailyFixMenus.find(m => m.dayOfWeek === todayOfWeek && m.isActive)
                   || dailyFixMenus.find(m => m.isActive)
                   || dailyFixMenus[0];

  if (!currentMenu || !currentMenu.imageUrl) return null;

  return (
    <div className="w-full px-4 pt-3 pb-1 max-w-lg mx-auto">
      {/* Pure Graphic Banner Container (Zero text overlay, zero day pills) */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden shadow-card group transition-all active:scale-[0.99] border aspect-[16/9]"
        style={{
          background: "var(--dut-card)",
          borderColor: "var(--dut-divider)",
        }}
      >
        <Image
          src={currentMenu.imageUrl}
          alt={currentMenu.title[lang as "tr" | "en"] ?? currentMenu.title.tr}
          fill
          sizes="(max-width: 640px) 100vw, 512px"
          priority
          className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
          unoptimized={currentMenu.imageUrl.startsWith("data:") || currentMenu.imageUrl.startsWith("blob:")}
        />
      </div>
    </div>
  );
};
