import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { mockVenueSettings, mockCategories, mockProducts } from "../src/data/mockMenuData";

const DEFAULT_IMAGE_URL = "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa";

// All 7 days fix menus
const all7DailyFixMenus = [
  {
    dayOfWeek: 1, // Pazartesi
    dayName: { tr: "Pazartesi", en: "Monday" },
    title: { tr: "Pazartesi Fiks Menü", en: "Monday Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + İçecek İkramı.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Drink." },
    price: 1500,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 2, // Salı
    dayName: { tr: "Salı", en: "Tuesday" },
    title: { tr: "Salı Fiks Menü", en: "Tuesday Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + İçecek İkramı.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Drink." },
    price: 1500,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 3, // Çarşamba
    dayName: { tr: "Çarşamba", en: "Wednesday" },
    title: { tr: "Çarşamba Canlı Müzik Fiks Menü", en: "Wednesday Live Music Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Canlı Müzik Gecesi.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Live Music." },
    price: 1650,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 4, // Perşembe
    dayName: { tr: "Perşembe", en: "Thursday" },
    title: { tr: "Perşembe Fiks Menü", en: "Thursday Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Tatlı İkramı.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Dessert." },
    price: 1750,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 5, // Cuma
    dayName: { tr: "Cuma", en: "Friday" },
    title: { tr: "Çok Özel Cuma Fiks Menü", en: "Special Friday Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Şarap veya Rakı + Tatlı.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Spirit + Dessert." },
    price: 1850,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 6, // Cumartesi
    dayName: { tr: "Cumartesi", en: "Saturday" },
    title: { tr: "Görkemli Cumartesi Fiks Menü", en: "Grand Saturday Fix Menu" },
    subtitle: { tr: "5 Çeşit Soğuk Meze + 3 Ara Sıcak + Seçmeli Ana Yemek + Sınırsız İçecek.", en: "5 Cold Mezes + 3 Hot Appetizers + Main Course + Unlimited Drinks." },
    price: 2100,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  },
  {
    dayOfWeek: 0, // Pazar
    dayName: { tr: "Pazar", en: "Sunday" },
    title: { tr: "Pazar Dost Sofrası Fiks Menü", en: "Sunday Family & Friends Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Meyve & Tatlı.", en: "4 Cold Mezes + 2 Hot Appetizers + Main Course + Fruits & Dessert." },
    price: 1600,
    currency: "₺",
    imageUrl: DEFAULT_IMAGE_URL,
    isActive: true
  }
];

// Write updated mockMenuData.ts
const updatedContent = `"use client";
import { Category, Product, DailyFixMenu, VenueSettings, Allergen } from "@/types/menu";

export const DEFAULT_IMAGE_URL = "${DEFAULT_IMAGE_URL}";

export const mockVenueSettings: VenueSettings = ${JSON.stringify(mockVenueSettings, null, 2)};

export const mockCategories: Category[] = ${JSON.stringify(mockCategories, null, 2)};

export const mockProducts: Product[] = ${JSON.stringify(mockProducts, null, 2)};

export const mockDailyFixMenus: DailyFixMenu[] = ${JSON.stringify(all7DailyFixMenus, null, 2)};

export const mockAllergensList: Allergen[] = [
  { id: "alg-gluten", code: "GLUTEN", name: { tr: "Gluten", en: "Gluten" } },
  { id: "alg-dairy", code: "DAIRY", name: { tr: "Süt / Süt Ürünleri", en: "Dairy" } },
  { id: "alg-egg", code: "EGG", name: { tr: "Yumurta", en: "Egg" } },
  { id: "alg-shellfish", code: "SHELLFISH", name: { tr: "Kabuklu Deniz Ürünleri", en: "Shellfish" } },
  { id: "alg-nuts", code: "NUTS", name: { tr: "Kuruyemiş / Fıstık", en: "Nuts" } },
  { id: "alg-fish", code: "FISH", name: { tr: "Balık", en: "Fish" } },
  { id: "alg-sesame", code: "SESAME", name: { tr: "Susam / Tahin", en: "Sesame" } },
];
`;

fs.writeFileSync("src/data/mockMenuData.ts", updatedContent, "utf8");

// Push to Supabase Cloud DB
const env = fs.readFileSync(".env.local", "utf8");
let url = "", key = "";
env.split("\n").forEach(line => {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) url = line.split("=")[1].trim();
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) key = line.split("=")[1].trim();
});

const sb = createClient(url, key);
const VENUE_ROW_ID = "cc890a36-95df-4be5-a4f1-a8110c61047f";

const payload = JSON.stringify({
  venue: mockVenueSettings,
  categories: mockCategories,
  products: mockProducts,
  dailyFixMenus: all7DailyFixMenus
});

sb.from("venue_settings").update({
  service_notice_tr: payload,
  updated_at: new Date().toISOString()
}).eq("id", VENUE_ROW_ID).then(res => {
  console.log("7 Days Fix Menu DB Push Result:", res.status);
});
