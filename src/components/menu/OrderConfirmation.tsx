"use client";
import React, { useEffect } from "react";
import { CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Language, OrderStatus } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface OrderConfirmationProps {
  lang: Language;
  onClose: () => void;
}

const statusSteps: { key: OrderStatus; labelTr: string; labelEn: string }[] = [
  { key: "received",  labelTr: "Sipariş Alındı",  labelEn: "Order Received"  },
  { key: "preparing", labelTr: "Hazırlanıyor",     labelEn: "Preparing"       },
  { key: "ready",     labelTr: "Hazır / Servis",   labelEn: "Ready / Served"  },
];

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ lang, onClose }) => {
  const { currentOrder, updateOrderStatus } = useMenu();
  if (!currentOrder) return null;

  const currentIndex = statusSteps.findIndex(s => s.key === currentOrder.status);

  // Demo: auto-advance status
  useEffect(() => {
    if (currentOrder.status === "received") {
      const t1 = setTimeout(() => updateOrderStatus("preparing"), 5000);
      const t2 = setTimeout(() => updateOrderStatus("ready"), 20000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center dut-backdrop px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#151516] rounded-[28px] p-6 shadow-bottom-sheet border border-white/[0.06] animate-scale-in">
        {/* Success icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#63D391]/10 border border-[#63D391]/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#63D391]" />
          </div>
          <h2 className="text-[#F7F7F8] text-xl font-bold text-center">
            {lang === "tr" ? "Sipariş Mutfağa Gönderildi!" : "Order Sent to Kitchen!"}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono font-semibold text-[#A66CFF] bg-[#302341] px-3 py-1 rounded-full border border-[#A66CFF]/25">
              #{currentOrder.id}
            </span>
          </div>
        </div>

        {/* Estimated time */}
        <div className="flex items-center justify-center gap-2 mb-6 py-3 rounded-2xl bg-[#1D1D1F] border border-white/[0.06]">
          <Clock className="w-4 h-4 text-[#F0B45A]" />
          <span className="text-sm text-[#96969D]">
            {lang === "tr" ? "Tahmini Süre:" : "Est. Time:"}
          </span>
          <span className="text-sm font-bold text-[#F7F7F8]">{currentOrder.estimatedTime}</span>
        </div>

        {/* Status progress */}
        <div className="space-y-3 mb-6">
          {statusSteps.map((step, i) => {
            const isDone    = i < currentIndex;
            const isActive  = i === currentIndex;
            const isPending = i > currentIndex;
            return (
              <div key={step.key} className="flex items-center gap-3">
                {/* Step indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone   ? "bg-[#63D391] border-2 border-[#63D391]" :
                  isActive ? "bg-[#302341] border-2 border-[#A66CFF] shadow-purple-glow" :
                             "bg-[#1D1D1F] border-2 border-white/10"
                }`}>
                  {isDone
                    ? <span className="text-[10px] text-[#101011] font-bold">✓</span>
                    : isActive
                    ? <div className="w-2 h-2 rounded-full bg-[#A66CFF] animate-pulse" />
                    : null
                  }
                </div>

                {/* Label */}
                <span className={`text-sm font-medium ${
                  isDone    ? "text-[#63D391]" :
                  isActive  ? "text-[#F7F7F8]" :
                              "text-[#68686E]"
                }`}>
                  {lang === "tr" ? step.labelTr : step.labelEn}
                </span>

                {isActive && (
                  <span className="ml-auto text-[10px] font-semibold text-[#A66CFF] bg-[#302341] px-2 py-0.5 rounded-full border border-[#A66CFF]/25 animate-pulse">
                    {lang === "tr" ? "Devam ediyor" : "In progress"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Order total */}
        <div className="p-3 rounded-2xl bg-[#1D1D1F] border border-white/[0.04] mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#96969D]">{lang === "tr" ? "Sipariş Toplam" : "Order Total"}</span>
            <span className="font-bold text-[#A66CFF] font-mono">{currentOrder.total} ₺</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-12 bg-[#1D1D1F] border border-white/[0.06] rounded-2xl font-semibold text-sm text-[#F7F7F8] hover:border-[#A66CFF]/30 transition-colors active:scale-[0.97]"
        >
          {lang === "tr" ? "Menüye Dön" : "Back to Menu"}
        </button>
      </div>
    </div>
  );
};
