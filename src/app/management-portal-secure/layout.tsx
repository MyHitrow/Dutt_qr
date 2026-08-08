"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed, FolderTree, Settings, ShieldCheck,
  LayoutDashboard, ExternalLink, LogOut, QrCode, Calendar, Menu, X,
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { QRCodeModal } from "@/components/admin/QRCodeModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { venue, theme, toggleTheme } = useMenu();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors" style={{ background: "var(--dut-bg)" }}>
        <div
          className="max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center space-y-5"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A66CFF] to-[#C7A8FF] flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--dut-text)" }}>Yönetim Paneli</h2>
            <p className="text-xs" style={{ color: "var(--dut-text3)" }}>Güvenli alana erişmek için parolanızı girin.</p>
          </div>
          <input
            type="password"
            placeholder="Yönetici Parolası"
            className="admin-input"
          />
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{ background: "var(--dut-purple)" }}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Genel Bakış",    href: "/management-portal-secure",             icon: LayoutDashboard },
    { name: "Fix Menü",       href: "/management-portal-secure/fix-menus",   icon: Calendar        },
    { name: "Ürünler",        href: "/management-portal-secure/products",    icon: UtensilsCrossed },
    { name: "Kategoriler",    href: "/management-portal-secure/categories",  icon: FolderTree      },
    { name: "Ayarlar",        href: "/management-portal-secure/settings",    icon: Settings        },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ background: "var(--dut-bg)", color: "var(--dut-text)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: "var(--dut-bg2)", borderColor: "var(--dut-divider)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--dut-purple)" }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm leading-none truncate" style={{ color: "var(--dut-text)" }}>
              {venue.name}
            </h1>
            <span className="text-[10px] font-mono" style={{ color: "var(--dut-purple)" }}>
              Admin Portal
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all text-sm"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
              title="Tema Değiştir"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              style={{ background: "rgba(166,108,255,0.1)", border: "1px solid rgba(166,108,255,0.25)", color: "var(--dut-purple)" }}
            >
              <QrCode className="w-3.5 h-3.5" />
              QR Kod
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
            >
              Menüyü Gör
              <ExternalLink className="w-3 h-3" style={{ color: "var(--dut-purple)" }} />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
              title="Çıkış"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sub Nav */}
        <div
          className={`max-w-7xl mx-auto px-4 border-t overflow-x-auto no-scrollbar ${mobileNavOpen ? "block" : "hidden sm:flex"}`}
          style={{ borderColor: "var(--dut-divider)" }}
        >
          <div className="flex items-stretch gap-0.5 py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? "rgba(166,108,255,0.1)" : "transparent",
                    color: isActive ? "var(--dut-purple)" : "var(--dut-text3)",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        venueName={venue.name}
      />
    </div>
  );
}
