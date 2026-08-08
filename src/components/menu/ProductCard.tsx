"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Star, Clock, Sparkles, Info, Flame } from "lucide-react";
import { Product, Language } from "@/types/menu";
import { DietaryBadge } from "./DietaryBadge";

interface ProductCardProps {
  product: Product;
  lang: Language;
  onOpen: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, lang, onOpen }) => {
  const [imgErr, setImgErr] = useState(false);
  const isSoldOut = !product.isAvailable;

  return (
    <article
      onClick={() => onOpen(product)}
      className={`relative rounded-[20px] p-4 pt-14 flex flex-col cursor-pointer mt-12 border shadow-card active:scale-[0.97] transition-transform group ${isSoldOut ? "opacity-50" : ""}`}
      style={{
        background: "var(--dut-card)",
        borderColor: "var(--dut-divider)",
      }}
    >
      {/* ── DUT Signature: overlapping circular plate ── */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-[88px] h-[88px] rounded-full border-4 overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.3)] z-10 flex-shrink-0 transition-transform duration-300 ${!isSoldOut ? "group-hover:scale-105" : ""}`}
        style={{
          borderColor: "var(--dut-bg)",
          background: "var(--dut-elevated)",
        }}
      >
        {product.hasImage && product.imageUrl && !imgErr
          ? <Image src={product.imageUrl} alt={product.name[lang]} fill sizes="88px" className="object-cover" onError={() => setImgErr(true)} />
          : <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--dut-elevated)" }}><Sparkles className="w-5 h-5 opacity-40" style={{ color: "var(--dut-purple)" }} /></div>
        }
        {/* Sold out plate overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--dut-bg) 80%, transparent)" }}>
            <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight px-1" style={{ color: "var(--dut-text3)" }}>
              {lang === "tr" ? "Tükendi" : "Sold Out"}
            </span>
          </div>
        )}
      </div>

      {/* Dietary badges */}
      <div className="flex flex-wrap gap-1 mb-2 min-h-[18px]">
        {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} />}
        {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} />}
        {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} />}
        {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} />}
        {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} /> : null}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-[13px] leading-snug line-clamp-2 mb-1 group-hover:text-[#A66CFF] transition-colors" style={{ color: "var(--dut-text)" }}>
        {product.name[lang]}
      </h3>

      {/* Rating & Calories row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {product.rating && (
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-[#A66CFF] text-[#A66CFF]" />
            <span className="text-[11px]" style={{ color: "var(--dut-text2)" }}>{product.rating}</span>
          </div>
        )}
        {product.calories && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#F0B45A]/10 border border-[#F0B45A]/20">
            <Flame className="w-3 h-3 text-[#F0B45A]" />
            <span className="text-[10px] font-semibold text-[#F0B45A] font-mono">{product.calories} kcal</span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Footer: price + prep time */}
      <div className="pt-2 border-t flex items-center justify-between mt-2" style={{ borderColor: "var(--dut-divider)" }}>
        <div>
          <span className="font-bold text-sm" style={{ color: "var(--dut-purple)" }}>{product.price} {product.currency}</span>
          {product.prepTime && (
            <div className="flex items-center gap-0.5 mt-0.5">
              <Clock className="w-2.5 h-2.5" style={{ color: "var(--dut-text3)" }} />
              <span className="text-[10px]" style={{ color: "var(--dut-text3)" }}>{product.prepTime}</span>
            </div>
          )}
        </div>
        {/* Info icon */}
        <div
          className="w-7 h-7 rounded-full border flex items-center justify-center group-hover:text-[#A66CFF] group-hover:border-[#A66CFF]/30 transition-all"
          style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}
        >
          <Info className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};
