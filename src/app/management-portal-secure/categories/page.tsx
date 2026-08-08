"use client";

import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { Category } from "@/types/menu";
import { Plus, Edit2, Trash2, X, FolderTree, Eye, EyeOff, Sparkles } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [formData, setFormData] = useState({
    nameTr: "", nameEn: "", emoji: "🍽️", slug: "", sortOrder: 1, isActive: true,
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      nameTr: "", nameEn: "", emoji: "🍽️", slug: "", sortOrder: categories.length + 1, isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      nameTr: cat.name.tr, nameEn: cat.name.en, emoji: cat.emoji || "🍽️", slug: cat.slug, sortOrder: cat.sortOrder, isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const slugified = formData.slug || formData.nameTr.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const payload: Partial<Category> = {
      slug: slugified,
      emoji: formData.emoji,
      name: { tr: formData.nameTr, en: formData.nameEn || formData.nameTr },
      sortOrder: Number(formData.sortOrder),
      isActive: formData.isActive,
    };

    if (editingCategory?.id) updateCategory(editingCategory.id, payload);
    else addCategory(payload as Omit<Category, "id">);

    setIsModalOpen(false);
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dut-text2)" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ color: "var(--dut-text)" }}>Kategori Yönetimi</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
            Menüdeki kategorileri ekleyin, sıralayın ve görünürlüklerini düzenleyin.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori</span>
        </button>
      </div>

      {/* Categories List Card */}
      <div
        className="rounded-3xl p-4 shadow-lg space-y-2"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:scale-[1.005]"
              style={{ background: "var(--dut-bg)", border: "1px solid var(--dut-divider)" }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(166,108,255,0.12)", border: "1px solid rgba(166,108,255,0.2)" }}
                >
                  {cat.emoji || "🍽️"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2" style={{ color: "var(--dut-text)" }}>
                    {cat.name.tr}
                    {!cat.isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md" style={{ background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)" }}>
                        Gizli
                      </span>
                    )}
                  </h3>
                  <span className="text-xs block font-light mt-0.5" style={{ color: "var(--dut-text3)" }}>
                    {cat.name.en} • <strong className="font-semibold" style={{ color: "var(--dut-purple-lt)" }}>{productCount} Ürün</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                  className="p-2 rounded-xl transition-all text-xs font-semibold"
                  style={cat.isActive
                    ? { background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }
                    : { background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }
                  }
                  title={cat.isActive ? "Gizle" : "Göster"}
                >
                  {cat.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-2 rounded-xl transition-all"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`"${cat.name.tr}" kategorisini ve altındaki ${productCount} ürünü silmek istediğinize emin misiniz?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-xl transition-all"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dut-backdrop animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl shadow-2xl animate-scale-in"
            style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--dut-divider)" }}>
              <h3 className="font-bold text-base" style={{ color: "var(--dut-text)" }}>
                {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--dut-elevated)", color: "var(--dut-text2)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {field("Emoji",
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="admin-input text-center text-lg"
                  />
                )}
                <div className="col-span-3">
                  {field("Kategori Adı (Türkçe) *",
                    <input
                      type="text"
                      value={formData.nameTr}
                      onChange={(e) => setFormData({ ...formData, nameTr: e.target.value })}
                      placeholder="Soğuk Mezeler"
                      className="admin-input"
                      required
                    />
                  )}
                </div>
              </div>

              {field("Category Name (English)",
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Cold Mezes"
                  className="admin-input"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                {field("Sıra No",
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="admin-input font-mono"
                  />
                )}

                {field("Durum",
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={formData.isActive
                      ? { background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }
                      : { background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }
                    }
                  >
                    {formData.isActive ? "Yayında (Aktif)" : "Gizli (Pasif)"}
                  </button>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t" style={{ borderColor: "var(--dut-divider)" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text2)" }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                  style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
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
