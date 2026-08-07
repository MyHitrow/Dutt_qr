"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMenu } from "@/context/MenuContext";
import { Product } from "@/types/menu";

import { DutHeader }              from "@/components/menu/DutHeader";
import { HeroChefCard }           from "@/components/menu/HeroChefCard";
import { CategoryNav }            from "@/components/menu/CategoryNav";
import { PopularCarousel }        from "@/components/menu/PopularCarousel";
import { ProductCard }            from "@/components/menu/ProductCard";
import { ProductDetailBottomSheet } from "@/components/menu/ProductDetailBottomSheet";
import { CartBar }                from "@/components/menu/CartBar";
import { CartPage }               from "@/components/menu/CartPage";
import { OrderConfirmation }      from "@/components/menu/OrderConfirmation";
import { WaiterBottomSheet }      from "@/components/menu/WaiterBottomSheet";
import { LanguageSelector }       from "@/components/menu/LanguageSelector";
import { AllergenFilter }         from "@/components/menu/AllergenFilter";
import { SearchOverlay }          from "@/components/menu/SearchOverlay";
import { SkeletonCard, SkeletonHero, SkeletonCategoryRow } from "@/components/menu/SkeletonCard";
import { BottomNav }              from "@/components/menu/BottomNav";
import { SlidersHorizontal, Bell }  from "lucide-react";

type ActiveSheet =
  | null
  | "cart"
  | "waiter"
  | "language"
  | "filter"
  | "search"
  | "order-confirm";

export default function Home() {
  const {
    venue, categories, filteredProducts, activeFilterCount,
    currentOrder, lang, getCurrentDayFixMenu,
  } = useMenu();

  const [isLoading, setIsLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "order" | "service">("home");

  const todayFixMenu = getCurrentDayFixMenu();

  // Simulate brief loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Force dark mode always
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

  // Popular products
  const popularProducts = useMemo(() =>
    filteredProducts.filter(p => p.dietary?.isPopular || p.dietary?.isChefRecommended).slice(0, 6),
    [filteredProducts]
  );

  // Chef's choice product (hero)
  const chefProduct = useMemo(() =>
    filteredProducts.find(p => p.dietary?.isChefRecommended && p.hasImage && p.isAvailable),
    [filteredProducts]
  );

  const open = (sheet: ActiveSheet) => setActiveSheet(sheet);
  const close = () => setActiveSheet(null);

  const handleCategorySelect = useCallback((catId: string) => {
    setActiveCategoryId(catId);
    const el = document.getElementById(`cat-section-${catId}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActiveTab("menu");
  }, []);

  // Scroll spy
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
      {/* ── Main page ── */}
      <div className="min-h-screen bg-[#101011] text-[#F7F7F8] pb-20">

        {/* 01 Header */}
        <DutHeader
          venue={venue}
          lang={lang}
          onSearchOpen={() => open("search")}
          onLangOpen={() => open("language")}
        />

        {/* Loading skeleton (Screen 13) */}
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
            {/* 02 Hero / Chef's Choice */}
            {chefProduct && (
              <HeroChefCard
                product={chefProduct}
                lang={lang}
                onOpen={p => setSelectedProduct(p)}
              />
            )}

            {/* 03 Category Nav — sticky */}
            <CategoryNav
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleCategorySelect}
              lang={lang}
            />

            {/* Filter + waiter bar */}
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

              <button
                onClick={() => open("waiter")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#1D1D1F] border-white/[0.06] text-[#68686E] hover:text-[#96969D] transition-all ml-auto"
              >
                <Bell className="w-3 h-3" />
                {lang === "tr" ? "Garson" : "Waiter"}
              </button>
            </div>

            {/* Popular carousel */}
            {popularProducts.length > 0 && (
              <PopularCarousel
                products={popularProducts}
                lang={lang}
                onOpen={p => setSelectedProduct(p)}
              />
            )}

            {/* Main menu sections */}
            <main className="max-w-lg mx-auto px-4 space-y-10 pt-2 pb-8">
              {categories.map(cat => {
                const products = productsByCategory.get(cat.id) ?? [];
                if (products.length === 0) return null;

                return (
                  <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-28">
                    {/* Section header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2">
                        {cat.emoji && <span className="text-xl">{cat.emoji}</span>}
                        <h2 className="text-[#F7F7F8] text-xl font-bold">{cat.name[lang]}</h2>
                        <span className="text-xs text-[#68686E] font-mono ml-auto">({products.length})</span>
                      </div>
                      {cat.description && (
                        <p className="text-[#68686E] text-xs mt-0.5 ml-7">{cat.description[lang as "tr" | "en"] ?? cat.description.tr}</p>
                      )}
                      <div className="h-px bg-white/[0.06] mt-3" />
                    </div>

                    {/* 2-col product grid */}
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

            {/* Footer notice */}
            <div className="px-4 pb-6 text-center">
              <p className="text-[11px] text-[#68686E] leading-relaxed">
                {venue.serviceNotice[lang as "tr" | "en"] ?? venue.serviceNotice.tr}
              </p>
              <p className="text-[10px] text-[#68686E]/50 mt-2 font-mono">DUT QR Menu · {venue.name}</p>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom navigation ── */}
      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onHomeClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveTab("home"); }}
        onMenuClick={() => { handleCategorySelect(categories[0]?.id ?? ""); setActiveTab("menu"); }}
        onOrderClick={() => { open("cart"); setActiveTab("order"); }}
        onServiceClick={() => { open("waiter"); setActiveTab("service"); }}
      />

      {/* Cart bar (floats above bottom nav) */}
      <CartBar lang={lang} onOpen={() => open("cart")} />

      {/* ── Sheets / Modals ── */}

      {/* 04/05 Product detail + customization */}
      <ProductDetailBottomSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        venue={venue}
      />

      {/* 06 Cart */}
      {activeSheet === "cart" && (
        <CartPage
          lang={lang}
          onClose={close}
          onOrderSent={() => { close(); open("order-confirm"); }}
        />
      )}

      {/* 07/08 Order confirmation + tracking */}
      {activeSheet === "order-confirm" && currentOrder && (
        <OrderConfirmation lang={lang} onClose={close} />
      )}

      {/* 09 Waiter */}
      {activeSheet === "waiter" && (
        <WaiterBottomSheet lang={lang} onClose={close} />
      )}

      {/* 10 Language */}
      {activeSheet === "language" && (
        <LanguageSelector onClose={close} />
      )}

      {/* 11 Allergen & Filter */}
      {activeSheet === "filter" && (
        <AllergenFilter lang={lang} onClose={close} />
      )}

      {/* 02 / 12 Search with empty state */}
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
