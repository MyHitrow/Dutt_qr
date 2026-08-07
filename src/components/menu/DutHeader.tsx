"use client";
import React from "react";
import { MapPin, Clock } from "lucide-react";
import { Language, VenueSettings } from "@/types/menu";

interface DutHeaderProps {
  venue: VenueSettings;
  lang: Language;
  onSearchOpen: () => void;
  onLangOpen: () => void;
}

export const DutHeader: React.FC<DutHeaderProps> = ({ venue, lang, onSearchOpen, onLangOpen }) => {
  const langLabel = { tr: "TR", en: "EN", de: "DE", ar: "AR" }[lang];

  return (
    <header className="w-full px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 bg-[#101011] z-30 relative">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* Logo avatar */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A66CFF] to-[#C7A8FF] flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="font-bold text-sm text-[#101011] tracking-tight">DUT</span>
        </div>

        {/* Venue name + table + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base text-[#F7F7F8] truncate leading-none">{venue.name}</h1>
            <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#1D1D1F] text-[#96969D] border border-white/6 font-mono">
              Masa {venue.tableNumber ?? "–"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {venue.isOpen
              ? <span className="w-1.5 h-1.5 rounded-full bg-[#63D391] flex-shrink-0" />
              : <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] flex-shrink-0" />
            }
            <span className="text-[11px] text-[#68686E] font-light leading-none">
              {venue.isOpen
                ? (lang === "tr" ? `Açık • Mutfak kapanış ${venue.closingTime}` : `Open • Kitchen closes ${venue.closingTime}`)
                : (lang === "tr" ? "Şu an kapalı" : "Currently closed")
              }
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language */}
          <button
            onClick={onLangOpen}
            className="h-8 px-2.5 rounded-xl bg-[#1D1D1F] border border-white/6 text-[11px] font-semibold text-[#96969D] hover:text-[#F7F7F8] transition-colors active:scale-95 font-mono"
          >
            {langLabel}
          </button>
          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="w-8 h-8 rounded-xl bg-[#1D1D1F] border border-white/6 flex items-center justify-center text-[#96969D] hover:text-[#A66CFF] transition-colors active:scale-95"
            aria-label="Search"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
