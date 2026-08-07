"use client";
import React from "react";
import { X, Check } from "lucide-react";
import { Language } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface LanguageSelectorProps {
  onClose: () => void;
}

const langs: { code: Language; flag: string; labelTr: string; labelEn: string }[] = [
  { code: "tr", flag: "🇹🇷", labelTr: "Türkçe",  labelEn: "Turkish" },
  { code: "en", flag: "🇬🇧", labelTr: "İngilizce", labelEn: "English" },
  { code: "de", flag: "🇩🇪", labelTr: "Almanca",  labelEn: "German"  },
  { code: "ar", flag: "🇸🇦", labelTr: "Arapça",   labelEn: "Arabic"  },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { lang, setLang } = useMenu();

  const handleSelect = (code: Language) => {
    setLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#151516] rounded-t-[28px] pb-[max(24px,env(safe-area-inset-bottom))] animate-slide-up border-t border-white/[0.06]">
        {/* Handle */}
        <div className="pt-3 pb-4 flex justify-center">
          <div className="dut-handle" />
        </div>
        <button onClick={onClose} className="absolute top-3 right-4 w-8 h-8 rounded-full bg-[#222224] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="px-5 pb-5">
          <h2 className="text-[#F7F7F8] font-bold text-lg mb-1">
            {lang === "tr" ? "Dil Seçimi" : "Language"}
          </h2>
          <p className="text-[#68686E] text-sm mb-5">
            {lang === "tr" ? "Sepetiniz ve seçimleriniz korunur." : "Your cart and selections are preserved."}
          </p>

          <div className="space-y-2">
            {langs.map(l => {
              const isActive = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                    isActive
                      ? "bg-[#302341] border-[#A66CFF]/35 text-[#C7A8FF]"
                      : "bg-[#1D1D1F] border-white/[0.06] text-[#96969D] hover:text-[#F7F7F8] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{l.flag}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{lang === "tr" ? l.labelTr : l.labelEn}</div>
                      <div className="text-[11px] text-[#68686E] uppercase font-mono mt-0.5">{l.code}</div>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[#A66CFF]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
