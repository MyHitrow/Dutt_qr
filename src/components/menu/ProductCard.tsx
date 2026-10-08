"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, Info, Flame } from "lucide-react";
import { Product, Language } from "@/types/menu";
import { DietaryBadge } from "./DietaryBadge";

interface ProductCardProps {
  product: Product;
  lang: Language;
  onOpen: (p: Product) => void;
  cardStyle?: "floating" | "cover" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onOpen,
  cardStyle = "floating",
}) => {
  const [imgErr, setImgErr] = useState(false);
  const isSoldOut = !product.isAvailable;
  const hasValidImage = Boolean(product.hasImage && product.imageUrl && !imgErr);

  // ── 1. MOD: BİSTRO YATAY LİSTE (Compact Horizontal Row) ──
  if (cardStyle === "list") {
    return (
      <article
        onClick={() => onOpen(product)}
        className={`col-span-2 relative rounded-2xl p-3.5 flex items-center justify-between gap-3.5 cursor-pointer dut-glass-card active:scale-[0.98] group transition-all ${
          isSoldOut ? "opacity-55" : ""
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Sadece fotoğraf varsa gösterilir; yoksa hiçbir placeholder kutusu konmaz */}
          {hasValidImage && (
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-black/20">
              <Image
                src={product.imageUrl!}
                alt={product.name[lang]}
                fill
                sizes="80px"
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                  isSoldOut ? "grayscale" : ""
                }`}
                unoptimized={product.imageUrl!.startsWith("data:") || product.imageUrl!.startsWith("blob:")}
                onError={() => setImgErr(true)}
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-[8px] font-bold uppercase text-white tracking-wider">
                    {lang === "tr" ? "Tükendi" : "Sold Out"}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className="font-bold text-sm leading-snug group-hover:text-[#A66CFF] transition-colors truncate"
                style={{ color: "var(--dut-text)" }}
              >
                {product.name[lang]}
              </h3>
              {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
              {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
              {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
              {!product.dietary?.isVegan && product.dietary?.isVegetarian && (
                <DietaryBadge type="vegetarian" lang={lang} iconOnly />
              )}
            </div>

            {product.description?.[lang] && (
              <p className="text-[11px] leading-relaxed line-clamp-1 opacity-75" style={{ color: "var(--dut-text3)" }}>
                {product.description[lang]}
              </p>
            )}

            {(product.prepTime || product.calories) && (
              <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--dut-text3)" }}>
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
        </div>

        {/* Fiyat & İncele */}
        <div className="flex flex-col items-end flex-shrink-0 pl-2">
          <span className="font-bold text-sm tracking-tight flex items-baseline gap-1" style={{ color: "var(--dut-text)" }}>
            <span className="font-mono text-base font-bold text-white group-hover:text-[var(--dut-purple-lt)] transition-colors">
              {product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : product.price}
            </span>
            <span className="text-xs font-semibold text-[#F0B45A]">{product.currency}</span>
          </span>
          {product.variants && product.variants.length > 0 && (
            <span className="text-[9px] font-semibold text-[#F0B45A]/80">
              {product.variants.length} {lang === "tr" ? "Ölçü" : "Sizes"}
            </span>
          )}
        </div>
      </article>
    );
  }

  // ── 2. MOD: KLASİK KAPAK FOTOĞRAFLI KART (Cover Photo Grid - Kafe / Burger / Kebap) ──
  if (cardStyle === "cover") {
    return (
      <article
        onClick={() => onOpen(product)}
        className={`relative rounded-[22px] p-3 flex flex-col justify-between cursor-pointer dut-glass-card active:scale-[0.97] group transition-all ${
          isSoldOut ? "opacity-55" : ""
        }`}
      >
        {/* Kapak Fotoğrafı: Sadece görsel varsa render edilir; yoksa tamamen boş kalır */}
        {hasValidImage ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/25">
            <Image
              src={product.imageUrl!}
              alt={product.name[lang]}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                isSoldOut ? "grayscale" : ""
              }`}
              unoptimized={product.imageUrl!.startsWith("data:") || product.imageUrl!.startsWith("blob:")}
              onError={() => setImgErr(true)}
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <span className="text-[9px] font-bold uppercase text-white tracking-wider px-2 py-0.5 rounded bg-black/60">
                  {lang === "tr" ? "Tükendi" : "Sold Out"}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Görsel yoksa üst kısım tamamen boş/temiz; rozetler için minimal boşluk */
          <div className="pt-1" />
        )}

        {/* Minimal Icon Rozetler */}
        <div className="flex items-center justify-end gap-1 mb-1.5 min-h-[18px]">
          {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
          {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
          {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
          {!product.dietary?.isVegan && product.dietary?.isVegetarian && (
            <DietaryBadge type="vegetarian" lang={lang} iconOnly />
          )}
          {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? (
            <DietaryBadge type="spicy" lang={lang} iconOnly />
          ) : null}
        </div>

        {/* Başlık & Açıklama */}
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

        {/* Fiyat ve İncele */}
        <div className="pt-2 border-t flex items-center justify-between mt-auto" style={{ borderColor: "var(--dut-divider)" }}>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight flex items-baseline gap-1" style={{ color: "var(--dut-text)" }}>
              <span className="font-mono text-[15px] font-bold text-white group-hover:text-[var(--dut-purple-lt)] transition-colors">
                {product.variants && product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : product.price}
              </span>
              <span className="text-xs font-semibold text-[#F0B45A]">{product.currency}</span>
            </span>
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
  }

  // ── 3. MOD (VARSAYILAN): LÜKS DEKUPE / YÜZEN TABAK (Floating Dish PNG) ──
  return (
    <article
      onClick={() => onOpen(product)}
      className={`relative rounded-[22px] flex flex-col justify-between cursor-pointer dut-glass-card active:scale-[0.97] group transition-all ${
        hasValidImage ? "p-3.5 pt-13 mt-12" : "p-4 pt-3.5 mt-0"
      } ${isSoldOut ? "opacity-55" : ""}`}
    >
      {/* Görsel varsa: 3D Temas Gölgesi ve Yüzen PNG Görsel */}
      {hasValidImage && (
        <>
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-[100%] blur-[2.5px] opacity-75 pointer-events-none transition-all duration-300 group-hover:w-16 group-hover:opacity-40 group-hover:blur-[4px]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, transparent 100%)",
            }}
          />

          <div
            className={`absolute -top-14 left-1/2 -translate-x-1/2 w-[94px] h-[94px] z-10 flex items-center justify-center pointer-events-none transition-all duration-300 ${
              !isSoldOut ? "group-hover:scale-110 group-hover:-translate-y-2" : ""
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={product.imageUrl!}
                alt={product.name[lang]}
                fill
                sizes="94px"
                className={`object-contain transition-all duration-300 drop-shadow-[0_12px_16px_rgba(0,0,0,0.4)] ${
                  isSoldOut ? "grayscale opacity-50" : ""
                }`}
                unoptimized={product.imageUrl!.startsWith("data:") || product.imageUrl!.startsWith("blob:")}
                onError={() => setImgErr(true)}
              />
            </div>

            {isSoldOut && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
                <span className="text-[8px] font-bold uppercase tracking-wider">
                  {lang === "tr" ? "Tükendi" : "Sold Out"}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Minimal Icon-Only Rozetler (Top Right) */}
      <div className="flex items-center justify-end gap-1 mb-1.5 min-h-[20px]">
        {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} iconOnly />}
        {product.dietary?.isNew && <DietaryBadge type="new" lang={lang} iconOnly />}
        {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} iconOnly />}
        {!product.dietary?.isVegan && product.dietary?.isVegetarian && (
          <DietaryBadge type="vegetarian" lang={lang} iconOnly />
        )}
        {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? (
          <DietaryBadge type="spicy" lang={lang} iconOnly />
        ) : null}
      </div>

      {/* Ürün Adı & Açıklaması */}
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

      {/* Fiyat + İncele Butonu */}
      <div className="pt-2 border-t flex items-center justify-between mt-auto" style={{ borderColor: "var(--dut-divider)" }}>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight flex items-baseline gap-1" style={{ color: "var(--dut-text)" }}>
            <span className="font-mono text-[15px] font-bold text-white group-hover:text-[var(--dut-purple-lt)] transition-colors">
              {product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : product.price}
            </span>
            <span className="text-xs font-semibold text-[#F0B45A]">{product.currency}</span>
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
