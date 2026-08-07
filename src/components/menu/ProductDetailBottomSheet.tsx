"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Clock, ShieldAlert, ChefHat, Info, Minus, Plus, Star } from "lucide-react";
import { Product, Language, VenueSettings, CartCustomization } from "@/types/menu";
import { DietaryBadge } from "./DietaryBadge";
import { useMenu } from "@/context/MenuContext";

interface ProductDetailBottomSheetProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  venue: VenueSettings;
}

export const ProductDetailBottomSheet: React.FC<ProductDetailBottomSheetProps> = ({
  product, onClose, lang, venue,
}) => {
  const { addToCart } = useMenu();
  const [qty, setQty] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>({});
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setQty(1);
    setNote("");
    setAdded(false);
    // Set defaults for radio groups
    const defaults: Record<string, string[]> = {};
    product.customizations?.forEach(g => {
      const def = g.choices.find(c => c.isDefault);
      if (def) defaults[g.id] = [def.id];
    });
    setSelectedChoices(defaults);
  }, [product]);

  useEffect(() => {
    if (product) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const handleChoice = (groupId: string, choiceId: string, type: "radio" | "checkbox") => {
    setSelectedChoices(prev => {
      if (type === "radio") return { ...prev, [groupId]: [choiceId] };
      const current = prev[groupId] ?? [];
      const exists = current.includes(choiceId);
      return { ...prev, [groupId]: exists ? current.filter(c => c !== choiceId) : [...current, choiceId] };
    });
  };

  const buildCustomizations = (): CartCustomization[] => {
    const result: CartCustomization[] = [];
    product.customizations?.forEach(g => {
      const chosen = selectedChoices[g.id] ?? [];
      chosen.forEach(cId => {
        const choice = g.choices.find(c => c.id === cId);
        if (choice) result.push({
          groupId: g.id,
          groupLabel: g.label[lang],
          choiceId: cId,
          choiceLabel: choice.label[lang],
          priceDelta: choice.priceDelta ?? 0,
        });
      });
    });
    return result;
  };

  const extraTotal = buildCustomizations().reduce((s, c) => s + c.priceDelta, 0);
  const unitPrice = product.price + extraTotal;
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    addToCart(product, qty, buildCustomizations(), note || undefined);
    setAdded(true);
    setTimeout(() => { onClose(); setAdded(false); }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#151516] rounded-t-[28px] shadow-bottom-sheet max-h-[92vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-[#222224] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food photo */}
        {product.imageUrl && (
          <div className="relative w-full h-52 flex-shrink-0">
            <Image src={product.imageUrl} alt={product.name[lang]} fill sizes="100vw" priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151516] via-[#151516]/20 to-transparent" />
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 space-y-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex-1">
              <span className="text-[10px] text-[#A66CFF] uppercase tracking-widest font-semibold">
                {lang === "tr" ? "Ürün Detayı" : "Item Detail"}
              </span>
              <h2 className="text-[#F7F7F8] text-xl font-bold leading-tight mt-0.5">
                {product.name[lang]}
              </h2>
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating!) ? "fill-[#A66CFF] text-[#A66CFF]" : "text-[#222224]"}`} />
                  ))}
                  <span className="text-xs text-[#96969D] ml-0.5">{product.rating} ({product.reviewCount})</span>
                </div>
              )}
            </div>
            <span className="text-[#A66CFF] font-bold text-xl font-mono whitespace-nowrap">
              {product.price} {product.currency}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#96969D] text-sm leading-relaxed">{product.description[lang]}</p>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            {product.prepTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D1D1F] border border-white/[0.06]">
                <Clock className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span className="text-xs text-[#96969D]">{product.prepTime}</span>
              </div>
            )}
            {product.dietary?.isVegan && <DietaryBadge type="vegan" lang={lang} size="sm" />}
            {!product.dietary?.isVegan && product.dietary?.isVegetarian && <DietaryBadge type="vegetarian" lang={lang} size="sm" />}
            {product.dietary?.isGlutenFree && <DietaryBadge type="glutenFree" lang={lang} size="sm" />}
            {product.dietary?.spicyLevel && product.dietary.spicyLevel > 0 ? <DietaryBadge type="spicy" lang={lang} size="sm" /> : null}
            {product.dietary?.isChefRecommended && <DietaryBadge type="chef" lang={lang} size="sm" />}
          </div>

          {/* Customizations */}
          {product.customizations?.map(group => (
            <div key={group.id}>
              <h4 className="text-[#F7F7F8] text-sm font-semibold mb-2">
                {group.label[lang]}
                {group.required && <span className="text-[#A66CFF] ml-1 text-xs">*</span>}
              </h4>
              <div className="space-y-2">
                {group.choices.map(choice => {
                  const isSelected = selectedChoices[group.id]?.includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(group.id, choice.id, group.type)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all active:scale-[0.98] text-left ${
                        isSelected
                          ? "bg-[#302341] border-[#A66CFF]/40 text-[#C7A8FF]"
                          : "bg-[#1D1D1F] border-white/[0.06] text-[#96969D]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#A66CFF] bg-[#A66CFF]" : "border-[#68686E]"}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#101011]" />}
                        </div>
                        <span className="text-sm font-medium">{choice.label[lang]}</span>
                      </div>
                      {choice.priceDelta && choice.priceDelta > 0 && (
                        <span className="text-xs text-[#A66CFF] font-semibold">+{choice.priceDelta} ₺</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special note */}
          <div>
            <h4 className="text-[#F7F7F8] text-sm font-semibold mb-2">
              {lang === "tr" ? "Özel İstek" : "Special Request"}
            </h4>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={lang === "tr" ? "Örn: Sarımsak olmasın lütfen…" : "E.g. No garlic please…"}
              className="w-full px-4 py-3 bg-[#1D1D1F] border border-white/[0.06] rounded-2xl text-[#F7F7F8] text-sm placeholder:text-[#68686E] resize-none focus:outline-none focus:border-[#A66CFF]/40 transition-colors"
            />
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#1D1D1F] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F0B45A]" />
                <span className="text-xs font-semibold text-[#F0B45A] uppercase tracking-wider">
                  {lang === "tr" ? "Alerjenler" : "Allergens"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.allergens.map(a => (
                  <span key={a.id} className="text-[11px] px-2 py-0.5 rounded-md bg-[#222224] text-[#96969D] border border-white/5">
                    {a.name[lang]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef note */}
          {product.chefNote?.[lang] && (
            <div className="p-3.5 rounded-2xl bg-[#302341]/60 border border-[#A66CFF]/15">
              <div className="flex items-center gap-1.5 mb-1">
                <ChefHat className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span className="text-xs font-semibold text-[#A66CFF] uppercase tracking-wider">
                  {lang === "tr" ? "Şefin Notu" : "Chef's Note"}
                </span>
              </div>
              <p className="text-[#96969D] text-xs italic leading-relaxed">"{product.chefNote[lang]}"</p>
            </div>
          )}

          {/* Service notice */}
          <div className="flex items-start gap-2 text-xs text-[#68686E] pb-2">
            <Info className="w-3.5 h-3.5 text-[#A66CFF] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{venue.serviceNotice[lang]}</p>
          </div>
        </div>

        {/* Footer: qty + add button */}
        <div className="flex-shrink-0 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 border-t border-white/[0.06] bg-[#151516]">
          <div className="flex items-center gap-3">
            {/* Qty selector */}
            <div className="flex items-center gap-2 bg-[#1D1D1F] rounded-2xl border border-white/[0.06] px-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] active:scale-90 transition">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-[#F7F7F8] font-bold text-base w-5 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-[#96969D] hover:text-[#A66CFF] active:scale-90 transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 h-12 rounded-2xl font-bold text-sm transition-all active:scale-[0.97] ${
                added
                  ? "bg-[#63D391] text-[#101011]"
                  : "bg-[#A66CFF] text-[#101011] shadow-purple-glow hover:bg-[#B87FFF]"
              }`}
            >
              {added
                ? (lang === "tr" ? "✓ Eklendi!" : "✓ Added!")
                : `${lang === "tr" ? "Siparişe Ekle" : "Add to Order"} · ${totalPrice} ₺`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
