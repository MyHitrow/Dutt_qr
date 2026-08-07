# PROJECT CONTEXT: Yeni Nesil Meyhane Dijital QR Menü Sistemi

## 1. Proje Felsefesi ve Kimliği
- **Konsept:** Modern İstanbul meyhanesi / yeni nesil gastronomi mekanı için premium, sade, hızlı ve mobil öncelikli dijital QR menü.
- **Temel Akış:** QR Kodu Okut → Menü Açılır → Kategoriyi İncele → Ürünü Gör → Ürün Detayına Gir → Menüye Dön.
- **Kesinlikle YER ALMAYACAKLAR (Kapsam Dışı):** Sepet, sepete ekle, adet seçimi, sipariş ver, ödeme, adisyon/POS entegrasyonu, adresi/teslimat, favoriler, üyelik, yorum, puanlama, garson çağırma.
- **Tasarım Dili:** "Sessiz Lüks" (Quiet Luxury), zarif, minimal, yetişkin, gece atmosferine uygun.
- **Marka Rengi:** Mor (`#8B5CF6` / `#7C3AED`). Yalnızca accent/detay olarak (Purple Corner Accent, aktif kategori altı, focus state, badge). Büyük yüzeylerde veya neon glow olarak kullanılmaz.
- **Tema:** Dark Tema (varsayılan: `#19181D` background, `#29262F` card) + Light Tema desteği (`#F8F7FA` background, `#FFFFFF` card).
- **Tipografi:** Primary UI için `Manrope` (sans-serif), Logo ve özel başlıklarda sınırlı `Cormorant Garamond` (serif).

## 2. Teknik Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (Custom Color Tokens & Design System)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (Yalnızca Admin Paneli için)
- **Storage:** Supabase Storage (Ürün görselleri için)
- **Hosting:** Vercel (Production & Preview Deployments)
- **Version Control:** Git & GitHub

## 4. Admin Paneli & Güvenlik Prensipleri
- **Gizli / Tahmin Edilemez URL:** Admin paneline erişim bilindik `/admin` veya `/dashboard` gibi kolay tahmin edilebilir rotalardan olmayacak. URL yapısı gizli/özel bir slug veya konfigüre edilebilir güvenli bir rota üzerinden erişilebilir kılınacak.
- **Tam Yönetilebilirlik:** Ana müşteri menüsündeki İstisnasız HER ŞEY (Mekan adı, slogan, logo, kategoriler, kategori sıralaması, ürünler, fotoğraflar, fotoğraflı/fotoğrafsız kart tipi, fiyatlar, para birimi, stok/tükendi durumu, dil çevirileri TR/EN, alerjenler, diyet etiketleri, şef notları) admin panelinden kolayca yönetilebilecek.

## 3. Geliştirme Prensipleri
- Mobile First (375px, 390px, 430px genişliklerinde kusursuz görünüm).
- Fotoğrafsız ürünler için "eksik görünmeyen" premium tipografik kart tasarımı.
- Performans odaklı: WebP/AVIF görseller, lazy loading, sıfır gereksiz JS kütüphanesi.
- Modüler ve sürdürülebilir geliştirme.
