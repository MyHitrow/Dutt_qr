"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { Save, CheckCircle2, Upload, X, Moon, Sun, Lock, ShieldCheck, Clock, Phone, Wifi, MapPin, MessageCircle, Ban, AlertCircle, Sparkles, Database, Download, RotateCcw, Archive, HardDrive, RefreshCw } from "lucide-react";
import { LicenseBanner } from "@/components/admin/LicenseBanner";
import { BackupItem } from "@/lib/backup";
import { formatWhatsAppNumber } from "@/lib/phone";

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

const daysOfWeekList = [
  { day: 1, label: "Pazartesi", short: "Pzt" },
  { day: 2, label: "Salı", short: "Sal" },
  { day: 3, label: "Çarşamba", short: "Çar" },
  { day: 4, label: "Perşembe", short: "Per" },
  { day: 5, label: "Cuma", short: "Cum" },
  { day: 6, label: "Cumartesi", short: "Cmt" },
  { day: 0, label: "Pazar", short: "Paz" },
];

export default function AdminSettingsPage() {
  const { venue, updateVenue, resetAllData } = useMenu();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const [isUploadingLight, setIsUploadingLight] = useState(false);

  const darkInputRef = useRef<HTMLInputElement>(null);
  const lightInputRef = useRef<HTMLInputElement>(null);
  const isDirtyRef = useRef(false);

  const [formData, setFormData] = useState({
    name: venue.name,
    sloganTr: venue.slogan?.tr || "",
    sloganEn: venue.slogan?.en || "",
    currencySymbol: venue.currencySymbol || "₺",
    noticeTr: venue.serviceNotice?.tr || "",
    noticeEn: venue.serviceNotice?.en || "",
    logoDarkUrl: venue.logoDarkUrl || "",
    logoLightUrl: venue.logoLightUrl || "",
    isOpen: venue.isOpen !== false,
    closedMessageTr: venue.closedMessage?.tr || "",
    closedMessageEn: venue.closedMessage?.en || "",
    contactPhone: venue.contactPhone || "",
    closingTime: venue.closingTime || "02:00",
    closedDays: venue.closedDays || [],
    wifiName: venue.wifiName || "",
    wifiPassword: venue.wifiPassword || "",
    address: venue.address || "",
    googleMapsUrl: venue.googleMapsUrl || "",
    whatsappNumber: venue.whatsappNumber || "",
    cardStyle: (venue.cardStyle as "floating" | "cover" | "list") || "floating",
  });

  // Backups state
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [backupActionLoading, setBackupActionLoading] = useState(false);
  const [backupMsg, setBackupMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBackups = async () => {
    try {
      setLoadingBackups(true);
      const res = await fetch("/api/backup");
      const json = await res.json();
      if (json.success && Array.isArray(json.backups)) {
        setBackups(json.backups);
      }
    } catch (err) {
      console.warn("Failed to load backups", err);
    } finally {
      setLoadingBackups(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateManualBackup = async () => {
    try {
      setBackupActionLoading(true);
      setBackupMsg(null);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const json = await res.json();
      if (json.success) {
        setBackupMsg({ type: "success", text: "Yeni veritabanı yedeği başarıyla alındı!" });
        await fetchBackups();
      } else {
        setBackupMsg({ type: "error", text: json.error || "Yedek alınamadı." });
      }
    } catch (err: any) {
      setBackupMsg({ type: "error", text: err.message || "Bağlantı hatası." });
    } finally {
      setBackupActionLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`DİKKAT: "${filename}" yedeğine geri dönmek istediğinizden emin misiniz?\n\nMevcut veritabanı bu yedeğin içeriğiyle değiştirilecektir.`)) {
      return;
    }
    try {
      setBackupActionLoading(true);
      setBackupMsg(null);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", filename }),
      });
      const json = await res.json();
      if (json.success) {
        setBackupMsg({ type: "success", text: "Yedek başarıyla geri yüklendi! Sayfa yenileniyor..." });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setBackupMsg({ type: "error", text: json.error || "Geri yükleme başarısız." });
      }
    } catch (err: any) {
      setBackupMsg({ type: "error", text: err.message || "Bağlantı hatası." });
    } finally {
      setBackupActionLoading(false);
    }
  };

  // Sync formData if venue is loaded or updated asynchronously, but ONLY if the user has not made unsaved changes
  React.useEffect(() => {
    if (!isDirtyRef.current) {
      setFormData({
        name: venue.name || "",
        sloganTr: venue.slogan?.tr || "",
        sloganEn: venue.slogan?.en || "",
        currencySymbol: venue.currencySymbol || "₺",
        noticeTr: venue.serviceNotice?.tr || "",
        noticeEn: venue.serviceNotice?.en || "",
        logoDarkUrl: venue.logoDarkUrl || "",
        logoLightUrl: venue.logoLightUrl || "",
        isOpen: venue.isOpen !== false,
        closedMessageTr: venue.closedMessage?.tr || "",
        closedMessageEn: venue.closedMessage?.en || "",
        contactPhone: venue.contactPhone || "",
        closingTime: venue.closingTime || "02:00",
        closedDays: venue.closedDays || [],
        wifiName: venue.wifiName || "",
        wifiPassword: venue.wifiPassword || "",
        address: venue.address || "",
        googleMapsUrl: venue.googleMapsUrl || "",
        whatsappNumber: venue.whatsappNumber || "",
        cardStyle: (venue.cardStyle as "floating" | "cover" | "list") || "floating",
      });
    }
  }, [venue]);

  const updateField = (key: keyof typeof formData, value: any) => {
    isDirtyRef.current = true;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDarkLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDark(true);
    isDirtyRef.current = true;
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
    isDirtyRef.current = true;
    try {
      const optimized = await optimizeLogoImage(file);
      setFormData(f => ({ ...f, logoLightUrl: optimized }));
    } finally {
      setIsUploadingLight(false);
    }
  };

  const handleToggleClosedDay = (dayIndex: number) => {
    isDirtyRef.current = true;
    const current = formData.closedDays || [];
    const updated = current.includes(dayIndex)
      ? current.filter((d) => d !== dayIndex)
      : [...current, dayIndex];
    setFormData((prev) => ({ ...prev, closedDays: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isDirtyRef.current = false;
    updateVenue({
      name: formData.name,
      slogan: { tr: formData.sloganTr, en: formData.sloganEn },
      currencySymbol: formData.currencySymbol,
      serviceNotice: { tr: formData.noticeTr, en: formData.noticeEn },
      logoDarkUrl: formData.logoDarkUrl || undefined,
      logoLightUrl: formData.logoLightUrl || undefined,
      isOpen: formData.isOpen,
      closingTime: formData.closingTime,
      closedMessage: { tr: formData.closedMessageTr, en: formData.closedMessageEn },
      contactPhone: formData.contactPhone || undefined,
      closedDays: formData.closedDays,
      wifiName: formData.wifiName || undefined,
      wifiPassword: formData.wifiPassword || undefined,
      address: formData.address || undefined,
      googleMapsUrl: formData.googleMapsUrl || undefined,
      whatsappNumber: formatWhatsAppNumber(formData.contactPhone, formData.whatsappNumber) || undefined,
      cardStyle: formData.cardStyle,
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

      {/* License Status & Countdown Banner */}
      <LicenseBanner license={venue.license} venueName={venue.name} />

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        {/* Restaurant Status & QR Access Lock Section */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4 transition-all"
          style={{
            background: formData.isOpen ? "rgba(99,211,145,0.06)" : "rgba(255,107,107,0.08)",
            borderColor: formData.isOpen ? "rgba(99,211,145,0.25)" : "rgba(255,107,107,0.35)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: formData.isOpen ? "rgba(99,211,145,0.15)" : "rgba(255,107,107,0.18)",
                  color: formData.isOpen ? "var(--dut-success)" : "var(--dut-danger)",
                }}
              >
                {formData.isOpen ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-rose-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                    Restoran Çalışma & Müşteri QR Erişim Durumu
                  </h3>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{
                      background: formData.isOpen ? "rgba(99,211,145,0.2)" : "rgba(255,107,107,0.2)",
                      color: formData.isOpen ? "var(--dut-success)" : "var(--dut-danger)",
                    }}
                  >
                    {formData.isOpen ? "Servis Açık" : "Servis Kapalı / Kilitli"}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--dut-text3)" }}>
                  {formData.isOpen
                    ? "Müşteriler masalardan QR kodu okutarak tüm menüye erişebilir ve sipariş verebilir."
                    : "Müşteriler menüye erişemez; bunun yerine 'Restoranımız Kapalıdır' bilgilendirme kartı gösterilir."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateField("isOpen", !formData.isOpen)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex-shrink-0 flex items-center justify-center gap-2 shadow-md"
              style={{
                background: formData.isOpen ? "var(--dut-danger)" : "var(--dut-success)",
                boxShadow: formData.isOpen ? "0 4px 14px rgba(255,107,107,0.3)" : "0 4px 14px rgba(99,211,145,0.3)",
              }}
            >
              {formData.isOpen ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Restoranı Kapat & QR Menüyü Kilitle</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Restoranı Aç & Menüyü Yayına Al</span>
                </>
              )}
            </button>
          </div>

          {/* Additional closed details */}
          <div className="pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ borderColor: "var(--dut-divider)" }}>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--dut-text2)" }}>
                Kapanış Bildirim Mesajı (Türkçe)
              </label>
              <textarea
                rows={2}
                value={formData.closedMessageTr}
                onChange={(e) => updateField("closedMessageTr", e.target.value)}
                placeholder="Örn: Değerli misafirlerimiz, restoranımız şu anda hizmet vermemektedir..."
                className="admin-input text-xs"
                style={{ resize: "none" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--dut-text2)" }}>
                Closed Notice (English)
              </label>
              <textarea
                rows={2}
                value={formData.closedMessageEn}
                onChange={(e) => updateField("closedMessageEn", e.target.value)}
                placeholder="e.g. Dear guests, our restaurant is currently closed..."
                className="admin-input text-xs"
                style={{ resize: "none" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--dut-text2)" }}>
                İletişim / Rezervasyon Telefonu (Müşteriye Gösterilir)
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
                placeholder="+90 252 000 00 00"
                className="admin-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--dut-text2)" }}>
                Mutfak Kapanış Saati
              </label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => updateField("closingTime", e.target.value)}
                placeholder="02:00"
                className="admin-input text-xs font-mono"
              />
            </div>

            {/* Haftalık Kapalı Günler */}
            <div className="pt-3 border-t sm:col-span-2 space-y-2" style={{ borderColor: "var(--dut-divider)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                  Haftalık Kapalı Günler (Bu günlerde Fix Menü üst bannerı otomatik gizlenir)
                </label>
                {(formData.closedDays || []).includes(new Date().getDay()) && (
                  <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Bugün kapalı gün seçili (Banner menüde gizli)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {daysOfWeekList.map((d) => {
                  const isClosed = (formData.closedDays || []).includes(d.day);
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => handleToggleClosedDay(d.day)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1.5"
                      style={{
                        background: isClosed ? "rgba(255,107,107,0.18)" : "rgba(255,255,255,0.04)",
                        borderColor: isClosed ? "rgba(255,107,107,0.4)" : "var(--dut-divider)",
                        color: isClosed ? "#FFA8A8" : "var(--dut-text3)",
                      }}
                    >
                      <span>{d.label}</span>
                      {isClosed ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/25 text-rose-300 font-bold">Kapalı</span>
                      ) : (
                        <span className="text-[10px] opacity-40">Açık</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Müşteri Bilgileri, Wi-Fi & İletişim (3-Nokta Menüsü İçeriği) */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm"
          style={{ background: "rgba(166,108,255,0.04)", borderColor: "rgba(166,108,255,0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-300">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                Müşteri Masası Wi-Fi & İletişim Bilgileri (QR 3-Nokta Menüsü)
              </h3>
              <p className="text-xs" style={{ color: "var(--dut-text3)" }}>
                Müşterilerin masada sağ alttaki 3-nokta butonuna bastıklarında görecekleri Wi-Fi şifresi, otomatik bağlanma ve açık adres bilgileri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {field("Wi-Fi Ağ Adı (SSID)",
              <input
                type="text"
                value={formData.wifiName}
                onChange={(e) => updateField("wifiName", e.target.value)}
                placeholder="Örn: Dutt Meyhane"
                className="admin-input font-mono text-xs"
              />
            )}

            {field("Wi-Fi Şifresi",
              <input
                type="text"
                value={formData.wifiPassword}
                onChange={(e) => updateField("wifiPassword", e.target.value)}
                placeholder="Örn: duttmeyhane2026"
                className="admin-input font-mono text-xs"
              />
            )}

            <div className="sm:col-span-2">
              {field("Mekan Açık Adresi",
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Örn: Çamlıbel Mh., İsmet İnönü Blv. No:14, Akdeniz / Mersin"
                  className="admin-input text-xs"
                />
              )}
            </div>

            <div>
              {field("Google Haritalar Linki (Yol Tarifi)",
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => updateField("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="admin-input text-xs font-mono"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                  WhatsApp Rezervasyon Numarası
                </label>
                {formData.contactPhone && (
                  <button
                    type="button"
                    onClick={() => updateField("whatsappNumber", formData.contactPhone)}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Telefonla Aynı Yap
                  </button>
                )}
              </div>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                placeholder={formData.contactPhone ? `Otomatik: ${formData.contactPhone}` : "Örn: 0553 589 16 29"}
                className="admin-input text-xs font-mono"
              />
              <p className="text-[10px] mt-1" style={{ color: "var(--dut-text3)" }}>
                Boş bırakılırsa yukarıdaki iletişim telefonu otomatik olarak WhatsApp butonu için kullanılır.
              </p>
            </div>
          </div>
        </div>

        {/* Menü Kartı & Fotoğraf Tasarım Modu (3 Farklı İşletme Konsepti) */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm"
          style={{ background: "rgba(166,108,255,0.04)", borderColor: "rgba(166,108,255,0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                Menü Kartı & Fotoğraf Tasarım Tarzı (3 Farklı İşletme Formatı)
              </h3>
              <p className="text-xs" style={{ color: "var(--dut-text3)" }}>
                İşletmenizin konseptine ve elinizdeki fotoğraf türüne en uygun kart stilini seçin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* 1. Seçenek: Lüks Dekupe / Yüzen Tabak (Floating PNG) */}
            <div
              onClick={() => updateField("cardStyle", "floating")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                formData.cardStyle === "floating"
                  ? "bg-purple-500/15 border-purple-400 shadow-purple-glow"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🍽️</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  formData.cardStyle === "floating" ? "bg-purple-500/30 text-purple-200" : "bg-white/5 text-white/40"
                }`}>
                  {formData.cardStyle === "floating" ? "Seçili ✓" : "Seç"}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">
                  Lüks Dekupe / Yüzen Tabak
                </h4>
                <p className="text-[11px] leading-relaxed text-white/60">
                  Arka planı silinmiş şeffaf PNG tabaklar için. Görsel kartın üst kenarından taşarak lüks meyhane/fine-dining havası verir.
                </p>
              </div>
              <span className="text-[9px] font-mono text-purple-300/80 block pt-1">
                Örnek: Dutt Meyhane, Meze Evleri
              </span>
            </div>

            {/* 2. Seçenek: Klasik Kapak Fotoğraflı Kart (Cover Grid) */}
            <div
              onClick={() => updateField("cardStyle", "cover")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                formData.cardStyle === "cover"
                  ? "bg-purple-500/15 border-purple-400 shadow-purple-glow"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🖼️</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  formData.cardStyle === "cover" ? "bg-purple-500/30 text-purple-200" : "bg-white/5 text-white/40"
                }`}>
                  {formData.cardStyle === "cover" ? "Seçili ✓" : "Seç"}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">
                  Kapak Fotoğraflı Kart
                </h4>
                <p className="text-[11px] leading-relaxed text-white/60">
                  Normal telefonla veya fotoğraf makinesiyle çekilmiş arka planlı kare/dikdörtgen fotoğraflar kartın üst yarısına tam oturur.
                </p>
              </div>
              <span className="text-[9px] font-mono text-purple-300/80 block pt-1">
                Örnek: Kafe, Burger, Kebapçı, Tatlıcı
              </span>
            </div>

            {/* 3. Seçenek: Bistro Yatay Liste (Compact Row) */}
            <div
              onClick={() => updateField("cardStyle", "list")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                formData.cardStyle === "list"
                  ? "bg-purple-500/15 border-purple-400 shadow-purple-glow"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">📋</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  formData.cardStyle === "list" ? "bg-purple-500/30 text-purple-200" : "bg-white/5 text-white/40"
                }`}>
                  {formData.cardStyle === "list" ? "Seçili ✓" : "Seç"}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">
                  Bistro Yatay Liste
                </h4>
                <p className="text-[11px] leading-relaxed text-white/60">
                  Solunda küçük kare fotoğraf, yanında açıklama olan kompakt satırlar. Sayfayı uzatmaz, hızlı taranır ve sipariş kolaylığı sağlar.
                </p>
              </div>
              <span className="text-[9px] font-mono text-purple-300/80 block pt-1">
                Örnek: Bar & Kokteyl, Şarap Menüsü
              </span>
            </div>
          </div>
        </div>

        {/* Name & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            {field("Mekan / Restoran Adı *",
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
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
                onChange={(e) => updateField("currencySymbol", e.target.value)}
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
                    onClick={() => {
                      isDirtyRef.current = true;
                      setFormData(f => ({ ...f, logoDarkUrl: "" }));
                    }}
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
                onChange={e => updateField("logoDarkUrl", e.target.value)}
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
                    onClick={() => {
                      isDirtyRef.current = true;
                      setFormData(f => ({ ...f, logoLightUrl: "" }));
                    }}
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
                onChange={e => updateField("logoLightUrl", e.target.value)}
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
              onChange={(e) => updateField("sloganTr", e.target.value)}
              className="admin-input"
            />
          )}

          {field("Slogan (English)",
            <input
              type="text"
              value={formData.sloganEn}
              onChange={(e) => updateField("sloganEn", e.target.value)}
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
              onChange={(e) => updateField("noticeTr", e.target.value)}
              className="admin-input"
              style={{ resize: "none" }}
            />
          )}

          {field("Service Notice (English)",
            <textarea
              rows={3}
              value={formData.noticeEn}
              onChange={(e) => updateField("noticeEn", e.target.value)}
              className="admin-input"
              style={{ resize: "none" }}
            />
          )}
        </div>

        <div className="pt-4 flex items-center justify-between border-t" style={{ borderColor: "var(--dut-divider)" }}>
          <button
            type="button"
            onClick={() => {
              if (confirm("Mobil cihazınızdaki veya tarayıcınızdaki eski önbellek temizlenip güncel canlı veriler yüklenecektir. Onaylıyor musunuz?")) {
                resetAllData();
              }
            }}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all hover:scale-95"
            style={{ background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }}
          >
            Önbelleği Sıfırla & Mobil Veriyi Yenile
          </button>

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

      {/* ── Database Backup & Restore Center ── */}
      <div
        className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: "rgba(166,108,255,0.15)",
                color: "var(--dut-purple-lt)",
              }}
            >
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold" style={{ color: "var(--dut-text)" }}>
                  Veritabanı Güvenliği & Otomatik Yedekleme Arşivi
                </h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    background: "rgba(99,211,145,0.15)",
                    color: "var(--dut-success)",
                  }}
                >
                  Otomatik Koruma Aktif
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--dut-text3)" }}>
                Sistem her gün yapılan ilk menü işleminde otomatik olarak tarihli güvenli snapshot alır (son 30 gün saklanır).
                Dilediğiniz an tek tıkla anlık yedek alabilir veya geçmiş bir yedeğe geri dönebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={fetchBackups}
              disabled={loadingBackups}
              className="p-2.5 rounded-xl border transition-all active:scale-95 shadow-sm"
              style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text2)" }}
              title="Yedek Listesini Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loadingBackups ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleCreateManualBackup}
              disabled={backupActionLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-md disabled:opacity-50"
              style={{ background: "var(--dut-purple)", boxShadow: "0 4px 14px rgba(166,108,255,0.25)" }}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{backupActionLoading ? "İşleniyor..." : "Şimdi Manuel Yedek Al"}</span>
            </button>
          </div>
        </div>

        {/* Status Message Banner */}
        {backupMsg && (
          <div
            className="p-3.5 rounded-xl text-xs flex items-center gap-2 border animate-fadeIn"
            style={{
              background: backupMsg.type === "success" ? "rgba(99,211,145,0.1)" : "rgba(255,107,107,0.1)",
              borderColor: backupMsg.type === "success" ? "rgba(99,211,145,0.3)" : "rgba(255,107,107,0.3)",
              color: backupMsg.type === "success" ? "var(--dut-success)" : "var(--dut-danger)",
            }}
          >
            {backupMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span className="font-semibold">{backupMsg.text}</span>
          </div>
        )}

        {/* Backups List Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--dut-divider)" }}>
          <div
            className="px-4 py-3 border-b flex items-center justify-between text-[11px] font-bold uppercase tracking-wider"
            style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}
          >
            <span>Kayıtlı Yedek Dosyaları ({backups.length})</span>
            <span className="text-[10px] font-mono">storage/backups</span>
          </div>

          {loadingBackups ? (
            <div className="p-8 text-center text-xs" style={{ color: "var(--dut-text3)" }}>
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
              Yedek kayıtları taranıyor...
            </div>
          ) : backups.length === 0 ? (
            <div className="p-8 text-center text-xs space-y-1" style={{ color: "var(--dut-text3)" }}>
              <HardDrive className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p className="font-semibold">Henüz arşivlenmiş yedek bulunmuyor.</p>
              <p className="text-[11px] opacity-75">Yukarıdaki &quot;Şimdi Manuel Yedek Al&quot; butonuna basarak ilk anlık yedeğinizi oluşturabilirsiniz.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--dut-divider)" }}>
              {backups.map((b) => {
                const dateObj = new Date(b.date);
                const formattedDate = dateObj.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={b.filename}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                          style={{
                            background: b.type === "daily" ? "rgba(166,108,255,0.15)" : "rgba(240,180,90,0.15)",
                            color: b.type === "daily" ? "var(--dut-purple-lt)" : "#F0B45A",
                            border: `1px solid ${b.type === "daily" ? "rgba(166,108,255,0.3)" : "rgba(240,180,90,0.3)"}`,
                          }}
                        >
                          {b.type === "daily" ? "📅 Günlük Otomatik" : "⚡ Manuel Anlık"}
                        </span>
                        <span className="font-mono text-xs font-semibold" style={{ color: "var(--dut-text)" }}>
                          {b.filename}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--dut-text3)" }}>
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span className="font-mono">{b.sizeFormatted}</span>
                        {b.productCount !== undefined && (
                          <>
                            <span>•</span>
                            <span>{b.productCount} Ürün</span>
                          </>
                        )}
                        {b.categoryCount !== undefined && (
                          <>
                            <span>•</span>
                            <span>{b.categoryCount} Kategori</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleRestoreBackup(b.filename)}
                        disabled={backupActionLoading}
                        className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-95 active:scale-90"
                        style={{
                          background: "rgba(255,107,107,0.1)",
                          borderColor: "rgba(255,107,107,0.3)",
                          color: "var(--dut-danger)",
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Bu Yedeğe Geri Dön</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Developer Credit Info Card */}
      <div
        className="p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md"
        style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}
      >
        <div className="space-y-0.5">
          <span className="font-bold text-xs" style={{ color: "var(--dut-text)" }}>Sistem & Yazılım Altyapısı</span>
          <p className="text-[11px]">
            Kurumsal QR Menü & Restoran Yönetim Sistemi: <strong className="text-[var(--dut-purple-lt)] font-bold">Powered by MOKA WORKS</strong>
          </p>
        </div>
        <span
          className="font-mono text-[10px] px-3 py-1 rounded-full border self-start sm:self-auto font-semibold"
          style={{ background: "rgba(166,108,255,0.1)", borderColor: "rgba(166,108,255,0.25)", color: "var(--dut-purple-lt)" }}
        >
          Moka Gastronomy v2.5 Enterprise
        </span>
      </div>
    </div>
  );
}
