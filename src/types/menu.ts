export type ThemeMode = "dark" | "light";
export type Language = "tr" | "en";

export interface Allergen {
  id: string;
  code: string;
  name: {
    tr: string;
    en: string;
  };
  iconName?: string;
}

export interface DietaryInfo {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number; // 0: None, 1: Mild, 2: Spicy, 3: Hot
}

export interface Product {
  id: string;
  categoryId: string;
  name: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  price: number;
  currency: string;
  imageUrl?: string;
  hasImage: boolean;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  dietary?: DietaryInfo;
  allergens?: Allergen[];
  chefNote?: {
    tr?: string;
    en?: string;
  };
  servingSuggestion?: {
    tr?: string;
    en?: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: {
    tr: string;
    en: string;
  };
  sortOrder: number;
  isActive: boolean;
  iconName?: string;
}

export interface DailyFixMenu {
  dayOfWeek: number; // 0: Pazar, 1: Pazartesi, 2: Salı, 3: Çarşamba, 4: Perşembe, 5: Cuma, 6: Cumartesi
  dayName: {
    tr: string;
    en: string;
  };
  title: {
    tr: string;
    en: string;
  };
  subtitle: {
    tr: string;
    en: string;
  };
  price: number;
  currency: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface VenueSettings {
  name: string;
  slogan: {
    tr: string;
    en: string;
  };
  logoUrl?: string;
  defaultTheme: ThemeMode;
  defaultLanguage: Language;
  currencySymbol: string;
  serviceNotice: {
    tr: string;
    en: string;
  };
}
