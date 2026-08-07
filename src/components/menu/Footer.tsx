"use client";

import React from "react";
import { Language, VenueSettings } from "@/types/menu";

interface FooterProps {
  venue: VenueSettings;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ venue, lang }) => {
  return (
    <footer className="w-full pt-10 pb-16 px-4 bg-background border-t border-menuBorder mt-12 transition-colors">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="font-serif text-xl font-semibold tracking-wide text-content-primary">
          {venue.name}
        </h3>
        <p className="text-xs text-content-muted font-light px-4">
          {venue.serviceNotice[lang]}
        </p>
        <div className="pt-4 text-[11px] text-content-muted/70 font-mono">
          © {new Date().getFullYear()} {venue.name} — Quiet Luxury Digital Menu
        </div>
      </div>
    </footer>
  );
};
