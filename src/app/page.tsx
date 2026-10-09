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
import { RestaurantClosedScreen } from "@/components/menu/RestaurantClosedScreen";
import { VenueInfoSheet }          from "@/components/menu/VenueInfoSheet";
import { SlidersHorizontal } from "lucide-react";

type ActiveSheet = null | "language" | "filter" | "search";

export default function Home() {
  const { venue, categories, dailyFixMenus, filteredProducts, activeFilterCount, lang, setLang, theme, toggleTheme } = useMenu();

  const [isLoading, setIsLoading]       = useState(false);
  const [activeSheet, setActiveSheet]   = useState<ActiveSheet>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // null = tüm kategoriler, string = sadece o kategori
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Track page visit on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const table = urlParams.get("masa") || urlParams.get("table") || undefined;
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "visit", table, lang }),
      }).catch(() => {});
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductOpen = useCallback((product: Product) => {
    setSelectedProduct(product);
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product_view",
          productId: product.id,
          productName: product.name.tr || product.name.en,
          categoryId: product.categoryId,
          lang,
        }),
      }).catch(() => {});
    } catch {}
  }, [lang]);

  // Tema class'ını html elemanına uygula
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Sadece aktif kategoriler (sortOrder'a göre sıralı)
  const activeCategories = useMemo(() =>
    [...categories]
      .filter(c => c.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [categories]
  );

  // Seçili kategoriye göre ürünleri filtrele
  const displayedProducts = useMemo(() => {
    if (!activeCategoryId) return filteredProducts;
    return filteredProducts.filter(p => p.categoryId === activeCategoryId);
  }, [filteredProducts, activeCategoryId]);

  // Seçili kategori veya tüm kategorilerin ürünleri (kategori bölümleri için)
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    activeCategories.forEach(c => map.set(c.id, []));
    displayedProducts.forEach(p => {
      const list = map.get(p.categoryId) ?? [];
      list.push(p);
      map.set(p.categoryId, list);
    });
    return map;
  }, [displayedProducts, activeCategories]);

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
    ? activeCategories.find(c => c.id === activeCategoryId)
    : null;

  // Restoran kapalıysa veya servis acil durdurulduysa müşteriye menü erişimini kilitle
  if (!isLoading && venue.isOpen === false) {
    return (
      <RestaurantClosedScreen
        venue={venue}
        lang={lang}
        theme={theme}
        toggleTheme={toggleTheme}
        setLang={setLang}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen min-h-[100dvh] pb-10 transition-colors relative overflow-hidden" style={{ background: "var(--dut-bg)", color: "var(--dut-text)" }}>
        {/* ── Loş Meyhane Atmosfer Işıkları (Silky Smooth Ambient Aura - GPU Optimized) ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Top-right subtle purple aura */}
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, rgba(166,108,255,0.18) 0%, rgba(166,108,255,0.05) 50%, transparent 70%)" }}
          />
          {/* Mid-left warm candlelight amber aura */}
          <div
            className="absolute top-1/3 -left-36 w-80 h-80 rounded-full opacity-35 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, rgba(240,180,90,0.14) 0%, rgba(240,180,90,0.04) 50%, transparent 70%)" }}
          />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10">
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
            <div className="px-4 grid grid-cols-2 gap-3.5 gap-y-6 pt-6">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Günün Özel Konsept / Banner Görseli (İşletme kapalı günlerinde veya banner kapatıldığında gizlenir) */}
            {!activeCategoryId && dailyFixMenus && dailyFixMenus.length > 0 && (
              <DailyFixMenuBanner
                dailyFixMenus={dailyFixMenus}
                lang={lang}
                showBanner={venue.showFixMenuBanner}
                closedDays={venue.closedDays}
              />
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
                        <h2 className="font-editorial text-2xl font-bold tracking-wide" style={{ color: "var(--dut-text)" }}>
                          {activeCategory.name[lang]}
                        </h2>
                        <span className="text-xs font-mono ml-auto" style={{ color: "var(--dut-text3)" }}>
                          ({displayedProducts.length})
                        </span>
                      </div>
                      <div className="h-px" style={{ background: "var(--dut-divider)" }} />
                    </div>
                  )}
                    <div className="grid grid-cols-2 gap-3.5 gap-y-6 pt-2">
                      {displayedProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          lang={lang}
                          onOpen={handleProductOpen}
                          cardStyle={venue.cardStyle}
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
                activeCategories.map(cat => {
                  const products = productsByCategory.get(cat.id) ?? [];
                  if (products.length === 0) return null;
                  return (
                    <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-28">
                      <div className="mb-5">
                        <div className="flex items-center gap-2">
                          <h2 className="font-editorial text-2xl font-bold tracking-wide" style={{ color: "var(--dut-text)" }}>{cat.name[lang]}</h2>
                          <span className="text-xs font-mono ml-auto" style={{ color: "var(--dut-text3)" }}>({products.length})</span>
                        </div>
                        <div className="h-px mt-3" style={{ background: "var(--dut-divider)" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-3.5 gap-y-6 pt-2">
                        {products.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            lang={lang}
                            onOpen={handleProductOpen}
                            cardStyle={venue.cardStyle}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </main>

            {/* Footer & Kurumsal Markalama */}
            <div className="px-4 pb-12 pt-4 text-center space-y-3">
              <p className="text-[11px] leading-relaxed max-w-sm mx-auto" style={{ color: "var(--dut-text3)" }}>
                {venue.serviceNotice[lang] ?? venue.serviceNotice.tr}
              </p>
              
              <div className="pt-2 flex items-center justify-center">
                <a
                  href="https://mokaworks.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "var(--dut-text3)",
                  }}
                >
                  <span className="opacity-50 uppercase tracking-widest text-[9px]">Powered by</span>
                  <span className="font-bold tracking-wider text-white/90 group-hover:text-purple-300 transition-colors">
                    MOKA WORKS
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                </a>
              </div>
            </div>
          </>
        )}
        </div>
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
        <SearchOverlay lang={lang} onClose={close} onProductOpen={handleProductOpen} />
      )}

      {/* Floating 3-Dot Quick Action (Wi-Fi, Adres & İletişim) */}
      <VenueInfoSheet venue={venue} lang={lang} />
    </>
  );
}
