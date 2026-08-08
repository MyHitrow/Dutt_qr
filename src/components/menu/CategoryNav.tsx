"use client";
import React, { useRef } from "react";
import { Category, Language } from "@/types/menu";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string | null; // null = tümü
  onSelectCategory: (id: string | null) => void;
  lang: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories, activeCategoryId, onSelectCategory, lang,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const pill = (isActive: boolean) => ({
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "7px 16px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    transition: "all 0.18s",
    whiteSpace: "nowrap" as const,
    cursor: "pointer",
    background: isActive ? "rgba(166,108,255,0.15)" : "var(--dut-card)",
    border: isActive ? "1px solid rgba(166,108,255,0.35)" : "1px solid var(--dut-divider)",
    color: isActive ? "var(--dut-purple-lt)" : "var(--dut-text3)",
  });

  return (
    <div
      className="sticky top-0 z-20 backdrop-blur-md border-b transition-colors"
      style={{ background: "color-mix(in srgb, var(--dut-bg) 92%, transparent)", borderColor: "var(--dut-divider)" }}
    >
      <div ref={scrollRef} className="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar max-w-lg mx-auto">
        {/* Tümü pill */}
        <button
          data-cat="all"
          onClick={() => onSelectCategory(null)}
          style={pill(activeCategoryId === null)}
          className="active:scale-95"
        >
          <span>{lang === "tr" ? "Tümü" : "All"}</span>
        </button>

        {categories.map((cat) => {
          const active = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={pill(active)}
              className="active:scale-95"
            >
              <span>{cat.name[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
