"use client";
import React from "react";
import { Home, UtensilsCrossed, ShoppingBag, Bell } from "lucide-react";
import { Language } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface BottomNavProps {
  lang: Language;
  activeTab: "home" | "menu" | "order" | "service";
  onHomeClick: () => void;
  onMenuClick: () => void;
  onOrderClick: () => void;
  onServiceClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang, activeTab, onHomeClick, onMenuClick, onOrderClick, onServiceClick,
}) => {
  const { cartCount } = useMenu();

  const tabs = [
    { id: "home",    icon: Home,          labelTr: "Ana Sayfa", labelEn: "Home",    action: onHomeClick    },
    { id: "menu",    icon: UtensilsCrossed, labelTr: "Menü",   labelEn: "Menu",    action: onMenuClick    },
    { id: "order",   icon: ShoppingBag,   labelTr: "Sipariş",  labelEn: "Order",   action: onOrderClick   },
    { id: "service", icon: Bell,          labelTr: "Servis",   labelEn: "Service", action: onServiceClick  },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom)] bg-[#151516]/95 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === "order" && cartCount > 0;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`flex flex-col items-center gap-1 min-w-[60px] py-1 rounded-2xl transition-all active:scale-90 ${
                isActive ? "text-[#A66CFF]" : "text-[#68686E] hover:text-[#96969D]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#A66CFF] rounded-full text-[8px] font-bold text-[#101011] flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-[#A66CFF]" : "text-[#68686E]"}`}>
                {lang === "tr" ? tab.labelTr : tab.labelEn}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#A66CFF]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
