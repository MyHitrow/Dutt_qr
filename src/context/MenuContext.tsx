"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Product, VenueSettings, Allergen } from "@/types/menu";
import {
  mockVenueSettings,
  mockCategories,
  mockProducts,
} from "@/data/mockMenuData";
import { createClient } from "@/lib/supabase/client";

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

const LOCAL_STORAGE_KEY_VENUE = "dutt_qr_venue";
const LOCAL_STORAGE_KEY_CATEGORIES = "dutt_qr_categories";
const LOCAL_STORAGE_KEY_PRODUCTS = "dutt_qr_products";

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [venue, setVenue] = useState<VenueSettings>(mockVenueSettings);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [allergens] = useState<Allergen[]>(mockAllergensList);
  const [isLoaded, setIsLoaded] = useState(false);

  const supabase = createClient();

  // Load from localStorage or Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Try localStorage first for instant client persistence
        const savedVenue = localStorage.getItem(LOCAL_STORAGE_KEY_VENUE);
        const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
        const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);

        if (savedVenue) setVenue(JSON.parse(savedVenue));
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        if (savedProducts) setProducts(JSON.parse(savedProducts));

        // Fetch live data from Supabase if tables exist
        const { data: dbVenue } = await supabase.from("venue_settings").select("*").maybeSingle();
        if (dbVenue) {
          const loadedVenue: VenueSettings = {
            name: dbVenue.venue_name || mockVenueSettings.name,
            slogan: {
              tr: dbVenue.slogan_tr || mockVenueSettings.slogan.tr,
              en: dbVenue.slogan_en || mockVenueSettings.slogan.en,
            },
            defaultTheme: (dbVenue.default_theme as any) || "dark",
            defaultLanguage: (dbVenue.default_language as any) || "tr",
            currencySymbol: dbVenue.currency_symbol || "₺",
            serviceNotice: {
              tr: dbVenue.service_notice_tr || mockVenueSettings.serviceNotice.tr,
              en: dbVenue.service_notice_en || mockVenueSettings.serviceNotice.en,
            },
          };
          setVenue(loadedVenue);
          localStorage.setItem(LOCAL_STORAGE_KEY_VENUE, JSON.stringify(loadedVenue));
        }

        const { data: dbCategories } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true });

        if (dbCategories && dbCategories.length > 0) {
          const loadedCats: Category[] = dbCategories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: { tr: c.name_tr, en: c.name_en },
            sortOrder: c.sort_order,
            isActive: c.is_active,
          }));
          setCategories(loadedCats);
          localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(loadedCats));
        }

        const { data: dbProducts } = await supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true });

        if (dbProducts && dbProducts.length > 0) {
          const loadedProds: Product[] = dbProducts.map((p) => ({
            id: p.id,
            categoryId: p.category_id,
            name: { tr: p.name_tr, en: p.name_en },
            description: { tr: p.description_tr || "", en: p.description_en || "" },
            price: Number(p.price),
            currency: p.currency || "₺",
            imageUrl: p.image_url || undefined,
            hasImage: p.has_image,
            isAvailable: p.is_available,
            isActive: p.is_active,
            sortOrder: p.sort_order,
            dietary: {
              isVegan: p.is_vegan,
              isVegetarian: p.is_vegetarian,
              isGlutenFree: p.is_gluten_free,
              spicyLevel: p.spicy_level,
            },
            chefNote: p.chef_note_tr ? { tr: p.chef_note_tr, en: p.chef_note_en } : undefined,
            servingSuggestion: p.serving_suggestion_tr
              ? { tr: p.serving_suggestion_tr, en: p.serving_suggestion_en }
              : undefined,
          }));
          setProducts(loadedProds);
          localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(loadedProds));
        }
      } catch (err) {
        console.warn("Could not fetch from Supabase, using local fallback state", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  // Helpers to persist state locally & to Supabase
  const persistVenue = (updated: VenueSettings) => {
    setVenue(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_VENUE, JSON.stringify(updated));
    supabase
      .from("venue_settings")
      .upsert({
        venue_name: updated.name,
        slogan_tr: updated.slogan.tr,
        slogan_en: updated.slogan.en,
        currency_symbol: updated.currencySymbol,
        service_notice_tr: updated.serviceNotice.tr,
        service_notice_en: updated.serviceNotice.en,
      })
      .then();
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

    supabase
      .from("products")
      .insert({
        category_id: created.categoryId,
        name_tr: created.name.tr,
        name_en: created.name.en,
        description_tr: created.description.tr,
        description_en: created.description.en,
        price: created.price,
        currency: created.currency,
        has_image: created.hasImage,
        image_url: created.imageUrl,
        is_available: created.isAvailable,
        is_active: created.isActive,
        is_vegan: created.dietary?.isVegan || false,
        is_vegetarian: created.dietary?.isVegetarian || false,
        is_gluten_free: created.dietary?.isGlutenFree || false,
        spicy_level: created.dietary?.spicyLevel || 0,
        chef_note_tr: created.chefNote?.tr,
        chef_note_en: created.chefNote?.en,
        serving_suggestion_tr: created.servingSuggestion?.tr,
        serving_suggestion_en: created.servingSuggestion?.en,
      })
      .then();
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updated } : p));
    persistProducts(next);

    const target = next.find((p) => p.id === id);
    if (target) {
      supabase
        .from("products")
        .update({
          name_tr: target.name.tr,
          name_en: target.name.en,
          description_tr: target.description.tr,
          description_en: target.description.en,
          price: target.price,
          currency: target.currency,
          has_image: target.hasImage,
          image_url: target.imageUrl,
          is_available: target.isAvailable,
          is_active: target.isActive,
          is_vegan: target.dietary?.isVegan || false,
          is_vegetarian: target.dietary?.isVegetarian || false,
          is_gluten_free: target.dietary?.isGlutenFree || false,
          spicy_level: target.dietary?.spicyLevel || 0,
          chef_note_tr: target.chefNote?.tr,
          chef_note_en: target.chefNote?.en,
          serving_suggestion_tr: target.servingSuggestion?.tr,
          serving_suggestion_en: target.servingSuggestion?.en,
        })
        .eq("id", id)
        .then();
    }
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    persistProducts(next);
    supabase.from("products").delete().eq("id", id).then();
  };

  const toggleProductAvailability = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (target) {
      const updatedAvailability = !target.isAvailable;
      updateProduct(id, { isAvailable: updatedAvailability });
    }
  };

  const addCategory = (newCat: Omit<Category, "id">) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    const next = [...categories, created];
    persistCategories(next);

    supabase
      .from("categories")
      .insert({
        slug: created.slug,
        name_tr: created.name.tr,
        name_en: created.name.en,
        sort_order: created.sortOrder,
        is_active: created.isActive,
      })
      .then();
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...updated } : c));
    persistCategories(next);

    const target = next.find((c) => c.id === id);
    if (target) {
      supabase
        .from("categories")
        .update({
          name_tr: target.name.tr,
          name_en: target.name.en,
          sort_order: target.sortOrder,
          is_active: target.isActive,
        })
        .eq("id", id)
        .then();
    }
  };

  const deleteCategory = (id: string) => {
    const next = categories.filter((c) => c.id !== id);
    persistCategories(next);
    setProducts((prev) => prev.filter((p) => p.categoryId !== id));
    supabase.from("categories").delete().eq("id", id).then();
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
