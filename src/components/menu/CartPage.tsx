"use client";
import React from "react";
import { X, Minus, Plus, Trash2, MapPin, Send } from "lucide-react";
import { Language } from "@/types/menu";
import { useMenu } from "@/context/MenuContext";

interface CartPageProps {
  lang: Language;
  onClose: () => void;
  onOrderSent: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ lang, onClose, onOrderSent }) => {
  const { venue, cartItems, cartSubtotal, serviceFee, cartTotal, updateCartItemQty, removeFromCart, submitOrder } = useMenu();

  const handleSubmit = () => {
    submitOrder();
    onClose();
    onOrderSent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center dut-backdrop animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#151516] rounded-t-[28px] shadow-bottom-sheet max-h-[90vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0">
          <div className="dut-handle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0 border-b border-white/[0.06]">
          <div>
            <h2 className="text-[#F7F7F8] font-bold text-lg">
              {lang === "tr" ? "Siparişim" : "My Order"}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-[#A66CFF]" />
              <span className="text-xs text-[#68686E]">
                {lang === "tr" ? `Masa ${venue.tableNumber}` : `Table ${venue.tableNumber}`}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#222224] border border-white/[0.06] flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3">
          {cartItems.map(item => (
            <div key={item.cartId} className="bg-[#1D1D1F] rounded-2xl p-3.5 border border-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-[#F7F7F8] text-sm font-semibold">{item.product.name[lang]}</h3>
                  {item.customizations.length > 0 && (
                    <p className="text-[#68686E] text-xs mt-0.5">
                      {item.customizations.map(c => c.choiceLabel).join(", ")}
                    </p>
                  )}
                  {item.specialNote && (
                    <p className="text-[#A66CFF]/70 text-[11px] mt-0.5 italic">"{item.specialNote}"</p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-[#68686E] hover:text-[#FF6B6B] transition-colors mt-0.5 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                {/* Qty control */}
                <div className="flex items-center gap-2 bg-[#151516] rounded-xl border border-white/[0.06] px-1">
                  <button onClick={() => updateCartItemQty(item.cartId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-[#96969D] hover:text-[#F7F7F8] active:scale-90 transition">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#F7F7F8] font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartItemQty(item.cartId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-[#96969D] hover:text-[#A66CFF] active:scale-90 transition">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[#A66CFF] font-bold text-sm font-mono">{item.lineTotal} ₺</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + CTA */}
        <div className="flex-shrink-0 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 border-t border-white/[0.06] bg-[#151516] space-y-3">
          {/* Price breakdown */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[#96969D]">{lang === "tr" ? "Ara Toplam" : "Subtotal"}</span>
              <span className="text-[#F7F7F8] font-mono">{cartSubtotal} ₺</span>
            </div>
            {serviceFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#96969D]">{lang === "tr" ? "Servis Ücreti" : "Service Fee"} ({venue.serviceFeePercent}%)</span>
                <span className="text-[#F7F7F8] font-mono">{serviceFee} ₺</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-1.5 border-t border-white/[0.06]">
              <span className="text-[#F7F7F8]">{lang === "tr" ? "Toplam" : "Total"}</span>
              <span className="text-[#A66CFF] font-mono">{cartTotal} ₺</span>
            </div>
          </div>

          {/* Send Order CTA */}
          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#A66CFF] rounded-2xl font-bold text-[#101011] text-sm flex items-center justify-center gap-2 shadow-purple-glow active:scale-[0.97] transition-transform hover:bg-[#B87FFF]"
          >
            <Send className="w-4 h-4" />
            {venue.orderMode === "direct"
              ? (lang === "tr" ? "Siparişi Gönder" : "Send Order")
              : (lang === "tr" ? "Garsonı Çağır" : "Call Waiter")
            }
          </button>
        </div>
      </div>
    </div>
  );
};
