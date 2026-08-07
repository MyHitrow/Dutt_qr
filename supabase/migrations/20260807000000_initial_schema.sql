-- ============================================================
-- DUTT MEYHANE DIJITAL QR MENU SYSTEM - SUPABASE SCHEMA MIGRATION
-- ============================================================

-- 1. VENUE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.venue_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_name TEXT NOT NULL DEFAULT 'Dutt Meyhane',
    slogan_tr TEXT NOT NULL DEFAULT 'Yeni Nesil Meyhane & Gastronomi',
    slogan_en TEXT NOT NULL DEFAULT 'Modern Tavern & Fine Gastronomy',
    currency_symbol TEXT NOT NULL DEFAULT '₺',
    logo_url TEXT,
    default_theme TEXT NOT NULL DEFAULT 'dark',
    default_language TEXT NOT NULL DEFAULT 'tr',
    service_notice_tr TEXT NOT NULL DEFAULT 'Detaylı içerik, pişirme tercihleri ve alerjen bilgisi için lütfen servis ekibimize danışınız.',
    service_notice_en TEXT NOT NULL DEFAULT 'For detailed ingredients, cooking preferences, and allergen info, please consult our service team.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_tr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ALLERGENS TABLE
CREATE TABLE IF NOT EXISTS public.allergens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name_tr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name_tr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_tr TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT '₺',
    image_url TEXT,
    has_image BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 1,
    is_vegan BOOLEAN NOT NULL DEFAULT false,
    is_vegetarian BOOLEAN NOT NULL DEFAULT false,
    is_gluten_free BOOLEAN NOT NULL DEFAULT false,
    spicy_level INT NOT NULL DEFAULT 0,
    chef_note_tr TEXT,
    chef_note_en TEXT,
    serving_suggestion_tr TEXT,
    serving_suggestion_en TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT ALLERGENS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.product_allergens (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    allergen_id UUID NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, allergen_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public users have READ ONLY access.
-- Authenticated Admins have FULL access.
-- ============================================================

ALTER TABLE public.venue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_allergens ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Venue Settings" ON public.venue_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Active Categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Allergens" ON public.allergens FOR SELECT USING (true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Product Allergens" ON public.product_allergens FOR SELECT USING (true);

-- AUTHENTICATED ADMIN FULL ACCESS POLICIES
CREATE POLICY "Admin Full Access Venue Settings" ON public.venue_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Allergens" ON public.allergens FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Product Allergens" ON public.product_allergens FOR ALL TO authenticated USING (true);
