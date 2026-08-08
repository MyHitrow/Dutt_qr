"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Category, Product, VenueSettings, Allergen, DailyFixMenu,
  CartItem, CartCustomization, Order, OrderStatus, ActiveFilters, Language,
} from "@/types/menu";
import {
  mockVenueSettings, mockCategories, mockProducts, mockDailyFixMenus,
  mockAllergensList, defaultFilters,
} from "@/data/mockMenuData";

interface MenuContextType {
  /* ─ Data ─ */
  venue: VenueSettings;
  categories: Category[];
  products: Product[];
  allergens: Allergen[];
  dailyFixMenus: DailyFixMenu[];
  lang: Language;
  setLang: (l: Language) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;

  /* ─ Fix Menu ─ */
  getCurrentDayFixMenu: () => DailyFixMenu | undefined;
  updateDailyFixMenu: (dayOfWeek: number, data: Partial<DailyFixMenu>) => void;
  updateVenue: (v: Partial<VenueSettings>) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  /* ─ Filters ─ */
  filters: ActiveFilters;
  setFilters: (f: ActiveFilters) => void;
  filteredProducts: Product[];
  activeFilterCount: number;

  /* ─ Cart ─ */
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  serviceFee: number;
  addToCart: (product: Product, qty: number, customizations: CartCustomization[], note?: string) => void;
  updateCartItemQty: (cartId: string, qty: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;

  /* ─ Order ─ */
  currentOrder: Order | null;
  submitOrder: () => void;
  updateOrderStatus: (status: OrderStatus) => void;
  clearOrder: () => void;

  /* ─ Reset Cache ─ */
  resetAllData: () => void;
}

const LS = {
  VENUE: "dut_v5_venue",
  CATEGORIES: "dut_v5_categories",
  PRODUCTS: "dut_v5_products",
  FIX_MENUS: "dut_v5_fix_menus",
  CART: "dut_v5_cart",
  LANG: "dut_v5_lang",
  THEME: "dut_v5_theme",
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<VenueSettings>(mockVenueSettings);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [dailyFixMenus, setDailyFixMenus] = useState<DailyFixMenu[]>(mockDailyFixMenus);
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [lang, setLangState] = useState<Language>("tr");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  /* ── Server Sync Helper ── */
  const syncToServer = async (v = venue, c = categories, p = products, fm = dailyFixMenus) => {
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venue: v, categories: c, products: p, dailyFixMenus: fm }),
      });
    } catch {}
  };

  /* ── Load from localStorage + Live Real-Time Server Sync (2.5s Polling) ── */
  useEffect(() => {
    try {
      const sv = localStorage.getItem(LS.VENUE);
      const sc = localStorage.getItem(LS.CATEGORIES);
      const sp = localStorage.getItem(LS.PRODUCTS);
      const sfm = localStorage.getItem(LS.FIX_MENUS);
      const sCart = localStorage.getItem(LS.CART);
      const sLang = localStorage.getItem(LS.LANG);
      const sTheme = localStorage.getItem(LS.THEME);
      if (sv)    setVenue(JSON.parse(sv));
      if (sc)    setCategories(JSON.parse(sc));
      if (sp)    setProducts(JSON.parse(sp));
      if (sfm)   setDailyFixMenus(JSON.parse(sfm));
      if (sCart) setCartItems(JSON.parse(sCart));
      if (sLang) setLangState(sLang as Language);
      const t = (sTheme as "dark" | "light") || "dark";
      setThemeState(t);
      document.documentElement.className = t;
    } catch { /* ignore */ }

    // Instant & periodic live sync from Supabase Cloud Database (every 2.5 seconds)
    const syncFromDatabase = () => {
      fetch("/api/sync")
        .then((res) => res.json())
        .then((json) => {
          if (json?.data) {
            const d = json.data;
            if (d.venue) { setVenue(d.venue); localStorage.setItem(LS.VENUE, JSON.stringify(d.venue)); }
            if (d.categories) { setCategories(d.categories); localStorage.setItem(LS.CATEGORIES, JSON.stringify(d.categories)); }
            if (d.products) { setProducts(d.products); localStorage.setItem(LS.PRODUCTS, JSON.stringify(d.products)); }
            if (d.dailyFixMenus) { setDailyFixMenus(d.dailyFixMenus); localStorage.setItem(LS.FIX_MENUS, JSON.stringify(d.dailyFixMenus)); }
          }
        })
        .catch(() => {});
    };

    syncFromDatabase();
    const intervalId = setInterval(syncFromDatabase, 2500);
    return () => clearInterval(intervalId);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    localStorage.setItem(LS.THEME, next);
    document.documentElement.className = next;
  };

  /* ── Persist helpers ── */
  const persistVenue = (v: VenueSettings) => {
    setVenue(v);
    localStorage.setItem(LS.VENUE, JSON.stringify(v));
    syncToServer(v, categories, products, dailyFixMenus);
  };
  const persistCategories = (c: Category[]) => {
    setCategories(c);
    localStorage.setItem(LS.CATEGORIES, JSON.stringify(c));
    syncToServer(venue, c, products, dailyFixMenus);
  };
  const persistProducts = (p: Product[]) => {
    setProducts(p);
    localStorage.setItem(LS.PRODUCTS, JSON.stringify(p));
    syncToServer(venue, categories, p, dailyFixMenus);
  };
  const persistFixMenus = (fm: DailyFixMenu[]) => {
    setDailyFixMenus(fm);
    localStorage.setItem(LS.FIX_MENUS, JSON.stringify(fm));
    syncToServer(venue, categories, products, fm);
  };
  const persistCart = (items: CartItem[]) => { setCartItems(items); localStorage.setItem(LS.CART, JSON.stringify(items)); };

  const setLang = (l: Language) => { setLangState(l); localStorage.setItem(LS.LANG, l); };

  /* ── Fix Menu ── */
  const getCurrentDayFixMenu = () => {
    const day = new Date().getDay();
    return dailyFixMenus.find(m => m.dayOfWeek === day && m.isActive);
  };
  const updateDailyFixMenu = (day: number, data: Partial<DailyFixMenu>) =>
    persistFixMenus(dailyFixMenus.map(m => m.dayOfWeek === day ? { ...m, ...data } : m));

  /* ── Venue / Product / Category CRUD ── */
  const updateVenue = (v: Partial<VenueSettings>) => persistVenue({ ...venue, ...v });
  const addProduct = (p: Omit<Product, "id">) => persistProducts([{ ...p, id: `prod-${Date.now()}` }, ...products]);
  const updateProduct = (id: string, p: Partial<Product>) => persistProducts(products.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProduct = (id: string) => persistProducts(products.filter(x => x.id !== id));
  const toggleProductAvailability = (id: string) => {
    const t = products.find(x => x.id === id);
    if (t) updateProduct(id, { isAvailable: !t.isAvailable });
  };
  const addCategory = (c: Omit<Category, "id">) => persistCategories([...categories, { ...c, id: `cat-${Date.now()}` }]);
  const updateCategory = (id: string, c: Partial<Category>) => persistCategories(categories.map(x => x.id === id ? { ...x, ...c } : x));
  const deleteCategory = (id: string) => { persistCategories(categories.filter(x => x.id !== id)); persistProducts(products.filter(x => x.categoryId !== id)); };

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
    if (Array.isArray(v)) return acc + v.length;
    return acc + (v ? 1 : 0);
  }, 0);

  /* ── Cart ── */
  const calcLineTotal = (product: Product, qty: number, customizations: CartCustomization[]) => {
    const extras = customizations.reduce((s, c) => s + c.priceDelta, 0);
    return (product.price + extras) * qty;
  };

  const addToCart = (product: Product, qty: number, customizations: CartCustomization[], note?: string) => {
    const lineTotal = calcLineTotal(product, qty, customizations);
    const newItem: CartItem = {
      cartId: `cart-${Date.now()}`,
      product,
      quantity: qty,
      customizations,
      specialNote: note,
      lineTotal,
    };
    persistCart([...cartItems, newItem]);
  };

  const updateCartItemQty = (cartId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(cartId); return; }
    persistCart(cartItems.map(i => i.cartId === cartId
      ? { ...i, quantity: qty, lineTotal: calcLineTotal(i.product, qty, i.customizations) }
      : i
    ));
  };

  const removeFromCart = (cartId: string) => persistCart(cartItems.filter(i => i.cartId !== cartId));
  const clearCart = () => persistCart([]);

  const cartCount    = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.lineTotal, 0);
  const serviceFee   = Math.round(cartSubtotal * ((venue.serviceFeePercent ?? 0) / 100));
  const cartTotal    = cartSubtotal + serviceFee;

  /* ── Order ── */
  const submitOrder = () => {
    const order: Order = {
      id: `A${String(Math.floor(Math.random() * 900) + 100)}`,
      tableNumber: venue.tableNumber ?? "1",
      items: [...cartItems],
      status: "received",
      subtotal: cartSubtotal,
      serviceFee,
      total: cartTotal,
      estimatedTime: "20–25 dak",
      createdAt: new Date(),
    };
    setCurrentOrder(order);
    clearCart();
  };

  const updateOrderStatus = (status: OrderStatus) => {
    if (currentOrder) setCurrentOrder({ ...currentOrder, status });
  };

  const clearOrder = () => setCurrentOrder(null);

  const resetAllData = () => {
    try {
      fetch("/api/sync", { method: "DELETE" }).catch(() => {});
      Object.values(LS).forEach(k => localStorage.removeItem(k));
      // Also clear old legacy keys
      ["dut_venue", "dut_categories", "dut_products", "dut_fix_menus", "dut_cart"].forEach(k => localStorage.removeItem(k));
    } catch {}
    setVenue(mockVenueSettings);
    setCategories(mockCategories);
    setProducts(mockProducts);
    setDailyFixMenus(mockDailyFixMenus);
    setCartItems([]);
    window.location.reload();
  };

  return (
    <MenuContext.Provider value={{
      venue, categories, products, allergens: mockAllergensList, dailyFixMenus, lang, setLang,
      theme, toggleTheme,
      getCurrentDayFixMenu, updateDailyFixMenu, updateVenue,
      addProduct, updateProduct, deleteProduct, toggleProductAvailability,
      addCategory, updateCategory, deleteCategory,
      filters, setFilters, filteredProducts, activeFilterCount,
      cartItems, cartCount, cartSubtotal, cartTotal, serviceFee,
      addToCart, updateCartItemQty, removeFromCart, clearCart,
      currentOrder, submitOrder, updateOrderStatus, clearOrder,
      resetAllData,
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
};
