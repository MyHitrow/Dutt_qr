"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Product, Language, VenueSettings } from "@/types/menu";
import {
  X,
  Flame,
  Leaf,
  WheatOff,
  ChefHat,
  Sparkles,
  Info,
  ShieldAlert,
} from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  venue: VenueSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  lang,
  venue,
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [product]);

  if (!product) return null;

  const chefNoteText = product.chefNote?.[lang];
  const servingSuggestionText = product.servingSuggestion?.[lang];
  const hasAllergens = product.allergens && product.allergens.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click area */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close backdrop"
      />

      {/* Modal / Sheet Container */}
      <div className="relative w-full max-w-lg bg-surface-card border-t sm:border border-menuBorder rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 purple-corner-tr animate-slideUp">
        {/* Header Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-background/80 text-content-primary hover:bg-background border border-menuBorder transition-colors shadow-md active:scale-95"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Banner (If present) */}
        {product.hasImage && product.imageUrl && (
          <div className="relative w-full h-56 sm:h-64 bg-background-secondary flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name[lang]}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 500px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-black/30" />
          </div>
        )}

        {/* Modal Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-purple font-semibold block mb-1">
                {lang === "tr" ? "Ürün Detayı" : "Item Detail"}
              </span>
              <h2 className="font-serif text-2xl font-semibold text-content-primary leading-tight">
                {product.name[lang]}
              </h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-semibold text-brand-purple whitespace-nowrap">
                {product.price} {product.currency}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description[lang] && (
            <p className="text-sm text-content-secondary font-light leading-relaxed">
              {product.description[lang]}
            </p>
          )}

          {/* Dietary Badges Section */}
          {(product.dietary?.isVegan ||
            product.dietary?.isVegetarian ||
            product.dietary?.isGlutenFree ||
            (product.dietary?.spicyLevel && product.dietary.spicyLevel > 0)) && (
            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-wider text-content-muted font-semibold mb-2">
                {lang === "tr" ? "Özellikler" : "Dietary Info"}
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {product.dietary?.isVegan && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Leaf className="w-3.5 h-3.5" />
                    Vegan
                  </span>
                )}
                {product.dietary?.isVegetarian && !product.dietary?.isVegan && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    <Leaf className="w-3.5 h-3.5" />
                    Vejetaryen
                  </span>
                )}
                {product.dietary?.isGlutenFree && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <WheatOff className="w-3.5 h-3.5" />
                    Glutensiz
                  </span>
                )}
                {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Flame className="w-3.5 h-3.5" />
                    {lang === "tr" ? "Acı Seviyesi" : "Spicy"} ({product.dietary.spicyLevel}/3)
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Allergens Section (Only if present!) */}
          {hasAllergens && (
            <div className="p-3.5 rounded-xl bg-background-secondary border border-menuBorder">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{lang === "tr" ? "Alerjen Bilgisi" : "Allergens"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.allergens!.map((alg) => (
                  <span
                    key={alg.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-card border border-menuBorder text-xs text-content-secondary"
                  >
                    {alg.name[lang]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef Note Section (Only if present!) */}
          {chefNoteText && (
            <div className="p-3.5 rounded-xl bg-brand-purple/5 border border-brand-purple/20">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">
                <ChefHat className="w-4 h-4" />
                <span>{lang === "tr" ? "Şefin Notu" : "Chef's Note"}</span>
              </div>
              <p className="text-xs text-content-secondary font-light italic">
                "{chefNoteText}"
              </p>
            </div>
          )}

          {/* Serving Suggestion Section (Only if present!) */}
          {servingSuggestionText && (
            <div className="p-3.5 rounded-xl bg-background-secondary border border-menuBorder">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{lang === "tr" ? "Servis Önerisi" : "Serving Suggestion"}</span>
              </div>
              <p className="text-xs text-content-secondary font-light">
                {servingSuggestionText}
              </p>
            </div>
          )}

          {/* Service Staff Informational Notice */}
          <div className="pt-2 border-t border-menuBorder/60 flex items-start gap-2 text-xs text-content-muted">
            <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
            <p className="font-light leading-relaxed">
              {venue.serviceNotice[lang]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
