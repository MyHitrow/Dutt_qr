"use client";
import React from "react";
import { X } from "lucide-react";
import { Language } from "@/types/menu";

interface WaiterBottomSheetProps {
  lang: Language;
  onClose: () => void;
}

const actions = [
  { id: "call",    emojiTr: "🙋",  labelTr: "Garson Çağır",    labelEn: "Call Waiter",    color: "text-[#C7A8FF]",  bg: "bg-[#302341]",     border: "border-[#A66CFF]/25"  },
  { id: "bill",    emoji:    "💳",  labelTr: "Hesap İste",       labelEn: "Request Bill",   color: "text-[#F7F7F8]",  bg: "bg-[#1D1D1F]",     border: "border-white/[0.06]"  },
  { id: "water",   emoji:    "💧",  labelTr: "Su İste",          labelEn: "Request Water",  color: "text-[#F7F7F8]",  bg: "bg-[#1D1D1F]",     border: "border-white/[0.06]"  },
  { id: "help",    emoji:    "❓",  labelTr: "Yardım Lazım",     labelEn: "Need Help",      color: "text-[#F7F7F8]",  bg: "bg-[#1D1D1F]",     border: "border-white/[0.06]"  },
];

export const WaiterBottomSheet: React.FC<WaiterBottomSheetProps> = ({ lang, onClose }) => {
  const handleAction = (id: string) => {
    // In a real app this would trigger a waiter notification
    console.log("Waiter action:", id);
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

        <div className="px-5 pb-2">
          <h2 className="text-[#F7F7F8] font-bold text-lg mb-1">
            {lang === "tr" ? "Servis Talebi" : "Service Request"}
          </h2>
          <p className="text-[#68686E] text-sm mb-5">
            {lang === "tr" ? "Servis ekibimize hızlıca ulaşın." : "Quickly reach our service team."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {actions.map(action => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className={`flex flex-col items-center gap-2 py-5 rounded-2xl ${action.bg} border ${action.border} active:scale-[0.96] transition-transform`}
              >
                <span className="text-2xl">{action.emoji ?? action.emojiTr}</span>
                <span className={`text-sm font-semibold ${action.color}`}>
                  {lang === "tr" ? action.labelTr : action.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
