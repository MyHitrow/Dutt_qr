"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Search, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Product, Language } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";
import { DietaryBadge } from "./DietaryBadge";

interface SearchOverlayProps {
  lang: Language;
  onClose: () => void;
  onProductOpen: (p: Product) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ lang, onClose, onProductOpen }) => {
  const [query, setQuery] = useState("");
  const { filteredProducts } = useMenu();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return filteredProducts.filter(p =>
      p.name[lang].toLowerCase().includes(q) ||
      p.description[lang].toLowerCase().includes(q) ||
      p.allergens?.some(a => a.name[lang].toLowerCase().includes(q))
    );
  }, [query, filteredProducts, lang]);

  const showEmpty = query.trim().length > 0 && results.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#101011] flex flex-col animate-fade-in">
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 border-b border-white/[0.06]">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1D1D1F] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-[#1D1D1F] border border-white/[0.06] rounded-2xl px-3.5 py-2.5">
          <Search className="w-4 h-4 text-[#68686E] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Yemek veya içecek ara…" : "Search food or drink…"}
            className="flex-1 bg-transparent text-[#F7F7F8] text-sm placeholder:text-[#68686E] outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#68686E] hover:text-[#F7F7F8]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* Empty prompt */}
        {!query && (
          <div className="py-16 text-center space-y-2">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-[#F7F7F8] font-semibold">
              {lang === "tr" ? "Ne arıyorsunuz?" : "What are you looking for?"}
            </p>
            <p className="text-[#68686E] text-sm">
              {lang === "tr" ? "Tavuk, makarna, vegan, kahve…" : "chicken, pasta, vegan, coffee…"}
            </p>
          </div>
        )}

        {/* Empty result */}
        {showEmpty && (
          <div className="py-16 text-center space-y-2">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[#F7F7F8] font-semibold">
              "{query}" {lang === "tr" ? "bulunamadı" : "not found"}
            </p>
            <p className="text-[#68686E] text-sm max-w-xs mx-auto">
              {lang === "tr"
                ? "Farklı anahtar kelime deneyin veya kategorilere göz atın."
                : "Try another keyword or browse categories."
              }
            </p>
            <button onClick={() => setQuery("")} className="mt-3 text-sm text-[#A66CFF] font-semibold">
              {lang === "tr" ? "Aramayı Temizle" : "Clear Search"}
            </button>
          </div>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#68686E] font-semibold uppercase tracking-wider mb-3">
              {results.length} {lang === "tr" ? "sonuç bulundu" : "results found"}
            </p>
            {results.map(product => (
              <button
                key={product.id}
                onClick={() => { onProductOpen(product); onClose(); }}
                className="w-full flex items-center gap-3 bg-[#1D1D1F] rounded-2xl p-3 border border-white/[0.04] active:scale-[0.98] transition-transform text-left hover:border-[#A66CFF]/20"
              >
                {/* Thumbnail */}
                {product.imageUrl ? (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={product.imageUrl} alt={product.name[lang]} fill sizes="56px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#222224] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🍽️</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#F7F7F8] text-sm font-semibold truncate">{product.name[lang]}</h3>
                  <p className="text-[#68686E] text-xs line-clamp-1 mt-0.5">{product.description[lang]}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[#A66CFF] text-xs font-bold">{product.price} ₺</span>
                    {!product.isAvailable && <DietaryBadge type="soldOut" lang={lang} />}
                    {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
