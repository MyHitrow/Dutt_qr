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
    titleTr: "",
    titleEn: "",
    subtitleTr: "",
    subtitleEn: "",
    price: 0,
    currency: "₺",
    imageUrl: "",
    isActive: true,
  });

  const handleOpenEdit = (menu: DailyFixMenu) => {
    setEditingDay(menu);
    setFormData({
      titleTr: menu.title.tr,
      titleEn: menu.title.en,
      subtitleTr: menu.subtitle.tr,
      subtitleEn: menu.subtitle.en,
      price: menu.price,
      currency: menu.currency,
      imageUrl: menu.imageUrl || "",
      isActive: menu.isActive,
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-content-primary">
          Günlük Fix Menü & Etkinlik Banners
        </h2>
        <p className="text-xs text-content-secondary font-light">
          Haftanın her günü için özel fix menü, konsept (Kadınlar Matinesi, Fasıl Gecesi vb.) ve fiyat belirleyin. Sistem ilgili gün geldiğinde 00:01'de otomatik yayına alacaktır.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5" />
          <span>Günlük Fix Menü konsepti kaydedildi!</span>
        </div>
      )}

      {/* 7 Days Fix Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailyFixMenus.map((menu) => {
          const isToday = menu.dayOfWeek === currentDayOfWeek;

          return (
            <div
              key={menu.dayOfWeek}
              className={`bg-surface-card border rounded-xl p-4 space-y-3 relative transition-all ${
                isToday
                  ? "border-brand-purple shadow-purple-glow bg-brand-purple/5"
                  : "border-menuBorder"
              }`}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-purple/10 border border-brand-purple/30 text-brand-purple font-semibold text-xs flex items-center justify-center font-mono">
                    {menu.dayName.tr.substring(0, 3)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm text-content-primary flex items-center gap-2">
                      {menu.dayName.tr} Günlük Menü
                      {isToday && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          BUGÜN YAYINDA
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(menu)}
                  className="p-1.5 rounded-lg bg-background-secondary border border-menuBorder hover:border-brand-purple/40 text-content-secondary hover:text-brand-purple transition-all"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-semibold text-sm text-content-primary">
                  {menu.title.tr}
                </h4>
                <p className="text-xs text-content-secondary font-light line-clamp-2 mt-0.5">
                  {menu.subtitle.tr}
                </p>
              </div>

              {/* Price & Timing */}
              <div className="pt-2 border-t border-menuBorder/60 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-brand-purple">
                  {menu.price} {menu.currency}
                </span>
                <span className="text-[10px] text-content-muted font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-purple" />
                  00:01 - 23:59
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface-card border border-menuBorder rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden purple-corner-tr">
            <div className="p-4 border-b border-menuBorder flex items-center justify-between bg-background-secondary">
              <h3 className="font-semibold text-base text-content-primary">
                {editingDay.dayName.tr} Günü Fix Menü Konsepti
              </h3>
              <button
                onClick={() => setEditingDay(null)}
                className="p-1 rounded-full text-content-muted hover:text-content-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-content-secondary">
                  Fix Menü Başlığı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={formData.titleTr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleTr: e.target.value })
                  }
                  placeholder="Örn: Salı Kadınlar Matinesi Özel Fix Menü"
                  className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-content-secondary">
                  Menü İçeriği & Konsept Açıklaması (Türkçe)
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitleTr}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitleTr: e.target.value })
                  }
                  placeholder="Örn: Sınırsız Meze Büfesi + Canlı Müzik..."
                  className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Fix Menü Fiyatı (₺) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg font-mono focus:border-brand-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Görsel URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-menuBorder flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDay(null)}
                  className="px-4 py-2 bg-background-secondary border border-menuBorder rounded-xl text-content-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-semibold shadow-purple-glow"
                >
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
