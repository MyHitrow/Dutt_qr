"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { X, Clock, ShieldAlert, ChefHat, Info, Star, Flame } from "lucide-react";
import { Product, Language, VenueSettings } from "@/types/menu";
import { DietaryBadge } from "./DietaryBadge";

interface ProductDetailBottomSheetProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  venue: VenueSettings;
}

export const ProductDetailBottomSheet: React.FC<ProductDetailBottomSheetProps> = ({
  product, onClose, lang, venue,
}) => {
  useEffect(() => {
    if (product) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-t-[28px] shadow-bottom-sheet max-h-[92vh] flex flex-col animate-slide-up"
        style={{
          background: "var(--dut-bg2)",
          color: "var(--dut-text)",
        }}
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
          style={{
            background: "var(--dut-elevated)",
            border: "1px solid var(--dut-divider)",
            color: "var(--dut-text2)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food photo */}
        {product.imageUrl && (
          <div className="relative w-full h-52 flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name[lang]}
              fill
              sizes="100vw"
              priority
              className="object-cover"
              unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dut-bg2)] via-transparent to-transparent" />
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8 space-y-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex-1">
              <h2 className="text-xl font-bold leading-tight" style={{ color: "var(--dut-text)" }}>
                {product.name[lang]}
              </h2>
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mt-1.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating!) ? "fill-[#A66CFF] text-[#A66CFF]" : "opacity-20 text-dut3"}`} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "var(--dut-text2)" }}>{product.rating}</span>
                  {product.reviewCount && <span className="text-[11px]" style={{ color: "var(--dut-text3)" }}>({product.reviewCount})</span>}
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-bold text-xl font-mono whitespace-nowrap" style={{ color: "var(--dut-purple)" }}>
                {product.price} {product.currency}
              </span>
              {product.prepTime && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  <Clock className="w-3 h-3" style={{ color: "var(--dut-text3)" }} />
                  <span className="text-xs" style={{ color: "var(--dut-text3)" }}>{product.prepTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--dut-text2)" }}>{product.description[lang]}</p>

          {/* Key specs: Calories & Prep time highlight */}
          <div className="flex items-center gap-3">
            {product.calories && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0B45A]/10 border border-[#F0B45A]/25">
                <Flame className="w-4 h-4 text-[#F0B45A]" />
                <div>
                  <span className="text-[10px] text-[#F0B45A]/80 uppercase tracking-wider font-semibold block leading-none">
                    {lang === "tr" ? "Kalori" : "Calories"}
                  </span>
                  <span className="text-xs font-bold text-[#F0B45A] font-mono leading-tight mt-0.5 block">
                    {product.calories} kcal
                  </span>
                </div>
              </div>
            )}
            {product.prepTime && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}>
                <Clock className="w-4 h-4" style={{ color: "var(--dut-purple)" }} />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold block leading-none" style={{ color: "var(--dut-text3)" }}>
                    {lang === "tr" ? "Hazırlanma" : "Prep Time"}
                  </span>
                  <span className="text-xs font-semibold leading-tight mt-0.5 block" style={{ color: "var(--dut-text)" }}>
                    {product.prepTime}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Dietary badges */}
          <div className="flex flex-wrap gap-2">
            {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} size="sm" />}
            {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} size="sm" />}
            {product.dietary?.isGlutenFree && <DietaryBadge type="glutenFree" lang={lang} size="sm" />}
            {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} size="sm" /> : null}
            {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} size="sm" />}
            {product.dietary?.isPopular && <DietaryBadge type="popular" lang={lang} size="sm" />}
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="p-4 rounded-2xl border" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}>
              <div className="flex items-center gap-1.5 mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F0B45A]" />
                <span className="text-xs font-semibold text-[#F0B45A] uppercase tracking-wider">
                  {lang === "tr" ? "Alerjenler" : "Allergens"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map(a => (
                  <span key={a.id} className="text-[11px] px-2.5 py-1 rounded-lg border" style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text2)" }}>
                    {a.name[lang as "tr" | "en"] ?? a.name.en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef note */}
          {product.chefNote?.[lang as "tr" | "en"] && (
            <div className="p-4 rounded-2xl border" style={{ background: "rgba(166,108,255,0.12)", borderColor: "rgba(166,108,255,0.25)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ChefHat className="w-3.5 h-3.5" style={{ color: "var(--dut-purple)" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dut-purple)" }}>
                  {lang === "tr" ? "Şefin Notu" : "Chef's Note"}
                </span>
              </div>
              <p className="text-xs italic leading-relaxed" style={{ color: "var(--dut-text2)" }}>
                "{product.chefNote[lang as "tr" | "en"]}"
              </p>
            </div>
          )}

          {/* Serving suggestion */}
          {product.servingSuggestion?.[lang as "tr" | "en"] && (
            <div className="p-4 rounded-2xl border" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "var(--dut-text3)" }}>
                {product.servingSuggestion[lang as "tr" | "en"]}
              </p>
            </div>
          )}

          {/* Allergen disclaimer */}
          <div className="flex items-start gap-2 text-xs pt-1 border-t" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--dut-purple)" }} />
            <p className="leading-relaxed">
              {venue.serviceNotice[lang as "tr" | "en"] ?? venue.serviceNotice.tr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
