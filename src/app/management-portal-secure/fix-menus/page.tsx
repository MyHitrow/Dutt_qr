"use client";

import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { DailyFixMenu } from "@/types/menu";
import { Calendar, Edit2, Save, X, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function AdminFixMenusPage() {
  const { dailyFixMenus, updateDailyFixMenu } = useMenu();
  const [editingDay, setEditingDay] = useState<DailyFixMenu | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentDayOfWeek = new Date().getDay();

  const [formData, setFormData] = useState({
    titleTr: "", titleEn: "", subtitleTr: "", subtitleEn: "",
    price: 0, currency: "₺", imageUrl: "", isActive: true,
  });

  const handleOpenEdit = (menu: DailyFixMenu) => {
    setEditingDay(menu);
    setFormData({
      titleTr: menu.title.tr, titleEn: menu.title.en,
      subtitleTr: menu.subtitle.tr, subtitleEn: menu.subtitle.en,
      price: menu.price, currency: menu.currency,
      imageUrl: menu.imageUrl || "", isActive: menu.isActive,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    updateDailyFixMenu(editingDay.dayOfWeek, {
      title: { tr: formData.titleTr, en: formData.titleEn || formData.titleTr },
      subtitle: { tr: formData.subtitleTr, en: formData.subtitleEn || formData.subtitleTr },
      price: Number(formData.price),
      currency: formData.currency,
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive,
    });

    setEditingDay(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dut-text2)" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold" style={{ color: "var(--dut-text)" }}>
          Günlük Fix Menü & Konseptler
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
          Haftanın her günü için özel fix menü (Kadınlar Matinesi, Fasıl Gecesi vb.) belirleyin. İlgili günde saat 00:01-23:59 arası otomatik gösterilir.
        </p>
      </div>

      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          style={{ background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Fix Menü konsepti başarıyla güncellendi!</span>
        </div>
      )}

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailyFixMenus.map((menu) => {
          const isToday = menu.dayOfWeek === currentDayOfWeek;

          return (
            <div
              key={menu.dayOfWeek}
              className="p-5 rounded-3xl space-y-3 relative transition-all hover:scale-[1.005] shadow-lg"
              style={{
                background: isToday ? "linear-gradient(135deg, rgba(166,108,255,0.1) 0%, var(--dut-card) 100%)" : "var(--dut-card)",
                border: isToday ? "1px solid rgba(166,108,255,0.4)" : "1px solid var(--dut-divider)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono"
                    style={{ background: "rgba(166,108,255,0.15)", color: "var(--dut-purple-lt)", border: "1px solid rgba(166,108,255,0.3)" }}
                  >
                    {menu.dayName.tr.substring(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--dut-text)" }}>
                      {menu.dayName.tr}
                      {isToday && (
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: "rgba(99,211,145,0.15)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.3)" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--dut-success)" }} />
                          BUGÜN YAYINDA
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(menu)}
                  className="p-2 rounded-xl transition-all"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-sm" style={{ color: "var(--dut-text)" }}>{menu.title.tr}</h4>
                <p className="text-xs line-clamp-2 mt-0.5" style={{ color: "var(--dut-text3)" }}>{menu.subtitle.tr}</p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--dut-divider)" }}>
                <span className="font-mono font-bold text-sm" style={{ color: "var(--dut-purple-lt)" }}>
                  {menu.price} {menu.currency}
                </span>
                <span className="text-[11px] font-mono flex items-center gap-1" style={{ color: "var(--dut-text3)" }}>
                  <Clock className="w-3 h-3 text-[#A66CFF]" />
                  00:01 – 23:59
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dut-backdrop animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl shadow-2xl animate-scale-in"
            style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--dut-divider)" }}>
              <h3 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
                {editingDay.dayName.tr} Fix Menü Konsepti
              </h3>
              <button
                onClick={() => setEditingDay(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--dut-elevated)", color: "var(--dut-text2)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {field("Fix Menü Başlığı (Türkçe) *",
                <input
                  type="text"
                  value={formData.titleTr}
                  onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })}
                  placeholder="Salı Kadınlar Matinesi Özel Fix Menü"
                  className="admin-input"
                  required
                />
              )}

              {field("Konsept Açıklaması (Türkçe)",
                <textarea
                  rows={2}
                  value={formData.subtitleTr}
                  onChange={(e) => setFormData({ ...formData, subtitleTr: e.target.value })}
                  placeholder="Sınırsız meze büfesi + canlı müzik..."
                  className="admin-input"
                  style={{ resize: "none" }}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                {field("Fix Menü Fiyatı (₺) *",
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="admin-input font-mono"
                    required
                  />
                )}

                {field("Görsel URL",
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="admin-input"
                  />
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t" style={{ borderColor: "var(--dut-divider)" }}>
                <button
                  type="button"
                  onClick={() => setEditingDay(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                  style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
