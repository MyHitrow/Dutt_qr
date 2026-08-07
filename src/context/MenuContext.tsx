"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Product, VenueSettings, Allergen, DailyFixMenu } from "@/types/menu";
import {
  mockVenueSettings,
  mockCategories,
  mockProducts,
  mockDailyFixMenus,
} from "@/data/mockMenuData";
import { createClient } from "@/lib/supabase/client";

interface MenuContextType {
  venue: VenueSettings;
  categories: Category[];
  products: Product[];
  allergens: Allergen[];
  dailyFixMenus: DailyFixMenu[];
  getCurrentDayFixMenu: () => DailyFixMenu | undefined;
  updateDailyFixMenu: (dayOfWeek: number, data: Partial<DailyFixMenu>) => void;
  updateVenue: (venue: Partial<VenueSettings>) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const mockAllergensList: Allergen[] = [
  { id: "alg-1", code: "MILK", name: { tr: "Süt ve Süt Ürünleri", en: "Milk & Dairy" } },
  { id: "alg-2", code: "NUTS", name: { tr: "Kuruyemiş / Fıstık", en: "Nuts / Pistachio" } },
  { id: "alg-3", code: "SHELLFISH", name: { tr: "Kabuklu Deniz Ürünleri", en: "Shellfish" } },
  { id: "alg-4", code: "GLUTEN", name: { tr: "Gluten / Buğday", en: "Gluten / Wheat" } },
  { id: "alg-5", code: "EGG", name: { tr: "Yumurta", en: "Egg" } },
  { id: "alg-6", code: "FISH", name: { tr: "Balık", en: "Fish" } },
  { id: "alg-7", code: "SESAME", name: { tr: "Susam", en: "Sesame" } },
];

const LOCAL_STORAGE_KEY_VENUE = "dutt_qr_venue";
const LOCAL_STORAGE_KEY_CATEGORIES = "dutt_qr_categories";
const LOCAL_STORAGE_KEY_PRODUCTS = "dutt_qr_products";
const LOCAL_STORAGE_KEY_FIX_MENUS = "dutt_qr_fix_menus";

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [venue, setVenue] = useState<VenueSettings>(mockVenueSettings);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [allergens] = useState<Allergen[]>(mockAllergensList);
  const [dailyFixMenus, setDailyFixMenus] = useState<DailyFixMenu[]>(mockDailyFixMenus);

  const supabase = createClient();

  // Load from localStorage or Supabase on mount
  useEffect(() => {
    try {
      const savedVenue = localStorage.getItem(LOCAL_STORAGE_KEY_VENUE);
      const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
      const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      const savedFixMenus = localStorage.getItem(LOCAL_STORAGE_KEY_FIX_MENUS);

      if (savedVenue) setVenue(JSON.parse(savedVenue));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedFixMenus) setDailyFixMenus(JSON.parse(savedFixMenus));
    } catch (err) {
      console.warn("Could not parse local storage fallback", err);
    }
  }, []);

  // Compute active Fix Menu for current day of week (00:01 to 23:59)
  const getCurrentDayFixMenu = () => {
    const currentDayOfWeek = new Date().getDay(); // 0: Pazar, 1: Pazartesi, 2: Salı, etc.
    const todayFixMenu = dailyFixMenus.find((m) => m.dayOfWeek === currentDayOfWeek);
    if (todayFixMenu && todayFixMenu.isActive) {
      return todayFixMenu;
    }
    return undefined;
  };

  const persistFixMenus = (updated: DailyFixMenu[]) => {
    setDailyFixMenus(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_FIX_MENUS, JSON.stringify(updated));
  };

  const updateDailyFixMenu = (dayOfWeek: number, data: Partial<DailyFixMenu>) => {
    const updated = dailyFixMenus.map((item) =>
      item.dayOfWeek === dayOfWeek ? { ...item, ...data } : item
    );
    persistFixMenus(updated);
  };

  const persistVenue = (updated: VenueSettings) => {
    setVenue(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_VENUE, JSON.stringify(updated));
  };

  const persistCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
  };

  const persistProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  };

  const updateVenue = (updated: Partial<VenueSettings>) => {
    const next = { ...venue, ...updated };
    persistVenue(next);
  };

  const addProduct = (newProd: Omit<Product, "id">) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    const next = [created, ...products];
    persistProducts(next);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updated } : p));
    persistProducts(next);
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    persistProducts(next);
  };

  const toggleProductAvailability = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (target) {
      updateProduct(id, { isAvailable: !target.isAvailable });
    }
  };

  const addCategory = (newCat: Omit<Category, "id">) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    const next = [...categories, created];
    persistCategories(next);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...updated } : c));
    persistCategories(next);
  };

  const deleteCategory = (id: string) => {
    const next = categories.filter((c) => c.id !== id);
    persistCategories(next);
    setProducts((prev) => prev.filter((p) => p.categoryId !== id));
  };

  return (
    <MenuContext.Provider
      value={{
        venue,
        categories,
        products,
        allergens,
        dailyFixMenus,
        getCurrentDayFixMenu,
        updateDailyFixMenu,
        updateVenue,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
