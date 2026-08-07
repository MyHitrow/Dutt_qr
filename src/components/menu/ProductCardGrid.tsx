"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, Language } from "@/types/menu";
import { Star, Clock, Flame, Sparkles } from "lucide-react";

interface ProductCardGridProps {
  product: Product;
  lang: Language;
  onSelectProduct: (product: Product) => void;
}

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  product,
  lang,
  onSelectProduct,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="w-full bg-[#1C1C1E] border border-menuBorder rounded-3xl p-4 pt-14 text-center cursor-pointer hover:border-brand-purple/50 transition-all active:scale-[0.98] group relative flex flex-col justify-between shadow-card mt-10"
    >
      {/* Overlapping Circular Plate Photo (Üst kenara yarım bindirilmiş tabak görseli) */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background shadow-plate overflow-hidden bg-[#222224] flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
        {product.hasImage && product.imageUrl && !imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name[lang]}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-brand-purple bg-brand-purple/10 p-2">
            <Sparkles className="w-6 h-6 text-brand-purple" />
          </div>
        )}
      </div>

      {/* Product Title */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm sm:text-base text-content-primary group-hover:text-brand-purple transition-colors leading-snug line-clamp-2">
          {product.name[lang]}
        </h3>

        {/* Purple Rating Stars */}
        <div className="flex items-center justify-center gap-1 py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-3 h-3 text-brand-purple fill-brand-purple"
            />
          ))}
        </div>
      </div>

      {/* Bottom Footer Info: Time / Price */}
      <div className="mt-3 pt-2.5 border-t border-menuBorder/60 flex items-center justify-between text-xs text-content-secondary font-light">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-brand-purple" />
          <span className="text-[11px] font-mono">15 Min</span>
        </div>

        <span className="font-mono text-sm font-bold text-brand-purple">
          {product.price} {product.currency}
        </span>
      </div>
    </article>
  );
};
