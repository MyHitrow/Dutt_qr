"use client";

import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { venue, updateVenue } = useMenu();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: venue.name,
    sloganTr: venue.slogan.tr,
    sloganEn: venue.slogan.en,
    currencySymbol: venue.currencySymbol,
    noticeTr: venue.serviceNotice.tr,
    noticeEn: venue.serviceNotice.en,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenue({
      name: formData.name,
      slogan: { tr: formData.sloganTr, en: formData.sloganEn },
      currencySymbol: formData.currencySymbol,
      serviceNotice: { tr: formData.noticeTr, en: formData.noticeEn },
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
          Dijital menünüzdeki mekan adı, slogan, para birimi ve dipnot uyarılarını yönetin.
        </p>
      </div>

      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          style={{ background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Mekan ayarları kaydedildi! Değişiklikler anında canlı menüye yansıdı.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <span>Ayarları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
