-- ============================================================
-- INITIAL SEED DATA FOR DUTT MEYHANE
-- ============================================================

-- Venue Settings
INSERT INTO public.venue_settings (venue_name, slogan_tr, slogan_en, currency_symbol)
VALUES ('Dutt Meyhane', 'Yeni Nesil Meyhane & Gastronomi', 'Modern Tavern & Fine Gastronomy', '₺');

-- Allergens
INSERT INTO public.allergens (code, name_tr, name_en) VALUES
('MILK', 'Süt ve Süt Ürünleri', 'Milk & Dairy'),
('NUTS', 'Kuruyemiş / Fıstık', 'Nuts / Pistachio'),
('SHELLFISH', 'Kabuklu Deniz Ürünleri', 'Shellfish'),
('GLUTEN', 'Gluten / Buğday', 'Gluten / Wheat'),
('EGG', 'Yumurta', 'Egg'),
('FISH', 'Balık', 'Fish');

-- Categories
INSERT INTO public.categories (id, slug, name_tr, name_en, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'soguk-mezeler', 'Soğuk Mezeler', 'Cold Mezes', 1),
('c1000000-0000-0000-0000-000000000002', 'sicak-mezeler', 'Sıcak Mezeler', 'Warm Mezes', 2),
('c1000000-0000-0000-0000-000000000003', 'ara-sicaklar', 'Ara Sıcaklar', 'Warm Starters', 3),
('c1000000-0000-0000-0000-000000000004', 'rakilar', 'Rakılar', 'Raki Selection', 4);

-- Products
INSERT INTO public.products (category_id, name_tr, name_en, description_tr, description_en, price, has_image, image_url, is_vegetarian, spicy_level, chef_note_tr) VALUES
('c1000000-0000-0000-0000-000000000001', 'Atom & Süzme Yoğurt', 'Atom & Strained Yogurt', 'Kurutulmuş acı Arnavut biberi, tereyağında kızdırılmış mor sarımsak ve süzme yoğurt.', 'Dried spicy Albanian pepper, garlic clarified butter and rich strained yogurt.', 240.00, true, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', true, 2, 'Biberlerimiz Hatay''dan özel olarak temin edilmektedir.'),
('c1000000-0000-0000-0000-000000000001', 'Girit Ezmesi', 'Cretan Cheese Paste', 'Ezine peyniri, lor peyniri, antep fıstığı, taze fesleğen ve sızma zeytinyağı.', 'Aged Ezine cheese, curd cheese, pistachio, fresh basil and extra virgin olive oil.', 260.00, true, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', true, 0, NULL),
('c1000000-0000-0000-0000-000000000004', 'Beylerbeyi Göbek (70 cl)', 'Beylerbeyi Gobek (70 cl)', '%100 yaş üzüm ve 3 kez distile edilmiş üst segment göbek rakısı.', '100% fresh grape, triple distilled premium Turkish raki.', 3100.00, false, NULL, false, 0, NULL);
