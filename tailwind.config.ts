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
        background: {
          DEFAULT: "var(--color-bg)",
          secondary: "var(--color-bg-secondary)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          card: "var(--color-card)",
          elevated: "var(--color-elevated)",
        },
        content: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        brand: {
          purple: "var(--color-purple)",
          "purple-dark": "var(--color-purple-dark)",
          "purple-light": "var(--color-purple-light)",
        },
        menuBorder: "var(--color-border)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.3)",
        "card-light": "0 4px 20px -2px rgba(45, 35, 55, 0.05)",
        "purple-glow": "0 0 15px -3px rgba(139, 92, 246, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
