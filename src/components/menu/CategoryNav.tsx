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
  categories, activeCategoryId, onSelectCategory, lang,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-cat="${activeCategoryId}"]`) as HTMLElement;
    if (el && scrollRef.current) {
      const c = scrollRef.current;
      c.scrollTo({ left: el.offsetLeft - c.offsetWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-0 z-20 bg-[#101011]/95 backdrop-blur-md border-b border-white/[0.04]">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar"
      >
        {categories.map((cat) => {
          const active = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold
                transition-all duration-200 active:scale-95 whitespace-nowrap
                ${active
                  ? "bg-[#302341] border border-[#A66CFF]/30 text-[#C7A8FF]"
                  : "bg-[#1D1D1F] border border-white/[0.06] text-[#68686E] hover:text-[#96969D]"
                }
              `}
            >
              {cat.emoji && <span className="text-sm leading-none">{cat.emoji}</span>}
              <span>{cat.name[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
