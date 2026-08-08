"use client";
import { Category, Product, DailyFixMenu, VenueSettings, Allergen } from "@/types/menu";

export const DEFAULT_IMAGE_URL = "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa";

export const mockVenueSettings: VenueSettings = {
  "name": "Dutt Meyhane",
  "slogan": {
    "tr": "Modern Meyhane & Lezzet Deneyimi",
    "en": "Modern Meze & Spirits Experience"
  },
  "isOpen": true,
  "closingTime": "02:00",
  "defaultTheme": "dark",
  "defaultLanguage": "tr",
  "currencySymbol": "₺",
  "serviceNotice": {
    "tr": "Ürünlerimize KDV dahildir. Alerjen ve özel pişirme tercihleriniz için lütfen servis ekibimize bilgi veriniz.",
    "en": "VAT included. Please inform our service team regarding any dietary restrictions or food allergies."
  },
  "orderMode": "waiter",
  "serviceFeePercent": 10
};

export const mockCategories: Category[] = [
  {
    "id": "cat-soguk",
    "slug": "soguk-baslangiclar",
    "name": {
      "tr": "Soğuk Başlangıçlar",
      "en": "Cold Starters"
    },
    "sortOrder": 1,
    "isActive": true
  },
  {
    "id": "cat-sicak",
    "slug": "ara-sicaklar",
    "name": {
      "tr": "Ara Sıcaklar",
      "en": "Hot Appetizers"
    },
    "sortOrder": 2,
    "isActive": true
  },
  {
    "id": "cat-salata",
    "slug": "salatalar",
    "name": {
      "tr": "Salatalar",
      "en": "Salads"
    },
    "sortOrder": 3,
    "isActive": true
  },
  {
    "id": "cat-anayemek",
    "slug": "ana-yemekler",
    "name": {
      "tr": "Ana Yemekler",
      "en": "Main Courses"
    },
    "sortOrder": 4,
    "isActive": true
  },
  {
    "id": "cat-bira",
    "slug": "biralar",
    "name": {
      "tr": "Biralar",
      "en": "Beers"
    },
    "sortOrder": 5,
    "isActive": true
  },
  {
    "id": "cat-kirmizi-sarap",
    "slug": "kirmizi-saraplar",
    "name": {
      "tr": "Kırmızı Şaraplar",
      "en": "Red Wines"
    },
    "sortOrder": 6,
    "isActive": true
  },
  {
    "id": "cat-beyaz-sarap",
    "slug": "beyaz-saraplar",
    "name": {
      "tr": "Beyaz Şaraplar",
      "en": "White Wines"
    },
    "sortOrder": 7,
    "isActive": true
  },
  {
    "id": "cat-rose-sarap",
    "slug": "rose-saraplar",
    "name": {
      "tr": "Rosé Şaraplar",
      "en": "Rosé Wines"
    },
    "sortOrder": 8,
    "isActive": true
  },
  {
    "id": "cat-sampanya",
    "slug": "sampanyalar",
    "name": {
      "tr": "Şampanyalar & Prosecco",
      "en": "Champagne & Prosecco"
    },
    "sortOrder": 9,
    "isActive": true
  },
  {
    "id": "cat-raki",
    "slug": "rakilar",
    "name": {
      "tr": "Rakılar",
      "en": "Raki"
    },
    "sortOrder": 10,
    "isActive": true
  },
  {
    "id": "cat-viski",
    "slug": "viskiler",
    "name": {
      "tr": "Viskiler",
      "en": "Whiskies"
    },
    "sortOrder": 11,
    "isActive": true
  },
  {
    "id": "cat-gin",
    "slug": "cinler",
    "name": {
      "tr": "Cinler",
      "en": "Gins"
    },
    "sortOrder": 12,
    "isActive": true
  },
  {
    "id": "cat-votka",
    "slug": "votkalar",
    "name": {
      "tr": "Votkalar",
      "en": "Vodkas"
    },
    "sortOrder": 13,
    "isActive": true
  },
  {
    "id": "cat-likor",
    "slug": "likorler",
    "name": {
      "tr": "Likörler",
      "en": "Liqueurs"
    },
    "sortOrder": 14,
    "isActive": true
  },
  {
    "id": "cat-shot",
    "slug": "shotlar",
    "name": {
      "tr": "Shotlar",
      "en": "Shots"
    },
    "sortOrder": 15,
    "isActive": true
  }
];

export const mockProducts: Product[] = [
  {
    "id": "p-soguk-1",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Hatay Zeytini",
      "en": "Hatay Olives"
    },
    "description": {
      "tr": "Kırmataş Antakya halhalı yeşil zeytini, ev yapımı nar ekşisi, sızma zeytinyağı ve taze zahter.",
      "en": "Cracked Antakya halhali green olives, homemade pomegranate molasses, extra virgin olive oil and wild thyme."
    },
    "price": 200,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "prepTime": "Hazır",
    "calories": 180,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "servingSuggestion": {
      "tr": "Taze sıcak lavaj ve tulum peyniri ile servis edilir.",
      "en": "Served with warm flatbread."
    }
  },
  {
    "id": "p-soguk-2",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Humus",
      "en": "Hummus"
    },
    "description": {
      "tr": "Geleneksel Hatay usulü ılık tahinli nohut püre mezesi, sızma zeytinyağı ve çam fıstığı ile.",
      "en": "Traditional Hatay-style warm creamy chickpea purée with tahini, olive oil and pine nuts."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "prepTime": "Hazır",
    "calories": 290,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true,
      "isChefRecommended": true
    },
    "allergens": [
      {
        "id": "alg-sesame",
        "code": "SESAME",
        "name": {
          "tr": "Susam / Tahin",
          "en": "Sesame"
        }
      }
    ]
  },
  {
    "id": "p-soguk-3",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Babagannuş",
      "en": "Babagannoush"
    },
    "description": {
      "tr": "Közlenmiş köz patlıcan, kapya biber, sarımsak, sızma zeytinyağı ve taze nar taneleri.",
      "en": "Smoked roasted eggplant, red peppers, garlic, olive oil and fresh pomegranate seeds."
    },
    "price": 220,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "prepTime": "Hazır",
    "calories": 160,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-soguk-4",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Maydanoz Tarator",
      "en": "Parsley Tarator"
    },
    "description": {
      "tr": "İnce kıyım taze maydanoz, süzme yoğurt, sarımsak, taze ceviz içi ve özel zeytinyağı marinesi.",
      "en": "Fine chopped fresh parsley, strained yogurt, garlic, walnuts and olive oil marinade."
    },
    "price": 230,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "prepTime": "Hazır",
    "calories": 210,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      },
      {
        "id": "alg-nuts",
        "code": "NUTS",
        "name": {
          "tr": "Kuruyemiş / Ceviz",
          "en": "Nuts"
        }
      }
    ]
  },
  {
    "id": "p-soguk-5",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Atom",
      "en": "Atom (Spicy Yogurt)"
    },
    "description": {
      "tr": "Yoğun süzme yoğurt üzerinde tereyağında cızırdayarak kızdırılmış acı kurutulmuş Arnavut biberi.",
      "en": "Thick strained yogurt topped with sizzling hot dried Albanian peppers in melted butter."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "prepTime": "Hazır",
    "calories": 240,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true,
      "spicyLevel": 3,
      "isPopular": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-soguk-6",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Kuru Cacık",
      "en": "Strained Yogurt Cacik"
    },
    "description": {
      "tr": "Süzme yoğurt, taze küp salatalık, taze nane, sarımsak ve sızma zeytinyağı gezdirilerek.",
      "en": "Strained yogurt with diced cucumber, fresh mint, garlic and drizzled extra virgin olive oil."
    },
    "price": 220,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6,
    "prepTime": "Hazır",
    "calories": 170,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-soguk-7",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Kaya Koruğu",
      "en": "Rock Samphire Pickle"
    },
    "description": {
      "tr": "Ege kıyılarından toplanan kaya koruğu salamurası, sızma zeytinyağı ve sarımsak marine.",
      "en": "Wild coastal rock samphire pickle dressed in extra virgin olive oil and garlic."
    },
    "price": 220,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 7,
    "prepTime": "Hazır",
    "calories": 130,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-soguk-8",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Peynir Tabağı",
      "en": "Artisanal Cheese Board"
    },
    "description": {
      "tr": "Tam yağlı olgunlaştırılmış Ezine peyniri, Hatay tulumu, ceviz içi ve taze incir reçeli.",
      "en": "Aged Ezine full-fat white cheese, Hatay tulum cheese, walnuts and fig jam."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 8,
    "prepTime": "Hazır",
    "calories": 320,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true,
      "isChefRecommended": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      },
      {
        "id": "alg-nuts",
        "code": "NUTS",
        "name": {
          "tr": "Kuruyemiş",
          "en": "Nuts"
        }
      }
    ]
  },
  {
    "id": "p-soguk-9",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Hatay Zeytin Salatası",
      "en": "Hatay Green Olive Salad"
    },
    "description": {
      "tr": "Kırma yeşil zeytin, taze nar taneleri, taze ceviz içi, nane, nar ekşisi ve sızma zeytinyağı.",
      "en": "Cracked green olives, pomegranate seeds, walnuts, fresh mint and pomegranate glaze."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 9,
    "prepTime": "Hazır",
    "calories": 220,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-nuts",
        "code": "NUTS",
        "name": {
          "tr": "Kuruyemiş / Ceviz",
          "en": "Nuts"
        }
      }
    ]
  },
  {
    "id": "p-soguk-10",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Haydari",
      "en": "Traditional Haydari"
    },
    "description": {
      "tr": "Süzme yoğurt, taze dereotu, kuru nane, Ezine peyniri rendesi ve tereyağı marinesi.",
      "en": "Strained yogurt, fresh dill, dried mint, grated Ezine cheese and melted butter infusion."
    },
    "price": 220,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 10,
    "prepTime": "Hazır",
    "calories": 190,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-soguk-11",
    "categoryId": "cat-soguk",
    "name": {
      "tr": "Prenses",
      "en": "Prenses Meze"
    },
    "description": {
      "tr": "Dutt şefine özel gizli baharat harçlı gurme süzme yoğurt ve kıyılmış ceviz mezesi.",
      "en": "Chef special spiced strained yogurt dip with finely chopped walnuts."
    },
    "price": 200,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 11,
    "prepTime": "Hazır",
    "calories": 200,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-sicak-1",
    "categoryId": "cat-sicak",
    "name": {
      "tr": "Ali Nazik (Ara Sıcak)",
      "en": "Ali Nazik (Appetizer)"
    },
    "description": {
      "tr": "Közlenmiş patlıcanlı süzme yoğurt yatağında tereyağlı sotelenmiş yumuşacık kuzu eti.",
      "en": "Sautéed tender lamb pieces served over a bed of warm smoked eggplant yogurt purée."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "prepTime": "12–15 dak",
    "calories": 420,
    "dietary": {
      "isChefRecommended": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ],
    "chefNote": {
      "tr": "Sıcak toprak güveçte ikram edilir.",
      "en": "Served sizzling hot in an earthenware dish."
    }
  },
  {
    "id": "p-sicak-2",
    "categoryId": "cat-sicak",
    "name": {
      "tr": "Karides Güveç",
      "en": "Shrimp Casserole"
    },
    "description": {
      "tr": "Toprak güveçte tereyağı, sarımsak, pul biber, mantar ve erimiş kaşar peynirli taze karides.",
      "en": "Fresh shrimp sautéed with butter, garlic, mushrooms and melted kashar cheese in a clay casserole."
    },
    "price": 800,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "prepTime": "15 dak",
    "calories": 480,
    "dietary": {
      "isPopular": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-shellfish",
        "code": "SHELLFISH",
        "name": {
          "tr": "Kabuklu Deniz Ürünleri",
          "en": "Shellfish"
        }
      },
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-sicak-3",
    "categoryId": "cat-sicak",
    "name": {
      "tr": "Köylü Patates",
      "en": "Country Style Fries"
    },
    "description": {
      "tr": "El kesimi baharatlı taze patates kızartması, özel baharat çeşnisi ve ev yapımı sos ile.",
      "en": "Hand-cut rustic fries seasoned with herbs and served with house sauce."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "prepTime": "10 dak",
    "calories": 380,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-sicak-4",
    "categoryId": "cat-sicak",
    "name": {
      "tr": "Sigara Böreği",
      "en": "Crispy Cheese Rolls"
    },
    "description": {
      "tr": "El açması çıtır yufka içerisinde Ezine peyniri ve ince kıyım maydanoz dolgusu.",
      "en": "Crispy filo pastry rolls filled with Ezine white cheese and fresh parsley."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "prepTime": "10 dak",
    "calories": 310,
    "dietary": {
      "isVegetarian": true
    },
    "allergens": [
      {
        "id": "alg-gluten",
        "code": "GLUTEN",
        "name": {
          "tr": "Gluten",
          "en": "Gluten"
        }
      },
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-sicak-5",
    "categoryId": "cat-sicak",
    "name": {
      "tr": "Kalamar Tava",
      "en": "Crispy Fried Calamari"
    },
    "description": {
      "tr": "Özel pane harcında gevrek kızartılmış Ege kalamarı, taze yapım tarator sos eşliğinde.",
      "en": "Golden crispy fried Aegean squid served with house tarator dipping sauce."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "prepTime": "15 dak",
    "calories": 450,
    "dietary": {
      "isChefRecommended": true,
      "isPopular": true
    },
    "allergens": [
      {
        "id": "alg-shellfish",
        "code": "SHELLFISH",
        "name": {
          "tr": "Kalamar / Deniz Ürünleri",
          "en": "Molluscs"
        }
      },
      {
        "id": "alg-gluten",
        "code": "GLUTEN",
        "name": {
          "tr": "Gluten",
          "en": "Gluten"
        }
      }
    ]
  },
  {
    "id": "p-salata-1",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Mevsim Salata",
      "en": "Garden Fresh Season Salad"
    },
    "description": {
      "tr": "Taze kıvırcık, Ege rokası, havuç rendesi, mor lahana, mısır, sızma zeytinyağı ve limon sos.",
      "en": "Crisp garden greens, arugula, shredded carrots, red cabbage, corn, extra virgin olive oil and lemon dressing."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "prepTime": "8 dak",
    "calories": 140,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-salata-2",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Hellimli Yeşil Salata",
      "en": "Grilled Halloumi Salad"
    },
    "description": {
      "tr": "Izgara Kıbrıs hellim peyniri, taze akdeniz yeşillikleri, taze ceviz içi ve nar ekşisi sos.",
      "en": "Seared halloumi cheese on fresh Mediterranean greens, walnuts and pomegranate dressing."
    },
    "price": 250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "prepTime": "10 dak",
    "calories": 320,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      },
      {
        "id": "alg-nuts",
        "code": "NUTS",
        "name": {
          "tr": "Kuruyemiş / Ceviz",
          "en": "Nuts"
        }
      }
    ]
  },
  {
    "id": "p-salata-3",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Roka Salatası",
      "en": "Wild Arugula Salad"
    },
    "description": {
      "tr": "Taze körpe Ege rokası, parmesan peyniri yaprakları, ceviz içi, kurutulmuş domates ve balsamic sos.",
      "en": "Wild baby arugula, aged parmesan shavings, walnuts, sun-dried tomatoes and balsamic reduction."
    },
    "price": 300,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "prepTime": "8 dak",
    "calories": 220,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-salata-4",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Fettüş Salata",
      "en": "Fattoush Salad"
    },
    "description": {
      "tr": "Çıtır pita ekmekleri, sumak, taze nane, salatalık, domates, nar ekşisi ve sızma zeytinyağı sosu.",
      "en": "Crispy pita chips, sumac, fresh mint, cucumber, tomato and tangy pomegranate vinaigrette."
    },
    "price": 300,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "prepTime": "10 dak",
    "calories": 260,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true
    },
    "allergens": [
      {
        "id": "alg-gluten",
        "code": "GLUTEN",
        "name": {
          "tr": "Gluten",
          "en": "Gluten"
        }
      }
    ]
  },
  {
    "id": "p-salata-5",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Gavurdağı Salatası",
      "en": "Gavurdagi Walnut Salad"
    },
    "description": {
      "tr": "İnce kıyım domates, salatalık, yeşil biber, bol ceviz içi, nar ekşisi ve sızma zeytinyağı.",
      "en": "Finely diced tomatoes, cucumbers, green peppers, loads of walnuts, pomegranate molasses and olive oil."
    },
    "price": 350,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "prepTime": "10 dak",
    "calories": 290,
    "dietary": {
      "isVegan": true,
      "isVegetarian": true,
      "isGlutenFree": true,
      "isChefRecommended": true
    },
    "allergens": [
      {
        "id": "alg-nuts",
        "code": "NUTS",
        "name": {
          "tr": "Kuruyemiş / Ceviz",
          "en": "Nuts"
        }
      }
    ]
  },
  {
    "id": "p-salata-6",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Peynirli İnce Kıyım",
      "en": "Shredded Greens & Cheese Salad"
    },
    "description": {
      "tr": "İncecik kıyılmış mevsim yeşillikleri, bol rendelenmiş Ezine peyniri, sızma zeytinyağı ve limon.",
      "en": "Finely shredded seasonal greens topped with generous grated Ezine white cheese and lemon-olive oil dressing."
    },
    "price": 350,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6,
    "prepTime": "8 dak",
    "calories": 210,
    "dietary": {
      "isVegetarian": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-salata-7",
    "categoryId": "cat-salata",
    "name": {
      "tr": "Dutt Soslu Tavuk Salata",
      "en": "Dutt Special Chicken Salad"
    },
    "description": {
      "tr": "Izgara tavuk bonfile dilimleri, özel Dutt şef sosu, taze avokado, Akdeniz yeşilliği ve çıtır kruton.",
      "en": "Grilled chicken tenderloins, signature Dutt chef dressing, fresh avocado, greens and crunchy croutons."
    },
    "price": 500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 7,
    "prepTime": "12 dak",
    "calories": 420,
    "dietary": {
      "isPopular": true,
      "isChefRecommended": true
    }
  },
  {
    "id": "p-ana-1",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Ali Nazik (Ana Yemek)",
      "en": "Ali Nazik Kebab (Main)"
    },
    "description": {
      "tr": "Köz Patlıcanlı süzme yoğurt püre yatağında cömert porsiyon özel marine sote et ve tereyağı cızırtısı.",
      "en": "Generous portion of tender sautéed beef served over smoky eggplant yogurt purée with browned butter."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "prepTime": "15–20 dak",
    "calories": 580,
    "dietary": {
      "isChefRecommended": true,
      "isGlutenFree": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-ana-2",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Tavuk Şiş",
      "en": "Grilled Chicken Skewers"
    },
    "description": {
      "tr": "Özel yoğurtlu baharat marinesi ile odun ateşinde ızgara edilmiş tavuk göğsü şişler, köz biber ile.",
      "en": "Tender yogurt-spiced marinated chicken breast skewers grilled over wood charcoal, served with roasted vegetables."
    },
    "price": 700,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "prepTime": "15–20 dak",
    "calories": 520,
    "dietary": {
      "isGlutenFree": true
    }
  },
  {
    "id": "p-ana-3",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Barbekü Soslu Tavuk",
      "en": "BBQ Glazed Chicken"
    },
    "description": {
      "tr": "Döküm tavada özel barbekü glaze soslu tavuk bonfile, fırınlanmış patates ve köz biber ile.",
      "en": "Cast-iron seared chicken breast glazed with smoky BBQ sauce, served with roasted potatoes."
    },
    "price": 750,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "prepTime": "15–20 dak",
    "calories": 590
  },
  {
    "id": "p-ana-4",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Et Güveç",
      "en": "Slow Cooked Beef Stew"
    },
    "description": {
      "tr": "Ağır ateşte güveçte fırınlanmış dana kuşbaşı et, arpacık soğan, sarımsak, domates ve taze kekik.",
      "en": "Slow-baked beef casserole cooked in a clay pot with shallots, garlic, tomatoes and wild thyme."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "prepTime": "20 dak",
    "calories": 640,
    "dietary": {
      "isGlutenFree": true,
      "isPopular": true
    }
  },
  {
    "id": "p-ana-5",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Kasap Köfte",
      "en": "Traditional Butcher Meatballs"
    },
    "description": {
      "tr": "Geleneksel lezzet; %100 dana kıymasından kasap köftesi, lavaş, köz biber ve domates eşliğinde.",
      "en": "Hand-shaped 100% prime beef butcher meatballs grilled over charcoal, served with lavash and roasted peppers."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "prepTime": "15 dak",
    "calories": 590
  },
  {
    "id": "p-ana-6",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Kebap",
      "en": "Adana / Urfa Style Kebab"
    },
    "description": {
      "tr": "Özel zırh kıymasından Adana/Urfa usulü zırh kebabı, tırnak pide, sumaklı soğan ve köz biber ile.",
      "en": "Hand-minced spiced beef kebab grilled on wide skewers over charcoal flame, served with flatbread."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6,
    "prepTime": "15–20 dak",
    "calories": 650,
    "dietary": {
      "isChefRecommended": true,
      "spicyLevel": 1
    }
  },
  {
    "id": "p-ana-7",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Yoğurtlu Kebap",
      "en": "Yogurt Kebab"
    },
    "description": {
      "tr": "Közlenmiş tırnak pide üzerine zırh kebabı, özel domates sosu, süzme yoğurt ve cızırdayan tereyağı.",
      "en": "Charcoal grilled kebab layered over warm diced flatbread with rich tomato reduction, cool yogurt and sizzling butter."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 7,
    "prepTime": "15–20 dak",
    "calories": 780,
    "dietary": {
      "isPopular": true
    },
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ]
  },
  {
    "id": "p-ana-8",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Dutt S.P.S",
      "en": "Dutt S.P.S Signature Dish"
    },
    "description": {
      "tr": "Dutt Meyhane imza tabağı: Şefin özel marine et karışımı, patates ve özel sos kompozisyonu.",
      "en": "Dutt House Speciality: Chef's signature secret marinated cut of beef, roasted potatoes and house sauce."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 8,
    "prepTime": "20 dak",
    "calories": 710,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-ana-9",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Izgara Kuşbaşı",
      "en": "Charcoal Skewered Beef Cubes"
    },
    "description": {
      "tr": "Odun ateşinde ızgara edilmiş yumuşacık dana kuşbaşı şişler, közlenmiş garnitürler ile.",
      "en": "Tender prime beef tenderloin cubes grilled over charcoal embers, served with roasted tomatoes and peppers."
    },
    "price": 900,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 9,
    "prepTime": "18 dak",
    "calories": 580,
    "dietary": {
      "isGlutenFree": true
    }
  },
  {
    "id": "p-ana-10",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Lokum Izgara",
      "en": "Beef Tenderloin Lokum Steak"
    },
    "description": {
      "tr": "Marine edilmiş pamuk gibi dana bonfile dilimleri, kekikli tereyağı sosu ve patates püresi ile.",
      "en": "Melt-in-your-mouth sliced beef tenderloin medallions seared with thyme butter, served with mashed potatoes."
    },
    "price": 1000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 10,
    "prepTime": "18–20 dak",
    "calories": 620,
    "dietary": {
      "isChefRecommended": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-ana-11",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Kuzu Pirzola",
      "en": "Grilled Lamb Chops"
    },
    "description": {
      "tr": "Taze kekik ve sarımsak ile marine edilmiş ızgara süt kuzu pirzolalar, köz sebzeler eşliğinde.",
      "en": "Charcoal-grilled milk-fed lamb chops marinated with wild thyme and garlic, served with grilled vegetables."
    },
    "price": 1000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 11,
    "prepTime": "20 dak",
    "calories": 680,
    "dietary": {
      "isChefRecommended": true,
      "isGlutenFree": true
    }
  },
  {
    "id": "p-ana-12",
    "categoryId": "cat-anayemek",
    "name": {
      "tr": "Karışık Izgara",
      "en": "Master Mixed Grill Feast"
    },
    "description": {
      "tr": "Şefin zengin ızgara tabağı: Kasap köfte, tavuk şiş, ızgara kuşbaşı, kuzu pirzola ve kebap.",
      "en": "Grand butcher platter: Butcher meatballs, chicken skewers, beef cubes, lamb chop and Adana kebab."
    },
    "price": 1600,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 12,
    "prepTime": "25 dak",
    "calories": 1100,
    "dietary": {
      "isChefRecommended": true,
      "isPopular": true
    }
  },
  {
    "id": "p-bira-1",
    "categoryId": "cat-bira",
    "name": {
      "tr": "Tuborg Gold",
      "en": "Tuborg Gold Beer"
    },
    "description": {
      "tr": "%100 malt soğuk servis 50 cl bira.",
      "en": "100% malt premium cold served 50 cl beer."
    },
    "price": 300,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "p-bira-2",
    "categoryId": "cat-bira",
    "name": {
      "tr": "Carlsberg (50 cl)",
      "en": "Carlsberg Beer (50 cl)"
    },
    "description": {
      "tr": "Danimarka usulü soğuk servis 50 cl premium pilsner.",
      "en": "Danish cold served 50 cl premium pilsner beer."
    },
    "price": 300,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "p-ksarap-1",
    "categoryId": "cat-kirmizi-sarap",
    "name": {
      "tr": "Kırmızı Şarap (Kadeh)",
      "en": "House Red Wine (Glass)"
    },
    "description": {
      "tr": "Ege bağlarından seçme kırmızı kadeh şarap.",
      "en": "Selected house red wine served by glass."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "p-ksarap-2",
    "categoryId": "cat-kirmizi-sarap",
    "name": {
      "tr": "Angora (35 cl)",
      "en": "Angora Red Wine (35 cl)"
    },
    "description": {
      "tr": "Meyvemsi aromalı 35 cl sek kırmızı şarap.",
      "en": "Fruity medium bodied red wine 35 cl bottle."
    },
    "price": 1250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "p-ksarap-3",
    "categoryId": "cat-kirmizi-sarap",
    "name": {
      "tr": "Sarafin Cabernet Sauvignon (70 cl)",
      "en": "Sarafin Cabernet Sauvignon (70 cl)"
    },
    "description": {
      "tr": "Fransız meşe fıçılarda olgunlaşmış 70 cl özel dolum sek kırmızı şarap.",
      "en": "Oak aged premium full bodied Cabernet Sauvignon 70 cl bottle."
    },
    "price": 4000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-ksarap-4",
    "categoryId": "cat-kirmizi-sarap",
    "name": {
      "tr": "Sarafin Merlot (75 cl)",
      "en": "Sarafin Merlot (75 cl)"
    },
    "description": {
      "tr": "Kadifemsi tanenli özel rekolte 75 cl kırmızı şarap.",
      "en": "Velvety smooth finish Merlot red wine 75 cl bottle."
    },
    "price": 4000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-bsarap-1",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Beyaz Şarap (Kadeh)",
      "en": "House White Wine (Glass)"
    },
    "description": {
      "tr": "Soğuk servis kadeh beyaz şarap.",
      "en": "Chilled house white wine served by glass."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "p-bsarap-2",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Angora (35 cl)",
      "en": "Angora White Wine (35 cl)"
    },
    "description": {
      "tr": "35 cl Şişe sek beyaz şarap.",
      "en": "35 cl bottle dry white wine."
    },
    "price": 1250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "p-bsarap-3",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Angora (70 cl)",
      "en": "Angora White Wine (70 cl)"
    },
    "description": {
      "tr": "70 cl Şişe sek beyaz şarap.",
      "en": "70 cl bottle dry white wine."
    },
    "price": 2400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3
  },
  {
    "id": "p-bsarap-4",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Çankaya (75 cl)",
      "en": "Cankaya White Wine (75 cl)"
    },
    "description": {
      "tr": "Klasik ferahlatıcı sek beyaz şarap 75 cl.",
      "en": "Classic crisp Turkish dry white wine 75 cl."
    },
    "price": 2400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4
  },
  {
    "id": "p-bsarap-5",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Sarafin (75 cl)",
      "en": "Sarafin Chardonnay (75 cl)"
    },
    "description": {
      "tr": "Chardonnay sek beyaz şarap 75 cl.",
      "en": "Premium Chardonnay white wine 75 cl bottle."
    },
    "price": 4000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-bsarap-6",
    "categoryId": "cat-beyaz-sarap",
    "name": {
      "tr": "Selection (75 cl)",
      "en": "Selection White Wine (75 cl)"
    },
    "description": {
      "tr": "Narince & Emir kupajı özel beyaz şarap 75 cl.",
      "en": "Narince & Emir grape cuvee white wine 75 cl."
    },
    "price": 4000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6
  },
  {
    "id": "p-rsarap-1",
    "categoryId": "cat-rose-sarap",
    "name": {
      "tr": "Rosé Şarap (Kadeh)",
      "en": "House Rosé Wine (Glass)"
    },
    "description": {
      "tr": "Ferahlatıcı kadeh rosé pembe şarap.",
      "en": "Refreshing chilled house rosé wine by glass."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "p-rsarap-2",
    "categoryId": "cat-rose-sarap",
    "name": {
      "tr": "Angora (35 cl)",
      "en": "Angora Rosé Wine (35 cl)"
    },
    "description": {
      "tr": "35 cl Şişe rosé şarap.",
      "en": "35 cl bottle rosé wine."
    },
    "price": 1250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "p-rsarap-3",
    "categoryId": "cat-rose-sarap",
    "name": {
      "tr": "Angora (75 cl)",
      "en": "Angora Rosé Wine (75 cl)"
    },
    "description": {
      "tr": "75 cl Şişe rosé şarap.",
      "en": "75 cl bottle rosé wine."
    },
    "price": 2400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3
  },
  {
    "id": "p-rsarap-4",
    "categoryId": "cat-rose-sarap",
    "name": {
      "tr": "Villa Doluca (75 cl)",
      "en": "Villa Doluca Rosé (75 cl)"
    },
    "description": {
      "tr": "Meyvemsi pembe rosé şarap 75 cl.",
      "en": "Fruity pink rosé wine 75 cl bottle."
    },
    "price": 2400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4
  },
  {
    "id": "p-samp-1",
    "categoryId": "cat-sampanya",
    "name": {
      "tr": "İnci Damlası",
      "en": "Inci Damlasi Sparkling"
    },
    "description": {
      "tr": "Köpüklü şarap / Sparkling wine bottle.",
      "en": "Turkish sparkling wine bottle."
    },
    "price": 3500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "p-samp-2",
    "categoryId": "cat-sampanya",
    "name": {
      "tr": "Prosecco",
      "en": "Italian Prosecco Sparkling"
    },
    "description": {
      "tr": "İtalyan sek köpüklü şarap 75 cl.",
      "en": "Italian dry Prosecco sparkling wine 75 cl bottle."
    },
    "price": 7500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "dietary": {
      "isPopular": true
    }
  },
  {
    "id": "p-samp-3",
    "categoryId": "cat-sampanya",
    "name": {
      "tr": "Moët & Chandon Ice",
      "en": "Moët & Chandon Ice Imperial"
    },
    "description": {
      "tr": "Buz ile servis edilen lüks ikona dönmüş şampanya.",
      "en": "Luxury French champagne served over ice."
    },
    "price": 15000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-samp-4",
    "categoryId": "cat-sampanya",
    "name": {
      "tr": "Moët & Chandon Rosé",
      "en": "Moët & Chandon Rosé Imperial"
    },
    "description": {
      "tr": "Pembe meyve aromalı lüks Fransız şampanyası.",
      "en": "Luxury French pink champagne with berry notes."
    },
    "price": 15000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4
  },
  {
    "id": "p-samp-5",
    "categoryId": "cat-sampanya",
    "name": {
      "tr": "Dom Pérignon",
      "en": "Dom Pérignon Vintage"
    },
    "description": {
      "tr": "Dünyanın en prestijli vintage Fransız şampanyası.",
      "en": "The world's premier prestigious vintage French champagne bottle."
    },
    "price": 30000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "dietary": {
      "isChefRecommended": true
    }
  },
  {
    "id": "p-raki-1",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Yeni Rakı",
      "en": "Yeni Raki"
    },
    "description": {
      "tr": "%100 üzüm ve anasonun geleneksel buluşması.",
      "en": "The iconic traditional Turkish raki spirit."
    },
    "price": 375,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-yr-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 375
      },
      {
        "id": "vr-yr-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 450
      },
      {
        "id": "vr-yr-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 1550
      },
      {
        "id": "vr-yr-4",
        "name": {
          "tr": "50 cl",
          "en": "50 cl"
        },
        "price": 2300
      },
      {
        "id": "vr-yr-5",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 3200
      },
      {
        "id": "vr-yr-6",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 4000
      }
    ]
  },
  {
    "id": "p-raki-2",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Efe Gold",
      "en": "Efe Gold Raki"
    },
    "description": {
      "tr": "Meşe fıçılarda dinlendirilmiş altın rengi raki.",
      "en": "Oak-matured golden raki."
    },
    "price": 400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "variants": [
      {
        "id": "vr-eg-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 400
      },
      {
        "id": "vr-eg-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 500
      },
      {
        "id": "vr-eg-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 1750
      },
      {
        "id": "vr-eg-4",
        "name": {
          "tr": "50 cl",
          "en": "50 cl"
        },
        "price": 2650
      },
      {
        "id": "vr-eg-5",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 3600
      },
      {
        "id": "vr-eg-6",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 4500
      }
    ]
  },
  {
    "id": "p-raki-3",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Tekirdağ Gold",
      "en": "Tekirdag Gold Raki"
    },
    "description": {
      "tr": "Meşe fıçılarda yıllandırılmış yumuşak içimli altın seri.",
      "en": "Oak aged premium smooth finish Gold Raki."
    },
    "price": 400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "dietary": {
      "isPopular": true
    },
    "variants": [
      {
        "id": "vr-tg-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 400
      },
      {
        "id": "vr-tg-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 500
      },
      {
        "id": "vr-tg-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 1750
      },
      {
        "id": "vr-tg-4",
        "name": {
          "tr": "50 cl",
          "en": "50 cl"
        },
        "price": 2650
      },
      {
        "id": "vr-tg-5",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 3600
      },
      {
        "id": "vr-tg-6",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 4500
      }
    ]
  },
  {
    "id": "p-raki-4",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Beylerbeyi Göbek",
      "en": "Beylerbeyi Gobek Raki"
    },
    "description": {
      "tr": "Üç kez distile edilmiş %100 yaş üzüm göbek rakısı.",
      "en": "Triple distilled 100% fresh grape premium Gobek raki."
    },
    "price": 475,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "dietary": {
      "isChefRecommended": true,
      "isPopular": true
    },
    "variants": [
      {
        "id": "vr-bg-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 475
      },
      {
        "id": "vr-bg-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 600
      },
      {
        "id": "vr-bg-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 2000
      },
      {
        "id": "vr-bg-4",
        "name": {
          "tr": "50 cl",
          "en": "50 cl"
        },
        "price": 2900
      },
      {
        "id": "vr-bg-5",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 3850
      },
      {
        "id": "vr-bg-6",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 4900
      }
    ]
  },
  {
    "id": "p-raki-5",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Sarızeybek 3 Meşe",
      "en": "Sarizeybek 3 Mese Raki"
    },
    "description": {
      "tr": "3 farklı meşe fıçıda yıllandırılmış %100 yaş üzüm premium göbek rakısı.",
      "en": "Aged in 3 distinct oak barrels, 100% fresh grape premium Raki."
    },
    "price": 500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "dietary": {
      "isChefRecommended": true,
      "isPopular": true
    },
    "variants": [
      {
        "id": "vr-sz-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 500
      },
      {
        "id": "vr-sz-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 625
      },
      {
        "id": "vr-sz-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 2250
      },
      {
        "id": "vr-sz-4",
        "name": {
          "tr": "50 cl",
          "en": "50 cl"
        },
        "price": 3000
      },
      {
        "id": "vr-sz-5",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 4000
      },
      {
        "id": "vr-sz-6",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 4900
      }
    ]
  },
  {
    "id": "p-raki-6",
    "categoryId": "cat-raki",
    "name": {
      "tr": "Kulüp",
      "en": "Kulup Raki (70 cl)"
    },
    "description": {
      "tr": "Klasik nostaljik Kulüp rakısı 70 cl.",
      "en": "Iconic classic Kulup Raki 70 cl bottle."
    },
    "price": 3250,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6,
    "variants": [
      {
        "id": "vr-kl-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 3250
      }
    ]
  },
  {
    "id": "p-viski-1",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Chivas Regal 12 Years",
      "en": "Chivas Regal 12 Yrs"
    },
    "description": {
      "tr": "12 Yıl olgunlaştırılmış İskoç harman viskisi.",
      "en": "12-year-old blended Scotch whisky."
    },
    "price": 550,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-ch12-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 550
      },
      {
        "id": "vr-ch12-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 900
      },
      {
        "id": "vr-ch12-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 3900
      },
      {
        "id": "vr-ch12-4",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 7800
      },
      {
        "id": "vr-ch12-5",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 9800
      }
    ]
  },
  {
    "id": "p-viski-2",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Chivas Regal 18 Years",
      "en": "Chivas Regal 18 Yrs"
    },
    "description": {
      "tr": "18 Yıl olgunlaştırılmış zengin kompleks İskoç viskisi.",
      "en": "18-year-old rich complex blended Scotch whisky."
    },
    "price": 800,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-ch18-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 800
      },
      {
        "id": "vr-ch18-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 1100
      },
      {
        "id": "vr-ch18-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 12500
      }
    ]
  },
  {
    "id": "p-viski-3",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Chivas Regal 25 Years",
      "en": "Chivas Regal 25 Yrs"
    },
    "description": {
      "tr": "25 Yıl fıçılanmış nadide nadir İskoç viski 70 cl.",
      "en": "Ultra rare 25-year-old legendary Scotch whisky 70 cl."
    },
    "price": 35000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-ch25-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 35000
      }
    ]
  },
  {
    "id": "p-viski-4",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Johnnie Walker Black Label",
      "en": "Johnnie Walker Black Label"
    },
    "description": {
      "tr": "İkonik 12 yıl olgunlaşmış isli kompleks İskoç viskisi.",
      "en": "Iconic 12-year-old smoky blended Scotch whisky."
    },
    "price": 550,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "variants": [
      {
        "id": "vr-jwbl-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 550
      },
      {
        "id": "vr-jwbl-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 900
      },
      {
        "id": "vr-jwbl-3",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 3900
      },
      {
        "id": "vr-jwbl-4",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 7800
      },
      {
        "id": "vr-jwbl-5",
        "name": {
          "tr": "100 cl",
          "en": "100 cl"
        },
        "price": 9800
      }
    ]
  },
  {
    "id": "p-viski-5",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Jameson",
      "en": "Jameson Irish Whiskey"
    },
    "description": {
      "tr": "Üç kez distile edilmiş yumuşak içimli İrlanda viskisi.",
      "en": "Triple distilled smooth Irish whiskey."
    },
    "price": 650,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 5,
    "variants": [
      {
        "id": "vr-jm-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 650
      },
      {
        "id": "vr-jm-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 950
      },
      {
        "id": "vr-jm-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 6300
      }
    ]
  },
  {
    "id": "p-viski-6",
    "categoryId": "cat-viski",
    "name": {
      "tr": "Royal Salute 21 Years",
      "en": "Royal Salute 21 Yrs"
    },
    "description": {
      "tr": "21 Yıl olgunlaştırılmış kraliyet serisi İskoç viskisi 70 cl.",
      "en": "Prestigious 21-year-old royal Scotch whisky 70 cl."
    },
    "price": 24000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 6,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-rs21-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 24000
      }
    ]
  },
  {
    "id": "p-gin-1",
    "categoryId": "cat-gin",
    "name": {
      "tr": "Beefeater",
      "en": "Beefeater London Dry Gin"
    },
    "description": {
      "tr": "Klasik İngiliz dry cin kadeh ve şişe seçeneği.",
      "en": "Classic London dry gin served single, double or bottle."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-beef-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 450
      },
      {
        "id": "vr-beef-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 600
      },
      {
        "id": "vr-beef-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 7000
      }
    ]
  },
  {
    "id": "p-gin-2",
    "categoryId": "cat-gin",
    "name": {
      "tr": "Gordon's",
      "en": "Gordon's Special Dry Gin"
    },
    "description": {
      "tr": "Ardıç aromalı ferahlatıcı İngiliz cini.",
      "en": "Classic juniper crisp dry gin."
    },
    "price": 450,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "variants": [
      {
        "id": "vr-gord-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 450
      },
      {
        "id": "vr-gord-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 600
      },
      {
        "id": "vr-gord-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 7000
      }
    ]
  },
  {
    "id": "p-gin-3",
    "categoryId": "cat-gin",
    "name": {
      "tr": "Bombay Sapphire",
      "en": "Bombay Sapphire Gin (70 cl)"
    },
    "description": {
      "tr": "Mavi şişesinde 10 botanik aromalı premium cin 70 cl.",
      "en": "Vibrant botanicals infused London dry gin 70 cl."
    },
    "price": 8500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "variants": [
      {
        "id": "vr-bomb-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 8500
      }
    ]
  },
  {
    "id": "p-gin-4",
    "categoryId": "cat-gin",
    "name": {
      "tr": "Hendrick's",
      "en": "Hendrick's Gin (70 cl)"
    },
    "description": {
      "tr": "Salatalık ve gül yaprakları distile edilmiş özel İskoç cini 70 cl.",
      "en": "Cucumber and rose petal infused small batch Scottish gin 70 cl."
    },
    "price": 12000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-hend-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 12000
      }
    ]
  },
  {
    "id": "p-votka-1",
    "categoryId": "cat-votka",
    "name": {
      "tr": "Absolut",
      "en": "Absolut Swedish Vodka"
    },
    "description": {
      "tr": "İsveç buğdayından %100 saf pürüzsüz votka.",
      "en": "Pure winter wheat Swedish premium vodka."
    },
    "price": 500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-abs-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 500
      },
      {
        "id": "vr-abs-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 650
      },
      {
        "id": "vr-abs-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 7000
      }
    ]
  },
  {
    "id": "p-votka-2",
    "categoryId": "cat-votka",
    "name": {
      "tr": "Belvedere",
      "en": "Belvedere Vodka (70 cl)"
    },
    "description": {
      "tr": "Polonya çavdarından 4 kez distile lüks votka 70 cl.",
      "en": "Luxury Polish rye quadruple distilled vodka 70 cl."
    },
    "price": 14000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-belv-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 14000
      }
    ]
  },
  {
    "id": "p-votka-3",
    "categoryId": "cat-votka",
    "name": {
      "tr": "Grey Goose",
      "en": "Grey Goose Vodka (70 cl)"
    },
    "description": {
      "tr": "Fransız kaynak suyu ve buğdayından üretilmiş lüks votka 70 cl.",
      "en": "Premium French winter wheat vodka 70 cl bottle."
    },
    "price": 15000,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "dietary": {
      "isChefRecommended": true
    },
    "variants": [
      {
        "id": "vr-gg-1",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 15000
      }
    ]
  },
  {
    "id": "p-likor-1",
    "categoryId": "cat-likor",
    "name": {
      "tr": "Malibu",
      "en": "Malibu Coconut Liqueur"
    },
    "description": {
      "tr": "Hindistan cevizi aromalı Karayip rom likörü.",
      "en": "Caribbean rum with natural coconut flavor."
    },
    "price": 400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-mal-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 400
      },
      {
        "id": "vr-mal-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 500
      }
    ]
  },
  {
    "id": "p-likor-2",
    "categoryId": "cat-likor",
    "name": {
      "tr": "Baileys",
      "en": "Baileys Irish Cream"
    },
    "description": {
      "tr": "İrlanda viskisi ve taze kremalı özel likör.",
      "en": "Original Irish cream liqueur."
    },
    "price": 400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "allergens": [
      {
        "id": "alg-dairy",
        "code": "DAIRY",
        "name": {
          "tr": "Süt / Süt Ürünleri",
          "en": "Dairy"
        }
      }
    ],
    "variants": [
      {
        "id": "vr-bai-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 400
      },
      {
        "id": "vr-bai-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 500
      }
    ]
  },
  {
    "id": "p-likor-3",
    "categoryId": "cat-likor",
    "name": {
      "tr": "Archers",
      "en": "Archers Peach Schnapps"
    },
    "description": {
      "tr": "Şeftali aromalı tatlı likör.",
      "en": "Crisp peach schnapps liqueur."
    },
    "price": 400,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 3,
    "variants": [
      {
        "id": "vr-arch-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 400
      },
      {
        "id": "vr-arch-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 500
      }
    ]
  },
  {
    "id": "p-likor-4",
    "categoryId": "cat-likor",
    "name": {
      "tr": "Aperol",
      "en": "Aperol Aperitivo"
    },
    "description": {
      "tr": "Acı portakal ve ot aromalı İtalyan aperitifi.",
      "en": "Classic Italian orange bitter aperitif."
    },
    "price": 500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 4,
    "variants": [
      {
        "id": "vr-ape-1",
        "name": {
          "tr": "Tek",
          "en": "Single"
        },
        "price": 500
      },
      {
        "id": "vr-ape-2",
        "name": {
          "tr": "Duble",
          "en": "Double"
        },
        "price": 600
      }
    ]
  },
  {
    "id": "p-shot-1",
    "categoryId": "cat-shot",
    "name": {
      "tr": "Olmeca Tekila",
      "en": "Olmeca Tequila"
    },
    "description": {
      "tr": "Meksika agavesinden tekila shot veya şişe servisi.",
      "en": "Authentic Mexican agave tequila shot or bottle."
    },
    "price": 350,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 1,
    "variants": [
      {
        "id": "vr-olm-1",
        "name": {
          "tr": "Shot",
          "en": "Shot"
        },
        "price": 350
      },
      {
        "id": "vr-olm-2",
        "name": {
          "tr": "35 cl",
          "en": "35 cl"
        },
        "price": 3500
      },
      {
        "id": "vr-olm-3",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 6000
      }
    ]
  },
  {
    "id": "p-shot-2",
    "categoryId": "cat-shot",
    "name": {
      "tr": "Jägermeister",
      "en": "Jägermeister Herbal Digestif"
    },
    "description": {
      "tr": "56 Çeşit ot ve baharat aromalı Alman likörü.",
      "en": "German digestif with 56 herbs and botanicals."
    },
    "price": 350,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "hasImage": true,
    "isAvailable": true,
    "isActive": true,
    "sortOrder": 2,
    "variants": [
      {
        "id": "vr-jager-1",
        "name": {
          "tr": "Shot",
          "en": "Shot"
        },
        "price": 350
      },
      {
        "id": "vr-jager-2",
        "name": {
          "tr": "70 cl",
          "en": "70 cl"
        },
        "price": 5500
      }
    ]
  }
];

export const mockDailyFixMenus: DailyFixMenu[] = [
  {
    "dayOfWeek": 1,
    "dayName": {
      "tr": "Pazartesi",
      "en": "Monday"
    },
    "title": {
      "tr": "Pazartesi Fiks Menü",
      "en": "Monday Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + İçecek İkramı.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Drink."
    },
    "price": 1500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 2,
    "dayName": {
      "tr": "Salı",
      "en": "Tuesday"
    },
    "title": {
      "tr": "Salı Fiks Menü",
      "en": "Tuesday Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + İçecek İkramı.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Drink."
    },
    "price": 1500,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 3,
    "dayName": {
      "tr": "Çarşamba",
      "en": "Wednesday"
    },
    "title": {
      "tr": "Çarşamba Canlı Müzik Fiks Menü",
      "en": "Wednesday Live Music Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Canlı Müzik Gecesi.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Live Music."
    },
    "price": 1650,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 4,
    "dayName": {
      "tr": "Perşembe",
      "en": "Thursday"
    },
    "title": {
      "tr": "Perşembe Fiks Menü",
      "en": "Thursday Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Tatlı İkramı.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Dessert."
    },
    "price": 1750,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 5,
    "dayName": {
      "tr": "Cuma",
      "en": "Friday"
    },
    "title": {
      "tr": "Çok Özel Cuma Fiks Menü",
      "en": "Special Friday Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Şarap veya Rakı + Tatlı.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Spirit + Dessert."
    },
    "price": 1850,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 6,
    "dayName": {
      "tr": "Cumartesi",
      "en": "Saturday"
    },
    "title": {
      "tr": "Görkemli Cumartesi Fiks Menü",
      "en": "Grand Saturday Fix Menu"
    },
    "subtitle": {
      "tr": "5 Çeşit Soğuk Meze + 3 Ara Sıcak + Seçmeli Ana Yemek + Sınırsız İçecek.",
      "en": "5 Cold Mezes + 3 Hot Appetizers + Main Course + Unlimited Drinks."
    },
    "price": 2100,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  },
  {
    "dayOfWeek": 0,
    "dayName": {
      "tr": "Pazar",
      "en": "Sunday"
    },
    "title": {
      "tr": "Pazar Dost Sofrası Fiks Menü",
      "en": "Sunday Family & Friends Fix Menu"
    },
    "subtitle": {
      "tr": "4 Çeşit Soğuk Meze + 2 Ara Sıcak + Seçmeli Ana Yemek + Meyve & Tatlı.",
      "en": "4 Cold Mezes + 2 Hot Appetizers + Main Course + Fruits & Dessert."
    },
    "price": 1600,
    "currency": "₺",
    "imageUrl": "https://lh3.googleusercontent.com/d/1F-BEZxh-SeZd3rm7e9v-3gDLI3JRyvqa",
    "isActive": true
  }
];

export const mockAllergensList: Allergen[] = [
  { id: "alg-gluten", code: "GLUTEN", name: { tr: "Gluten", en: "Gluten" } },
  { id: "alg-dairy", code: "DAIRY", name: { tr: "Süt / Süt Ürünleri", en: "Dairy" } },
  { id: "alg-egg", code: "EGG", name: { tr: "Yumurta", en: "Egg" } },
  { id: "alg-shellfish", code: "SHELLFISH", name: { tr: "Kabuklu Deniz Ürünleri", en: "Shellfish" } },
  { id: "alg-nuts", code: "NUTS", name: { tr: "Kuruyemiş / Fıstık", en: "Nuts" } },
  { id: "alg-fish", code: "FISH", name: { tr: "Balık", en: "Fish" } },
  { id: "alg-sesame", code: "SESAME", name: { tr: "Susam / Tahin", en: "Sesame" } },
];
