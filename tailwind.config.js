/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants.tsx",
    "./*.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Light Theme ──────────────────────────────────────────────
        "bg-light":          "#E8DCFF",  // Main Background
        "card-light":        "#F3EEFF",  // Card Background
        "border-light":      "#D0BFFF",  // Border / Divider
        "text-primary":      "#1A1A1A",  // Primary Text
        "text-secondary":    "#5A4E72",  // Secondary Text
        "cta":               "#FFDE59",  // CTA / Button
        "cta-hover":         "#F5CE30",  // Button Hover
        "primary":           "#9B5FE3",  // Main Accent
        "success":           "#4ADE80",  // Success
        "error":             "#F87171",  // Error

        // ── Dark Theme ────────────────────────────────────────────────
        "bg-dark":           "#0F0A1A",  // Main Background
        "surface-dark":      "#1A1030",  // Card Background
        "elevated-dark":     "#251848",  // Elevated Surface
        "border-dark":       "#2E1F55",  // Border / Divider
        "input-dark":        "#1E1438",  // Input Background
        "focus-dark":        "#B87AFF",  // Input Focus Ring
        "text-soft":         "#E8DCFF",  // Primary Text (dark)
        "text-muted":        "#9B7EC8",  // Secondary Text (dark)
        "text-placeholder":  "#5A4E72",  // Muted / Placeholder
        "accent-dark":       "#B87AFF",  // Main Accent (dark)
        "btn-disabled":      "#3D3060",  // Button Disabled
        "warning":           "#FB923C",  // Warning

        // ── Aliases for backwards-compat ─────────────────────────────
        "background-light":  "#E8DCFF",
        "surface-light":     "#F3EEFF",
      },
      fontFamily: {
        sans: ['Google Sans', 'sans-serif'],
        display: ['Google Sans', 'sans-serif'],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "2xl":     "2rem",
        "full":    "9999px"
      },
    },
  },
  plugins: [],
}
