"use client";

import React, { useRef, useEffect } from "react";
import { Category, Language } from "@/types/menu";
import { Utensils, Coffee, Wine, IceCream, Pizza } from "lucide-react";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  lang: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  lang,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll category tab into view when active category changes
  useEffect(() => {
    if (!containerRef.current) return;
    const activeElement = containerRef.current.querySelector(
      `[data-category-id="${activeCategoryId}"]`
    ) as HTMLElement;

    if (activeElement) {
      const container = containerRef.current;
      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategoryId]);

  return (
    <nav className="w-full bg-background/95 backdrop-blur-md sticky top-[53px] z-20 transition-colors py-2">
      <div className="max-w-md mx-auto px-4 mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base text-content-primary">
          {lang === "tr" ? "Kategoriler" : "Meal Category"}
        </h3>
        <span className="text-xs text-content-secondary font-medium font-mono">
          ({categories.length})
        </span>
      </div>

      <div
        ref={containerRef}
        className="max-w-md mx-auto flex items-center gap-2.5 px-4 pb-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              data-category-id={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all relative flex items-center gap-2 active:scale-95 border ${
                isActive
                  ? "bg-brand-purple text-[#111111] border-brand-purple shadow-lg shadow-brand-purple/25 font-bold scale-[1.02]"
                  : "bg-surface border-menuBorder text-content-secondary hover:text-content-primary hover:border-menuBorder/80"
              }`}
            >
              <Utensils className={`w-3.5 h-3.5 ${isActive ? "text-[#111111]" : "text-brand-purple"}`} />
              <span>{cat.name[lang]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
