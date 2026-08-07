# 🍇 Dutt Meyhane — Dijital QR Menü Sistemi

Modern İstanbul Meyhanesi ve gastronomi mekanları için tasarlanmış; ultra hızlı, sade, mobil öncelikli ve "Sessiz Lüks" (Quiet Luxury) tasarım felsefesine sahip dijital QR menü sistemi.

---

## 🌟 Öne Çıkan Özellikler

### 📱 Müşteri Deneyimi (Customer Menu)
- **Sürtünmesiz Erişim:** Uygulama indirme, kayıt, üyelik veya e-posta zorunluluğu yok.
- **Sipariş / Sepet İçermez:** Tek ve net odak menüyü, lezzetleri ve içerikleri keşfettirmektir.
- **Mobile-First:** 375px, 390px, 430px ekranlarda kusursuz mobil performans.
- **Purple Corner Accent:** Mor renk marka vurgusu olarak yalnızca kart köşelerinde ve mikro accent detaylarda şıkça kullanılmıştır.
- **Fotoğraflı & Fotoğrafsız Premium Kartlar:** Rakı ve şaraplar gibi fotoğraftan ziyade tipografik kalite gerektiren lezzetler için özel görselsiz kart tasarımı.
- **Alerjen & Şef Notu Detayları:** Alerjen ikonları, diyet etiketleri (Vegan, Glutensiz vb.) ve servis ekibi bilgilendirme ikazları.
- **Çift Dil & Çift Tema:** Türkçe / İngilizce ve Dark / Light tema dinamik geçişi.

### 🛡️ Yönetim Paneli (Admin Portal)
- **Gizli & Tahmin Edilemez URL:** `/admin` yerine korumalı gizli rota (`/management-portal-secure`).
- **%100 Yönetilebilirlik:** Ürünler, fiyatlar, açıklamalar, kategoriler, stok durumu (TÜKENDİ), alerjenler ve mekan ayarları anlık yönetilebilir.
- **Masa QR Kod Oluşturucu:** Masalar için yüksek çözünürlüklü indirilebilir QR kod jeneratörü.

---

## 🛠️ Teknolojik Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS (Custom Color Tokens & Design System)
- **Database & Auth:** Supabase PostgreSQL & Supabase Auth
- **Hosting:** Vercel

---

## 🚀 Hızlı Başlangıç (Local Development)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcıda açın
http://localhost:3000
```

---

## 📂 Proje Dokümantasyonu
- [Proje Bağlamı ve Prensipler](/docs/PROJECT_CONTEXT.md)
- [Proje Durum Raporu](/docs/PROJECT_STATE.md)
- [Canlıya Alma ve Kurulum Rehberi](/docs/DEPLOYMENT_GUIDE.md)
