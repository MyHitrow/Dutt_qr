"use client";

import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { Category } from "@/types/menu";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } = useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [orderNotice, setOrderNotice] = useState(false);

  const [formData, setFormData] = useState({
    nameTr: "",
    nameEn: "",
    emoji: "🍽️",
    slug: "",
    isActive: true,
  });

  // Sort categories by sortOrder ascending
  const sortedCategories = [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      nameTr: "",
      nameEn: "",
      emoji: "🍽️",
      slug: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      nameTr: cat.name.tr,
      nameEn: cat.name.en,
      emoji: cat.emoji || "🍽️",
      slug: cat.slug,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const generateSlug = (text: string) => {
    const trMap: Record<string, string> = {
      ç: "c", Ç: "c",
      ğ: "g", Ğ: "g",
      ş: "s", Ş: "s",
      ü: "u", Ü: "u",
      ı: "i", I: "i", İ: "i",
      ö: "o", Ö: "o",
    };
    return text
      .split("")
      .map((c) => trMap[c] || c)
      .join("")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const slugified = formData.slug || generateSlug(formData.nameTr);
    const payload: Partial<Category> = {
      slug: slugified,
      emoji: formData.emoji,
      name: { tr: formData.nameTr, en: formData.nameEn || formData.nameTr },
      isActive: formData.isActive,
    };

    if (editingCategory?.id) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload as Omit<Category, "id">);
    }

    setIsModalOpen(false);
  };

  // ── Drag & Drop Handlers ──
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...sortedCategories];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    reorderCategories(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setOrderNotice(true);
    setTimeout(() => setOrderNotice(false), 2500);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ── Move Up / Down Buttons ──
  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedCategories.length) return;

    const updated = [...sortedCategories];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    reorderCategories(updated);
    setOrderNotice(true);
    setTimeout(() => setOrderNotice(false), 2500);
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dut-text2)" }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ color: "var(--dut-text)" }}>
            Kategori Yönetimi
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dut-text3)" }}>
            Kategorileri sürükleyip bırakarak veya ok butonlarıyla istediğiniz sıraya taşıyın. Değişiklikler anında menüye yansır.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg flex-shrink-0"
          style={{ background: "var(--dut-purple)", boxShadow: "0 8px 24px rgba(166,108,255,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori</span>
        </button>
      </div>

      {/* Success Notification */}
      {orderNotice && (
        <div
          className="p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          style={{
            background: "rgba(99,211,145,0.12)",
            color: "var(--dut-success)",
            border: "1px solid rgba(99,211,145,0.25)",
          }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Kategori sıralaması güncellendi ve canlı menüye uygulandı!</span>
        </div>
      )}

      {/* Categories Reorderable List Card */}
      <div
        className="rounded-3xl p-4 shadow-lg space-y-2.5"
        style={{ background: "var(--dut-card)", border: "1px solid var(--dut-divider)" }}
      >
        {sortedCategories.map((cat, index) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={cat.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-move select-none ${
                isDragging ? "opacity-35 scale-[0.98]" : ""
              } ${isDragOver ? "border-purple-400 bg-purple-500/10 shadow-lg" : ""}`}
              style={{
                background: isDragOver ? "rgba(166,108,255,0.12)" : "var(--dut-bg)",
                border: isDragOver ? "1px solid #A66CFF" : "1px solid var(--dut-divider)",
              }}
            >
              {/* Left: Grip Handle + Rank + Emoji + Title */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag Grip Handle & Index */}
                <div className="flex items-center gap-1.5 text-white/40 hover:text-purple-300 transition-colors flex-shrink-0">
                  <GripVertical className="w-5 h-5 cursor-grab active:cursor-grabbing" />
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-white/60">
                    {index + 1}
                  </span>
                </div>

                {/* Emoji Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(166,108,255,0.12)", border: "1px solid rgba(166,108,255,0.2)" }}
                >
                  {cat.emoji || "🍽️"}
                </div>

                {/* Name & Count */}
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 truncate" style={{ color: "var(--dut-text)" }}>
                    {cat.name.tr}
                    {!cat.isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)" }}>
                        Gizli
                      </span>
                    )}
                  </h3>
                  <span className="text-xs block font-light mt-0.5" style={{ color: "var(--dut-text3)" }}>
                    {cat.name.en} • <strong className="font-semibold text-purple-300">{productCount} Ürün</strong>
                  </span>
                </div>
              </div>

              {/* Right: Up/Down Buttons + Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {/* Reorder Buttons (Especially convenient on mobile/touch) */}
                <div className="flex items-center gap-1 mr-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border transition-all text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)" }}
                    title="Yukarı Taşı"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === sortedCategories.length - 1}
                    className="p-1.5 rounded-lg border transition-all text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    style={{ background: "var(--dut-elevated)", borderColor: "var(--dut-divider)" }}
                    title="Aşağı Taşı"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Toggle Visibility */}
                <button
                  type="button"
                  onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                  className="p-2 rounded-xl transition-all text-xs font-semibold"
                  style={
                    cat.isActive
                      ? { background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }
                      : { background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }
                  }
                  title={cat.isActive ? "Gizle" : "Göster"}
                >
                  {cat.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-2 rounded-xl transition-all"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)", color: "var(--dut-text3)" }}
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`"${cat.name.tr}" kategorisini ve altındaki ${productCount} ürünü silmek istediğinize emin misiniz?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-xl transition-all text-rose-400 hover:text-rose-300"
                  style={{ background: "var(--dut-elevated)", border: "1px solid var(--dut-divider)" }}
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
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white/60 hover:text-white"
                style={{ background: "var(--dut-elevated)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {field(
                  "Emoji",
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="admin-input text-center text-lg"
                  />
                )}
                <div className="col-span-3">
                  {field(
                    "Kategori Adı (Türkçe) *",
                    <input
                      type="text"
                      value={formData.nameTr}
                      onChange={(e) => setFormData({ ...formData, nameTr: e.target.value })}
                      placeholder="Soğuk Mezeler"
                      className="admin-input font-bold"
                      required
                    />
                  )}
                </div>
              </div>

              {field(
                "Category Name (English)",
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Cold Mezes"
                  className="admin-input"
                />
              )}

              {field(
                "Durum",
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={
                    formData.isActive
                      ? { background: "rgba(99,211,145,0.12)", color: "var(--dut-success)", border: "1px solid rgba(99,211,145,0.25)" }
                      : { background: "rgba(255,107,107,0.12)", color: "var(--dut-danger)", border: "1px solid rgba(255,107,107,0.25)" }
                  }
                >
                  {formData.isActive ? "Yayında (Müşteriye Açık)" : "Gizli (Müşteriye Kapalı)"}
                </button>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: "var(--dut-divider)" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-lg"
                  style={{ background: "var(--dut-purple)", boxShadow: "0 4px 14px rgba(166,108,255,0.3)" }}
                >
                  {editingCategory ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
