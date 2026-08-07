# DEPLOYMENT & PRODUCTION SETUP GUIDE

Bu doküman, **Dutt Meyhane Dijital QR Menü Sistemi**'nin Vercel ve Supabase üzerinde canlıya alınması için adım adım rehber içerir.

---

## 1. Supabase Kurulumu & Migration
1. [supabase.com](https://supabase.com) üzerinde yeni bir PostgreSQL projesi oluşturun.
2. **SQL Editor** bölümüne gidin.
3. [supabase/migrations/20260807000000_initial_schema.sql](file:///Users/motion/Desktop/Dutt%20Qr%20Men%C3%BC/supabase/migrations/20260807000000_initial_schema.sql) dosyasındaki SQL kodlarını çalıştırın.
4. Başlangıç verileri için [supabase/seed.sql](file:///Users/motion/Desktop/Dutt%20Qr%20Men%C3%BC/supabase/seed.sql) dosyasını çalıştırın.
5. **Project Settings -> API** altından `URL`, `anon_key` ve `service_role_key` değerlerini kopyalayın.

---

## 2. Environment Variables (Ortam Değişkenleri)
Vercel ve `.env.local` ortamlarında aşağıdaki değişkenleri tanımlayın:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-do-not-expose
ADMIN_SECRET_PATH=management-portal-secure
NEXT_PUBLIC_DEFAULT_VENUE_NAME="Dutt Meyhane"
```

---

## 3. Vercel & GitHub Entegrasyonu
1. Kodları GitHub repository'sine push edin (`main` branch).
2. [vercel.com](https://vercel.com) panelinden "Add New Project" seçin ve GitHub repo'yu bağlayın.
3. Framework olarak **Next.js** otomatik algılanacaktır.
4. Environment Variables sekmesinde yukarıdaki değişkenleri girin.
5. **Deploy** butonuna basın.

---

## 4. Custom Domain Bağlantısı (DNS)
1. Vercel Proje Ayarları -> **Domains** sekmesine gidin.
2. `menu.mekaninadi.com` veya `mekaninadi.com` domaininizi ekleyin.
3. DNS sağlayıcınızda (GoDaddy, Cloudflare, Namecheap vb.) gösterilen A veya CNAME kaydını ekleyin:
   - `CNAME menu cname.vercel-dns.com`
4. SSL sertifikası Vercel tarafından otomatik tanımlanacaktır.

---

## 5. Güvenlik & Gizli Admin Paneli
- Yönetim paneli rotası standart `/admin` değil, özel `management-portal-secure` veya `ADMIN_SECRET_PATH` değişkeniyle tanımlanan gizli path üzerinden çalışır.
- Masadaki QR kod müşteriyi `https://menu.mekaninadi.com` adresine yönlendirir.
- Müşteriler müşteri menüsünden hiçbir şekilde admin rotasını göremez veya tahmin edemez.
