"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, Language } from "@/types/menu";
import { Flame, Leaf, WheatOff, Sparkles } from "lucide-react";

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
      className="w-full bg-surface-card border border-menuBorder rounded-2xl p-3.5 flex flex-col justify-between text-center cursor-pointer hover:border-brand-purple/50 hover:shadow-purple-glow transition-all active:scale-[0.98] group relative overflow-hidden purple-corner-tr"
    >
      <div>
        {/* Circle Image Frame (Daire Görsel) */}
        {product.hasImage ? (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden border-2 border-brand-purple/30 group-hover:border-brand-purple shadow-md bg-background-secondary flex-shrink-0 transition-colors">
            {product.imageUrl && !imageError ? (
              <Image
                src={product.imageUrl}
                alt={product.name[lang]}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-content-muted text-[10px]">
                {lang === "tr" ? "Görsel" : "Image"}
              </div>
            )}
          </div>
        ) : (
          /* Fotoğrafsız Premium Kart Daire Simgesi */
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-brand-purple" />
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-sm text-content-primary group-hover:text-brand-purple transition-colors leading-snug line-clamp-2 mt-3">
          {product.name[lang]}
        </h3>

        {/* Short Description */}
        {product.description[lang] && (
          <p className="text-[11px] text-content-secondary line-clamp-2 font-light leading-snug mt-1">
            {product.description[lang]}
          </p>
        )}
      </div>

      {/* Footer: Price & Badges */}
      <div className="mt-3 pt-2 border-t border-menuBorder/60 space-y-1.5">
        <span className="font-mono text-xs sm:text-sm font-bold text-brand-purple block">
          {product.price} {product.currency}
        </span>

        {/* Dietary Icons */}
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {product.dietary?.isVegan && (
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400" title="Vegan">
              <Leaf className="w-3 h-3" />
            </span>
          )}
          {product.dietary?.isVegetarian && !product.dietary?.isVegan && (
            <span className="p-1 rounded bg-green-500/10 text-green-400" title="Vejetaryen">
              <Leaf className="w-3 h-3" />
            </span>
          )}
          {product.dietary?.isGlutenFree && (
            <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="Glutensiz">
              <WheatOff className="w-3 h-3" />
            </span>
          )}
          {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? (
            <span className="p-1 rounded bg-rose-500/10 text-rose-400" title="Acı">
              <Flame className="w-3 h-3" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
};
