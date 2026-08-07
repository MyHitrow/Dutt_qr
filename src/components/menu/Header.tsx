"use client";

import React from "react";
import Image from "next/image";
import { Moon, Sun, Globe, Bell } from "lucide-react";
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
    <header className="w-full pt-6 pb-4 px-4 bg-background transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left Welcome Text Header */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            {venue.name}
          </h1>
          <p className="text-xs text-content-secondary font-light mt-0.5">
            {venue.slogan[lang]}
          </p>
        </div>

        {/* Right Controls & User Avatar with Notification Badge */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface border border-menuBorder text-xs font-semibold text-content-secondary hover:text-content-primary hover:border-brand-purple/40 transition-all active:scale-95"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-purple" />
            <span className="uppercase text-[11px] font-mono">{lang}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full bg-surface border border-menuBorder text-content-secondary hover:text-content-primary hover:border-brand-purple/40 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-brand-purple" />
            )}
          </button>

          {/* Avatar Icon with Notification Indicator */}
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-brand-purple to-brand-purple-light p-0.5 flex-shrink-0 cursor-pointer shadow-md">
            <div className="w-full h-full rounded-full bg-[#1C1C1E] flex items-center justify-center text-content-primary font-bold text-xs">
              DM
            </div>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};
