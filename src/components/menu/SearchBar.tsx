"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Language } from "@/types/menu";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lang: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  lang,
}) => {
  const placeholderText =
    lang === "tr" ? "Menüde ara..." : "Search menu items...";

  return (
    <div className="w-full px-4 pt-3 pb-2 bg-background sticky top-0 z-20 transition-colors">
      <div className="max-w-md mx-auto relative flex items-center">
        <Search className="w-4 h-4 text-content-muted absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholderText}
          className="w-full pl-10 pr-9 py-2.5 bg-surface-card border border-menuBorder rounded-xl text-xs sm:text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 p-1 rounded-full text-content-muted hover:text-content-primary bg-background-secondary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
