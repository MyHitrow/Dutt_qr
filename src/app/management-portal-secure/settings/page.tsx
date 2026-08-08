"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { Save, CheckCircle2, Upload, X, Moon, Sun } from "lucide-react";

async function optimizeLogoImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 512;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png", 0.95)); // Keep transparent background if PNG
      };
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminSettingsPage() {
  const { venue, updateVenue } = useMenu();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const [isUploadingLight, setIsUploadingLight] = useState(false);

  const darkInputRef = useRef<HTMLInputElement>(null);
  const lightInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: venue.name,
    sloganTr: venue.slogan.tr,
    sloganEn: venue.slogan.en,
    currencySymbol: venue.currencySymbol,
    noticeTr: venue.serviceNotice.tr,
    noticeEn: venue.serviceNotice.en,
    logoDarkUrl: venue.logoDarkUrl || "",
    logoLightUrl: venue.logoLightUrl || "",
  });

  const handleDarkLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDark(true);
    try {
      const optimized = await optimizeLogoImage(file);
      setFormData(f => ({ ...f, logoDarkUrl: optimized }));
    } finally {
      setIsUploadingDark(false);
    }
  };

  const handleLightLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLight(true);
    try {
      const optimized = await optimizeLogoImage(file);
      setFormData(f => ({ ...f, logoLightUrl: optimized }));
    } finally {
      setIsUploadingLight(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenue({
      name: formData.name,
      slogan: { tr: formData.sloganTr, en: formData.sloganEn },
      currencySymbol: formData.currencySymbol,
      serviceNotice: { tr: formData.noticeTr, en: formData.noticeEn },
      logoDarkUrl: formData.logoDarkUrl || undefined,
      logoLightUrl: formData.logoLightUrl || undefined,
    });

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
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold" style={{ color: "var(--dut-text)" }}>
          Mekan & Menü Ayarları
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
          Dijital menünüzdeki mekan adı, logo, slogan, para birimi ve servis uyarılarını yönetin.
        </p>
      </div>

      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          style={{ background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Mekan ayarları ve logolar kaydedildi! Değişiklikler anında canlı menüye yansıdı.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        {/* Name & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            {field("Mekan / Restoran Adı *",
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="admin-input font-bold"
                required
              />
            )}
          </div>

          <div>
            {field("Para Birimi",
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="admin-input font-mono"
                required
              />
            )}
          </div>
        </div>

        {/* Dual Logo Upload Section (Dark & Light) */}
        <div className="space-y-3 pt-2 border-t" style={{ borderColor: "var(--dut-divider)" }}>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--dut-text)" }}>
              Firma Logoları (Çift Tema Desteği)
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
              Müşteri temayı değiştirdiğinde ilgili logo otomatik olarak başlıkta gösterilir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Dark Theme Logo */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "#101011", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Moon className="w-3.5 h-3.5 text-[#A66CFF]" />
                <span>Dark Tema Logosu (Siyah Arka Plan)</span>
              </div>
              <p className="text-[11px] text-gray-400">Koyu temada görünecek beyaz/açık renkli logo veya şeffaf PNG.</p>

              <input
                ref={darkInputRef}
                type="file"
                accept="image/*"
                onChange={handleDarkLogoUpload}
                className="hidden"
              />

              {formData.logoDarkUrl ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-[#1C1C1E] border border-white/10">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 flex items-center justify-center p-1 border border-white/5">
                    <Image
                      src={formData.logoDarkUrl}
                      alt="Dark Logo"
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      unoptimized={formData.logoDarkUrl.startsWith("data:") || formData.logoDarkUrl.startsWith("blob:")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-emerald-400 block">✓ Dark Logo Yüklendi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, logoDarkUrl: "" }))}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => darkInputRef.current?.click()}
                  disabled={isUploadingDark}
                  className="w-full py-5 rounded-xl border border-dashed border-white/20 flex flex-col items-center gap-1.5 text-gray-400 hover:text-white transition-all"
                >
                  <Upload className="w-4 h-4 text-[#A66CFF]" />
                  <span className="text-xs font-semibold">{isUploadingDark ? "Yükleniyor..." : "Dark Logo Yükle (PNG)"}</span>
                </button>
              )}

              <input
                type="url"
                value={formData.logoDarkUrl}
                onChange={e => setFormData({ ...formData, logoDarkUrl: e.target.value })}
                placeholder="veya URL girin: https://..."
                className="admin-input text-xs"
              />
            </div>

            {/* Light Theme Logo */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "#F6F5F3", border: "1px solid rgba(0,0,0,0.1)" }}>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                <Sun className="w-3.5 h-3.5 text-[#F0B45A]" />
                <span>Light Tema Logosu (Açık Arka Plan)</span>
              </div>
              <p className="text-[11px] text-gray-600">Açık temada görünecek koyu/siyah logo veya şeffaf PNG.</p>

              <input
                ref={lightInputRef}
                type="file"
                accept="image/*"
                onChange={handleLightLogoUpload}
                className="hidden"
              />

              {formData.logoLightUrl ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-black/10">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center p-1 border border-black/5">
                    <Image
                      src={formData.logoLightUrl}
                      alt="Light Logo"
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      unoptimized={formData.logoLightUrl.startsWith("data:") || formData.logoLightUrl.startsWith("blob:")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-emerald-600 block">✓ Light Logo Yüklendi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, logoLightUrl: "" }))}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => lightInputRef.current?.click()}
                  disabled={isUploadingLight}
                  className="w-full py-5 rounded-xl border border-dashed border-gray-300 flex flex-col items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-all"
                >
                  <Upload className="w-4 h-4 text-[#F0B45A]" />
                  <span className="text-xs font-semibold">{isUploadingLight ? "Yükleniyor..." : "Light Logo Yükle (PNG)"}</span>
                </button>
              )}

              <input
                type="url"
                value={formData.logoLightUrl}
                onChange={e => setFormData({ ...formData, logoLightUrl: e.target.value })}
                placeholder="veya URL girin: https://..."
                className="admin-input text-xs text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Slogans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: "var(--dut-divider)" }}>
          {field("Slogan (Türkçe)",
            <input
              type="text"
              value={formData.sloganTr}
              onChange={(e) => setFormData({ ...formData, sloganTr: e.target.value })}
              className="admin-input"
            />
          )}

          {field("Slogan (English)",
            <input
              type="text"
              value={formData.sloganEn}
              onChange={(e) => setFormData({ ...formData, sloganEn: e.target.value })}
              className="admin-input"
            />
          )}
        </div>

        {/* Service Notices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Dipnot / Servis Notu (Türkçe)",
            <textarea
              rows={3}
              value={formData.noticeTr}
              onChange={(e) => setFormData({ ...formData, noticeTr: e.target.value })}
              className="admin-input"
              style={{ resize: "none" }}
            />
          )}

          {field("Service Notice (English)",
            <textarea
              rows={3}
              value={formData.noticeEn}
              onChange={(e) => setFormData({ ...formData, noticeEn: e.target.value })}
              className="admin-input"
              style={{ resize: "none" }}
            />
          )}
        </div>

        <div className="pt-4 flex items-center justify-end border-t" style={{ borderColor: "var(--dut-divider)" }}>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg"
            style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
          >
            <Save className="w-4 h-4" />
            <span>Ayarları & Logoları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
