"use client";
import React from "react";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { Product, Language } from "@/types/menu";

interface PopularCarouselProps {
  products: Product[];
  lang: Language;
  onOpen: (p: Product) => void;
}

export const PopularCarousel: React.FC<PopularCarouselProps> = ({ products, lang, onOpen }) => {
  if (products.length === 0) return null;

  return (
    <div className="py-3">
      {/* Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold" style={{ color: "var(--dut-text)" }}>
            {lang === "tr" ? "Şu an popüler" : "Popular right now"}
          </h2>
          <p className="text-xs font-light mt-0.5" style={{ color: "var(--dut-text3)" }}>
            {lang === "tr" ? "Diğer masaların en çok tercih ettikleri" : "Most ordered by other tables"}
          </p>
        </div>
      </div>

      {/* Horizontal scroll cards (padding py-3 prevents shadow clipping) */}
      <div className="flex gap-3.5 px-4 overflow-x-auto no-scrollbar py-3 -my-1">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onOpen(product)}
            className="flex-shrink-0 w-44 rounded-[20px] overflow-hidden border active:scale-[0.97] transition-all group text-left"
            style={{
              background: "var(--dut-card)",
              borderColor: "var(--dut-divider)",
              boxShadow: "var(--dut-shadow)",
            }}
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
                <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--dut-elevated)" }}>
                  <span className="text-3xl">🍽️</span>
                </div>
              )}
              {/* Rating badge overlay */}
              {product.rating && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                  <Star className="w-2.5 h-2.5 fill-[#A66CFF] text-[#A66CFF]" />
                  <span className="text-[10px] text-white font-semibold">{product.rating}</span>
                </div>
              )}
            </div>

            {/* Card content */}
            <div className="p-3">
              <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1" style={{ color: "var(--dut-text)" }}>
                {product.name[lang]}
              </h3>
              <p className="text-[11px] leading-relaxed line-clamp-1 mb-2" style={{ color: "var(--dut-text3)" }}>
                {product.description[lang]}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm" style={{ color: "var(--dut-purple)" }}>{product.price} {product.currency}</span>
                {product.prepTime && (
                  <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "var(--dut-text3)" }}>
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
