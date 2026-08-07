import { Category, Product, VenueSettings, DailyFixMenu } from "@/types/menu";

export const mockVenueSettings: VenueSettings = {
  name: "Dutt Meyhane",
  slogan: {
    tr: "Yeni Nesil Meyhane & Gastronomi",
    en: "Modern Tavern & Fine Gastronomy",
  },
  defaultTheme: "dark",
  defaultLanguage: "tr",
  currencySymbol: "₺",
  serviceNotice: {
    tr: "Detaylı içerik, pişirme tercihleri ve alerjen bilgisi için lütfen servis ekibimize danışınız.",
    en: "For detailed ingredients, cooking preferences, and allergen info, please consult our service team.",
  },
};

export const mockDailyFixMenus: DailyFixMenu[] = [
  {
    dayOfWeek: 1, // Pazartesi
    dayName: { tr: "Pazartesi", en: "Monday" },
    title: { tr: "Sendromsuz Pazartesi Fix Menü", en: "No-Blues Monday Fix Menu" },
    subtitle: { tr: "4 Çeşit Soğuk Meze + Ara Sıcak + Ana Yemek + 2 Kadeh İçecek", en: "4 Cold Mezes + Starter + Main + 2 Glasses Drink" },
    price: 1250,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 2, // Salı
    dayName: { tr: "Salı", en: "Tuesday" },
    title: { tr: "Kadınlar Matinesi Özel Fix Menü", en: "Ladies Night Special Fix Menu" },
    subtitle: { tr: "Sınırsız Meze Büfesi + Canlı Müzik + Tatlı & Meyve İkramı", en: "Unlimited Meze + Live Music + Dessert & Fruit Compliments" },
    price: 1450,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 3, // Çarşamba
    dayName: { tr: "Çarşamba", en: "Wednesday" },
    title: { tr: "Ege Lezzetleri & Akustik Gece", en: "Aegean Flavors & Acoustic Night" },
    subtitle: { tr: "Zeytinyağlı Mezeler + Ege Otu Mücveri + Deniz Mahsulleri", en: "Aegean Olive Oil Mezes + Seafood Special" },
    price: 1350,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 4, // Perşembe
    dayName: { tr: "Perşembe", en: "Thursday" },
    title: { tr: "Hafta Ortası Meyhane Keyfi", en: "Midweek Tavern Feast" },
    subtitle: { tr: "Şefin Özel Seçimleri + Sıcak Meze Tabağı + Izgara Balık", en: "Chef Special Selection + Warm Meze Plate + Grilled Fish" },
    price: 1400,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 5, // Cuma
    dayName: { tr: "Cuma", en: "Friday" },
    title: { tr: "Cuma Fasıl & Gala Fix Menü", en: "Friday Classical Fasıl Gala Menu" },
    subtitle: { tr: "Canlı Klasik Fasıl + 6 Çeşit Meze + Ara Sıcaklar + Ana Yemek", en: "Live Fasıl Music + 6 Mezes + Starters + Main Course" },
    price: 1850,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 6, // Cumartesi
    dayName: { tr: "Cumartesi", en: "Saturday" },
    title: { tr: "Cumartesi Yeni Nesil Eğlence Fix Menü", en: "Saturday Modern Tavern Gala Menu" },
    subtitle: { tr: "DJ Performansı + Premium Zengin Menü + Meyve & Şampanya", en: "Live DJ Performance + Premium Full Course Menu" },
    price: 1950,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    dayOfWeek: 0, // Pazar
    dayName: { tr: "Pazar", en: "Sunday" },
    title: { tr: "Pazar Rakı & Dem Akşamı", en: "Sunday Relaxing Raki Evening" },
    subtitle: { tr: "Ağır Ağır Demlenen Soğuk Mezeler + Özel Demleme Rakı Menüsü", en: "Slow Meze Dining + Premium Raki Experience" },
    price: 1300,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
];

export const mockCategories: Category[] = [
  { id: "cat-1", slug: "soguk-mezeler", name: { tr: "Soğuk Mezeler", en: "Cold Mezes" }, sortOrder: 1, isActive: true },
  { id: "cat-2", slug: "sicak-mezeler", name: { tr: "Sıcak Mezeler", en: "Warm Mezes" }, sortOrder: 2, isActive: true },
  { id: "cat-3", slug: "ara-sicaklar", name: { tr: "Ara Sıcaklar", en: "Warm Starters" }, sortOrder: 3, isActive: true },
  { id: "cat-4", slug: "deniz-urunleri", name: { tr: "Deniz Ürünleri", en: "Seafood Main" }, sortOrder: 4, isActive: true },
  { id: "cat-5", slug: "ana-yemekler", name: { tr: "Ana Yemekler", en: "Main Courses" }, sortOrder: 5, isActive: true },
  { id: "cat-6", slug: "tatlilar", name: { tr: "Tatlılar", en: "Desserts" }, sortOrder: 6, isActive: true },
  { id: "cat-7", slug: "rakilar", name: { tr: "Rakılar", en: "Raki Selection" }, sortOrder: 7, isActive: true },
  { id: "cat-8", slug: "saraplar", name: { tr: "Şaraplar", en: "Wines" }, sortOrder: 8, isActive: true },
  { id: "cat-9", slug: "alkolsuz", name: { tr: "Alkolsüz", en: "Non-Alcoholic" }, sortOrder: 9, isActive: true },
];

export const mockProducts: Product[] = [
  {
    id: "prod-101",
    categoryId: "cat-1",
    name: { tr: "Atom & Süzme Yoğurt", en: "Atom & Strained Yogurt" },
    description: {
      tr: "Kurutulmuş acı Arnavut biberi, tereyağında kızdırılmış mor sarımsak ve süzme yoğurt.",
      en: "Dried spicy Albanian pepper, garlic clarified butter and rich strained yogurt."
    },
    price: 240,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
    hasImage: true,
    isAvailable: true,
    isActive: true,
    sortOrder: 1,
    dietary: { isVegetarian: true, spicyLevel: 2 },
    allergens: [{ id: "alg-1", code: "MILK", name: { tr: "Süt ve Süt Ürünleri", en: "Milk & Dairy" } }],
    chefNote: {
      tr: "Biberlerimiz Hatay'dan özel olarak temin edilmektedir.",
      en: "Peppers are specially sourced from Hatay."
    }
  },
  {
    id: "prod-102",
    categoryId: "cat-1",
    name: { tr: "Girit Ezmesi", en: "Cretan Cheese Paste" },
    description: {
      tr: "Ezine peyniri, lor peyniri, antep fıstığı, taze fesleğen ve sızma zeytinyağı.",
      en: "Aged Ezine cheese, curd cheese, pistachio, fresh basil and extra virgin olive oil."
    },
    price: 260,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    hasImage: true,
    isAvailable: true,
    isActive: true,
    sortOrder: 2,
    dietary: { isVegetarian: true, isGlutenFree: true },
    allergens: [
      { id: "alg-1", code: "MILK", name: { tr: "Süt ve Süt Ürünleri", en: "Milk & Dairy" } },
      { id: "alg-2", code: "NUTS", name: { tr: "Kuruyemiş", en: "Nuts" } }
    ]
  },
  {
    id: "prod-103",
    categoryId: "cat-1",
    name: { tr: "Avokadolu Fava", en: "Fava Bean Puree with Avocado" },
    description: {
      tr: "Ege baklası, olgun avokado dilimleri, dereotu, dereotu yağı ve karamelize kırmızı soğan.",
      en: "Broad bean puree, ripe avocado, fresh dill, dill oil and caramelized red onion."
    },
    price: 270,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    hasImage: true,
    isAvailable: true,
    isActive: true,
    sortOrder: 3,
    dietary: { isVegan: true, isVegetarian: true, isGlutenFree: true }
  },
  {
    id: "prod-201",
    categoryId: "cat-3",
    name: { tr: "Tereyağında Karides", en: "Shrimp in Butter & Garlic" },
    description: {
      tr: "Körfez karidesi, sarımsak, pul biber, taze kekik ve sızma tereyağı.",
      en: "Gulf shrimp, garlic, red pepper flakes, fresh thyme and clarified butter."
    },
    price: 490,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    hasImage: true,
    isAvailable: true,
    isActive: true,
    sortOrder: 1,
    allergens: [
      { id: "alg-3", code: "SHELLFISH", name: { tr: "Kabuklu Deniz Ürünleri", en: "Shellfish" } },
      { id: "alg-1", code: "MILK", name: { tr: "Süt ve Süt Ürünleri", en: "Milk & Dairy" } }
    ]
  },
  {
    id: "prod-202",
    categoryId: "cat-3",
    name: { tr: "Ahtapot Izgara", en: "Grilled Octopus" },
    description: {
      tr: "Köz patlıcan yatağında ızgara ızgara Ege ahtapotu, nar ekşili zeytinyağı sos.",
      en: "Grilled Aegean octopus served over smoked eggplant puree with pomegranate reduction."
    },
    price: 680,
    currency: "₺",
    imageUrl: "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80",
    hasImage: true,
    isAvailable: true,
    isActive: true,
    sortOrder: 2,
    chefNote: {
      tr: "Odun ateşinde ağır ağır marine edilerek pişirilmektedir.",
      en: "Slowly marinated and wood-fire grilled."
    }
  },
  {
    id: "prod-301",
    categoryId: "cat-7",
    name: { tr: "Yeni Rakı Giz (50 cl)", en: "Yeni Raki Giz (50 cl)" },
    description: {
      tr: "Meşe fıçılarda dinlendirilmiş özel seri yaş üzüm rakısı.",
      en: "Special oak-barreled fresh grape raki."
    },
    price: 2400,
    currency: "₺",
    hasImage: false,
    isAvailable: true,
    isActive: true,
    sortOrder: 1,
    servingSuggestion: {
      tr: "Karaf ve taze buz ile servis edilir.",
      en: "Served with carafe and fresh ice."
    }
  },
  {
    id: "prod-302",
    categoryId: "cat-7",
    name: { tr: "Beylerbeyi Göbek (70 cl)", en: "Beylerbeyi Gobek (70 cl)" },
    description: {
      tr: "%100 yaş üzüm ve 3 kez distile edilmiş üst segment göbek rakısı.",
      en: "100% fresh grape, triple distilled premium Turkish raki."
    },
    price: 3100,
    currency: "₺",
    hasImage: false,
    isAvailable: true,
    isActive: true,
    sortOrder: 2
  }
];
