"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, Language } from "@/types/menu";
import { Flame, Leaf, WheatOff } from "lucide-react";

interface ProductCardWithImageProps {
  product: Product;
  lang: Language;
  onSelectProduct: (product: Product) => void;
}

export const ProductCardWithImage: React.FC<ProductCardWithImageProps> = ({
  product,
  lang,
  onSelectProduct,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="w-full bg-surface-card border border-menuBorder rounded-xl p-3.5 flex gap-3.5 purple-corner-tr cursor-pointer hover:border-brand-purple/40 hover:shadow-purple-glow transition-all active:scale-[0.99] group relative overflow-hidden"
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-background-secondary border border-menuBorder">
        {product.imageUrl && !imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name[lang]}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-content-muted text-[10px]">
            {lang === "tr" ? "Görsel" : "Image"}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-2">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-content-primary group-hover:text-brand-purple transition-colors leading-snug line-clamp-1">
              {product.name[lang]}
            </h3>
            <span className="font-medium text-sm sm:text-base text-content-primary font-mono whitespace-nowrap">
              {product.price} {product.currency}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-content-secondary line-clamp-2 mt-1 font-light leading-relaxed">
            {product.description[lang]}
          </p>
        </div>

        {/* Badges & Dietary Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {product.dietary?.isVegan && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-2.5 h-2.5" />
              Vegan
            </span>
          )}
          {product.dietary?.isVegetarian && !product.dietary?.isVegan && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              <Leaf className="w-2.5 h-2.5" />
              Vejetaryen
            </span>
          )}
          {product.dietary?.isGlutenFree && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <WheatOff className="w-2.5 h-2.5" />
              Glutensiz
            </span>
          )}
          {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-2.5 h-2.5" />
              {lang === "tr" ? "Acı" : "Spicy"}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
};
