"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import {
  UtensilsCrossed, FolderTree, AlertTriangle, CheckCircle2, XCircle,
  Plus, ArrowRight, Settings, Sparkles, Flame, Globe2, Lock, ShieldCheck,
  BarChart3,
} from "lucide-react";
import { LicenseBanner } from "@/components/admin/LicenseBanner";

export default function AdminDashboard() {
  const { products, categories, venue, updateVenue, toggleProductAvailability } = useMenu();

  const totalProducts = products.length;
  const outOfStockProducts = products.filter((p) => !p.isAvailable);
  const totalCategories = categories.length;
  const imageProductsCount = products.filter((p) => p.hasImage).length;
  const noImageProductsCount = products.filter((p) => !p.hasImage).length;

  const license = venue.license;
  const expiresAt = license?.expiresAt ? new Date(license.expiresAt) : null;
  const now = new Date();
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 365;
  const isLicenseActive = license?.status !== "expired";
  const agencyPhone = license?.agencyWhatsapp || "905535891629";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── 3'lü Sütun Üst Panel: Lisans · Restoran Durumu · Hızlı Eylemler ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Sütun: Aktif Lisans Durumu */}
        <div
          className="p-5 rounded-3xl border flex flex-col justify-between space-y-3.5 transition-all shadow-lg dut-glass-card"
          style={{ borderColor: "rgba(166,108,255,0.25)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-500/15 text-purple-300 border border-purple-500/20">
                <ShieldCheck className="w-5 h-5 text-[#C7A8FF]" />
              </div>
              <div>
                <span className="text-[11px] block font-semibold text-purple-300">
                  {license?.planName || "Kurumsal Lisans"}
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Aktif Lisans
                </h3>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                isLicenseActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              {isLicenseActive ? "AKTİF" : "SÜRESİ DOLDU"}
            </span>
          </div>

          <div className="space-y-1 py-0.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-white">
                {daysLeft} <span className="text-xs font-normal text-white/50">Gün Kaldı</span>
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                {expiresAt ? expiresAt.toLocaleDateString("tr-TR") : "Süresiz"}
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-[#A66CFF] to-emerald-400"
                style={{ width: `${Math.min(100, Math.max(10, Math.round((daysLeft / 365) * 100)))}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: "var(--dut-divider)" }}>
            <span className="text-[10px] text-white/40">Sağlayıcı: {license?.agencyName || "Moka Works"}</span>
            <a
              href={`https://wa.me/${agencyPhone}?text=${encodeURIComponent(`Merhaba Moka ekibi, ${venue.name} işletmemizin lisansı hakkında görüşmek istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
            >
              <span>Destek & Yenile</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. Sütun: Restoran Açma / Kapama (Müşteri QR Menü Kilidi) */}
        <div
          className="p-5 rounded-3xl border flex flex-col justify-between space-y-3.5 transition-all shadow-lg"
          style={{
            background: venue.isOpen
              ? "linear-gradient(135deg, rgba(99,211,145,0.08) 0%, var(--dut-card) 100%)"
              : "linear-gradient(135deg, rgba(255,107,107,0.1) 0%, var(--dut-card) 100%)",
            borderColor: venue.isOpen ? "rgba(99,211,145,0.3)" : "rgba(255,107,107,0.35)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: venue.isOpen ? "rgba(99,211,145,0.18)" : "rgba(255,107,107,0.2)",
                  color: venue.isOpen ? "var(--dut-success)" : "var(--dut-danger)",
                }}
              >
                {venue.isOpen ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <Lock className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div>
                <span className="text-[11px] block font-semibold" style={{ color: venue.isOpen ? "#6ee7b7" : "#fca5a5" }}>
                  {venue.isOpen ? "Canlı Yayında" : "Servis Kilitli"}
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Restoran Durumu
                </h3>
              </div>
            </div>

            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                background: venue.isOpen ? "rgba(99,211,145,0.2)" : "rgba(255,107,107,0.2)",
                color: venue.isOpen ? "var(--dut-success)" : "var(--dut-danger)",
              }}
            >
              {venue.isOpen ? "AÇIK" : "KAPALI"}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: "var(--dut-text3)" }}>
            {venue.isOpen
              ? "Masalardan QR kodu okutan misafirler menüyü tam yetkiyle inceleyebilir."
              : "Müşteri ekranında 'Restoranımız Kapalıdır' uyarısı gösterilmektedir."}
          </p>

          <button
            type="button"
            onClick={() => {
              if (venue.isOpen) {
                if (confirm("Restoranı kapatmak ve müşteri QR menü erişimini kilitlemek istediğinize emin misiniz?")) {
                  updateVenue({ isOpen: false });
                }
              } else {
                updateVenue({ isOpen: true });
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md hover:opacity-95"
            style={{
              background: venue.isOpen ? "var(--dut-danger)" : "var(--dut-success)",
              boxShadow: venue.isOpen ? "0 4px 14px rgba(255,107,107,0.3)" : "0 4px 14px rgba(99,211,145,0.3)",
            }}
          >
            {venue.isOpen ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Restoranı Kapat & Menüyü Kilitle</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Restoranı Aç & Yayına Al</span>
              </>
            )}
          </button>
        </div>

        {/* 3. Sütun: Hızlı Eylemler (Yeni Ürün Ekle & Trafik & Analiz) */}
        <div
          className="p-5 rounded-3xl border flex flex-col justify-between space-y-3.5 transition-all shadow-lg dut-glass-card"
          style={{ borderColor: "rgba(166,108,255,0.2)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-500/15 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <span className="text-[11px] block font-semibold text-purple-300">
                Hızlı Yönetim
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                İşlem Kısayolları
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              href="/management-portal-secure/products"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: "var(--dut-purple)",
                boxShadow: "0 6px 20px rgba(166,108,255,0.35)",
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ürün Ekle</span>
            </Link>

            <Link
              href="/management-portal-secure/analytics"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 border text-white/90 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "var(--dut-divider)",
              }}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
              <span>Trafik & Menü Analitiği</span>
            </Link>
          </div>

          <div className="pt-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)" }}>
            <span>Toplam {totalProducts} Ürün Kayıtlı</span>
            <Link href="/management-portal-secure/settings" className="hover:text-purple-300 transition-colors">
              Mekan Ayarları →
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div
          className="p-5 rounded-2xl space-y-2 transition-all hover:scale-[1.01]"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--dut-text3)" }}>
              Toplam Ürün
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(166,108,255,0.12)" }}>
              <UtensilsCrossed className="w-4 h-4" style={{ color: "var(--dut-purple-lt)" }} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono" style={{ color: "var(--dut-text)" }}>
            {totalProducts}
          </div>
          <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
            {imageProductsCount} Fotoğraflı / {noImageProductsCount} Yazılı
          </p>
        </div>

        {/* Categories */}
        <div
          className="p-5 rounded-2xl space-y-2 transition-all hover:scale-[1.01]"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--dut-text3)" }}>
              Kategoriler
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,211,145,0.12)" }}>
              <FolderTree className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono" style={{ color: "var(--dut-text)" }}>
            {totalCategories}
          </div>
          <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
            Soğuk, Sıcak, Rakı vb.
          </p>
        </div>

        {/* Out of stock */}
        <div
          className="p-5 rounded-2xl space-y-2 transition-all hover:scale-[1.01]"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--dut-text3)" }}>
              Tükendi (Stok Dışı)
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,107,0.12)" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "var(--dut-danger)" }} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono" style={{ color: outOfStockProducts.length > 0 ? "var(--dut-danger)" : "var(--dut-text)" }}>
            {outOfStockProducts.length}
          </div>
          <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
            Servise kapalı ürünler
          </p>
        </div>

        {/* Active Languages */}
        <div
          className="p-5 rounded-2xl space-y-2 transition-all hover:scale-[1.01]"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--dut-text3)" }}>
              Aktif Diller
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(166,108,255,0.12)" }}>
              <Globe2 className="w-4 h-4" style={{ color: "var(--dut-purple-lt)" }} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono" style={{ color: "var(--dut-purple-lt)" }}>
            TR / EN
          </div>
          <p className="text-[11px]" style={{ color: "var(--dut-text3)" }}>
            Çift dil senkronize
          </p>
        </div>
      </div>

      {/* Quick Stok & Tükendi Table */}
      <div
        className="rounded-3xl p-6 space-y-4 shadow-lg"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
              Hızlı Stok & Tükendi Yönetimi
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
              Tükenen ürünlerin durumunu anında güncelleyin.
            </p>
          </div>
          <Link
            href="/management-portal-secure/products"
            className="flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
            style={{ color: "var(--dut-purple-lt)" }}
          >
            Tüm Ürünler
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              className="flex items-center justify-between p-3.5 rounded-2xl transition-all"
              style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)" }}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {prod.hasImage && prod.imageUrl ? (
                  <div
                    className="w-11 h-11 rounded-xl relative flex-shrink-0 flex items-center justify-center p-0.5"
                    style={{ background: "var(--dut-elevated)" }}
                  >
                    <Image src={prod.imageUrl} alt={prod.name.tr} fill sizes="44px" className="object-contain drop-shadow-xs" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--dut-elevated)" }}>
                    <Sparkles className="w-4 h-4" style={{ color: "var(--dut-purple)" }} />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm truncate" style={{ color: "var(--dut-text)" }}>
                    {prod.name.tr}
                  </h4>
                  <span className="text-xs font-mono font-bold" style={{ color: "var(--dut-purple-lt)" }}>
                    {prod.price} {prod.currency}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleProductAvailability(prod.id)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
                style={prod.isAvailable
                  ? { background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }
                  : { background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }
                }
              >
                {prod.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stokta</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>TÜKENDİ</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/management-portal-secure/products"
          className="p-6 rounded-3xl space-y-3 transition-all hover:scale-[1.02] group shadow-lg"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "rgba(166,108,255,0.15)" }}>
            <UtensilsCrossed className="w-6 h-6" style={{ color: "var(--dut-purple-lt)" }} />
          </div>
          <div>
            <h4 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
              Ürün Yönetimi
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--dut-text3)" }}>
              Fiyat, görsel, kalori, alerjen ve şef notlarını düzenleyin.
            </p>
          </div>
        </Link>

        <Link
          href="/management-portal-secure/categories"
          className="p-6 rounded-3xl space-y-3 transition-all hover:scale-[1.02] group shadow-lg"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "rgba(99,211,145,0.15)" }}>
            <FolderTree className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
              Kategori Yönetimi
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--dut-text3)" }}>
              Kategori isimleri, emoji, sıralama ve görünürlük ayarları.
            </p>
          </div>
        </Link>

        <Link
          href="/management-portal-secure/settings"
          className="p-6 rounded-3xl space-y-3 transition-all hover:scale-[1.02] group shadow-lg"
          style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "rgba(240,180,90,0.15)" }}>
            <Settings className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
              Mekan Ayarları
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--dut-text3)" }}>
              Mekan adı, slogan, logo ve servis notları.
            </p>
          </div>
        </Link>
      </div>

    </div>
  );
}
