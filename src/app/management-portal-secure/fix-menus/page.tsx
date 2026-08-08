"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { DailyFixMenu } from "@/types/menu";
import { Calendar, Edit2, Save, X, CheckCircle2, Clock, Upload, Link2, ImageIcon } from "lucide-react";

// Banner görsel optimizasyonu: canvas üzerinden WebP'ye sıkıştırır (max 1200px)
async function optimizeBannerImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminFixMenusPage() {
  const { dailyFixMenus, updateDailyFixMenu } = useMenu();
  const [editingDay, setEditingDay] = useState<DailyFixMenu | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [imgMode, setImgMode] = useState<"url" | "upload">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImgMode(menu.imageUrl?.startsWith("data:") ? "upload" : "url");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const optimized = await optimizeBannerImage(file);
      setFormData(f => ({ ...f, imageUrl: optimized }));
    } finally {
      setIsUploading(false);
    }
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
          Günlük Fix Menü & Banner Görselleri
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
          Haftanın her günü için özel banner görseli ve fix menü konsepti belirleyin. Salı günü tasarımı Salı 00:01'de otomatik yayına girecektir.
        </p>
      </div>

      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          style={{ background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Günün Banner görseli ve konsepti başarıyla güncellendi! Müşteri menüsünde anında yayında.</span>
        </div>
      )}

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailyFixMenus.map((menu) => {
          const isToday = menu.dayOfWeek === currentDayOfWeek;

          return (
            <div
              key={menu.dayOfWeek}
              className="p-5 rounded-3xl space-y-3.5 relative transition-all hover:scale-[1.005] shadow-lg overflow-hidden flex flex-col justify-between"
              style={{
                background: isToday ? "linear-gradient(135deg, rgba(166,108,255,0.12) 0%, var(--dut-card) 100%)" : "var(--dut-card)",
                border: isToday ? "1px solid rgba(166,108,255,0.4)" : "1px solid var(--dut-divider)",
              }}
            >
              {/* Header row */}
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
                  title="Düzenle / Görsel Yükle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Banner Image Preview */}
              {menu.imageUrl ? (
                <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-md border" style={{ borderColor: "var(--dut-divider)" }}>
                  <Image
                    src={menu.imageUrl}
                    alt={menu.title.tr}
                    fill
                    sizes="400px"
                    className="object-cover"
                    unoptimized={menu.imageUrl.startsWith("data:") || menu.imageUrl.startsWith("blob:")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-[10px] uppercase font-bold text-[#A66CFF] block">Banner Görseli</span>
                    <h4 className="font-bold text-xs text-white truncate">{menu.title.tr}</h4>
                  </div>
                </div>
              ) : (
                <div className="w-full py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
                  <ImageIcon className="w-5 h-5 opacity-40" />
                  <span className="text-xs font-medium opacity-60">Banner görseli yüklenmemiş</span>
                </div>
              )}

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
                {editingDay.dayName.tr} Günü Banner & Konsepti
              </h3>
              <button
                onClick={() => setEditingDay(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--dut-elevated)", color: "var(--dut-text2)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">

              {/* Banner Image Upload / URL Selector */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--dut-text2)" }}>
                  Günün Banner Tasarımı Görseli
                </label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImgMode("upload")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={imgMode === "upload"
                      ? { background: "rgba(166,108,255,0.15)", border: "1px solid rgba(166,108,255,0.35)", color: "var(--dut-purple)" }
                      : { background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }
                    }
                  >
                    <Upload className="w-3.5 h-3.5" /> Tasarım Dosyası Yükle
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgMode("url")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={imgMode === "url"
                      ? { background: "rgba(166,108,255,0.15)", border: "1px solid rgba(166,108,255,0.35)", color: "var(--dut-purple)" }
                      : { background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }
                    }
                  >
                    <Link2 className="w-3.5 h-3.5" /> URL Linki Ver
                  </button>
                </div>

                {imgMode === "upload" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-all"
                      style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)", background: "var(--dut-bg)" }}
                    >
                      {isUploading ? (
                        <span className="text-xs animate-pulse" style={{ color: "var(--dut-purple)" }}>Optimize ediliyor...</span>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" style={{ color: "var(--dut-purple)" }} />
                          <span className="text-xs font-bold" style={{ color: "var(--dut-text)" }}>
                            {editingDay.dayName.tr} Günü Banner Görselini Yükle
                          </span>
                          <span className="text-[10px] opacity-60">Yüksek kalite WebP'ye otomatik dönüştürülür (max 1200px)</span>
                        </>
                      )}
                    </button>
                    {formData.imageUrl && (
                      <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl border" style={{ background: "var(--dut-bg)", borderColor: "var(--dut-divider)" }}>
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={formData.imageUrl}
                            alt="preview"
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={formData.imageUrl.startsWith("data:") || formData.imageUrl.startsWith("blob:")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold" style={{ color: "var(--dut-success)" }}>✓ Yüklendi ve Optimize Edildi</p>
                          <p className="text-[10px] truncate" style={{ color: "var(--dut-text3)" }}>{editingDay.dayName.tr} Banner Görseli</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(f => ({ ...f, imageUrl: "" }))}
                          className="p-1 rounded-lg"
                          style={{ color: "var(--dut-danger)" }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="admin-input"
                  />
                )}
              </div>

              {field("Fix Menü Başlığı (Türkçe) *",
                <input
                  type="text"
                  value={formData.titleTr}
                  onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })}
                  placeholder="Salı Kadınlar Matinesi Özel Fix Menü"
                  className="admin-input font-bold"
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
                {field("Para Birimi",
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="admin-input font-mono"
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
                  Kaydet & Yayına Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
