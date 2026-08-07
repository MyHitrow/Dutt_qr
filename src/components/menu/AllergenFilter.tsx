"use client";
import React from "react";
import { X, Check, SlidersHorizontal } from "lucide-react";
import { Language, ActiveFilters } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";
import { defaultFilters } from "@/data/mockMenuData";

interface AllergenFilterProps {
  lang: Language;
  onClose: () => void;
}

const dietFilters: { key: keyof Omit<ActiveFilters, "allergens">; emojiTr: string; labelTr: string; labelEn: string }[] = [
  { key: "chefRecommended", emojiTr: "👨‍🍳", labelTr: "Şef Seçimi",    labelEn: "Chef's Pick"   },
  { key: "popular",         emojiTr: "🔥",   labelTr: "Popüler",       labelEn: "Popular"       },
  { key: "vegetarian",      emojiTr: "🥗",   labelTr: "Vejetaryen",    labelEn: "Vegetarian"    },
  { key: "vegan",           emojiTr: "🌱",   labelTr: "Vegan",         labelEn: "Vegan"         },
  { key: "glutenFree",      emojiTr: "🌾",   labelTr: "Glutensiz",     labelEn: "Gluten-Free"   },
  { key: "spicy",           emojiTr: "🌶️",  labelTr: "Acılı",         labelEn: "Spicy"         },
];

const allergenOptions: { code: string; emojiTr: string; labelTr: string; labelEn: string }[] = [
  { code: "GLUTEN",    emojiTr: "🌾", labelTr: "Gluten",              labelEn: "Gluten"     },
  { code: "DAIRY",     emojiTr: "🥛", labelTr: "Süt / Süt Ürünleri", labelEn: "Dairy"      },
  { code: "EGG",       emojiTr: "🥚", labelTr: "Yumurta",            labelEn: "Egg"         },
  { code: "SHELLFISH", emojiTr: "🦞", labelTr: "Kabuklu Deniz",      labelEn: "Shellfish"   },
  { code: "NUTS",      emojiTr: "🥜", labelTr: "Kuruyemiş",          labelEn: "Nuts"        },
  { code: "FISH",      emojiTr: "🐟", labelTr: "Balık",              labelEn: "Fish"        },
  { code: "SESAME",    emojiTr: "🫘", labelTr: "Susam",              labelEn: "Sesame"      },
];

export const AllergenFilter: React.FC<AllergenFilterProps> = ({ lang, onClose }) => {
  const { filters, setFilters, activeFilterCount } = useMenu();

  const toggleDiet = (key: keyof Omit<ActiveFilters, "allergens">) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const toggleAllergen = (code: string) => {
    const current = filters.allergens;
    setFilters({
      ...filters,
      allergens: current.includes(code) ? current.filter(c => c !== code) : [...current, code],
    });
  };

  const hasFilters = activeFilterCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#151516] rounded-t-[28px] pb-[max(24px,env(safe-area-inset-bottom))] animate-slide-up border-t border-white/[0.06] max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="pt-3 pb-2 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>
        <button onClick={onClose} className="absolute top-3 right-4 w-8 h-8 rounded-full bg-[#222224] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto no-scrollbar flex-1 px-5 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4 h-4 text-[#A66CFF]" />
            <h2 className="text-[#F7F7F8] font-bold text-lg">
              {lang === "tr" ? "Filtrele" : "Filter Menu"}
            </h2>
            {hasFilters && (
              <span className="ml-auto text-[11px] font-semibold text-[#A66CFF] bg-[#302341] px-2.5 py-0.5 rounded-full border border-[#A66CFF]/25">
                {activeFilterCount} {lang === "tr" ? "aktif" : "active"}
              </span>
            )}
          </div>

          {/* Diet filters */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#68686E] mb-3">
              {lang === "tr" ? "Beslenme Tercihi" : "Dietary Preference"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dietFilters.map(f => {
                const isOn = filters[f.key];
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleDiet(f.key)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border transition-all active:scale-[0.97] ${
                      isOn
                        ? "bg-[#302341] border-[#A66CFF]/35 text-[#C7A8FF]"
                        : "bg-[#1D1D1F] border-white/[0.06] text-[#96969D] hover:text-[#F7F7F8]"
                    }`}
                  >
                    <span className="text-base">{f.emojiTr}</span>
                    <span className="text-xs font-semibold">{lang === "tr" ? f.labelTr : f.labelEn}</span>
                    {isOn && <Check className="w-3.5 h-3.5 text-[#A66CFF] ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergen exclusions */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#68686E] mb-1">
              {lang === "tr" ? "Alerjen Hariç Tut" : "Exclude Allergens"}
            </h3>
            <p className="text-[11px] text-[#68686E] mb-3 leading-relaxed">
              {lang === "tr"
                ? "Ürünler ortak mutfak alanlarında hazırlanmaktadır. Kesin tıbbi garanti verilmemektedir."
                : "Products may be prepared in shared kitchen environments. No medical guarantee implied."
              }
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allergenOptions.map(a => {
                const isExcluded = filters.allergens.includes(a.code);
                return (
                  <button
                    key={a.code}
                    onClick={() => toggleAllergen(a.code)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border transition-all active:scale-[0.97] ${
                      isExcluded
                        ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
                        : "bg-[#1D1D1F] border-white/[0.06] text-[#96969D] hover:text-[#F7F7F8]"
                    }`}
                  >
                    <span className="text-base">{a.emojiTr}</span>
                    <span className="text-xs font-semibold">{lang === "tr" ? a.labelTr : a.labelEn}</span>
                    {isExcluded && <span className="ml-auto text-[9px] font-bold text-rose-400">HARİÇ</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-5 pt-3 pb-2 border-t border-white/[0.06] flex gap-3">
          {hasFilters && (
            <button
              onClick={() => setFilters(defaultFilters)}
              className="flex-1 h-11 rounded-2xl border border-white/[0.06] bg-[#1D1D1F] text-[#96969D] text-sm font-semibold active:scale-[0.97] transition-transform"
            >
              {lang === "tr" ? "Temizle" : "Clear All"}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl bg-[#A66CFF] text-[#101011] text-sm font-bold shadow-purple-glow active:scale-[0.97] transition-transform"
          >
            {lang === "tr" ? "Uygula" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};
