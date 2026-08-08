"use client";

import React, { useState, useMemo, useRef } from "react";
import { useMenu } from "@/context/MenuContext";
import { Product, ProductVariant } from "@/types/menu";
import {
  Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, X,
  Flame, Leaf, WheatOff, Sparkles, ChefHat, Link2, Upload, Eye,
} from "lucide-react";
import Image from "next/image";

// Görsel optimizasyonu: canvas üzerinden WebP'ye sıkıştırır
async function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 900;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.82));
      };
    };
    reader.readAsDataURL(file);
  });
}

const DUT_INPUT = "w-full p-2.5 rounded-xl text-xs focus:outline-none transition-colors";
const inputStyle = { background: "var(--dut-bg)", border: "1px solid var(--dut-divider)", color: "var(--dut-text)" };
const focusStyle = { borderColor: "var(--dut-purple)" };

export default function AdminProductsPage() {
  const { products, categories, allergens, addProduct, updateProduct, deleteProduct, toggleProductAvailability } = useMenu();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgMode, setImgMode] = useState<"url" | "upload">("url");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nameTr: "", nameEn: "", descriptionTr: "", descriptionEn: "",
    price: 100, calories: 0, currency: "₺", categoryId: categories[0]?.id || "",
    hasImage: true, imageUrl: "", isAvailable: true, isActive: true,
    isVegan: false, isVegetarian: false, isGlutenFree: false,
    spicyLevel: 0, chefNoteTr: "", chefNoteEn: "",
    servingSuggestionTr: "", servingSuggestionEn: "", allergenIds: [] as string[],
    variants: [] as ProductVariant[],
  });

  const filteredProducts = useMemo(() => products.filter(p => {
    const cat = selectedCatId === "all" || p.categoryId === selectedCatId;
    const q = !searchQuery || p.name.tr.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.en.toLowerCase().includes(searchQuery.toLowerCase());
    return cat && q;
  }), [products, selectedCatId, searchQuery]);

  const resetForm = () => ({
    nameTr: "", nameEn: "", descriptionTr: "", descriptionEn: "",
    price: 100, calories: 0, currency: "₺", categoryId: categories[0]?.id || "",
    hasImage: true, imageUrl: "", isAvailable: true, isActive: true,
    isVegan: false, isVegetarian: false, isGlutenFree: false,
    spicyLevel: 0, chefNoteTr: "", chefNoteEn: "",
    servingSuggestionTr: "", servingSuggestionEn: "", allergenIds: [] as string[],
    variants: [] as ProductVariant[],
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(resetForm());
    setUploadPreview(null);
    setImgMode("url");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      nameTr: prod.name.tr, nameEn: prod.name.en,
      descriptionTr: prod.description.tr, descriptionEn: prod.description.en,
      price: prod.price, calories: prod.calories ?? 0, currency: prod.currency,
      categoryId: prod.categoryId, hasImage: prod.hasImage,
      imageUrl: prod.imageUrl || "", isAvailable: prod.isAvailable, isActive: prod.isActive,
      isVegan: !!prod.dietary?.isVegan, isVegetarian: !!prod.dietary?.isVegetarian,
      isGlutenFree: !!prod.dietary?.isGlutenFree, spicyLevel: prod.dietary?.spicyLevel || 0,
      chefNoteTr: prod.chefNote?.tr || "", chefNoteEn: prod.chefNote?.en || "",
      servingSuggestionTr: prod.servingSuggestion?.tr || "", servingSuggestionEn: prod.servingSuggestion?.en || "",
      allergenIds: prod.allergens ? prod.allergens.map(a => a.id) : [],
      variants: prod.variants ? [...prod.variants] : [],
    });
    setUploadPreview(prod.imageUrl?.startsWith("data:") ? prod.imageUrl : null);
    setImgMode(prod.imageUrl?.startsWith("data:") ? "upload" : "url");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const optimized = await optimizeImage(file);
      setUploadPreview(optimized);
      setFormData(f => ({ ...f, imageUrl: optimized, hasImage: true }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAllergens = allergens.filter(a => formData.allergenIds.includes(a.id));
    const payload: Partial<Product> = {
      categoryId: formData.categoryId,
      name: { tr: formData.nameTr, en: formData.nameEn || formData.nameTr },
      description: { tr: formData.descriptionTr, en: formData.descriptionEn || formData.descriptionTr },
      price: Number(formData.price),
      calories: formData.calories > 0 ? formData.calories : undefined,
      currency: formData.currency,
      hasImage: formData.hasImage,
      imageUrl: formData.hasImage ? formData.imageUrl : undefined,
      isAvailable: formData.isAvailable,
      isActive: formData.isActive,
      sortOrder: editingProduct?.sortOrder || 1,
      dietary: { isVegan: formData.isVegan, isVegetarian: formData.isVegetarian, isGlutenFree: formData.isGlutenFree, spicyLevel: formData.spicyLevel },
      allergens: selectedAllergens,
      variants: formData.variants.length > 0 ? formData.variants : undefined,
      chefNote: formData.chefNoteTr ? { tr: formData.chefNoteTr, en: formData.chefNoteEn } : undefined,
      servingSuggestion: formData.servingSuggestionTr ? { tr: formData.servingSuggestionTr, en: formData.servingSuggestionEn } : undefined,
    };
    if (editingProduct?.id) updateProduct(editingProduct.id, payload);
    else addProduct(payload as Omit<Product, "id">);
    setIsModalOpen(false);
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dut-text2)" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--dut-text)" }}>Ürün Yönetimi</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
            Menüdeki tüm ürünlerin içerik, fiyat ve görsellerini düzenleyin.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 shadow-lg"
          style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl" style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}>
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--dut-text3)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ürün ara..."
            className={`${DUT_INPUT} pl-9`}
            style={inputStyle}
          />
        </div>
        <select
          value={selectedCatId}
          onChange={e => setSelectedCatId(e.target.value)}
          className={DUT_INPUT}
          style={{ ...inputStyle, width: "auto", minWidth: 160 }}
        >
          <option value="all">Tüm Kategoriler ({products.length})</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name.tr}</option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map(prod => {
          const catName = categories.find(c => c.id === prod.categoryId)?.name.tr || "–";
          return (
            <div
              key={prod.id}
              className="group rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.01]"
              style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                {prod.hasImage && prod.imageUrl ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name.tr}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized={prod.imageUrl.startsWith("data:") || prod.imageUrl.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--dut-elevated)" }}>
                    <Sparkles className="w-5 h-5" style={{ color: "var(--dut-purple)" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md font-mono" style={{ background: "rgba(166,108,255,0.1)", color: "var(--dut-purple)", border: "1px solid rgba(166,108,255,0.2)" }}>
                      {catName}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm truncate" style={{ color: "var(--dut-text)" }}>{prod.name.tr}</h3>
                  <p className="text-[11px] truncate" style={{ color: "var(--dut-text3)" }}>{prod.name.en}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-base font-mono" style={{ color: "var(--dut-purple)" }}>{prod.price} {prod.currency}</span>
                  {prod.calories && (
                    <div className="flex items-center justify-end gap-0.5 mt-0.5">
                      <Flame className="w-3 h-3" style={{ color: "var(--dut-warning)" }} />
                      <span className="text-[10px] font-mono" style={{ color: "var(--dut-warning)" }}>{prod.calories} kcal</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs line-clamp-2" style={{ color: "var(--dut-text3)" }}>{prod.description.tr}</p>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between" style={{ borderTop: "1px solid var(--dut-divider)" }}>
                <button
                  onClick={() => toggleProductAvailability(prod.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={prod.isAvailable
                    ? { background: "rgba(99,211,145,0.1)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.2)" }
                    : { background: "rgba(255,107,107,0.1)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.2)" }
                  }
                >
                  {prod.isAvailable
                    ? <><CheckCircle2 className="w-3 h-3" /> Stokta</>
                    : <><XCircle className="w-3 h-3" /> Tükendi</>
                  }
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`"${prod.name.tr}" ürününü silmek istediğinize emin misiniz?`)) deleteProduct(prod.id); }}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dut-backdrop animate-fade-in">
          <div
            className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl animate-scale-in"
            style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
          >
            {/* Modal header */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid var(--dut-divider)" }}>
              <h3 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--dut-elevated)", color: "var(--dut-text2)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 space-y-5">

              {/* Category */}
              <div className="grid grid-cols-2 gap-4">
                {field("Kategori *",
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className={DUT_INPUT}
                    style={inputStyle}
                    required
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name.tr}</option>)}
                  </select>
                )}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dut-text2)" }}>Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`${DUT_INPUT} font-mono`}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("Ürün Adı (Türkçe) *",
                  <input type="text" value={formData.nameTr} onChange={e => setFormData({ ...formData, nameTr: e.target.value })}
                    placeholder="Örn: Atom & Süzme Yoğurt" className={DUT_INPUT} style={inputStyle} required />
                )}
                {field("Product Name (English)",
                  <input type="text" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g.: Atom & Strained Yogurt" className={DUT_INPUT} style={inputStyle} />
                )}
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("Açıklama (Türkçe)",
                  <textarea rows={2} value={formData.descriptionTr} onChange={e => setFormData({ ...formData, descriptionTr: e.target.value })}
                    className={DUT_INPUT} style={{ ...inputStyle, resize: "none" }} />
                )}
                {field("Description (English)",
                  <textarea rows={2} value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className={DUT_INPUT} style={{ ...inputStyle, resize: "none" }} />
                )}
              </div>

              {/* Calories */}
              <div className="grid grid-cols-2 gap-4">
                {field("Kalori (kcal)",
                  <div className="relative">
                    <Flame className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--dut-warning)" }} />
                    <input type="number" min={0} value={formData.calories || ""}
                      onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })}
                      placeholder="420" className={`${DUT_INPUT} pl-9 font-mono`} style={inputStyle} />
                  </div>
                )}
                <div />
              </div>

              {/* Image section */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--dut-text2)" }}>Ürün Görseli</label>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImgMode("url")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={imgMode === "url"
                      ? { background: "rgba(166,108,255,0.15)", border: "1px solid rgba(166,108,255,0.35)", color: "var(--dut-purple)" }
                      : { background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }
                    }
                  >
                    <Link2 className="w-3.5 h-3.5" /> URL ile Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgMode("upload")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={imgMode === "upload"
                      ? { background: "rgba(166,108,255,0.15)", border: "1px solid rgba(166,108,255,0.35)", color: "var(--dut-purple)" }
                      : { background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }
                    }
                  >
                    <Upload className="w-3.5 h-3.5" /> Dosya Yükle
                  </button>
                </div>

                {imgMode === "url" ? (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value, hasImage: !!e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className={DUT_INPUT}
                    style={inputStyle}
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-all"
                      style={{ borderColor: "var(--dut-divider)", color: "var(--dut-text3)", background: "var(--dut-bg)" }}
                    >
                      {isUploading
                        ? <span className="text-xs animate-pulse" style={{ color: "var(--dut-purple)" }}>Optimize ediliyor...</span>
                        : <>
                          <Upload className="w-6 h-6" />
                          <span className="text-xs font-semibold">Görsel seçin — JPEG, PNG, WebP</span>
                          <span className="text-[10px] opacity-60">Otomatik olarak WebP&apos;ye optimize edilir (max 900px)</span>
                        </>
                      }
                    </button>
                    {uploadPreview && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={uploadPreview}
                            alt="preview"
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={uploadPreview.startsWith("data:") || uploadPreview.startsWith("blob:")}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{ color: "var(--dut-success)" }}>✓ Görsel yüklendi ve optimize edildi</p>
                          <p className="text-[10px]" style={{ color: "var(--dut-text3)" }}>WebP, max 900px genişlik, %82 kalite</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setUploadPreview(null); setFormData(f => ({ ...f, imageUrl: "", hasImage: false })); }}
                          className="p-1 rounded-lg transition-all"
                          style={{ color: "var(--dut-danger)" }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dietary */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--dut-text2)" }}>Diyet & Özellik Etiketleri</label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl" style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)" }}>
                  {[
                    { key: "isVegan",     label: "🌿 Vegan",      val: formData.isVegan       },
                    { key: "isVegetarian",label: "🥗 Vejetaryen", val: formData.isVegetarian  },
                    { key: "isGlutenFree",label: "🌾 Glutensiz",  val: formData.isGlutenFree  },
                  ].map(({ key, label, val }) => (
                    <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input type="checkbox" checked={val} onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
                        className="accent-[#A66CFF] w-3.5 h-3.5" />
                      <span className="text-xs" style={{ color: "var(--dut-text2)" }}>{label}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Flame className="w-3.5 h-3.5" style={{ color: "var(--dut-danger)" }} />
                    <span className="text-xs" style={{ color: "var(--dut-text2)" }}>Acı:</span>
                    <select
                      value={formData.spicyLevel}
                      onChange={e => setFormData({ ...formData, spicyLevel: Number(e.target.value) })}
                      className="text-xs p-1 rounded-lg"
                      style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)", color: "var(--dut-text)" }}
                    >
                      <option value={0}>Yok</option>
                      <option value={1}>Az 🌶</option>
                      <option value={2}>Orta 🌶🌶</option>
                      <option value={3}>Çok 🌶🌶🌶</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--dut-text2)" }}>Alerjen Seçimi</label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl" style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)" }}>
                  {allergens.map(alg => {
                    const isSelected = formData.allergenIds.includes(alg.id);
                    return (
                      <button
                        key={alg.id}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? formData.allergenIds.filter(id => id !== alg.id)
                            : [...formData.allergenIds, alg.id];
                          setFormData({ ...formData, allergenIds: updated });
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all"
                        style={isSelected
                          ? { background: "rgba(255,107,107,0.1)", color: "var(--dut-danger)", borderColor: "rgba(255,107,107,0.3)" }
                          : { background: "var(--dut-card)", color: "var(--dut-text3)", borderColor: "var(--dut-divider)" }
                        }
                      >
                        {alg.name.tr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ölçü / Porsiyon Seçenekleri (Varyantlar) */}
              <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: "var(--dut-divider)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold" style={{ color: "var(--dut-text)" }}>
                      Ölçü / Porsiyon Seçenekleri (Opsiyonel)
                    </label>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--dut-text3)" }}>
                      Örn: Tek (₺500), Duble (₺625), 35cl (₺2.250), 70cl (₺4.000)...
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(f => ({
                        ...f,
                        variants: [
                          ...f.variants,
                          { id: `var-${Date.now()}`, name: { tr: "", en: "" }, price: Number(f.price) }
                        ]
                      }));
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    style={{ background: "rgba(166,108,255,0.12)", color: "var(--dut-purple)", border: "1px solid rgba(166,108,255,0.25)" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ölçü Ekle
                  </button>
                </div>

                {formData.variants.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {formData.variants.map((v, idx) => (
                      <div key={v.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)" }}>
                        <input
                          type="text"
                          placeholder="Ölçü Adı (Örn: Tek, Duble, 35 cl, 70 cl)"
                          value={v.name.tr}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(f => {
                              const next = [...f.variants];
                              next[idx] = { ...next[idx], name: { tr: val, en: val } };
                              return { ...f, variants: next };
                            });
                          }}
                          className={DUT_INPUT}
                          style={inputStyle}
                        />
                        <input
                          type="number"
                          placeholder="Fiyat (₺)"
                          value={v.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFormData(f => {
                              const next = [...f.variants];
                              next[idx] = { ...next[idx], price: val };
                              return { ...f, variants: next };
                            });
                          }}
                          className={`${DUT_INPUT} w-28 font-mono`}
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(f => ({
                              ...f,
                              variants: f.variants.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="p-2 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid var(--dut-divider)" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
                >
                  {editingProduct ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
