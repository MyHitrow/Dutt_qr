export type ThemeMode = "dark" | "light";
export type Language = "tr" | "en" | "de" | "ar";
export type OrderStatus = "received" | "preparing" | "ready";

/* ─── Allergen ─── */
export interface Allergen {
  id: string;
  code: string;
  name: { tr: string; en: string; de?: string; ar?: string };
}

/* ─── Dietary ─── */
export interface DietaryInfo {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number; // 0–3
  isChefRecommended?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

/* ─── Customization ─── */
export interface CustomizationChoice {
  id: string;
  label: { tr: string; en: string };
  priceDelta?: number; // positive = extra cost
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  type: "radio" | "checkbox";
  label: { tr: string; en: string };
  choices: CustomizationChoice[];
  required?: boolean;
}

/* ─── Product ─── */
export interface Product {
  id: string;
  categoryId: string;
  name: { tr: string; en: string; de?: string; ar?: string };
  description: { tr: string; en: string; de?: string; ar?: string };
  price: number;
  currency: string;
  imageUrl?: string;
  hasImage: boolean;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  prepTime?: string; // "15–20 min"
  calories?: number; // kcal
  rating?: number; // 4.8
  reviewCount?: number;
  dietary?: DietaryInfo;
  allergens?: Allergen[];
  customizations?: CustomizationGroup[];
  chefNote?: { tr?: string; en?: string };
  servingSuggestion?: { tr?: string; en?: string };
  portion?: { tr?: string; en?: string };
}

/* ─── Cart ─── */
export interface CartCustomization {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceDelta: number;
}

export interface CartItem {
  cartId: string; // unique per line item
  product: Product;
  quantity: number;
  customizations: CartCustomization[];
  specialNote?: string;
  lineTotal: number;
}

/* ─── Order ─── */
export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  serviceFee: number;
  total: number;
  estimatedTime: string;
  createdAt: Date;
}

/* ─── Category ─── */
export interface Category {
  id: string;
  slug: string;
  name: { tr: string; en: string; de?: string; ar?: string };
  description?: { tr: string; en: string };
  sortOrder: number;
  isActive: boolean;
  emoji?: string;
}

/* ─── Daily Fix Menu ─── */
export interface DailyFixMenu {
  dayOfWeek: number;
  dayName: { tr: string; en: string };
  title: { tr: string; en: string };
  subtitle: { tr: string; en: string };
  price: number;
  currency: string;
  imageUrl?: string;
  isActive: boolean;
}

/* ─── Filters ─── */
export interface ActiveFilters {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
  chefRecommended: boolean;
  popular: boolean;
  allergens: string[]; // allergen codes to EXCLUDE
}

/* ─── Venue ─── */
export interface VenueSettings {
  name: string;
  tableNumber?: string;
  slogan: { tr: string; en: string };
  logoUrl?: string;
  isOpen: boolean;
  closingTime?: string; // "23:30"
  defaultTheme: ThemeMode;
  defaultLanguage: Language;
  currencySymbol: string;
  serviceNotice: { tr: string; en: string };
  orderMode: "direct" | "waiter"; // direct = send to kitchen, waiter = show to waiter
  serviceFeePercent?: number;
}
