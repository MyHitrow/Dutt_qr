"use client";

import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { Category } from "@/types/menu";
import { Plus, Edit2, Trash2, X, FolderTree, Eye, EyeOff } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(
    null
  );

  const [formData, setFormData] = useState({
    nameTr: "",
    nameEn: "",
    slug: "",
    sortOrder: 1,
    isActive: true,
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      nameTr: "",
      nameEn: "",
      slug: "",
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      nameTr: cat.name.tr,
      nameEn: cat.name.en,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    const slugified =
      formData.slug ||
      formData.nameTr.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const payload: Partial<Category> = {
      slug: slugified,
      name: { tr: formData.nameTr, en: formData.nameEn || formData.nameTr },
      sortOrder: Number(formData.sortOrder),
      isActive: formData.isActive,
    };

    if (editingCategory?.id) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload as Omit<Category, "id">);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-content-primary">
            Kategori Yönetimi
          </h2>
          <p className="text-xs text-content-secondary font-light">
            Menüdeki kategorileri ekleyin, düzenleyin ve sıralamalarını değiştirin.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs font-semibold shadow-purple-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-surface-card border border-menuBorder rounded-xl overflow-hidden divide-y divide-menuBorder">
        {categories.map((cat) => {
          const productCount = products.filter(
            (p) => p.categoryId === cat.id
          ).length;

          return (
            <div
              key={cat.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-background-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-mono font-bold text-xs">
                  {cat.sortOrder}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-content-primary flex items-center gap-2">
                    {cat.name.tr}
                    {!cat.isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">
                        Gizli
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-content-muted block font-light">
                    {cat.name.en} • {productCount} Ürün • /{cat.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateCategory(cat.id, { isActive: !cat.isActive })
                  }
                  className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                    cat.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                  title={cat.isActive ? "Kategoriyi Gizle" : "Kategoriyi Göster"}
                >
                  {cat.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-2 rounded-lg bg-background border border-menuBorder text-content-secondary hover:text-brand-purple transition-all"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        `"${cat.name.tr}" kategorisini ve altındaki ${productCount} ürünü silmek istediğinize emin misiniz?`
                      )
                    ) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-background border border-menuBorder text-content-muted hover:text-rose-400 transition-all"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface-card border border-menuBorder rounded-2xl w-full max-w-md shadow-2xl overflow-hidden purple-corner-tr">
            <div className="p-4 border-b border-menuBorder flex items-center justify-between bg-background-secondary">
              <h3 className="font-semibold text-base text-content-primary">
                {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-content-muted hover:text-content-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-content-secondary">
                  Kategori Adı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={formData.nameTr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameTr: e.target.value })
                  }
                  placeholder="Örn: Soğuk Mezeler"
                  className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-content-secondary">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  placeholder="e.g.: Cold Mezes"
                  className="w-full p-2.5 bg-background border border-menuBorder rounded-lg focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Sıra Numarası
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-background border border-menuBorder rounded-lg font-mono focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-content-secondary">
                    Durum
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className={`w-full p-2.5 rounded-lg border text-center font-medium transition-all ${
                      formData.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {formData.isActive ? "Yayında (Aktif)" : "Gizli (Pasif)"}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-menuBorder flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-background-secondary border border-menuBorder rounded-xl text-content-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-semibold shadow-purple-glow"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
