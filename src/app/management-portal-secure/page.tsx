"use client";

import React from "react";
import Link from "next/link";
import { useMenu } from "@/context/MenuContext";
import {
  UtensilsCrossed,
  FolderTree,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const { products, categories, venue, toggleProductAvailability } = useMenu();

  const totalProducts = products.length;
  const outOfStockProducts = products.filter((p) => !p.isAvailable);
  const totalCategories = categories.length;
  const imageProductsCount = products.filter((p) => p.hasImage).length;
  const noImageProductsCount = products.filter((p) => !p.hasImage).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-surface-card border border-menuBorder rounded-2xl p-6 purple-corner-tr flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-content-primary">
            Hoş Geldiniz, {venue.name} Yönetim Paneli
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary font-light mt-1">
            Menünüzdeki tüm lezzetleri, fiyatları, kategorileri ve stok durumlarını anlık yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/management-portal-secure/products?action=new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs font-semibold shadow-purple-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-menuBorder p-4 rounded-xl space-y-1">
          <span className="text-xs text-content-muted font-medium">Toplam Ürün</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-content-primary">
              {totalProducts}
            </span>
            <UtensilsCrossed className="w-5 h-5 text-brand-purple" />
          </div>
          <span className="text-[10px] text-content-secondary block">
            {imageProductsCount} Fotoğraflı / {noImageProductsCount} Fotoğrafsız
          </span>
        </div>

        <div className="bg-surface-card border border-menuBorder p-4 rounded-xl space-y-1">
          <span className="text-xs text-content-muted font-medium">Aktif Kategoriler</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-content-primary">
              {totalCategories}
            </span>
            <FolderTree className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-content-secondary block">
            Soğuk, Sıcak, Rakı vb.
          </span>
        </div>

        <div className="bg-surface-card border border-menuBorder p-4 rounded-xl space-y-1">
          <span className="text-xs text-content-muted font-medium">Tükendi (Stok Dışı)</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {outOfStockProducts.length}
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-[10px] text-content-secondary block">
            Anlık servise kapalı
          </span>
        </div>

        <div className="bg-surface-card border border-menuBorder p-4 rounded-xl space-y-1">
          <span className="text-xs text-content-muted font-medium">Aktif Diller</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-brand-purple">
              TR / EN
            </span>
            <CheckCircle2 className="w-5 h-5 text-brand-purple" />
          </div>
          <span className="text-[10px] text-content-secondary block">
            Çift dil senkronize
          </span>
        </div>
      </div>

      {/* Quick Stok / Availability Toggle Section */}
      <div className="bg-surface-card border border-menuBorder rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-content-primary">
              Hızlı Stok & Tükendi Yönetimi
            </h3>
            <p className="text-xs text-content-secondary font-light">
              Servis anında tükenen ürünlerin durumunu tek tıkla değiştirin.
            </p>
          </div>
          <Link
            href="/management-portal-secure/products"
            className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
          >
            <span>Tüm Ürünler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              className="p-3 bg-background-secondary border border-menuBorder rounded-xl flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <h4 className="font-medium text-xs sm:text-sm text-content-primary truncate">
                  {prod.name.tr}
                </h4>
                <span className="text-[11px] text-content-muted font-mono">
                  {prod.price} {prod.currency}
                </span>
              </div>
              <button
                onClick={() => toggleProductAvailability(prod.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  prod.isAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                }`}
              >
                {prod.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stokta Var</span>
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
          className="p-5 bg-surface-card border border-menuBorder hover:border-brand-purple/40 rounded-xl space-y-2 transition-all hover:shadow-purple-glow group"
        >
          <UtensilsCrossed className="w-6 h-6 text-brand-purple group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-sm text-content-primary">
            Ürün Yönetimi
          </h4>
          <p className="text-xs text-content-secondary font-light">
            Fiyat, görsel, açıklama, alerjen ve şef notlarını düzenleyin.
          </p>
        </Link>

        <Link
          href="/management-portal-secure/categories"
          className="p-5 bg-surface-card border border-menuBorder hover:border-brand-purple/40 rounded-xl space-y-2 transition-all hover:shadow-purple-glow group"
        >
          <FolderTree className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-sm text-content-primary">
            Kategori Yönetimi
          </h4>
          <p className="text-xs text-content-secondary font-light">
            Menüdeki kategori isimleri, sıralamaları ve görünürlüğü yönetin.
          </p>
        </Link>

        <Link
          href="/management-portal-secure/settings"
          className="p-5 bg-surface-card border border-menuBorder hover:border-brand-purple/40 rounded-xl space-y-2 transition-all hover:shadow-purple-glow group"
        >
          <Settings className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-sm text-content-primary">
            Mekan Ayarları
          </h4>
          <p className="text-xs text-content-secondary font-light">
            Mekan adı, slogan, logo ve servis ekibi bilgilendirme notu.
          </p>
        </Link>
      </div>
    </div>
  );
}
