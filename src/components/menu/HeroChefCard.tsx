"use client";
import React from "react";
import Image from "next/image";
import { Clock, ChefHat } from "lucide-react";
import { Product, Language } from "@/types/menu";

interface HeroChefCardProps {
  product: Product;
  lang: Language;
  onOpen: (p: Product) => void;
}

export const HeroChefCard: React.FC<HeroChefCardProps> = ({ product, lang, onOpen }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? (lang === "tr" ? "Günaydın 👋" : "Good morning 👋")
    : hour < 17
    ? (lang === "tr" ? "İyi öğlenler 👋" : "Good afternoon 👋")
    : (lang === "tr" ? "İyi akşamlar 👋" : "Good evening 👋");

  return (
    <div className="px-4 pt-3 pb-1">
      {/* Greeting */}
      <div className="mb-3">
        <p className="text-[#96969D] text-sm font-light">{greeting}</p>
        <h2 className="text-[#F7F7F8] text-xl font-bold leading-snug mt-0.5">
          {lang === "tr" ? "Ne yemek istersiniz?" : "What would you like to eat?"}
        </h2>
      </div>

      {/* Hero Card */}
      <button
        onClick={() => onOpen(product)}
        className="w-full bg-[#1D1D1F] rounded-[20px] overflow-hidden relative flex items-center gap-0 active:scale-[0.98] transition-transform group shadow-card border border-white/[0.04]"
      >
        {/* Left content */}
        <div className="flex-1 p-4 text-left">
          <div className="flex items-center gap-1.5 mb-2">
            <ChefHat className="w-3 h-3 text-[#A66CFF]" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A66CFF]">
              {lang === "tr" ? "Şefin Seçimi" : "Chef's Choice"}
            </span>
          </div>
          <h3 className="text-[#F7F7F8] font-bold text-lg leading-tight mb-1">
            {product.name[lang]}
          </h3>
          <p className="text-[#68686E] text-xs leading-relaxed line-clamp-2 mb-3">
            {product.description[lang]}
          </p>
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-[#A66CFF]">
              {product.price} {product.currency}
            </span>
            {product.prepTime && (
              <span className="flex items-center gap-1 text-[11px] text-[#68686E]">
                <Clock className="w-3 h-3" />
                {product.prepTime}
              </span>
            )}
          </div>
        </div>

        {/* Right food photo */}
        {product.imageUrl && (
          <div className="relative w-36 h-32 flex-shrink-0 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name[lang]}
              fill
              sizes="144px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D1F] via-transparent to-transparent" />
          </div>
        )}
      </button>
    </div>
  );
};
