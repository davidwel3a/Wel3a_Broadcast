import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          input: "var(--color-border-input)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          on: "var(--color-on-accent)",
        },
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        discord: "var(--color-discord)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        sm: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        base: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        lg: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        xl: ["28px", { lineHeight: "34px", fontWeight: "700" }],
        display: ["40px", { lineHeight: "44px", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-md)",
        glow: "var(--shadow-glow)",
        dangerGlow: "var(--shadow-danger-glow)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        smooth: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
