"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed, FolderTree, Settings, ShieldCheck,
  LayoutDashboard, ExternalLink, LogOut, QrCode, Calendar, Menu, X,
  User, Lock, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { QRCodeModal } from "@/components/admin/QRCodeModal";

const AUTH_KEY = "dut_admin_session_auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { venue, theme, toggleTheme } = useMenu();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (stored === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Accepted default credentials: admin / dutt123 or admin / 123456 or dutt / dutt123
    const validUsernames = ["admin", "dutt", "duttmeyhane"];
    const validPasswords = ["dutt123", "123456", "admin123", "admin"];

    const isUserValid = validUsernames.includes(username.trim().toLowerCase());
    const isPassValid = validPasswords.includes(password.trim());

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(AUTH_KEY, "true");
      } catch {}
    } else {
      setErrorMsg("Kullanıcı adı veya şifre hatalı! Lütfen tekrar deneyin.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    try {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  };

  // Loading state check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--dut-bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dut-purple)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors" style={{ background: "var(--dut-bg)" }}>
        <div className="w-full max-w-md space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A66CFF] to-[#C7A8FF] flex items-center justify-center mx-auto shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--dut-text)" }}>
              {venue.name} Admin Portal
            </h1>
            <p className="text-xs" style={{ color: "var(--dut-text3)" }}>
              Yönetici paneline erişmek için kullanıcı adı ve şifrenizi girin.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleLogin}
            className="p-7 rounded-3xl space-y-4 border shadow-2xl transition-all"
            style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}
          >
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--dut-text3)" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="admin-input pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--dut-text3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="admin-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--dut-text3)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98] shadow-lg mt-2 flex items-center justify-center gap-2"
              style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.35)" }}
            >
              <span>Güvenli Giriş Yap</span>
            </button>

            {/* Default info note */}
            <div className="pt-2 text-center">
              <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                Varsayılan Kullanıcı Adı: <span className="font-mono text-[#A66CFF]">admin</span> | Şifre: <span className="font-mono text-[#A66CFF]">dutt123</span>
              </p>
            </div>
          </form>
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
              onClick={handleLogout}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
              title="Çıkış Yap"
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
