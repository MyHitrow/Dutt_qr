"use client";
import React from "react";
import { Language } from "@/types/menu";

interface DietaryBadgeProps {
  type: "vegan" | "vegetarian" | "glutenFree" | "spicy" | "chef" | "popular" | "new" | "soldOut";
  lang: Language;
  size?: "sm" | "xs";
}

const badgeMap = {
  vegan:       { icon: "🌱", labelTr: "Vegan",        labelEn: "Vegan",       cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
  vegetarian:  { icon: "🥗", labelTr: "Vejetaryen",   labelEn: "Vegetarian",  cls: "bg-green-500/10   text-green-400   border-green-500/15"   },
  glutenFree:  { icon: "🌾", labelTr: "Glutensiz",    labelEn: "Gluten-free", cls: "bg-amber-500/10   text-amber-400   border-amber-500/15"   },
  spicy:       { icon: "🌶", labelTr: "Acılı",        labelEn: "Spicy",       cls: "bg-rose-500/10    text-rose-400    border-rose-500/15"    },
  chef:        { icon: "👨‍🍳", labelTr: "Şef Seçimi",  labelEn: "Chef's Pick", cls: "bg-[#302341]      text-[#C7A8FF]   border-[#A66CFF]/25"   },
  popular:     { icon: "🔥", labelTr: "Popüler",      labelEn: "Popular",     cls: "bg-orange-500/10  text-orange-400  border-orange-500/15"  },
  new:         { icon: "✨", labelTr: "Yeni",          labelEn: "New",         cls: "bg-sky-500/10     text-sky-400     border-sky-500/15"     },
  soldOut:     { icon: "🚫", labelTr: "Tükendi",      labelEn: "Sold Out",    cls: "bg-[#222224]      text-[#68686E]   border-white/5"        },
};

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, lang, size = "xs" }) => {
  const badge = badgeMap[type];
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";
  const padding  = size === "xs" ? "px-1.5 py-0.5" : "px-2 py-1";
  return (
    <span className={`inline-flex items-center gap-1 ${padding} rounded-md border font-medium ${textSize} ${badge.cls}`}>
      <span>{badge.icon}</span>
      <span>{lang === "tr" ? badge.labelTr : badge.labelEn}</span>
    </span>
  );
};
