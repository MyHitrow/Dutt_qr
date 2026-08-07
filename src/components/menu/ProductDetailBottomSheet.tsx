"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { X, Clock, ShieldAlert, ChefHat, Info, Star } from "lucide-react";
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

      <div className="relative w-full max-w-lg bg-[#151516] rounded-t-[28px] shadow-bottom-sheet max-h-[92vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-[#222224] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food photo */}
        {product.imageUrl && (
          <div className="relative w-full h-52 flex-shrink-0">
            <Image src={product.imageUrl} alt={product.name[lang]} fill sizes="100vw" priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151516] via-[#151516]/20 to-transparent" />
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8 space-y-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex-1">
              <h2 className="text-[#F7F7F8] text-xl font-bold leading-tight">
                {product.name[lang]}
              </h2>
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mt-1.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating!) ? "fill-[#A66CFF] text-[#A66CFF]" : "text-[#222224]"}`} />
                  ))}
                  <span className="text-xs text-[#96969D] ml-1">{product.rating}</span>
                  {product.reviewCount && <span className="text-[11px] text-[#68686E]">({product.reviewCount})</span>}
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[#A66CFF] font-bold text-xl font-mono whitespace-nowrap">
                {product.price} {product.currency}
              </span>
              {product.prepTime && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  <Clock className="w-3 h-3 text-[#68686E]" />
                  <span className="text-xs text-[#68686E]">{product.prepTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-[#96969D] text-sm leading-relaxed">{product.description[lang]}</p>

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
            <div className="p-4 rounded-2xl bg-[#1D1D1F] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F0B45A]" />
                <span className="text-xs font-semibold text-[#F0B45A] uppercase tracking-wider">
                  {lang === "tr" ? "Alerjenler" : "Allergens"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map(a => (
                  <span key={a.id} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#222224] text-[#96969D] border border-white/5">
                    {a.name[lang as "tr" | "en"] ?? a.name.en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef note */}
          {product.chefNote?.[lang as "tr" | "en"] && (
            <div className="p-4 rounded-2xl bg-[#302341]/60 border border-[#A66CFF]/15">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span className="text-xs font-semibold text-[#A66CFF] uppercase tracking-wider">
                  {lang === "tr" ? "Şefin Notu" : "Chef's Note"}
                </span>
              </div>
              <p className="text-[#96969D] text-xs italic leading-relaxed">
                "{product.chefNote[lang as "tr" | "en"]}"
              </p>
            </div>
          )}

          {/* Serving suggestion */}
          {product.servingSuggestion?.[lang as "tr" | "en"] && (
            <div className="p-4 rounded-2xl bg-[#1D1D1F] border border-white/[0.06]">
              <p className="text-xs text-[#68686E] leading-relaxed">
                {product.servingSuggestion[lang as "tr" | "en"]}
              </p>
            </div>
          )}

          {/* Allergen disclaimer */}
          <div className="flex items-start gap-2 text-xs text-[#68686E] pt-1 border-t border-white/[0.04]">
            <Info className="w-3.5 h-3.5 text-[#A66CFF] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {venue.serviceNotice[lang as "tr" | "en"] ?? venue.serviceNotice.tr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
