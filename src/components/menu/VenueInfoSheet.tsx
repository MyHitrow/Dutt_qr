"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VenueSettings, Language } from "@/types/menu";
import { formatWhatsAppNumber, formatTelUri } from "@/lib/phone";
import {
  MoreHorizontal,
  Wifi,
  Copy,
  Check,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  X,
  QrCode,
  Clock,
  Sparkles,
} from "lucide-react";

interface VenueInfoSheetProps {
  venue: VenueSettings;
  lang: Language;
}

export const VenueInfoSheet: React.FC<VenueInfoSheetProps> = ({ venue, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [showWifiQr, setShowWifiQr] = useState(false);

  const wifiSsid = venue.wifiName || "Dutt Meyhane";
  const wifiPass = venue.wifiPassword || "duttmeyhane2026";
  const address = venue.address || "Çamlıbel Mh., İsmet İnönü Blv. No:14, Akdeniz / Mersin";
  const phone = venue.contactPhone || "+90 532 123 45 67";
  const mapsUrl =
    venue.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue.name || "Dutt Meyhane"} ${address}`
    )}`;

  const cleanPhone = formatTelUri(phone);
  const whatsappNum = formatWhatsAppNumber(venue.contactPhone, venue.whatsappNumber);

  // Standart Wi-Fi Otomatik Bağlantı QR Kodu (WPA/WPA2 protokolü)
  const wifiQrData = `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
  const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    wifiQrData
  )}&color=FFFFFF&bgcolor=14121A&margin=2`;

  const handleCopyWifi = () => {
    try {
      navigator.clipboard.writeText(wifiPass);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2200);
    } catch {
      // Fallback
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2200);
    }
  };

  const isTr = lang === "tr";

  return (
    <>
      {/* ── Sağ Alt Yüzen 3 Nokta Butonu (Floating 3-Dot Trigger) ── */}
      <div className="fixed bottom-6 right-5 z-40 select-none">
        <button
          id="btn-venue-info"
          onClick={() => setIsOpen(true)}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center p-3.5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
          style={{
            background: "linear-gradient(135deg, rgba(34,31,43,0.95) 0%, rgba(20,18,26,0.98) 100%)",
            border: "1px solid rgba(166,108,255,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 18px rgba(166,108,255,0.25)",
            backdropFilter: "blur(16px)",
          }}
          aria-label={isTr ? "Mekan ve Wi-Fi Bilgileri" : "Venue and Wi-Fi Info"}
          title={isTr ? "Wi-Fi & İletişim Bilgileri" : "Wi-Fi & Contact"}
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full opacity-40 group-hover:opacity-75 transition-opacity blur-sm bg-purple-500/30 animate-pulse pointer-events-none" />

          {/* 3 Nokta İkonu */}
          <MoreHorizontal className="w-6 h-6 text-purple-200 group-hover:text-white transition-colors relative z-10" />

          {/* Mini Wi-Fi Badge on Corner */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A66CFF] text-white flex items-center justify-center shadow-md">
            <Wifi className="w-2.5 h-2.5" />
          </span>
        </button>
      </div>

      {/* ── Bottom Sheet & Backdrop Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet Container */}
          <div
            className="relative w-full sm:max-w-md max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5 z-10 animate-slide-up"
            style={{
              background: "linear-gradient(180deg, rgba(26,23,36,0.98) 0%, rgba(18,16,24,0.99) 100%)",
              borderColor: "rgba(166,108,255,0.25)",
              color: "var(--dut-text)",
            }}
          >
            {/* Mobile Pull Indicator */}
            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto -mt-2 mb-2 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border font-bold text-sm shadow-inner"
                  style={{
                    background: "linear-gradient(135deg, rgba(166,108,255,0.2) 0%, rgba(200,162,86,0.15) 100%)",
                    borderColor: "rgba(166,108,255,0.3)",
                    color: "var(--dut-purple-lt)",
                  }}
                >
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-white">
                    {venue.name || "Dutt Mersin"}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    {venue.slogan?.[lang] || "Modern Meyhane & Lezzet Deneyimi"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── 1. Wi-Fi Bilgileri & Otomatik Bağlanma ── */}
            <div
              className="p-4 rounded-2xl border space-y-3 relative overflow-hidden"
              style={{
                background: "rgba(166,108,255,0.06)",
                borderColor: "rgba(166,108,255,0.25)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-300">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-200">
                      {isTr ? "Misafir Wi-Fi Ağı" : "Guest Wi-Fi"}
                    </h4>
                    <p className="text-[10px] text-white/50">{isTr ? "Ücretsiz yüksek hızlı internet" : "Free high-speed internet"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWifiQr(!showWifiQr)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all bg-white/10 hover:bg-white/15 text-purple-200 active:scale-95"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showWifiQr ? (isTr ? "Gizle" : "Hide") : (isTr ? "QR Kod" : "QR Code")}</span>
                </button>
              </div>

              {/* Wi-Fi SSID & Password Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/40 block font-medium">
                    {isTr ? "Ağ Adı (SSID)" : "Network"}
                  </span>
                  <span className="text-xs font-bold font-mono text-white/90 truncate block mt-0.5">
                    {wifiSsid}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 block font-medium">
                      {isTr ? "Şifre" : "Password"}
                    </span>
                    <button
                      onClick={handleCopyWifi}
                      className="text-[10px] text-purple-300 hover:text-purple-200 flex items-center gap-1 font-semibold"
                    >
                      {copiedWifi ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isTr ? "Kopyalandı" : "Copied"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isTr ? "Kopyala" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="text-xs font-bold font-mono text-purple-300 truncate block mt-0.5 select-all">
                    {wifiPass}
                  </span>
                </div>
              </div>

              {/* QR Code Auto Connect Toggle Drawer */}
              {showWifiQr && (
                <div className="pt-3 border-t border-white/10 flex flex-col items-center text-center space-y-2 animate-fade-in">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wifiQrUrl}
                      alt="Wi-Fi QR Code"
                      width={160}
                      height={160}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="text-[11px] text-white/60 max-w-xs">
                    <p className="font-semibold text-purple-200">
                      {isTr ? "Kameranızı QR koda tutarak otomatik bağlanın" : "Scan with camera to connect automatically"}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {isTr ? "Telefonunuz Wi-Fi ağına şifre girmeden katılacaktır." : "No password typing needed."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. Adres & Harita Navigasyonu ── */}
            <div
              className="p-4 rounded-2xl border space-y-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-blue-500/15 text-blue-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white/90">
                    {isTr ? "Mekan Adresi" : "Address & Location"}
                  </h4>
                  <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-white/90 hover:text-white active:scale-98"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{isTr ? "Haritada Göster & Yol Tarifi Al" : "Open in Maps & Directions"}</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
            </div>

            {/* ── 3. İletişim, Rezervasyon & Saatler ── */}
            <div
              className="p-4 rounded-2xl border space-y-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white/90">
                      {isTr ? "İletişim & Rezervasyon" : "Contact & Reservations"}
                    </h4>
                    <p className="text-[10px] text-white/50">{phone}</p>
                  </div>
                </div>

                {venue.closingTime && (
                  <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Mutfak: {venue.closingTime}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Hemen Ara */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-95 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                  }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isTr ? "Hemen Ara" : "Call Venue"}</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                    isTr
                      ? `Merhaba ${venue.name || "Dutt"}, rezervasyon ve bilgi almak istiyorum.`
                      : `Hello, I would like to make a reservation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-95 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
                  }}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Footer Notice */}
            <p className="text-[10px] text-center text-white/30 pt-1">
              {isTr ? "Dutt Meyhane Dijital QR Menü Deneyimi" : "Dutt Meyhane Digital Experience"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
