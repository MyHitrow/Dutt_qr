import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dut: {
          bg: "#101011",
          "bg-2": "#151516",
          card: "#1D1D1F",
          elevated: "#222224",
          purple: "#A66CFF",
          "purple-light": "#C7A8FF",
          "purple-dark": "#302341",
          text: "#F7F7F8",
          "text-2": "#96969D",
          "text-3": "#68686E",
          divider: "rgba(255,255,255,0.06)",
          success: "#63D391",
          warning: "#F0B45A",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.6)",
        plate: "0 16px 40px rgba(0,0,0,0.85), 0 0 24px rgba(166,108,255,0.12)",
        "purple-glow": "0 0 24px -4px rgba(166,108,255,0.35)",
        "cart": "0 -4px 24px rgba(0,0,0,0.5)",
        "bottom-sheet": "0 -8px 40px rgba(0,0,0,0.7)",
      },
      animation: {
        "slide-up": "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        "shimmer": "shimmer 1.6s linear infinite",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.94)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
