import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#F5F0EB",
        surface: "#FAFAF7",
        ink: "#2C2C2A",
        muted: "#8A8680",
        subtle: "#A8A29E",
        accent: {
          DEFAULT: "#6B7C5E",
          soft: "#D4DCCD",
          hover: "#5A6B4E",
          light: "#EDF1EA",
        },
        warm: {
          50: "#FAF8F5",
          100: "#F5F0EB",
          200: "#EBE4DB",
          300: "#DDD4C9",
          400: "#C4BAB0",
        },
        border: "#E2DDD6",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(44,44,42,0.03), 0 4px 12px rgba(44,44,42,0.02)",
        card: "0 1px 3px rgba(44,44,42,0.04), 0 6px 24px rgba(44,44,42,0.03)",
        elevated: "0 2px 8px rgba(44,44,42,0.05), 0 12px 40px rgba(44,44,42,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
