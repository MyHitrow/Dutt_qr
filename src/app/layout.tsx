import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { MenuProvider } from "@/context/MenuContext";
import { GlobalErrorBoundary } from "@/components/common/GlobalErrorBoundary";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dutt Meyhane — Dijital QR Menü",
  description:
    "Modern İstanbul Meyhanesi Dijital QR Menüsü. Mezeler, ara sıcaklar, ızgaralar ve seçkin içecekler.",
  authors: [{ name: "Moka Works" }],
  creator: "Moka Works",
  publisher: "Moka Works",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Dutt Meyhane — Dijital QR Menü",
    description: "Modern İstanbul Meyhanesi Dijital QR Menüsü.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#120D18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
      </head>
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased min-h-screen bg-background text-content-primary selection:bg-brand-purple/30 selection:text-brand-purple`}
      >
        <GlobalErrorBoundary>
          <MenuProvider>{children}</MenuProvider>
        </GlobalErrorBoundary>

        {/* PWA Service Worker Registration */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { /* PWA registered */ },
                    function(err) { /* SW registration failed */ }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
