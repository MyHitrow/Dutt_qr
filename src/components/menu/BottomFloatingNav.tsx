"use client";

import React from "react";
import { Home, Search, Bookmark, User, Sparkles } from "lucide-react";
import { Language } from "@/types/menu";

interface BottomFloatingNavProps {
  lang: Language;
  onHomeClick?: () => void;
  onSearchClick?: () => void;
}

export const BottomFloatingNav: React.FC<BottomFloatingNavProps> = ({
  lang,
  onHomeClick,
  onSearchClick,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-[#1C1C1E]/95 backdrop-blur-xl border border-menuBorder rounded-full px-6 py-2.5 flex items-center justify-between z-40 shadow-2xl transition-all">
      {/* Home (Active - Dut Purple) */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          if (onHomeClick) onHomeClick();
        }}
        className="flex flex-col items-center gap-0.5 text-brand-purple font-semibold transition-transform active:scale-95"
      >
        <Home className="w-5 h-5 text-brand-purple" />
        <span className="text-[10px] tracking-wide font-mono">Home</span>
      </button>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="flex flex-col items-center gap-0.5 text-content-secondary hover:text-content-primary transition-colors active:scale-95"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] tracking-wide font-mono">
          {lang === "tr" ? "Ara" : "Search"}
        </span>
      </button>

      {/* Fix Menu Specials */}
      <button
        onClick={() => {
          const el = document.getElementById("category-section-cat-1");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex flex-col items-center gap-0.5 text-content-secondary hover:text-content-primary transition-colors active:scale-95"
      >
        <Sparkles className="w-5 h-5 text-brand-purple-light" />
        <span className="text-[10px] tracking-wide font-mono">
          {lang === "tr" ? "Lezzet" : "Taste"}
        </span>
      </button>

      {/* Profile / Venue Info */}
      <button
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
        className="flex flex-col items-center gap-0.5 text-content-secondary hover:text-content-primary transition-colors active:scale-95"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] tracking-wide font-mono">
          {lang === "tr" ? "Mekan" : "Venue"}
        </span>
      </button>
    </div>
  );
};
