"use client";

import React from "react";
import { Product, Language } from "@/types/menu";
import { Sparkles } from "lucide-react";

interface ProductCardNoImageProps {
  product: Product;
  lang: Language;
  onSelectProduct: (product: Product) => void;
}

export const ProductCardNoImage: React.FC<ProductCardNoImageProps> = ({
  product,
  lang,
  onSelectProduct,
}) => {
  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="w-full bg-surface-card border border-menuBorder rounded-xl p-4 purple-corner-tr cursor-pointer hover:border-brand-purple/40 hover:shadow-purple-glow transition-all active:scale-[0.99] group relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row: Title & Price */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-semibold text-sm sm:text-base text-content-primary group-hover:text-brand-purple transition-colors leading-snug">
            {product.name[lang]}
          </h3>
          <span className="font-medium text-sm sm:text-base text-content-primary font-mono whitespace-nowrap">
            {product.price} {product.currency}
          </span>
        </div>

        {/* Description */}
        {product.description[lang] && (
          <p className="text-xs text-content-secondary font-light leading-relaxed line-clamp-2">
            {product.description[lang]}
          </p>
        )}
      </div>

      {/* Serving Suggestion Note or Subtle Bottom Line */}
      {product.servingSuggestion?.[lang] ? (
        <div className="mt-3 pt-2.5 border-t border-menuBorder/60 flex items-center gap-1.5 text-[11px] text-brand-purple font-light">
          <Sparkles className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{product.servingSuggestion[lang]}</span>
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-menuBorder/40 flex justify-end">
          <span className="text-[10px] text-content-muted tracking-widest uppercase font-mono group-hover:text-brand-purple transition-colors">
            {lang === "tr" ? "Detay" : "Details"} →
          </span>
        </div>
      )}
    </article>
  );
};
