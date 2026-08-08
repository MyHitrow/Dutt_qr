"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Product, Language } from "@/types/menu";
import { DietaryBadge } from "./DietaryBadge";

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

      {/* Horizontal scroll cards */}
      <div className="flex gap-3.5 px-4 overflow-x-auto no-scrollbar py-3 -my-1">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onOpen(product)}
            className="flex-shrink-0 w-44 rounded-[20px] overflow-hidden border active:scale-[0.97] transition-all group text-left flex flex-col justify-between"
            style={{
              background: "var(--dut-card)",
              borderColor: "var(--dut-divider)",
              boxShadow: "var(--dut-shadow)",
            }}
          >
            {/* Food photo */}
            <div className="relative w-full h-28 overflow-hidden flex items-center justify-center" style={{ background: "var(--dut-elevated)" }}>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name[lang]}
                  fill
                  sizes="176px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl">🍽️</span>
                </div>
              )}

              {/* Minimal Icon-Only Badges */}
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
                {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
                {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
                {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} iconOnly />}
                {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} iconOnly /> : null}
              </div>
            </div>

            {/* Card content */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
              <div>
                <h3 className="text-[13px] font-bold leading-snug line-clamp-1" style={{ color: "var(--dut-text)" }}>
                  {product.name[lang]}
                </h3>
                {product.description?.[lang] && (
                  <p className="text-[11px] leading-relaxed line-clamp-1 mt-0.5 opacity-75" style={{ color: "var(--dut-text3)" }}>
                    {product.description[lang]}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "var(--dut-divider)" }}>
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
