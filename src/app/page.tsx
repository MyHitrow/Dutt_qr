"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMenu } from "@/context/MenuContext";
import { Product } from "@/types/menu";

import { DutHeader }               from "@/components/menu/DutHeader";
import { DailyFixMenuBanner }     from "@/components/menu/DailyFixMenuBanner";
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
  const { venue, categories, filteredProducts, activeFilterCount, lang, theme, getCurrentDayFixMenu } = useMenu();

  const [isLoading, setIsLoading]       = useState(true);
  const [activeSheet, setActiveSheet]   = useState<ActiveSheet>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // null = tüm kategoriler, string = sadece o kategori
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const todayFixMenu = getCurrentDayFixMenu();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Tema class'ını html elemanına uygula
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Seçili kategoriye göre ürünleri filtrele
  const displayedProducts = useMemo(() => {
    if (!activeCategoryId) return filteredProducts;
    return filteredProducts.filter(p => p.categoryId === activeCategoryId);
  }, [filteredProducts, activeCategoryId]);

  // Seçili kategori veya tüm kategorilerin ürünleri (kategori bölümleri için)
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    categories.forEach(c => map.set(c.id, []));
    displayedProducts.forEach(p => {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    });
    return map;
  }, [displayedProducts, categories]);

  // Popüler ürünler (sadece tüm kategoriler modunda gösterilecek)
  const popularProducts = useMemo(() =>
    filteredProducts.filter(p => p.dietary?.isPopular || p.dietary?.isChefRecommended).slice(0, 6),
    [filteredProducts]
  );

  const open  = (sheet: ActiveSheet) => setActiveSheet(sheet);
  const close = () => setActiveSheet(null);

  // Kategoriye tıklama — null seçince tümünü göster
  const handleCategorySelect = useCallback((catId: string | null) => {
    setActiveCategoryId(catId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Aktif kategorinin bilgisi
  const activeCategory = activeCategoryId
    ? categories.find(c => c.id === activeCategoryId)
    : null;

  return (
    <>
      <div className="min-h-screen pb-10 transition-colors" style={{ background: "var(--dut-bg)", color: "var(--dut-text)" }}>

        {/* Header */}
        <DutHeader
          venue={venue}
          lang={lang}
          onSearchOpen={() => open("search")}
          onLangOpen={() => open("language")}
        />

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
            {/* Günün Özel Konsept / Banner Görseli (Tüm 7 gün interaktif seçilebilir) */}
            {!activeCategoryId && dailyFixMenus && dailyFixMenus.length > 0 && (
              <DailyFixMenuBanner dailyFixMenus={dailyFixMenus} lang={lang} />
            )}

            {/* Sticky Category Nav */}
            <CategoryNav
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleCategorySelect}
              lang={lang}
            />

            {/* Filtre butonu */}
            <div className="flex items-center gap-2 px-4 py-2.5 max-w-lg mx-auto">
              <button
                onClick={() => open("filter")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  background: activeFilterCount > 0 ? "rgba(166,108,255,0.15)" : "var(--dut-card)",
                  borderColor: activeFilterCount > 0 ? "rgba(166,108,255,0.35)" : "var(--dut-divider)",
                  color: activeFilterCount > 0 ? "var(--dut-purple-lt)" : "var(--dut-text3)",
                }}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {lang === "tr" ? "Filtrele" : "Filter"}
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: "var(--dut-purple)" }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Aktif kategori chip + temizle */}
              {activeCategory && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ml-1"
                  style={{ background: "rgba(166,108,255,0.15)", color: "var(--dut-purple-lt)", border: "1px solid rgba(166,108,255,0.3)" }}
                >
                  <span>{activeCategory.name[lang]}</span>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Ürün grid'i */}
            <main className="max-w-lg mx-auto px-4 space-y-10 pt-2 pb-8">
              {activeCategoryId ? (
                // Tek kategori modu — sadece o kategorinin ürünleri
                <>
                  {activeCategory && (
                    <div className="mb-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xl font-bold" style={{ color: "var(--dut-text)" }}>
                          {activeCategory.name[lang]}
                        </h2>
                        <span className="text-xs font-mono ml-auto" style={{ color: "var(--dut-text3)" }}>
                          ({displayedProducts.length})
                        </span>
                      </div>
                      <div className="h-px" style={{ background: "var(--dut-divider)" }} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {displayedProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        onOpen={p => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                  {displayedProducts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm" style={{ color: "var(--dut-text3)" }}>
                        {lang === "tr" ? "Bu kategoride ürün bulunamadı." : "No products in this category."}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                // Tümü modu — tüm kategoriler bölümler halinde
                categories.map(cat => {
                  const products = productsByCategory.get(cat.id) ?? [];
                  if (products.length === 0) return null;
                  return (
                    <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-28">
                      <div className="mb-5">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold" style={{ color: "var(--dut-text)" }}>{cat.name[lang]}</h2>
                          <span className="text-xs font-mono ml-auto" style={{ color: "var(--dut-text3)" }}>({products.length})</span>
                        </div>
                        <div className="h-px mt-3" style={{ background: "var(--dut-divider)" }} />
                      </div>
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
                })
              )}
            </main>

            {/* Footer */}
            <div className="px-4 pb-8 text-center space-y-1">
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--dut-text3)" }}>
                {venue.serviceNotice[lang] ?? venue.serviceNotice.tr}
              </p>
              <p className="text-[10px] font-mono" style={{ color: "var(--dut-text3)", opacity: 0.5 }}>DUT QR Menu · {venue.name}</p>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ProductDetailBottomSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        venue={venue}
      />
      {activeSheet === "language" && <LanguageSelector onClose={close} />}
      {activeSheet === "filter" && <AllergenFilter lang={lang} onClose={close} />}
      {activeSheet === "search" && (
        <SearchOverlay lang={lang} onClose={close} onProductOpen={p => setSelectedProduct(p)} />
      )}
    </>
  );
}
