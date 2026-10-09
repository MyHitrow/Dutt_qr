"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  Product, Category, Allergen, DailyFixMenu, ActiveFilters,
  Language, VenueSettings
} from "@/types/menu";
import {
  mockVenueSettings, mockCategories, mockProducts,
  mockDailyFixMenus, mockAllergensList
} from "@/data/mockMenuData";

interface MenuContextType {
  venue: VenueSettings;
  categories: Category[];
  products: Product[];
  allergens: Allergen[];
  dailyFixMenus: DailyFixMenu[];
  lang: Language;
  setLang: (l: Language) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;

  /* ── Fix Menu ── */
  getCurrentDayFixMenu: () => DailyFixMenu | undefined;
  updateDailyFixMenu: (day: number, data: Partial<DailyFixMenu>) => Promise<boolean>;

  /* ── Venue / Product / Category CRUD ── */
  updateVenue: (v: Partial<VenueSettings>) => Promise<boolean>;
  addProduct: (p: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductAvailability: (id: string) => Promise<boolean>;
  addCategory: (c: Omit<Category, "id">) => Promise<boolean>;
  updateCategory: (id: string, c: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (newCategories: Category[]) => Promise<boolean>;

  /* ── Filtering ── */
  filters: ActiveFilters;
  setFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  filteredProducts: Product[];
  activeFilterCount: number;

  /* ── Reset Cache ── */
  resetAllData: () => void;
}

const LS = {
  VENUE: "dut_v5_venue",
  CATEGORIES: "dut_v5_categories",
  PRODUCTS: "dut_v5_products",
  FIX_MENUS: "dut_v5_fix_menus",
  LANG: "dut_v5_lang",
  THEME: "dut_v5_theme",
};

const defaultFilters: ActiveFilters = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  spicy: false,
  chefRecommended: false,
  popular: false,
  allergens: [],
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<VenueSettings>(mockVenueSettings);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [dailyFixMenus, setDailyFixMenus] = useState<DailyFixMenu[]>(mockDailyFixMenus);
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [lang, setLangState] = useState<Language>("tr");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  const lastLocalSaveTimeRef = useRef<number>(0);
  const serverVersionRef = useRef<string>("");

  const venueRef = useRef(venue);
  venueRef.current = venue;
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;
  const productsRef = useRef(products);
  productsRef.current = products;
  const dailyFixMenusRef = useRef(dailyFixMenus);
  dailyFixMenusRef.current = dailyFixMenus;

  /* ── Server Sync Helper (HTTP POST to DB) ── */
  const syncToServer = async (
    v = venueRef.current,
    c = categoriesRef.current,
    p = productsRef.current,
    fm = dailyFixMenusRef.current
  ): Promise<boolean> => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("dut_admin_token") || sessionStorage.getItem("dut_admin_token")
          : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/sync", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          baseVersion: serverVersionRef.current,
          venue: v,
          categories: c,
          products: p,
          dailyFixMenus: fm,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error("[MenuContext] Sunucu senkronizasyonu başarısız (HTTP", res.status, "):", errJson);
        return false;
      }

      const json = await res.json().catch(() => ({}));
      if (json?.version) {
        serverVersionRef.current = json.version;
      }
      return true;
    } catch (err) {
      console.error("[MenuContext] Senkronizasyon ağ hatası:", err);
      return false;
    }
  };

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[MenuContext] LocalStorage setItem failed for key "${key}" (possibly quota limit):`, e);
  }
};

  /* ── Load from localStorage + Live Real-Time Server Sync with Adaptive Backoff ── */
  useEffect(() => {
    try {
      const sv = localStorage.getItem(LS.VENUE);
      const sc = localStorage.getItem(LS.CATEGORIES);
      const sp = localStorage.getItem(LS.PRODUCTS);
      const sfm = localStorage.getItem(LS.FIX_MENUS);
      const sLang = localStorage.getItem(LS.LANG);
      const sTheme = localStorage.getItem(LS.THEME);
      if (sv) {
        const parsedV = JSON.parse(sv);
        if (parsedV && typeof parsedV === "object") {
          if (!parsedV.license) parsedV.license = {};
          parsedV.license.agencyWhatsapp = "905535891629";
          parsedV.license.agencyPhone = "+90 553 589 16 29";
        }
        setVenue(parsedV);
        venueRef.current = parsedV;
      }
      if (sc) {
        const parsedC = JSON.parse(sc);
        setCategories(parsedC);
        categoriesRef.current = parsedC;
      }
      if (sp) {
        const parsedP: Product[] = JSON.parse(sp);
        setProducts(parsedP);
        productsRef.current = parsedP;
      }
      if (sfm) {
        const parsedFm: DailyFixMenu[] = JSON.parse(sfm);
        setDailyFixMenus(parsedFm);
        dailyFixMenusRef.current = parsedFm;
      }
      if (sLang) setLangState(sLang as Language);
      const t = (sTheme as "dark" | "light") || "dark";
      setThemeState(t);
      document.documentElement.className = t;
    } catch { /* ignore */ }

    // Instant & adaptive periodic live sync from Server Database
    let isSubscribed = true;
    let pollTimer: NodeJS.Timeout | null = null;
    let currentDelay = 45000; // Efficient 45s customer interval (saves mobile battery and data)

    const syncFromDatabase = async () => {
      if (!isSubscribed) return;
      // Skip poll if page is hidden to conserve server resources and mobile battery
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        if (isSubscribed) pollTimer = setTimeout(syncFromDatabase, currentDelay);
        return;
      }
      // If a local edit happened within the last 4 seconds, skip poll to prevent overwrite race condition
      if (Date.now() - lastLocalSaveTimeRef.current < 4000) {
        if (isSubscribed) pollTimer = setTimeout(syncFromDatabase, currentDelay);
        return;
      }

      try {
        const url = serverVersionRef.current
          ? `/api/sync?v=${encodeURIComponent(serverVersionRef.current)}`
          : "/api/sync";
        const headers: Record<string, string> = {};
        if (serverVersionRef.current) {
          headers["If-None-Match"] = `"${serverVersionRef.current}"`;
        }

        const res = await fetch(url, { headers });

        // PERF-001: True HTTP 304 Not Modified — instant return with zero body & zero re-render
        if (res.status === 304) {
          currentDelay = 45000;
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Fallback unchanged check
        if (json?.unchanged) {
          currentDelay = 45000;
          return;
        }

        if (json?.data && isSubscribed) {
          const d = json.data;
          if (json.version) serverVersionRef.current = json.version;

          if (d.venue) {
            venueRef.current = d.venue;
            setVenue(prev => {
              if (JSON.stringify(prev) === JSON.stringify(d.venue)) return prev;
              safeLocalStorageSet(LS.VENUE, JSON.stringify(d.venue));
              return d.venue;
            });
          }
          if (d.categories) {
            categoriesRef.current = d.categories;
            setCategories(prev => {
              if (JSON.stringify(prev) === JSON.stringify(d.categories)) return prev;
              safeLocalStorageSet(LS.CATEGORIES, JSON.stringify(d.categories));
              return d.categories;
            });
          }
          if (d.products) {
            productsRef.current = d.products;
            setProducts(d.products);
            safeLocalStorageSet(LS.PRODUCTS, JSON.stringify(d.products));
          }
          if (d.dailyFixMenus) {
            dailyFixMenusRef.current = d.dailyFixMenus;
            setDailyFixMenus(d.dailyFixMenus);
            safeLocalStorageSet(LS.FIX_MENUS, JSON.stringify(d.dailyFixMenus));
          }
          currentDelay = 45000;
        }
      } catch {
        currentDelay = Math.min(currentDelay * 1.5, 60000);
      } finally {
        if (isSubscribed) {
          pollTimer = setTimeout(syncFromDatabase, currentDelay);
        }
      }
    };

    // Cross-tab real-time sync (updates customer menu tab instantly when admin changes data in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === LS.VENUE) {
          const parsed = JSON.parse(e.newValue);
          setVenue(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
        if (e.key === LS.CATEGORIES) {
          const parsed = JSON.parse(e.newValue);
          setCategories(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
        if (e.key === LS.PRODUCTS) {
          const parsed = JSON.parse(e.newValue);
          setProducts(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
        if (e.key === LS.FIX_MENUS) {
          const parsed = JSON.parse(e.newValue);
          setDailyFixMenus(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
      } catch {}
    };

    // Refresh immediately when tab gains focus/visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncFromDatabase();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    syncFromDatabase();
    return () => {
      isSubscribed = false;
      if (pollTimer) clearTimeout(pollTimer);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    safeLocalStorageSet(LS.THEME, next);
    document.documentElement.className = next;
  };

  /* ── Persist helpers ── */
  const persistVenue = (v: VenueSettings): Promise<boolean> => {
    lastLocalSaveTimeRef.current = Date.now();
    venueRef.current = v;
    setVenue(v);
    safeLocalStorageSet(LS.VENUE, JSON.stringify(v));
    return syncToServer(v, categoriesRef.current, productsRef.current, dailyFixMenusRef.current);
  };
  const persistCategories = (c: Category[]): Promise<boolean> => {
    lastLocalSaveTimeRef.current = Date.now();
    categoriesRef.current = c;
    setCategories(c);
    safeLocalStorageSet(LS.CATEGORIES, JSON.stringify(c));
    return syncToServer(venueRef.current, c, productsRef.current, dailyFixMenusRef.current);
  };
  const persistProducts = (p: Product[]): Promise<boolean> => {
    lastLocalSaveTimeRef.current = Date.now();
    productsRef.current = p;
    setProducts(p);
    safeLocalStorageSet(LS.PRODUCTS, JSON.stringify(p));
    return syncToServer(venueRef.current, categoriesRef.current, p, dailyFixMenusRef.current);
  };
  const persistFixMenus = (fm: DailyFixMenu[]): Promise<boolean> => {
    lastLocalSaveTimeRef.current = Date.now();
    dailyFixMenusRef.current = fm;
    setDailyFixMenus(fm);
    safeLocalStorageSet(LS.FIX_MENUS, JSON.stringify(fm));
    return syncToServer(venueRef.current, categoriesRef.current, productsRef.current, fm);
  };

  const setLang = (l: Language) => { setLangState(l); safeLocalStorageSet(LS.LANG, l); };

  /* ── Fix Menu ── */
  const getCurrentDayFixMenu = () => {
    const day = new Date().getDay();
    return (dailyFixMenusRef.current || dailyFixMenus).find(m => m.dayOfWeek === day && m.isActive);
  };
  const updateDailyFixMenu = (day: number, data: Partial<DailyFixMenu>): Promise<boolean> => {
    const current = dailyFixMenusRef.current || dailyFixMenus;
    const updated = current.map(m => m.dayOfWeek === day ? { ...m, ...data } : m);
    return persistFixMenus(updated);
  };

  /* ── Venue / Product / Category CRUD ── */
  const updateVenue = (v: Partial<VenueSettings>): Promise<boolean> => {
    const current = venueRef.current || venue;
    const updated = { ...current, ...v };
    return persistVenue(updated);
  };

  const addProduct = (p: Omit<Product, "id">): Promise<boolean> => {
    const current = productsRef.current || products;
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = [{ ...p, id: newId }, ...current];
    return persistProducts(updated);
  };

  const updateProduct = (id: string, p: Partial<Product>): Promise<boolean> => {
    const current = productsRef.current || products;
    const updated = current.map(x => x.id === id ? { ...x, ...p } : x);
    return persistProducts(updated);
  };

  const deleteProduct = (id: string): Promise<boolean> => {
    const current = productsRef.current || products;
    const updated = current.filter(x => x.id !== id);
    return persistProducts(updated);
  };

  const toggleProductAvailability = (id: string): Promise<boolean> => {
    const current = productsRef.current || products;
    const t = current.find(x => x.id === id);
    if (t) return updateProduct(id, { isAvailable: !t.isAvailable });
    return Promise.resolve(false);
  };

  const addCategory = (c: Omit<Category, "id">): Promise<boolean> => {
    const current = categoriesRef.current || categories;
    const newId = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = [...current, { ...c, id: newId, sortOrder: current.length + 1 }];
    return persistCategories(updated);
  };

  const updateCategory = (id: string, c: Partial<Category>): Promise<boolean> => {
    const current = categoriesRef.current || categories;
    const updated = current.map(x => x.id === id ? { ...x, ...c } : x);
    return persistCategories(updated);
  };

  const deleteCategory = (id: string): Promise<boolean> => {
    lastLocalSaveTimeRef.current = Date.now();
    const curCats = categoriesRef.current || categories;
    const curProds = productsRef.current || products;
    const newCategories = curCats.filter((x) => x.id !== id);
    const newProducts = curProds.filter((x) => x.categoryId !== id);
    categoriesRef.current = newCategories;
    productsRef.current = newProducts;
    setCategories(newCategories);
    setProducts(newProducts);
    safeLocalStorageSet(LS.CATEGORIES, JSON.stringify(newCategories));
    safeLocalStorageSet(LS.PRODUCTS, JSON.stringify(newProducts));
    return syncToServer(venueRef.current, newCategories, newProducts, dailyFixMenusRef.current);
  };

  const reorderCategories = (newCategories: Category[]): Promise<boolean> => {
    const updated = newCategories.map((c, index) => ({
      ...c,
      sortOrder: index + 1,
    }));
    return persistCategories(updated);
  };

  /* ── Filtered products (with diet/allergen filters) ── */
  const filteredProducts = products.filter(p => {
    if (!p.isActive) return false;
    if (filters.vegetarian && !p.dietary?.isVegetarian && !p.dietary?.isVegan) return false;
    if (filters.vegan && !p.dietary?.isVegan) return false;
    if (filters.glutenFree && !p.dietary?.isGlutenFree) return false;
    if (filters.spicy && !(p.dietary?.spicyLevel && p.dietary.spicyLevel > 0)) return false;
    if (filters.chefRecommended && !p.dietary?.isChefRecommended) return false;
    if (filters.popular && !p.dietary?.isPopular) return false;
    if (filters.allergens.length > 0) {
      const productAllergenCodes = p.allergens?.map(a => a.code) ?? [];
      if (filters.allergens.some(code => productAllergenCodes.includes(code))) return false;
    }
    return true;
  });

  const activeFilterCount = Object.values(filters).reduce((acc, v) => {
    if (Array.isArray(v)) return acc + (v as string[]).length;
    return acc + (v ? 1 : 0);
  }, 0);

  const resetAllData = () => {
    try {
      Object.values(LS).forEach(k => localStorage.removeItem(k));
      ["dut_venue", "dut_categories", "dut_products", "dut_fix_menus"].forEach(k => localStorage.removeItem(k));
    } catch {}
    setVenue(mockVenueSettings);
    setCategories(mockCategories);
    setProducts(mockProducts);
    setDailyFixMenus(mockDailyFixMenus);
    window.location.reload();
  };

  return (
    <MenuContext.Provider value={{
      venue, categories, products, allergens: mockAllergensList, dailyFixMenus, lang, setLang,
      theme, toggleTheme,
      getCurrentDayFixMenu, updateDailyFixMenu, updateVenue,
      addProduct, updateProduct, deleteProduct, toggleProductAvailability,
      addCategory, updateCategory, deleteCategory, reorderCategories,
      filters, setFilters, filteredProducts, activeFilterCount,
      resetAllData,
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
