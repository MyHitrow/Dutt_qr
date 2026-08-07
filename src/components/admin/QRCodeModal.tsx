"use client";

import React, { useState } from "react";
import { QrCode, Download, Copy, Check, X, Smartphone } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  venueName,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuUrl, setMenuUrl] = useState(
    typeof window !== "undefined"
      ? window.location.origin
      : "https://menu.mekaninadi.com"
  );

  if (!isOpen) return null;

  // Generate Google Chart API QR Code image URL for quick rendering & download
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    menuUrl
  )}&color=19181D&bgcolor=FFFFFF&margin=2`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-surface-card border border-menuBorder rounded-2xl p-6 shadow-2xl space-y-5 text-center purple-corner-tr">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-content-muted hover:text-content-primary bg-background-secondary"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple flex items-center justify-center mx-auto mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-content-primary">
            {venueName} Masa QR Kodu
          </h3>
          <p className="text-xs text-content-secondary font-light">
            Müşterilerinizin masada taratarak menüyü açacağı yüksek çözünürlüklü QR kod.
          </p>
        </div>

        {/* QR Display Card */}
        <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-200 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="Masa QR Kodu"
            className="w-48 h-48 mx-auto"
          />
        </div>

        {/* URL Input & Copy */}
        <div className="flex items-center gap-2 bg-background-secondary p-1.5 rounded-xl border border-menuBorder">
          <input
            type="text"
            value={menuUrl}
            onChange={(e) => setMenuUrl(e.target.value)}
            className="w-full bg-transparent px-2 text-xs font-mono text-content-secondary focus:outline-none"
          />
          <button
            onClick={handleCopyUrl}
            className="px-3 py-1.5 bg-surface-card border border-menuBorder hover:border-brand-purple text-xs font-medium rounded-lg flex items-center gap-1 text-content-primary transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Kopyalandı
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-purple" /> Kopyala
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <a
            href={qrImageUrl}
            download={`${venueName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-purple-glow transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>QR Kodu İndir (PNG)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
