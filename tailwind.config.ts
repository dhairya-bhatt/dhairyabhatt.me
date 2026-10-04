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
          DEFAULT: "#141414",
          subtle: "#181818",
          elevated: "#1E1E1E",
        },
        surface: {
          DEFAULT: "#1C1C1E",
          hover: "#262628",
          border: "#2C2C2E",
          highlight: "#3A3A3C",
        },
        accent: {
          DEFAULT: "#FF4632", // Vermilion Pokéball Red
          hover: "#FF5E4D",
          muted: "#E04A36",
          subtle: "rgba(255, 70, 50, 0.12)",
        },
        ink: {
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#71717A",
          faint: "#52525B",
        },
        parchment: "#F5F2EB",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
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
