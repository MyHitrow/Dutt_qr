"use client";
import React from "react";
import Image from "next/image";
import { Sun, Moon, Search } from "lucide-react";
import { Language, VenueSettings } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface DutHeaderProps {
  venue: VenueSettings;
  lang: Language;
  onSearchOpen: () => void;
  onLangOpen: () => void;
}

export const DutHeader: React.FC<DutHeaderProps> = ({ venue, lang, onSearchOpen, onLangOpen }) => {
  const { theme, toggleTheme } = useMenu();

  const activeLogo = theme === "dark"
    ? (venue.logoDarkUrl || venue.logoUrl)
    : (venue.logoLightUrl || venue.logoUrl);

  return (
    <header
      className="w-full px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 z-30 relative transition-colors"
      style={{ backgroundColor: "var(--dut-bg)" }}
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* Venue Logo (Dark & Light support) */}
        {activeLogo ? (
          <div
            className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 relative border shadow-md transition-all"
            style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}
          >
            <Image
              src={activeLogo}
              alt={venue.name}
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--dut-purple)] to-[var(--dut-purple-lt)] flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="font-bold text-sm text-white tracking-tight">DUT</span>
          </div>
        )}

        {/* Venue name & status (Table badge removed) */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-bold text-base truncate leading-none transition-colors"
            style={{ color: "var(--dut-text)" }}
          >
            {venue.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: venue.isOpen ? "var(--dut-success)" : "var(--dut-danger)" }}
            />
            <span className="text-[11px] font-light leading-none transition-colors" style={{ color: "var(--dut-text3)" }}>
              {venue.isOpen
                ? (lang === "tr" ? `Açık • Mutfak kapanış ${venue.closingTime}` : `Open • Kitchen closes ${venue.closingTime}`)
                : (lang === "tr" ? "Şu an kapalı" : "Currently closed")
              }
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun className="w-3.5 h-3.5 text-[#F0B45A]" />
              : <Moon className="w-3.5 h-3.5 text-[#A66CFF]" />
            }
          </button>

          {/* Language toggle — TR / EN only */}
          <button
            onClick={onLangOpen}
            className="h-8 px-2.5 rounded-xl text-[11px] font-bold transition-all active:scale-90 font-mono"
            style={{
              background: "var(--dut-card)",
              border: "1px solid var(--dut-divider)",
              color: "var(--dut-text2)"
            }}
          >
            {lang === "tr" ? "TR" : "EN"}
          </button>

          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
