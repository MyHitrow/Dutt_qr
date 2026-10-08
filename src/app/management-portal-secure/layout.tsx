"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed, FolderTree, Settings, ShieldCheck,
  LayoutDashboard, ExternalLink, LogOut, QrCode, Calendar, Menu, X,
  User, Lock, Eye, EyeOff, AlertCircle, BarChart3, MessageCircle
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { QRCodeModal } from "@/components/admin/QRCodeModal";

const AUTH_KEY = "dut_admin_session_auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { venue, updateVenue, theme, toggleTheme } = useMenu();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusMessageTr, setStatusMessageTr] = useState("");
  const [statusMessageEn, setStatusMessageEn] = useState("");
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

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem(AUTH_KEY, "true");
          localStorage.setItem(AUTH_KEY, "true");
        } catch {}
      } else {
        setErrorMsg(data.message || "Kullanıcı adı veya şifre hatalı! Lütfen tekrar deneyin.");
      }
    } catch {
      // Fallback check if server endpoint unreachable
      const validUsernames = ["admin", "dutt", "duttmeyhane"];
      const validPasswords = ["dutt123", "123456", "admin123", "admin"];
      if (
        validUsernames.includes(username.trim().toLowerCase()) &&
        validPasswords.includes(password.trim())
      ) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem(AUTH_KEY, "true");
          localStorage.setItem(AUTH_KEY, "true");
        } catch {}
      } else {
        setErrorMsg("Kullanıcı adı veya şifre hatalı! Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    fetch("/api/admin/auth", { method: "DELETE" }).catch(() => {});
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
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: "var(--dut-text3)" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="admin-input has-icon-left"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                Şifre
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: "var(--dut-text3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="admin-input has-icon-left has-icon-right"
                  style={{ paddingLeft: "42px", paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1 z-10"
                  style={{ color: "var(--dut-text3)" }}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
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
            <div className="pt-2 text-center space-y-1">
              <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                Varsayılan Kullanıcı Adı: <span className="font-mono text-[#A66CFF]">admin</span> | Şifre: <span className="font-mono text-[#A66CFF]">dutt123</span>
              </p>
              <p className="text-[10px] font-mono pt-1 text-white/40">
                Powered by <strong className="font-semibold text-white/70">MOKA WORKS</strong> · Enterprise Hospitality Cloud
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Genel Bakış",    href: "/management-portal-secure",             icon: LayoutDashboard },
    { name: "Trafik & Analiz",href: "/management-portal-secure/analytics",     icon: BarChart3       },
    { name: "Fix Menü",       href: "/management-portal-secure/fix-menus",   icon: Calendar        },
    { name: "Ürünler",        href: "/management-portal-secure/products",    icon: UtensilsCrossed },
    { name: "Kategoriler",    href: "/management-portal-secure/categories",  icon: FolderTree      },
    { name: "Ayarlar",        href: "/management-portal-secure/settings",    icon: Settings        },
  ];

  const openStatusModal = () => {
    setStatusMessageTr(venue.closedMessage?.tr || "Değerli misafirlerimiz, restoranımız şu anda hizmet vermemektedir. Servis hazırlıklarımızın ardından en kısa sürede tekrar sizlerle buluşacağız.");
    setStatusMessageEn(venue.closedMessage?.en || "Dear guests, our restaurant is currently closed. We will be back in service shortly after our preparations.");
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    const nextIsOpen = !venue.isOpen;
    updateVenue({
      isOpen: nextIsOpen,
      closedMessage: {
        tr: statusMessageTr,
        en: statusMessageEn,
      },
    });
    setIsStatusModalOpen(false);
  };

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
            {/* Restaurant Open / Closed Emergency Toggle */}
            <button
              onClick={openStatusModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
              style={{
                background: venue.isOpen ? "rgba(99,211,145,0.14)" : "rgba(255,107,107,0.18)",
                border: venue.isOpen ? "1px solid rgba(99,211,145,0.35)" : "1px solid rgba(255,107,107,0.45)",
                color: venue.isOpen ? "var(--dut-success)" : "var(--dut-danger)",
              }}
              title={venue.isOpen ? "Restoranı Kapat ve QR Erişimini Kilitle" : "Restoranı Aç ve Menüyü Yayına Al"}
            >
              <span className={`w-2 h-2 rounded-full ${venue.isOpen ? "bg-emerald-400" : "bg-rose-500 animate-pulse"}`} />
              <span>{venue.isOpen ? "Restoran Açık" : "Restoran Kapalı"}</span>
              <span className="hidden md:inline text-[10px] opacity-75 font-normal ml-0.5">
                {venue.isOpen ? "(Kapat)" : "(Aç)"}
              </span>
            </button>

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

            {/* Moka Destek WhatsApp */}
            <a
              href={`https://wa.me/${venue.license?.agencyWhatsapp || "905300000000"}?text=${encodeURIComponent(
                `Merhaba, ${venue.name} QR Menü destek talebimiz bulunmaktadır.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white transition-all shadow-sm active:scale-95 hover:opacity-95"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                boxShadow: "0 2px 10px rgba(37,211,102,0.25)",
              }}
              title="Ajans Destek Hattı"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Destek</span>
            </a>

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

      {/* Admin Footer */}
      <footer className="border-t py-4 px-6 text-xs mt-auto" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[11px]">
            © {new Date().getFullYear()} {venue.name} Yönetim Portalı
          </span>
          <span className="text-[11px] font-mono flex items-center gap-1.5 text-white/50">
            <span>Platform:</span>
            <a href="https://mokaworks.tr" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors font-bold text-white/80">
              MOKA WORKS
            </a>
            <span className="text-white/30">•</span>
            <span className="text-purple-300 font-semibold">Gastronomy v2.5 Enterprise</span>
          </span>
        </div>
      </footer>

      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        venueName={venue.name}
      />

      {/* Emergency Restaurant Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-5 border shadow-2xl transition-all"
            style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--dut-divider)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: venue.isOpen ? "rgba(255,107,107,0.14)" : "rgba(99,211,145,0.14)",
                    color: venue.isOpen ? "var(--dut-danger)" : "var(--dut-success)",
                  }}
                >
                  {venue.isOpen ? <Lock className="w-5 h-5 text-rose-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "var(--dut-text)" }}>
                    {venue.isOpen ? "Restoranı Kapat & QR Menüyü Kilitle" : "Restoranı Aç & Menüyü Yayına Al"}
                  </h3>
                  <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
                    {venue.isOpen ? "Müşteriler kapalı ekranı ile karşılaşacaktır." : "Tüm masalar menüye erişebilecektir."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {venue.isOpen ? (
              <div className="space-y-3">
                <div
                  className="p-3.5 rounded-xl text-xs leading-relaxed border"
                  style={{ background: "rgba(255,107,107,0.08)", borderColor: "rgba(255,107,107,0.25)", color: "var(--dut-text)" }}
                >
                  <p className="font-semibold text-rose-400 mb-1">⚠️ Acil Durum / Kapanış Uyarısı:</p>
                  <p className="text-xs" style={{ color: "var(--dut-text2)" }}>
                    Restoranı kapattığınızda müşteriler masadaki QR kodu okutsalar dahi menüye veya ürünlere erişemez. Müşteriye aşağıdaki bildirim mesajı gösterilir.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: "var(--dut-text2)" }}>
                    Kapanış Mesajı (Müşteriye Gösterilecek):
                  </label>
                  <textarea
                    rows={3}
                    value={statusMessageTr}
                    onChange={(e) => setStatusMessageTr(e.target.value)}
                    className="admin-input text-xs"
                    placeholder="Örn: Özel bir davet sebebiyle bu akşam kapalıyız..."
                  />
                </div>
              </div>
            ) : (
              <div
                className="p-3.5 rounded-xl text-xs leading-relaxed border space-y-2"
                style={{ background: "rgba(99,211,145,0.08)", borderColor: "rgba(99,211,145,0.25)", color: "var(--dut-text)" }}
              >
                <p className="font-semibold text-emerald-400">✓ Canlı Servise Geçiş:</p>
                <p className="text-xs" style={{ color: "var(--dut-text2)" }}>
                  Restoranı açtığınızda tüm dijital QR menü, kategoriler ve fiyatlar anında müşterilerin erişimine açılacaktır.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--dut-divider)" }}>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{
                  background: venue.isOpen ? "var(--dut-danger)" : "var(--dut-success)",
                  boxShadow: venue.isOpen
                    ? "0 4px 16px rgba(255,107,107,0.35)"
                    : "0 4px 16px rgba(99,211,145,0.35)",
                }}
              >
                {venue.isOpen ? "Evet, Restoranı Kapat" : "Evet, Restoranı Aç"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
