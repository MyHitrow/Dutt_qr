"use client";

import React, { useRef, useEffect } from "react";
import { Category, Language } from "@/types/menu";

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
    <nav className="w-full bg-background/95 backdrop-blur-md sticky top-[53px] z-20 border-b border-menuBorder shadow-sm transition-colors">
      <div
        ref={containerRef}
        className="max-w-md mx-auto flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              data-category-id={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all relative flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? "text-brand-purple bg-brand-purple/10 border border-brand-purple/30 font-semibold shadow-purple-glow"
                  : "text-content-secondary hover:text-content-primary bg-surface-card/60 border border-menuBorder hover:border-menuBorder/80"
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
              )}
              {cat.name[lang]}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
