import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { MenuProvider } from "@/context/MenuContext";
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
  description: "Modern İstanbul Meyhanesi Dijital QR Menüsü. Mezeler, ara sıcaklar, ızgaralar ve seçkin içecekler.",
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
  themeColor: "#19181D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased min-h-screen bg-background text-content-primary selection:bg-brand-purple/30 selection:text-brand-purple`}
      >
        <MenuProvider>{children}</MenuProvider>
      </body>
    </html>
  );
}
