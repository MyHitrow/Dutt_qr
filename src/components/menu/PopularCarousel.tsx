"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Star, Clock, ChevronRight } from "lucide-react";
import { Product, Language } from "@/types/menu";

interface PopularCarouselProps {
  products: Product[];
  lang: Language;
  onOpen: (p: Product) => void;
}

export const PopularCarousel: React.FC<PopularCarouselProps> = ({ products, lang, onOpen }) => {
  if (products.length === 0) return null;

  return (
    <div className="py-4">
      {/* Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[#F7F7F8] text-base font-bold">
            {lang === "tr" ? "Şu an popüler" : "Popular right now"}
          </h2>
          <p className="text-[#68686E] text-xs font-light mt-0.5">
            {lang === "tr" ? "Diğer masaların en çok sipariş ettikleri" : "Most ordered by other tables"}
          </p>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onOpen(product)}
            className="flex-shrink-0 w-44 bg-[#1D1D1F] rounded-[20px] overflow-hidden border border-white/[0.04] shadow-card active:scale-[0.97] transition-transform group text-left"
          >
            {/* Food photo */}
            <div className="relative w-full h-28 overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name[lang]}
                  fill
                  sizes="176px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-[#222224] flex items-center justify-center">
                  <span className="text-3xl">🍽️</span>
                </div>
              )}
              {/* Rating badge overlay */}
              {product.rating && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-[#101011]/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                  <Star className="w-2.5 h-2.5 fill-[#A66CFF] text-[#A66CFF]" />
                  <span className="text-[10px] text-[#F7F7F8] font-semibold">{product.rating}</span>
                </div>
              )}
            </div>

            {/* Card content */}
            <div className="p-3">
              <h3 className="text-[#F7F7F8] text-[13px] font-semibold leading-snug line-clamp-2 mb-1">
                {product.name[lang]}
              </h3>
              <p className="text-[#68686E] text-[11px] leading-relaxed line-clamp-1 mb-2">
                {product.description[lang]}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#A66CFF] font-bold text-sm">{product.price} {product.currency}</span>
                {product.prepTime && (
                  <span className="flex items-center gap-0.5 text-[10px] text-[#68686E]">
                    <Clock className="w-2.5 h-2.5" />
                    {product.prepTime}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
