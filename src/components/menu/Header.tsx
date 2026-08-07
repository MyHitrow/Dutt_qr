"use client";

import React from "react";
import { Moon, Sun, Globe } from "lucide-react";
import { Language, ThemeMode, VenueSettings } from "@/types/menu";

interface HeaderProps {
  venue: VenueSettings;
  lang: Language;
  theme: ThemeMode;
  onLanguageChange: (lang: Language) => void;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  venue,
  lang,
  theme,
  onLanguageChange,
  onThemeToggle,
}) => {
  return (
    <header className="w-full pt-6 pb-4 px-4 bg-background/90 backdrop-blur-md border-b border-menuBorder transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Theme & Language Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-card border border-menuBorder text-xs font-medium text-content-secondary hover:text-content-primary hover:border-brand-purple/40 transition-all active:scale-95"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-purple" />
            <span className="uppercase tracking-wider font-semibold">
              {lang}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-full bg-surface-card border border-menuBorder text-content-secondary hover:text-content-primary hover:border-brand-purple/40 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-purple" />
            )}
          </button>
        </div>

        {/* Small Brand Touch */}
        <div className="text-right">
          <span className="text-[10px] tracking-widest text-brand-purple font-semibold uppercase block">
            QR MENU
          </span>
          <span className="text-[11px] text-content-muted">
            {lang === "tr" ? "Masa Menüsü" : "Table Menu"}
          </span>
        </div>
      </div>

      {/* Hero Venue Header */}
      <div className="max-w-md mx-auto text-center mt-5 mb-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-content-primary">
          {venue.name}
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary font-light tracking-wide mt-1">
          {venue.slogan[lang]}
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-purple to-transparent mx-auto mt-3 rounded-full opacity-60" />
      </div>
    </header>
  );
};
