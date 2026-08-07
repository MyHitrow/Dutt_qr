"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  FolderTree,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  QrCode,
  Calendar,
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { QRCodeModal } from "@/components/admin/QRCodeModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { venue } = useMenu();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-surface-card border border-menuBorder p-6 rounded-2xl shadow-xl text-center space-y-4 purple-corner-tr">
          <ShieldCheck className="w-12 h-12 text-brand-purple mx-auto" />
          <h2 className="font-serif text-2xl font-semibold text-content-primary">
            Yönetim Paneli Girişi
          </h2>
          <p className="text-xs text-content-secondary font-light">
            Güvenli alana erişim için yönetici şifrenizi giriniz.
          </p>
          <input
            type="password"
            placeholder="Yönetici Parolası"
            className="w-full px-4 py-2.5 bg-background-secondary border border-menuBorder rounded-xl text-sm focus:outline-none focus:border-brand-purple"
          />
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-2.5 bg-brand-purple text-white font-medium rounded-xl hover:bg-brand-purple-dark transition-colors shadow-purple-glow"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Genel Bakış",
      href: "/management-portal-secure",
      icon: LayoutDashboard,
    },
    {
      name: "Günlük Fix Menü",
      href: "/management-portal-secure/fix-menus",
      icon: Calendar,
    },
    {
      name: "Ürünler",
      href: "/management-portal-secure/products",
      icon: UtensilsCrossed,
    },
    {
      name: "Kategoriler",
      href: "/management-portal-secure/categories",
      icon: FolderTree,
    },
    {
      name: "Mekan Ayarları",
      href: "/management-portal-secure/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-content-primary flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-surface-card border-b border-menuBorder sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base text-content-primary leading-none">
                {venue.name} Admin Portal
              </h1>
              <span className="text-[10px] text-brand-purple font-mono tracking-wider uppercase">
                Güvenli Rota: /management-portal-secure
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-purple/10 border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/20 rounded-lg transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Masa QR Al</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background-secondary border border-menuBorder hover:border-brand-purple/40 rounded-lg text-content-secondary hover:text-content-primary transition-all"
            >
              <span>Menüyü Gör</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-purple" />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-lg bg-background-secondary border border-menuBorder text-content-muted hover:text-rose-400 transition-colors"
              title="Güvenli Çıkış"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Nav Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-brand-purple text-brand-purple font-semibold bg-brand-purple/5"
                    : "border-transparent text-content-secondary hover:text-content-primary hover:border-menuBorder"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      {/* Table QR Code Generator Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        venueName={venue.name}
      />
    </div>
  );
}
