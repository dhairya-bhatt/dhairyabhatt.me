import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#111111",
          subtle: "#161616",
          elevated: "#1C1C1E",
        },
        surface: {
          DEFAULT: "#18181A",
          hover: "#222224",
          border: "#28282B",
          highlight: "#353538",
        },
        accent: {
          DEFAULT: "#FF4632",
          hover: "#FF5E4D",
          muted: "#E04A36",
          subtle: "rgba(255, 70, 50, 0.12)",
        },
        ink: {
          primary: "#FFFFFF",
          secondary: "#B0B0B5",
          muted: "#7E7E86",
          faint: "#505056",
        },
        parchment: "#F5F2EB",
      },
      fontFamily: {
        century: ["Century", "Century Schoolbook", "TeX Gyre Schola", "Georgia", "serif"],
        helvetica: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        funnel: ["'Funnel Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Century", "Century Schoolbook", "TeX Gyre Schola", "Georgia", "serif"],
        sans: ["'Funnel Sans'", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Courier New", "monospace"],
      },
      animation: {
        "marquee": "marquee 32s linear infinite",
        "marquee-fast": "marquee 16s linear infinite",
        "equalizer-1": "equalizer 1.2s ease-in-out infinite alternate",
        "equalizer-2": "equalizer 0.9s ease-in-out infinite alternate 0.2s",
        "equalizer-3": "equalizer 1.4s ease-in-out infinite alternate 0.4s",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        equalizer: {
          "0%": { height: "20%" },
          "100%": { height: "100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
