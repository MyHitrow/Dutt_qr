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

const getCategoryPlaceholder = (catId?: string) => {
  if (!catId) return "🍽️";
  if (catId.includes("sampanya")) return "🍾";
  if (catId.includes("sarap")) return "🍷";
  if (catId.includes("raki") || catId.includes("viski")) return "🥃";
  if (catId.includes("bira")) return "🍺";
  if (catId.includes("gin") || catId.includes("votka") || catId.includes("shot") || catId.includes("likor")) return "🍸";
  if (catId.includes("salata")) return "🥗";
  if (catId.includes("soguk") || catId.includes("sicak")) return "🧆";
  return "🍽️";
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, lang, onOpen }) => {
  const [imgErr, setImgErr] = useState(false);
  const isSoldOut = !product.isAvailable;

  return (
    <article
      onClick={() => onOpen(product)}
      className={`relative rounded-[22px] p-3.5 pt-13 flex flex-col justify-between cursor-pointer mt-11 dut-glass-card active:scale-[0.97] group ${isSoldOut ? "opacity-55" : ""}`}
    >
      {/* ── Realistic Contact Shadow on Top Card Surface ── */}
      {product.hasImage && product.imageUrl && !imgErr && (
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-[100%] blur-[2.5px] opacity-75 pointer-events-none transition-all duration-300 group-hover:w-16 group-hover:opacity-40 group-hover:blur-[4px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, transparent 100%)",
          }}
        />
      )}

      {/* ── Frameless Floating PNG Product Image ── */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-[94px] h-[94px] z-10 flex items-center justify-center pointer-events-none transition-all duration-300 ${
          !isSoldOut ? "group-hover:scale-110 group-hover:-translate-y-2" : ""
        }`}
      >
        {product.hasImage && product.imageUrl && !imgErr ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name[lang]}
              fill
              sizes="94px"
              className={`object-contain transition-all duration-300 drop-shadow-[0_12px_16px_rgba(0,0,0,0.4)] ${
                isSoldOut ? "grayscale opacity-50" : ""
              }`}
              unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
              onError={() => setImgErr(true)}
            />
          </div>
        ) : (
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-md group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%), var(--dut-card)",
              border: "1px solid var(--dut-divider)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-2xl filter drop-shadow-sm select-none opacity-90">
              {getCategoryPlaceholder(product.categoryId)}
            </span>
          </div>
        )}

        {/* Sold out overlay badge */}
        {isSoldOut && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
            <span className="text-[8px] font-bold uppercase tracking-wider">
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
      <div className="mb-2 space-y-1">
        <h3
          className="font-bold text-[13px] leading-snug line-clamp-1 group-hover:text-[#A66CFF] transition-colors"
          style={{ color: "var(--dut-text)" }}
        >
          {product.name[lang]}
        </h3>

        {product.description?.[lang] && (
          <p className="text-[11px] leading-relaxed line-clamp-1 opacity-75" style={{ color: "var(--dut-text3)" }}>
            {product.description[lang]}
          </p>
        )}

        {/* Dedicated Prep Time & Calories info line */}
        {(product.prepTime || product.calories) && (
          <div className="flex items-center gap-2 pt-0.5 flex-wrap text-[10px]" style={{ color: "var(--dut-text3)" }}>
            {product.prepTime && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5 opacity-70" />
                <span>{product.prepTime}</span>
              </span>
            )}
            {product.calories && (
              <span className="flex items-center gap-0.5 font-mono text-[#F0B45A]">
                <Flame className="w-2.5 h-2.5" />
                <span>{product.calories} kcal</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Dedicated Price + Info button */}
      <div className="pt-2 border-t flex items-center justify-between mt-auto" style={{ borderColor: "var(--dut-divider)" }}>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight flex items-baseline gap-1" style={{ color: "var(--dut-text)" }}>
            <span className="font-mono text-[15px] font-bold text-white group-hover:text-[var(--dut-purple-lt)] transition-colors">
              {product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map(v => v.price))
                : product.price}
            </span>
            <span className="text-xs font-semibold text-[#F0B45A]">
              {product.currency}
            </span>
          </span>
          {product.variants && product.variants.length > 0 && (
            <span className="text-[9px] font-semibold text-[#F0B45A]/80">
              {product.variants.length} {lang === "tr" ? "Farklı Ölçü" : "Sizes"}
            </span>
          )}
        </div>

        <div
          className="w-6 h-6 rounded-full border flex items-center justify-center group-hover:text-[#A66CFF] group-hover:border-[#A66CFF]/40 transition-all flex-shrink-0"
          style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}
        >
          <Info className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
};
