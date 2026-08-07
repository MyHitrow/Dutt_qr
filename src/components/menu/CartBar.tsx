"use client";
import React from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Language } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface CartBarProps {
  lang: Language;
  onOpen: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({ lang, onOpen }) => {
  const { cartCount, cartTotal } = useMenu();
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between bg-[#A66CFF] rounded-2xl px-4 py-3.5 shadow-purple-glow active:scale-[0.97] transition-transform animate-spring-pop"
      >
        {/* Left: bag + count */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#101011]" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#101011] rounded-full text-[9px] font-bold text-[#A66CFF] flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <span className="font-bold text-sm text-[#101011]">
            {cartCount} {lang === "tr" ? "ürün" : "items"}
          </span>
        </div>

        {/* Right: total + arrow */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-[#101011]">{cartTotal} ₺</span>
          <ChevronRight className="w-4 h-4 text-[#101011]/70" />
        </div>
      </button>
    </div>
  );
};
