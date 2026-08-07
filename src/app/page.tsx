"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/menu/Header";
import { SearchBar } from "@/components/menu/SearchBar";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { DailyFixMenuBanner } from "@/components/menu/DailyFixMenuBanner";
import { ProductCardGrid } from "@/components/menu/ProductCardGrid";
import { ProductDetailModal } from "@/components/menu/ProductDetailModal";
import { Footer } from "@/components/menu/Footer";
import { useMenu } from "@/context/MenuContext";
import { Language, Product, ThemeMode } from "@/types/menu";
import { SearchX } from "lucide-react";

export default function Home() {
  const {
    venue: mockVenueSettings,
    categories: mockCategories,
    products: mockProducts,
    getCurrentDayFixMenu,
  } = useMenu();

  const [lang, setLang] = useState<Language>("tr");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(mockCategories[0]?.id || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeDayFixMenu = getCurrentDayFixMenu();

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return mockProducts;
    const query = searchQuery.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name[lang].toLowerCase().includes(query) ||
        p.description[lang].toLowerCase().includes(query)
    );
  }, [searchQuery, lang, mockProducts]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    mockCategories.forEach((cat) => map.set(cat.id, []));
    filteredProducts.forEach((prod) => {
      const list = map.get(prod.categoryId) || [];
      list.push(prod);
      map.set(prod.categoryId, list);
    });
    return map;
  }, [filteredProducts, mockCategories]);

  // Scroll to section when category tab is clicked
  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    const element = document.getElementById(`category-section-${catId}`);
    if (element) {
      const yOffset = -110;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll spy to update active category tab on manual scroll
  useEffect(() => {
    if (searchQuery) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const cat of mockCategories) {
        const element = document.getElementById(`category-section-${cat.id}`);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategoryId(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, mockCategories]);

  return (
    <div className="min-h-screen bg-background text-content-primary flex flex-col transition-colors duration-300">
      {/* Venue Header */}
      <Header
        venue={mockVenueSettings}
        lang={lang}
        theme={theme}
        onLanguageChange={setLang}
        onThemeToggle={handleThemeToggle}
      />

      {/* Daily Fix Menu Banner (00:01 - 23:59 Automated Schedule) */}
      {!searchQuery && activeDayFixMenu && (
        <DailyFixMenuBanner fixMenu={activeDayFixMenu} lang={lang} />
      )}

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lang={lang}
      />

      {/* Horizontal Category Nav */}
      <CategoryNav
        categories={mockCategories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-8 space-y-8">
        {filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="py-16 text-center space-y-3">
            <SearchX className="w-10 h-10 text-brand-purple mx-auto opacity-70" />
            <h3 className="font-semibold text-base text-content-primary">
              {lang === "tr" ? "Ürün Bulunamadı" : "No Items Found"}
            </h3>
            <p className="text-xs text-content-secondary max-w-xs mx-auto">
              {lang === "tr"
                ? `"${searchQuery}" için sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.`
                : `No results for "${searchQuery}". Please try another keyword.`}
            </p>
          </div>
        ) : (
          /* Category Sections & 2-Column Grid Product Feed */
          mockCategories.map((cat) => {
            const productsInCat = productsByCategory.get(cat.id) || [];
            if (productsInCat.length === 0) return null;

            return (
              <section
                key={cat.id}
                id={`category-section-${cat.id}`}
                className="scroll-mt-32 space-y-4"
              >
                {/* Category Section Title Header */}
                <div className="flex items-center gap-2 pt-2 pb-1 border-b border-menuBorder/60">
                  <span className="w-1.5 h-4 bg-brand-purple rounded-full" />
                  <h2 className="font-serif text-xl font-semibold tracking-wide text-content-primary">
                    {cat.name[lang]}
                  </h2>
                  <span className="text-xs text-content-muted font-mono ml-auto">
                    ({productsInCat.length})
                  </span>
                </div>

                {/* 2-Column Half Card Grid with Circular Image */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                  {productsInCat.map((product) => (
                    <ProductCardGrid
                      key={product.id}
                      product={product}
                      lang={lang}
                      onSelectProduct={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Footer */}
      <Footer venue={mockVenueSettings} lang={lang} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        venue={mockVenueSettings}
      />
    </div>
  );
}
