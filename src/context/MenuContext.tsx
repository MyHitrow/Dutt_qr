"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Product, VenueSettings, Allergen } from "@/types/menu";
import {
  mockVenueSettings,
  mockCategories,
  mockProducts,
} from "@/data/mockMenuData";

interface MenuContextType {
  venue: VenueSettings;
  categories: Category[];
  products: Product[];
  allergens: Allergen[];
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

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [venue, setVenue] = useState<VenueSettings>(mockVenueSettings);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [allergens] = useState<Allergen[]>(mockAllergensList);

  const updateVenue = (updated: Partial<VenueSettings>) => {
    setVenue((prev) => ({ ...prev, ...updated }));
  };

  const addProduct = (newProd: Omit<Product, "id">) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const addCategory = (newCat: Omit<Category, "id">) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, created]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Also remove or detach products in this category
    setProducts((prev) => prev.filter((p) => p.categoryId !== id));
  };

  return (
    <MenuContext.Provider
      value={{
        venue,
        categories,
        products,
        allergens,
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
