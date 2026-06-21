import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        travel: {
          dark: "#111825",      // Primary Dark
          offwhite: "#fefcfd",  // Off-White
          white: "#ffffff",     // Pure White
          gray: "#f7f7f7",      // Light Gray
          accent: "#ea580c",    // Warm orange/amber travel accent
          muted: "#64748b",     // Muted slate gray
          border: "#e2e8f0",    // Soft border gray
        },
        editorial: {
          bg: "var(--bg-color)",        
          text: "var(--text-color)",      
          accent: "#ea580c",    
          border: "var(--border-color)",
          muted: "var(--muted-color)",
          card: "var(--card-bg)",
        }
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(17, 24, 37, 0.05), 0 2px 8px -1px rgba(17, 24, 37, 0.03)",
        "premium-hover": "0 10px 30px -4px rgba(17, 24, 37, 0.08), 0 4px 12px -2px rgba(17, 24, 37, 0.04)",
        card: "0 1px 3px 0 rgba(17, 24, 37, 0.03), 0 1px 2px -1px rgba(17, 24, 37, 0.02)",
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
