/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a1a",
        surface: {
          DEFAULT: "#0f0f2a",
          hover: "#141437",
        },
        border: {
          DEFAULT: "#2e2554",
          input: "#6b5ca5",
        },
        text: {
          DEFAULT: "#f3f0fa",
          muted: "#b5acd5",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          on: "#ffffff",
        },
        danger: "#f87171",
        success: "#4ade80",
        warning: "#fbbf24",
        discord: "#5865f2",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
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
    },
  },
  plugins: [],
};
