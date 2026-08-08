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
      className={`relative rounded-[20px] flex flex-col cursor-pointer border active:scale-[0.97] transition-all group overflow-hidden ${isSoldOut ? "opacity-55" : ""}`}
      style={{
        background: "var(--dut-card)",
        borderColor: "var(--dut-divider)",
        boxShadow: "var(--dut-shadow)",
      }}
    >
      {/* ── Product Photo Container (Top) ── */}
      <div className="relative w-full h-32 sm:h-36 overflow-hidden flex items-center justify-center" style={{ background: "var(--dut-elevated)" }}>
        {product.hasImage && product.imageUrl && !imgErr ? (
          <Image
            src={product.imageUrl}
            alt={product.name[lang]}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 opacity-30" style={{ color: "var(--dut-purple)" }} />
          </div>
        )}

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-red-600/80 border border-red-400/30">
              {lang === "tr" ? "Tükendi" : "Sold Out"}
            </span>
          </div>
        )}

        {/* Minimal Icon-Only Dietary Badges (Top-Right Overlay) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
          {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
          {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
          {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} iconOnly />}
          {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} iconOnly /> : null}
        </div>
      </div>

      {/* ── Product Details (Bottom) ── */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Product Name */}
          <h3
            className="font-bold text-[13px] leading-snug line-clamp-1 group-hover:text-[#A66CFF] transition-colors"
            style={{ color: "var(--dut-text)" }}
          >
            {product.name[lang]}
          </h3>

          {/* Description */}
          {product.description?.[lang] && (
            <p className="text-[11px] leading-relaxed line-clamp-1 mt-0.5 opacity-75" style={{ color: "var(--dut-text3)" }}>
              {product.description[lang]}
            </p>
          )}
        </div>

        {/* Footer: Price + Prep Time / Calories */}
        <div className="pt-2 border-t flex items-center justify-between mt-auto" style={{ borderColor: "var(--dut-divider)" }}>
          <div className="flex items-center gap-2">
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
      </div>
    </article>
  );
};
