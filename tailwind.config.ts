import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matte: {
          DEFAULT: "#060606",
          100: "#0a0a0a",
          200: "#111111",
          300: "#1a1a1a",
          400: "#222222",
          500: "#2a2a2a",
          600: "#333333",
        },
        // Signature palette: electric blue → violet → pink
        electric: {
          DEFAULT: "#3B82F6",
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#3B82F6",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#8B5CF6",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
        },
        pink: {
          DEFAULT: "#EC4899",
          50:  "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#EC4899",
          500: "#db2777",
          600: "#be185d",
          700: "#9d174d",
        },
        // Keep indigo as alias for backward compat with prose/blog
        indigo: {
          DEFAULT: "#3B82F6",
          300: "#93c5fd",
          400: "#3B82F6",
          500: "#2563eb",
        },
        // Keep cyan for syntax highlighting
        cyan: {
          DEFAULT: "#8B5CF6",
          300: "#c4b5fd",
          400: "#8B5CF6",
        },
      },
      fontFamily: {
        heading: ["Clash Display", "system-ui", "sans-serif"],
        body: ["Satoshi", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Signature gradient: electric blue → violet → pink
        "gradient-accent":
          "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)",
        "gradient-accent-horizontal":
          "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
        "gradient-glow":
          "radial-gradient(circle at center, rgba(139,92,246,0.18), transparent 70%)",
        "gradient-card":
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
      },
      animation: {
        "fade-in":       "fadeIn 0.5s ease-out forwards",
        "fade-in-up":    "fadeInUp 0.6s ease-out forwards",
        "fade-in-down":  "fadeInDown 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right":"slideInRight 0.5s ease-out forwards",
        "scale-in":      "scaleIn 0.4s ease-out forwards",
        "float":         "float 6s ease-in-out infinite",
        "pulse-glow":    "pulseGlow 3s ease-in-out infinite",
        "shimmer":       "shimmer 3s linear infinite",
        "spin-slow":     "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%":   { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139,92,246,0.12)" },
          "50%":      { boxShadow: "0 0 50px rgba(139,92,246,0.35)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
