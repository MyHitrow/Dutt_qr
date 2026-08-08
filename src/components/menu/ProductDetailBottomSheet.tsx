"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { X, Clock, ShieldAlert, ChefHat, Info, Flame, Sparkles } from "lucide-react";
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

  const hasAllergens = product.allergens && product.allergens.length > 0;
  const hasChefNote = Boolean(product.chefNote?.[lang as "tr" | "en"]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in p-0 sm:p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div
        className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-bottom-sheet max-h-[75vh] flex flex-col animate-slide-up mt-44 sm:mt-52 pt-16 pb-5"
        style={{
          background: "var(--dut-bg2)",
          color: "var(--dut-text)",
        }}
      >
        {/* Handle */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex-shrink-0 z-20">
          <div className="dut-handle" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 active:scale-95 shadow-md"
          style={{
            background: "var(--dut-elevated)",
            border: "1px solid var(--dut-divider)",
            color: "var(--dut-text2)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── 200%-250% Scale Circular Plate Image Header (%75-%80 Outside, %20-%25 Inside) ── */}
        <div
          className="absolute -top-[160px] sm:-top-[185px] left-1/2 -translate-x-1/2 w-[210px] h-[210px] sm:w-[240px] sm:h-[240px] rounded-full border-4 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] z-20 flex-shrink-0 transition-transform duration-300 hover:scale-105"
          style={{
            borderColor: "var(--dut-bg2)",
            background: "var(--dut-elevated)",
          }}
        >
          {product.hasImage && product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name[lang]}
              fill
              sizes="240px"
              priority
              className="object-cover"
              unoptimized={product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("blob:")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 opacity-40" style={{ color: "var(--dut-purple)" }} />
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 space-y-4 pt-3">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between gap-3 pt-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold leading-snug" style={{ color: "var(--dut-text)" }}>
                {product.name[lang]}
              </h2>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-bold text-xl font-mono whitespace-nowrap" style={{ color: "var(--dut-purple)" }}>
                {product.price} {product.currency}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description?.[lang] && (
            <p className="text-xs sm:text-sm leading-relaxed opacity-85" style={{ color: "var(--dut-text2)" }}>
              {product.description[lang]}
            </p>
          )}

          {/* Specs: Calories & Prep Time Highlight (Grid format) */}
          {(product.calories || product.prepTime) && (
            <div className="flex items-center gap-3">
              {product.calories && (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0B45A]/10 border border-[#F0B45A]/25">
                  <Flame className="w-4 h-4 text-[#F0B45A]" />
                  <div>
                    <span className="text-[9px] text-[#F0B45A]/80 uppercase tracking-wider font-semibold block leading-none">
                      {lang === "tr" ? "KALORİ" : "CALORIES"}
                    </span>
                    <span className="text-xs font-bold text-[#F0B45A] font-mono leading-tight mt-0.5 block">
                      {product.calories} kcal
                    </span>
                  </div>
                </div>
              )}
              {product.prepTime && (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}>
                  <Clock className="w-4 h-4" style={{ color: "var(--dut-purple)" }} />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold block leading-none" style={{ color: "var(--dut-text3)" }}>
                      {lang === "tr" ? "HAZIRLANMA" : "PREP TIME"}
                    </span>
                    <span className="text-xs font-semibold leading-tight mt-0.5 block" style={{ color: "var(--dut-text)" }}>
                      {product.prepTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1.5">
            {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} size="xs" />}
            {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} size="xs" />}
            {product.dietary?.isGlutenFree && <DietaryBadge type="glutenFree" lang={lang} size="xs" />}
            {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} size="xs" /> : null}
            {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} size="xs" />}
            {product.dietary?.isPopular && <DietaryBadge type="popular" lang={lang} size="xs" />}
          </div>

          {/* ── 2-Column Grid on Mobile for Allergens & Chef's Note (Side by Side on ALL Screens) ── */}
          {(hasAllergens || hasChefNote) && (
            <div className={`grid ${hasAllergens && hasChefNote ? "grid-cols-2" : "grid-cols-1"} gap-2.5`}>
              {/* Allergens Box */}
              {hasAllergens && (
                <div className="p-3 rounded-2xl border flex flex-col justify-between" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#F0B45A] flex-shrink-0" />
                    <span className="text-[10px] font-bold text-[#F0B45A] uppercase tracking-wider truncate">
                      {lang === "tr" ? "Alerjenler" : "Allergens"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.allergens!.map(a => (
                      <span key={a.id} className="text-[9px] px-1.5 py-0.5 rounded-md border font-medium" style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text2)" }}>
                        {a.name[lang as "tr" | "en"] ?? a.name.en}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Chef's Note Box */}
              {hasChefNote && (
                <div className="p-3 rounded-2xl border flex flex-col justify-between" style={{ background: "rgba(166,108,255,0.12)", borderColor: "rgba(166,108,255,0.25)" }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ChefHat className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--dut-purple)" }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: "var(--dut-purple)" }}>
                      {lang === "tr" ? "Şefin Notu" : "Chef's Note"}
                    </span>
                  </div>
                  <p className="text-[11px] italic leading-snug line-clamp-3" style={{ color: "var(--dut-text2)" }}>
                    "{product.chefNote![lang as "tr" | "en"]}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Serving Suggestion */}
          {product.servingSuggestion?.[lang as "tr" | "en"] && (
            <div className="p-3 rounded-xl border text-xs" style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
              {product.servingSuggestion[lang as "tr" | "en"]}
            </div>
          )}

          {/* Allergen Disclaimer */}
          <div className="flex items-start gap-2 text-[11px] pt-1.5 border-t" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
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
