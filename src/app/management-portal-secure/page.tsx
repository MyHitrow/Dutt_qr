"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import {
  UtensilsCrossed, FolderTree, AlertTriangle, CheckCircle2, XCircle,
  Plus, ArrowRight, Settings, Sparkles, Flame, Globe2,
} from "lucide-react";

export default function AdminDashboard() {
  const { products, categories, venue, toggleProductAvailability } = useMenu();

  const totalProducts = products.length;
  const outOfStockProducts = products.filter((p) => !p.isAvailable);
  const totalCategories = categories.length;
  const imageProductsCount = products.filter((p) => p.hasImage).length;
  const noImageProductsCount = products.filter((p) => !p.hasImage).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome Hero Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl"
        style={{
          background: "linear-gradient(135deg, rgba(166,108,255,0.12) 0%, var(--dut-card) 60%)",
          border: "1px solid rgba(166,108,255,0.25)",
        }}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#A66CFF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#A66CFF]/20 text-[#C7A8FF] border border-[#A66CFF]/30">
              DUT Kitchen Dashboard
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--dut-text)" }}>
            Hoş Geldiniz, {venue.name}
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--dut-text2)" }}>
            Menünüzdeki lezzetleri, fiyatları, kategorileri ve stok durumlarını anlık yönetin.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <Link
            href="/management-portal-secure/products"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg"
            style={{
              background: "var(--dut-purple)",
              boxShadow: "0 8px 24px rgba(166,108,255,0.35)",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün Ekle</span>
          </Link>
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
                  <div className="w-11 h-11 rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image src={prod.imageUrl} alt={prod.name.tr} fill sizes="44px" className="object-cover" />
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
