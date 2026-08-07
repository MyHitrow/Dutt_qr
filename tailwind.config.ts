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
          DEFAULT: "#111111",
          secondary: "#18181A",
        },
        surface: {
          DEFAULT: "#1C1C1E",
          card: "#1C1C1E",
          elevated: "#222224",
          purpleDark: "#302341",
        },
        content: {
          primary: "#F5F5F5",
          secondary: "#8E8E93",
          muted: "#636366",
        },
        brand: {
          purple: "#A66CFF",
          "purple-light": "#C7A8FF",
          "purple-dark": "#302341",
        },
        menuBorder: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.7)",
        plate: "0 12px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px 0 rgba(166, 108, 255, 0.15)",
        "purple-glow": "0 0 20px -3px rgba(166, 108, 255, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
