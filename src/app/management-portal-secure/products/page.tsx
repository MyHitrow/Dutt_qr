"use client";

import React, { useState, useMemo } from "react";
import { useMenu } from "@/context/MenuContext";
import { Product } from "@/types/menu";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Flame,
  Leaf,
  WheatOff,
  Sparkles,
  ChefHat,
  Image as ImageIcon,
  Type,
} from "lucide-react";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    allergens,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
  } = useMenu();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    nameTr: string;
    nameEn: string;
    descriptionTr: string;
    descriptionEn: string;
    price: number;
    currency: string;
    categoryId: string;
    hasImage: boolean;
    imageUrl: string;
    isAvailable: boolean;
    isActive: boolean;
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    spicyLevel: number;
    chefNoteTr: string;
    chefNoteEn: string;
    servingSuggestionTr: string;
    servingSuggestionEn: string;
    allergenIds: string[];
  }>({
    nameTr: "",
    nameEn: "",
    descriptionTr: "",
    descriptionEn: "",
    price: 0,
    currency: "₺",
    categoryId: categories[0]?.id || "",
    hasImage: true,
    imageUrl: "",
    isAvailable: true,
    isActive: true,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    spicyLevel: 0,
    chefNoteTr: "",
    chefNoteEn: "",
    servingSuggestionTr: "",
    servingSuggestionEn: "",
    allergenIds: [],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCatId === "all" || p.categoryId === selectedCatId;
      const matchesQuery =
        !searchQuery ||
        p.name.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.en.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [products, selectedCatId, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      nameTr: "",
      nameEn: "",
      descriptionTr: "",
      descriptionEn: "",
      price: 100,
      currency: "₺",
      categoryId: categories[0]?.id || "",
      hasImage: true,
      imageUrl: "",
      isAvailable: true,
      isActive: true,
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      spicyLevel: 0,
      chefNoteTr: "",
      chefNoteEn: "",
      servingSuggestionTr: "",
      servingSuggestionEn: "",
      allergenIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      nameTr: prod.name.tr,
      nameEn: prod.name.en,
      descriptionTr: prod.description.tr,
      descriptionEn: prod.description.en,
      price: prod.price,
      currency: prod.currency,
      categoryId: prod.categoryId,
      hasImage: prod.hasImage,
      imageUrl: prod.imageUrl || "",
      isAvailable: prod.isAvailable,
      isActive: prod.isActive,
      isVegan: !!prod.dietary?.isVegan,
      isVegetarian: !!prod.dietary?.isVegetarian,
      isGlutenFree: !!prod.dietary?.isGlutenFree,
      spicyLevel: prod.dietary?.spicyLevel || 0,
      chefNoteTr: prod.chefNote?.tr || "",
      chefNoteEn: prod.chefNote?.en || "",
      servingSuggestionTr: prod.servingSuggestion?.tr || "",
      servingSuggestionEn: prod.servingSuggestion?.en || "",
      allergenIds: prod.allergens ? prod.allergens.map((a) => a.id) : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAllergensObj = allergens.filter((a) =>
      formData.allergenIds.includes(a.id)
    );

    const payload: Partial<Product> = {
      categoryId: formData.categoryId,
      name: { tr: formData.nameTr, en: formData.nameEn || formData.nameTr },
      description: {
        tr: formData.descriptionTr,
        en: formData.descriptionEn || formData.descriptionTr,
      },
      price: Number(formData.price),
      currency: formData.currency,
      hasImage: formData.hasImage,
      imageUrl: formData.hasImage ? formData.imageUrl : undefined,
      isAvailable: formData.isAvailable,
      isActive: formData.isActive,
      sortOrder: editingProduct?.sortOrder || 1,
      dietary: {
        isVegan: formData.isVegan,
        isVegetarian: formData.isVegetarian,
        isGlutenFree: formData.isGlutenFree,
        spicyLevel: formData.spicyLevel,
      },
      allergens: selectedAllergensObj,
      chefNote:
        formData.chefNoteTr || formData.chefNoteEn
          ? { tr: formData.chefNoteTr, en: formData.chefNoteEn }
          : undefined,
      servingSuggestion:
        formData.servingSuggestionTr || formData.servingSuggestionEn
          ? { tr: formData.servingSuggestionTr, en: formData.servingSuggestionEn }
          : undefined,
    };

    if (editingProduct?.id) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload as Omit<Product, "id">);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-content-primary">
            Ürün Yönetimi
          </h2>
          <p className="text-xs text-content-secondary font-light">
            Menüdeki tüm yemek, içecek ve mezelerin içerik, fiyat ve görsellerini düzenleyin.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs font-semibold shadow-purple-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-surface-card border border-menuBorder p-4 rounded-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün adı veya açıklamasıyla ara..."
            className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-menuBorder rounded-lg text-xs focus:outline-none focus:border-brand-purple"
          />
        </div>

        <select
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
          className="px-3 py-2 bg-background-secondary border border-menuBorder rounded-lg text-xs text-content-primary focus:outline-none focus:border-brand-purple"
        >
          <option value="all">Tüm Kategoriler ({products.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.tr}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((prod) => {
          const categoryName =
            categories.find((c) => c.id === prod.categoryId)?.name.tr ||
            "Kategori Yok";

          return (
            <div
              key={prod.id}
              className="bg-surface-card border border-menuBorder rounded-xl p-4 space-y-3 purple-corner-tr relative group hover:border-brand-purple/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      {categoryName}
                    </span>
                    {prod.hasImage ? (
                      <span className="text-[10px] text-content-muted flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-emerald-400" /> Fotoğraflı
                      </span>
                    ) : (
                      <span className="text-[10px] text-content-muted flex items-center gap-1">
                        <Type className="w-3 h-3 text-amber-400" /> Tipografik
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-content-primary">
                    {prod.name.tr}
                  </h3>
                  <span className="text-xs text-content-muted block italic">
                    {prod.name.en}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-bold text-brand-purple block">
                    {prod.price} {prod.currency}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-content-secondary line-clamp-2 font-light">
                {prod.description.tr}
              </p>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-menuBorder flex items-center justify-between">
                <button
                  onClick={() => toggleProductAvailability(prod.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                    prod.isAvailable
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {prod.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Stokta Var
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> TÜKENDİ
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(prod)}
                    className="p-1.5 rounded-lg bg-background-secondary border border-menuBorder text-content-secondary hover:text-brand-purple hover:border-brand-purple/30 transition-all"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(`"${prod.name.tr}" ürününü silmek istediğinize emin misiniz?`)
                      ) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-background-secondary border border-menuBorder text-content-muted hover:text-rose-400 transition-all"
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

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface-card border border-menuBorder rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden purple-corner-tr">
            {/* Modal Header */}
            <div className="p-4 border-b border-menuBorder flex items-center justify-between bg-background-secondary">
              <h3 className="font-semibold text-base text-content-primary">
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-content-muted hover:text-content-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveForm} className="p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar text-xs">
              {/* Category & Card Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Kategori *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.tr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Kart Görsel Tipi
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasImage: true })}
                      className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                        formData.hasImage
                          ? "border-brand-purple text-brand-purple font-semibold bg-brand-purple/10"
                          : "border-menuBorder text-content-secondary"
                      }`}
                    >
                      Fotoğraflı Kart
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasImage: false })}
                      className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                        !formData.hasImage
                          ? "border-brand-purple text-brand-purple font-semibold bg-brand-purple/10"
                          : "border-menuBorder text-content-secondary"
                      }`}
                    >
                      Fotoğrafsız Premium Kart
                    </button>
                  </div>
                </div>
              </div>

              {/* Names TR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Ürün Adı (Türkçe) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameTr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameTr: e.target.value })
                    }
                    placeholder="Örn: Atom & Süzme Yoğurt"
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Product Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="e.g.: Atom & Strained Yogurt"
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Price & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple font-mono"
                    required
                  />
                </div>
                {formData.hasImage && (
                  <div>
                    <label className="block font-semibold mb-1 text-content-secondary">
                      Görsel URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                    />
                  </div>
                )}
              </div>

              {/* Descriptions TR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Açıklama (Türkçe)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionTr}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionTr: e.target.value })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionEn: e.target.value })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Dietary Checkboxes */}
              <div>
                <label className="block font-semibold mb-2 text-content-secondary">
                  Diyet & Özellik Etiketleri
                </label>
                <div className="flex flex-wrap gap-3 p-3 bg-background border border-menuBorder rounded-lg">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVegan}
                      onChange={(e) =>
                        setFormData({ ...formData, isVegan: e.target.checked })
                      }
                    />
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vegan</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) =>
                        setFormData({ ...formData, isVegetarian: e.target.checked })
                      }
                    />
                    <Leaf className="w-3.5 h-3.5 text-green-400" />
                    <span>Vejetaryen</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isGlutenFree}
                      onChange={(e) =>
                        setFormData({ ...formData, isGlutenFree: e.target.checked })
                      }
                    />
                    <WheatOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Glutensiz</span>
                  </label>

                  <div className="flex items-center gap-1 ml-auto">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Acı Seviyesi:</span>
                    <select
                      value={formData.spicyLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, spicyLevel: Number(e.target.value) })
                      }
                      className="p-1 bg-surface-card border rounded"
                    >
                      <option value={0}>Yok</option>
                      <option value={1}>Az Acı (1/3)</option>
                      <option value={2}>Orta Acı (2/3)</option>
                      <option value={3}>Çok Acı (3/3)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Allergens Selector */}
              <div>
                <label className="block font-semibold mb-1 text-content-secondary">
                  Alerjen Seçimi
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-background border border-menuBorder rounded-lg">
                  {allergens.map((alg) => {
                    const isSelected = formData.allergenIds.includes(alg.id);
                    return (
                      <button
                        key={alg.id}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? formData.allergenIds.filter((id) => id !== alg.id)
                            : [...formData.allergenIds, alg.id];
                          setFormData({ ...formData, allergenIds: updated });
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                          isSelected
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold"
                            : "bg-surface-card border-menuBorder text-content-muted"
                        }`}
                      >
                        {alg.name.tr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chef Note & Serving Suggestion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5 text-brand-purple" />
                    Şefin Notu (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={formData.chefNoteTr}
                    onChange={(e) =>
                      setFormData({ ...formData, chefNoteTr: e.target.value })
                    }
                    placeholder="Örn: Özel baharat harcı ile marine edilmiştir."
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Servis Önerisi (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={formData.servingSuggestionTr}
                    onChange={(e) =>
                      setFormData({ ...formData, servingSuggestionTr: e.target.value })
                    }
                    placeholder="Örn: Soğuk karaf ile ikram edilir."
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-menuBorder flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-background-secondary border border-menuBorder rounded-xl text-content-secondary hover:text-content-primary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-semibold shadow-purple-glow"
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
