"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Clock, Sparkles, Info, Flame } from "lucide-react";
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
      className={`relative rounded-[22px] p-3.5 pt-12 flex flex-col justify-between cursor-pointer mt-10 border active:scale-[0.97] transition-all group ${isSoldOut ? "opacity-55" : ""}`}
      style={{
        background: "var(--dut-card)",
        borderColor: "var(--dut-divider)",
        boxShadow: "var(--dut-shadow)",
      }}
    >
      {/* ── DUT Signature Overlapping Circular Plate Image ── */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 w-[84px] h-[84px] rounded-full border-4 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.35)] z-10 flex-shrink-0 transition-transform duration-300 ${!isSoldOut ? "group-hover:scale-105" : ""}`}
        style={{
          borderColor: "var(--dut-bg)",
          background: "var(--dut-elevated)",
        }}
      >
        {product.hasImage && product.imageUrl && !imgErr ? (
          <Image
            src={product.imageUrl}
            alt={product.name[lang]}
            fill
            sizes="84px"
            className="object-cover"
            unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--dut-elevated)" }}>
            <Sparkles className="w-5 h-5 opacity-40" style={{ color: "var(--dut-purple)" }} />
          </div>
        )}

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <span className="text-[8px] font-bold uppercase tracking-wider text-center text-white px-1 leading-tight">
              {lang === "tr" ? "Tükendi" : "Sold Out"}
            </span>
          </div>
        )}
      </div>

      {/* Minimal Icon-Only Dietary Badges (Top Right of Card) */}
      <div className="flex items-center justify-end gap-1 mb-1.5 min-h-[20px]">
        {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
        {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
        {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
        {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} iconOnly />}
        {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} iconOnly /> : null}
      </div>

      {/* Product Name & Description */}
      <div className="mb-2">
        <h3
          className="font-bold text-[13px] leading-snug line-clamp-1 group-hover:text-[#A66CFF] transition-colors"
          style={{ color: "var(--dut-text)" }}
        >
          {product.name[lang]}
        </h3>

        {product.description?.[lang] && (
          <p className="text-[11px] leading-relaxed line-clamp-1 mt-0.5 opacity-75" style={{ color: "var(--dut-text3)" }}>
            {product.description[lang]}
          </p>
        )}
      </div>

      {/* Footer: Price + Prep Time + Calories */}
      <div className="pt-2 border-t flex items-center justify-between mt-auto" style={{ borderColor: "var(--dut-divider)" }}>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm" style={{ color: "var(--dut-purple)" }}>
            {product.price} {product.currency}
          </span>
          {product.calories && (
            <span className="flex items-center gap-0.5 text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-[#F0B45A]/10 text-[#F0B45A]">
              <Flame className="w-2.5 h-2.5" />
              {product.calories}k
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {product.prepTime && (
            <div className="flex items-center gap-0.5 text-[10px]" style={{ color: "var(--dut-text3)" }}>
              <Clock className="w-2.5 h-2.5" />
              <span>{product.prepTime}</span>
            </div>
          )}
          <div
            className="w-6 h-6 rounded-full border flex items-center justify-center group-hover:text-[#A66CFF] transition-all"
            style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}
          >
            <Info className="w-3 h-3" />
          </div>
        </div>
      </div>
    </article>
  );
};
