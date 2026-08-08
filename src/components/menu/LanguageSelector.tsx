"use client";
import React from "react";
import { Check, X } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { Language } from "@/types/menu";

interface LanguageSelectorProps {
  onClose: () => void;
}

const LANGS: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "tr", label: "Turkish",  native: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English",  native: "English", flag: "🇬🇧" },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { lang, setLang } = useMenu();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-t-[28px] shadow-2xl animate-slide-up"
        style={{ background: "var(--dut-bg2)" }}
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="dut-handle" />
        </div>

        {/* Header */}
        <div
          className="px-5 pb-4 flex items-center justify-between border-b"
          style={{ borderColor: "var(--dut-divider)" }}
        >
          <h3 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
            Dil Seçimi / Language
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--dut-elevated)", color: "var(--dut-text2)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language list */}
        <div className="px-5 py-4 space-y-2 pb-10">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); onClose(); }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                background: lang === l.code ? "rgba(166,108,255,0.12)" : "var(--dut-card)",
                border: lang === l.code ? "1px solid rgba(166,108,255,0.3)" : "1px solid var(--dut-divider)",
              }}
            >
              <span className="text-2xl">{l.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--dut-text)" }}>{l.native}</p>
                <p className="text-xs" style={{ color: "var(--dut-text3)" }}>{l.label}</p>
              </div>
              {lang === l.code && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--dut-purple)" }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
