"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VenueSettings, Language } from "@/types/menu";
import { Lock, Phone, RefreshCw, Sun, Moon, Globe, ShieldCheck, Clock } from "lucide-react";

interface RestaurantClosedScreenProps {
  venue: VenueSettings;
  lang: Language;
  theme: "dark" | "light";
  toggleTheme: () => void;
  setLang: (l: Language) => void;
}

export const RestaurantClosedScreen: React.FC<RestaurantClosedScreenProps> = ({
  venue,
  lang,
  theme,
  toggleTheme,
  setLang,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const activeLogo = theme === "light"
    ? (venue.logoLightUrl || venue.logoDarkUrl || venue.logoUrl)
    : (venue.logoDarkUrl || venue.logoUrl);

  const handleCheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const defaultClosedMessage = {
    tr: "Değerli misafirlerimiz, şu anda servisimize kısa bir ara vermiş bulunmaktayız. En kısa sürede lezzet dolu soframızda yeniden buluşmak dileğiyle.",
    en: "Dear guests, our service is temporarily paused. We look forward to welcoming you back to our table very soon.",
  };

  const closedNotice = venue.closedMessage?.[lang] || defaultClosedMessage[lang];

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between p-4 sm:p-6 transition-colors overflow-hidden select-none"
      style={{ background: "var(--dut-bg)", color: "var(--dut-text)" }}
    >
      {/* ── Loş Meyhane Atmosfer Işıkları (Silky Ambient Auras) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[130px] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -left-36 w-80 h-80 rounded-full blur-[130px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(240,180,90,0.22) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(166,108,255,0.25) 0%, transparent 70%)" }}
        />
      </div>

      {/* ── Top Bar (Theme & Language Controls) ── */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {activeLogo ? (
            <div
              className="w-9 h-9 rounded-xl overflow-hidden relative border p-1 shadow-sm"
              style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}
            >
              <Image
                src={activeLogo}
                alt={venue.name}
                fill
                sizes="36px"
                className="object-contain p-1"
                unoptimized={activeLogo.startsWith("data:") || activeLogo.startsWith("blob:")}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--dut-purple)] to-[var(--dut-purple-lt)] flex items-center justify-center shadow-md">
              <span className="font-bold text-xs text-white">DUT</span>
            </div>
          )}
          <span className="font-bold text-xs tracking-tight truncate max-w-[160px]" style={{ color: "var(--dut-text)" }}>
            {venue.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-sm"
            style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)", color: "var(--dut-text2)" }}
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5" style={{ color: "var(--dut-purple-lt)" }} />
            <span className="uppercase font-mono text-[11px]">{lang}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all active:scale-95 shadow-sm"
            style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)", color: "var(--dut-text2)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* ── Center Content Card ── */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto py-8">
        <div
          className="rounded-3xl p-7 sm:p-9 text-center space-y-6 shadow-2xl relative overflow-hidden transition-all animate-fade-in"
          style={{
            background: "var(--dut-card)",
            border: "1px solid var(--dut-divider)",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.35)",
          }}
        >
          {/* Top 1px hairline glow */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,107,107,0.5), transparent)",
            }}
          />

          {/* Animated Closed Icon / Emblem */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* Outer soft pulsing ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
              style={{ background: "var(--dut-danger)" }}
            />
            {/* Main badge */}
            <div
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,107,0.18), rgba(240,180,90,0.12))",
                borderColor: "rgba(255,107,107,0.35)",
              }}
            >
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{
              background: "rgba(255,107,107,0.14)",
              color: "var(--dut-danger)",
              border: "1px solid rgba(255,107,107,0.3)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{lang === "tr" ? "Servis Geçici Olarak Kapalı" : "Service Temporarily Closed"}</span>
          </div>

          {/* Venue & Headline */}
          <div className="space-y-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: "var(--dut-text)" }}>
              {venue.name}
            </h1>
            <p className="text-xs font-medium tracking-wide uppercase font-mono" style={{ color: "var(--dut-text3)" }}>
              {venue.slogan[lang] ?? venue.slogan.tr}
            </p>
          </div>

          {/* Elegant Notice Message */}
          <div
            className="p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-inner"
            style={{
              background: "var(--dut-bg)",
              borderColor: "var(--dut-divider)",
              color: "var(--dut-text2)",
            }}
          >
            <p className="font-light italic">
              &ldquo;{closedNotice}&rdquo;
            </p>
          </div>

          {/* Operating hours note if available */}
          {venue.closingTime && (
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--dut-text3)" }}>
              <Clock className="w-3.5 h-3.5 text-[#F0B45A]" />
              <span>
                {lang === "tr"
                  ? `Mutfak Kapanış Saati: ${venue.closingTime}`
                  : `Kitchen Closing Time: ${venue.closingTime}`}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            {/* Check again button */}
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-white"
              style={{
                background: "var(--dut-purple)",
                boxShadow: "0 8px 24px rgba(166,108,255,0.3)",
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              <span>
                {isChecking
                  ? (lang === "tr" ? "Kontrol Ediliyor..." : "Checking...")
                  : (lang === "tr" ? "Durumu Tekrar Kontrol Et" : "Check Status Again")}
              </span>
            </button>

            {/* Contact phone button if configured */}
            {venue.contactPhone && (
              <a
                href={`tel:${venue.contactPhone.replace(/\s+/g, "")}`}
                className="w-full py-3 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border hover:scale-[0.99]"
                style={{
                  background: "var(--dut-card)",
                  borderColor: "var(--dut-divider)",
                  color: "var(--dut-text)",
                }}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === "tr" ? "Mekanı Ara / Rezervasyon" : "Call Venue / Reservation"}</span>
              </a>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer & Admin Access ── */}
      <footer className="relative z-10 w-full max-w-lg mx-auto text-center space-y-2.5 pb-3">
        <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
          {venue.serviceNotice?.[lang] ?? venue.serviceNotice?.tr}
        </p>

        <div className="pt-1 flex items-center justify-center">
          <a
            href="https://mokaworks.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--dut-text3)",
            }}
          >
            <span className="opacity-50 uppercase tracking-widest text-[9px]">Powered by</span>
            <span className="font-bold tracking-wider text-white/90 group-hover:text-purple-300 transition-colors">
              MOKA WORKS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-60" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 pt-0.5">
          <Link
            href="/management-portal-secure"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors opacity-60 hover:opacity-100"
            style={{ color: "var(--dut-text3)" }}
          >
            <ShieldCheck className="w-3 h-3 text-[#A66CFF]" />
            <span>{lang === "tr" ? "Yönetici Girişi" : "Staff Portal"}</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};
