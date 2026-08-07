"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMenu } from "@/context/MenuContext";
import { Product } from "@/types/menu";

import { DutHeader }               from "@/components/menu/DutHeader";
import { HeroChefCard }            from "@/components/menu/HeroChefCard";
import { CategoryNav }             from "@/components/menu/CategoryNav";
import { PopularCarousel }         from "@/components/menu/PopularCarousel";
import { ProductCard }             from "@/components/menu/ProductCard";
import { ProductDetailBottomSheet } from "@/components/menu/ProductDetailBottomSheet";
import { LanguageSelector }        from "@/components/menu/LanguageSelector";
import { AllergenFilter }          from "@/components/menu/AllergenFilter";
import { SearchOverlay }           from "@/components/menu/SearchOverlay";
import { SkeletonCard, SkeletonHero, SkeletonCategoryRow } from "@/components/menu/SkeletonCard";
import { SlidersHorizontal } from "lucide-react";

type ActiveSheet = null | "language" | "filter" | "search";

export default function Home() {
  const {
    venue, categories, filteredProducts, activeFilterCount, lang, getCurrentDayFixMenu,
  } = useMenu();

  const [isLoading, setIsLoading]       = useState(true);
  const [activeSheet, setActiveSheet]   = useState<ActiveSheet>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");

  // Simulate brief loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    categories.forEach(c => map.set(c.id, []));
    filteredProducts.forEach(p => {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    });
    return map;
  }, [filteredProducts, categories]);

  // Popular / chef recommended products for carousel
  const popularProducts = useMemo(() =>
    filteredProducts.filter(p => p.dietary?.isPopular || p.dietary?.isChefRecommended).slice(0, 6),
    [filteredProducts]
  );

  // Chef's choice hero product
  const chefProduct = useMemo(() =>
    filteredProducts.find(p => p.dietary?.isChefRecommended && p.hasImage && p.isAvailable),
    [filteredProducts]
  );

  const open  = (sheet: ActiveSheet) => setActiveSheet(sheet);
  const close = () => setActiveSheet(null);

  const handleCategorySelect = useCallback((catId: string) => {
    setActiveCategoryId(catId);
    const el = document.getElementById(`cat-section-${catId}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Scroll spy — update active category tab as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const pos = window.scrollY + 120;
      for (const cat of categories) {
        const el = document.getElementById(`cat-section-${cat.id}`);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveCategoryId(cat.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <>
      <div className="min-h-screen bg-[#101011] text-[#F7F7F8] pb-10">

        {/* Header — venue name, table, status, language, search */}
        <DutHeader
          venue={venue}
          lang={lang}
          onSearchOpen={() => open("search")}
          onLangOpen={() => open("language")}
        />

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="space-y-0">
            <SkeletonHero />
            <SkeletonCategoryRow />
            <div className="px-4 grid grid-cols-2 gap-3 pt-6">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Chef's Choice Hero Card */}
            {chefProduct && (
              <HeroChefCard
                product={chefProduct}
                lang={lang}
                onOpen={p => setSelectedProduct(p)}
              />
            )}

            {/* Sticky Category Nav */}
            <CategoryNav
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleCategorySelect}
              lang={lang}
            />

            {/* Filter button row */}
            <div className="flex items-center gap-2 px-4 py-2.5">
              <button
                onClick={() => open("filter")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeFilterCount > 0
                    ? "bg-[#302341] border-[#A66CFF]/35 text-[#C7A8FF]"
                    : "bg-[#1D1D1F] border-white/[0.06] text-[#68686E] hover:text-[#96969D]"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {lang === "tr" ? "Filtrele" : "Filter"}
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 bg-[#A66CFF] rounded-full text-[9px] font-bold text-[#101011] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Popular / Chef's picks carousel */}
            {popularProducts.length > 0 && (
              <PopularCarousel
                products={popularProducts}
                lang={lang}
                onOpen={p => setSelectedProduct(p)}
              />
            )}

            {/* Main menu sections — 2-column grid */}
            <main className="max-w-lg mx-auto px-4 space-y-10 pt-2 pb-8">
              {categories.map(cat => {
                const products = productsByCategory.get(cat.id) ?? [];
                if (products.length === 0) return null;

                return (
                  <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-28">
                    {/* Category header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2">
                        {cat.emoji && <span className="text-xl">{cat.emoji}</span>}
                        <h2 className="text-[#F7F7F8] text-xl font-bold">{cat.name[lang]}</h2>
                        <span className="text-xs text-[#68686E] font-mono ml-auto">({products.length})</span>
                      </div>
                      <div className="h-px bg-white/[0.06] mt-3" />
                    </div>

                    {/* 2-col grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          lang={lang}
                          onOpen={p => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </main>

            {/* Footer */}
            <div className="px-4 pb-8 text-center space-y-1">
              <p className="text-[11px] text-[#68686E] leading-relaxed">
                {venue.serviceNotice[lang as "tr" | "en"] ?? venue.serviceNotice.tr}
              </p>
              <p className="text-[10px] text-[#68686E]/40 font-mono">DUT QR Menu · {venue.name}</p>
            </div>
          </>
        )}
      </div>

      {/* Product detail bottom sheet — info only, no cart */}
      <ProductDetailBottomSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        venue={venue}
      />

      {/* Language selector */}
      {activeSheet === "language" && <LanguageSelector onClose={close} />}

      {/* Allergen & diet filter */}
      {activeSheet === "filter" && <AllergenFilter lang={lang} onClose={close} />}

      {/* Search overlay */}
      {activeSheet === "search" && (
        <SearchOverlay
          lang={lang}
          onClose={close}
          onProductOpen={p => setSelectedProduct(p)}
        />
      )}
    </>
  );
}
