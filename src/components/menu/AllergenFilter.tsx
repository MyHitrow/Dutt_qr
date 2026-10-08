"use client";
import React from "react";
import { X, Check, SlidersHorizontal } from "lucide-react";
import { Language, ActiveFilters } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

const defaultFilters: ActiveFilters = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  spicy: false,
  chefRecommended: false,
  popular: false,
  allergens: [],
};

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
      allergens: current.includes(code) ? current.filter((c: string) => c !== code) : [...current, code],
    });
  };

  const hasFilters = activeFilterCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-t-[28px] pb-[max(24px,env(safe-area-inset-bottom))] animate-slide-up border-t max-h-[85vh] flex flex-col shadow-2xl transition-colors"
        style={{
          background: "var(--dut-bg2)",
          borderColor: "var(--dut-divider)",
          color: "var(--dut-text)",
        }}
      >
        {/* Handle */}
        <div className="pt-3 pb-2 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
          style={{
            background: "var(--dut-elevated)",
            border: "1px solid var(--dut-divider)",
            color: "var(--dut-text2)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto no-scrollbar flex-1 px-5 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4 h-4" style={{ color: "var(--dut-purple)" }} />
            <h2 className="font-bold text-lg" style={{ color: "var(--dut-text)" }}>
              {lang === "tr" ? "Filtrele" : "Filter Menu"}
            </h2>
            {hasFilters && (
              <span
                className="ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  color: "var(--dut-purple-lt)",
                  background: "var(--dut-purple-dk)",
                  border: "1px solid rgba(166,108,255,0.25)",
                }}
              >
                {activeFilterCount} {lang === "tr" ? "aktif" : "active"}
              </span>
            )}
          </div>

          {/* Diet filters */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--dut-text3)" }}>
              {lang === "tr" ? "Beslenme Tercihi" : "Dietary Preference"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dietFilters.map(f => {
                const isOn = filters[f.key];
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleDiet(f.key)}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border transition-all active:scale-[0.97]"
                    style={isOn ? {
                      background: "var(--dut-purple-dk)",
                      borderColor: "rgba(166,108,255,0.35)",
                      color: "var(--dut-purple-lt)",
                    } : {
                      background: "var(--dut-card)",
                      borderColor: "var(--dut-divider)",
                      color: "var(--dut-text2)",
                    }}
                  >
                    <span className="text-base">{f.emojiTr}</span>
                    <span className="text-xs font-semibold">{lang === "tr" ? f.labelTr : f.labelEn}</span>
                    {isOn && <Check className="w-3.5 h-3.5 ml-auto" style={{ color: "var(--dut-purple)" }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergen exclusions */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--dut-text3)" }}>
              {lang === "tr" ? "Alerjen Hariç Tut" : "Exclude Allergens"}
            </h3>
            <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--dut-text3)" }}>
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
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border transition-all active:scale-[0.97]"
                    style={isExcluded ? {
                      background: "rgba(255,107,107,0.12)",
                      borderColor: "rgba(255,107,107,0.3)",
                      color: "var(--dut-danger)",
                    } : {
                      background: "var(--dut-card)",
                      borderColor: "var(--dut-divider)",
                      color: "var(--dut-text2)",
                    }}
                  >
                    <span className="text-base">{a.emojiTr}</span>
                    <span className="text-xs font-semibold">{lang === "tr" ? a.labelTr : a.labelEn}</span>
                    {isExcluded && <span className="ml-auto text-[9px] font-bold" style={{ color: "var(--dut-danger)" }}>HARİÇ</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="flex-shrink-0 px-5 pt-3 pb-2 border-t flex gap-3"
          style={{ borderColor: "var(--dut-divider)" }}
        >
          {hasFilters && (
            <button
              onClick={() => setFilters(defaultFilters)}
              className="flex-1 h-11 rounded-2xl border text-sm font-semibold active:scale-[0.97] transition-transform"
              style={{
                background: "var(--dut-card)",
                borderColor: "var(--dut-divider)",
                color: "var(--dut-text2)",
              }}
            >
              {lang === "tr" ? "Temizle" : "Clear All"}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl text-white text-sm font-bold shadow-lg active:scale-[0.97] transition-transform"
            style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
          >
            {lang === "tr" ? "Uygula" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};
