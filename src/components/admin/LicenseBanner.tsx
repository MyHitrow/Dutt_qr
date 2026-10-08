"use client";

import React, { useMemo } from "react";
import { ShieldCheck, Clock, ExternalLink, MessageCircle, AlertTriangle } from "lucide-react";
import { LicenseInfo } from "@/types/menu";

interface LicenseBannerProps {
  license?: LicenseInfo;
  venueName: string;
}

export const LicenseBanner: React.FC<LicenseBannerProps> = ({ license, venueName }) => {
  const licenseData: LicenseInfo = useMemo(() => {
    const base = license || {
      status: "active",
      planName: "Yıllık Kurumsal Lisans",
      expiresAt: "2027-10-15T00:00:00.000Z",
      licenseKey: "MOKA-DUTT-2026-X889",
      agencyName: "Moka Works",
      agencyWhatsapp: "905535891629",
      agencyPhone: "+90 553 589 16 29",
    };
    return {
      ...base,
      agencyWhatsapp: "905535891629",
      agencyPhone: "+90 553 589 16 29",
    };
  }, [license]);

  const { daysRemaining, isExpired, isNearExpiry, formattedExpiryDate, progressPercent } = useMemo(() => {
    const expiryDate = new Date(licenseData.expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const expired = diffMs <= 0 || licenseData.status === "expired";
    const near = days <= 30 && !expired;

    // Estimate 365-day scale for visual progress bar
    const totalDays = 365;
    const progress = Math.min(100, Math.max(0, Math.round((days / totalDays) * 100)));

    const formatted = expiryDate.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      daysRemaining: days,
      isExpired: expired,
      isNearExpiry: near,
      formattedExpiryDate: formatted,
      progressPercent: progress,
    };
  }, [licenseData]);

  const whatsappUrl = `https://wa.me/${licenseData.agencyWhatsapp || "905535891629"}?text=${encodeURIComponent(
    `Merhaba, ${venueName} QR Menü lisansımız hakkında destek almak / lisans süremizi yenilemek istiyoruz.`
  )}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all ${
        isExpired
          ? "bg-red-500/10 border-red-500/30"
          : isNearExpiry
          ? "bg-amber-500/10 border-amber-500/30"
          : "dut-glass-card border-[rgba(166,108,255,0.25)]"
      }`}
    >
      {/* Background soft ambient glow */}
      <div
        className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20"
        style={{
          background: isExpired
            ? "radial-gradient(circle, #ff4b4b 0%, transparent 70%)"
            : "radial-gradient(circle, var(--dut-purple) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: License Status & Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                isExpired
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : isNearExpiry
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
              }`}
            >
              {isExpired ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> SÜRESİ DOLDU
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AKTİF LİSANS DOĞRULANDI
                </>
              )}
            </span>

            <span className="text-xs font-mono opacity-60" style={{ color: "var(--dut-text3)" }}>
              {licenseData.planName}
            </span>

            {licenseData.licenseKey && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: "var(--dut-text3)" }}>
                {licenseData.licenseKey}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--dut-text)" }}>
              {isExpired ? "Lisans Yenilenmeli" : `${daysRemaining} Gün Kaldı`}
            </span>
            <span className="text-xs" style={{ color: "var(--dut-text3)" }}>
              • Bitiş: <strong style={{ color: "var(--dut-text2)" }}>{formattedExpiryDate}</strong>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md pt-1">
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isExpired
                    ? "bg-red-500"
                    : isNearExpiry
                    ? "bg-amber-400"
                    : "bg-gradient-to-r from-[#A66CFF] to-[#6EE7B7]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Agency Support & Renew Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-shrink-0">
          <div className="text-left md:text-right hidden sm:block">
            <p className="text-[11px] font-medium" style={{ color: "var(--dut-text3)" }}>
              Altyapı & Teknik Servis
            </p>
            <p className="text-xs font-bold text-white tracking-wide">
              {licenseData.agencyName || "Moka Works"}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover:opacity-95"
            style={{
              background: isExpired
                ? "var(--dut-danger)"
                : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              boxShadow: isExpired
                ? "0 4px 14px rgba(255,107,107,0.3)"
                : "0 4px 14px rgba(37,211,102,0.3)",
            }}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{isExpired ? "Lisansı Yenile" : "Lisans & Destek"}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
