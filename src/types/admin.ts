import { Product, Category, VenueSettings } from "./menu";

export type AdminTab = "products" | "categories" | "allergens" | "settings";

export interface ProductFormData {
  id?: string;
  categoryId: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  imageUrl?: string;
  hasImage: boolean;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number;
  chefNoteTr?: string;
  chefNoteEn?: string;
  servingSuggestionTr?: string;
  servingSuggestionEn?: string;
  allergenIds?: string[];
}

export interface CategoryFormData {
  id?: string;
  slug: string;
  nameTr: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}
