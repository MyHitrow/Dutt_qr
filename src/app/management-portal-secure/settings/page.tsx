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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-content-primary">
          Mekan & Menü Genel Ayarları
        </h2>
        <p className="text-xs text-content-secondary font-light">
          Dijital menünüzde görünen mekan ismi, slogan, para birimi ve servis uyarılarını yönetin.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5" />
          <span>Mekan ayarları başarıyla güncellendi! Müşteri menüsüne anında yansıdı.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-card border border-menuBorder rounded-2xl p-6 space-y-5 purple-corner-tr text-xs"
      >
        {/* Venue Name & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1 text-content-secondary">
              Mekan / Restoran Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-content-secondary">
              Para Birimi Sembolü
            </label>
            <input
              type="text"
              value={formData.currencySymbol}
              onChange={(e) =>
                setFormData({ ...formData, currencySymbol: e.target.value })
              }
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple font-mono"
              required
            />
          </div>
        </div>

        {/* Slogans TR & EN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-content-secondary">
              Slogan (Türkçe)
            </label>
            <input
              type="text"
              value={formData.sloganTr}
              onChange={(e) =>
                setFormData({ ...formData, sloganTr: e.target.value })
              }
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-content-secondary">
              Slogan (English)
            </label>
            <input
              type="text"
              value={formData.sloganEn}
              onChange={(e) =>
                setFormData({ ...formData, sloganEn: e.target.value })
              }
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
            />
          </div>
        </div>

        {/* Service Notices TR & EN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-content-secondary">
              Servis Ekibi Hatırlatma Notu (Türkçe)
            </label>
            <textarea
              rows={3}
              value={formData.noticeTr}
              onChange={(e) =>
                setFormData({ ...formData, noticeTr: e.target.value })
              }
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-content-secondary">
              Service Notice (English)
            </label>
            <textarea
              rows={3}
              value={formData.noticeEn}
              onChange={(e) =>
                setFormData({ ...formData, noticeEn: e.target.value })
              }
              className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-menuBorder flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-semibold shadow-purple-glow transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Ayarları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
