/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Brahmando / Brahmexa brand colours ───────────────────────
      colors: {
        brand: {
          50:  "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted:   "#f8fafc",
          border:  "#dbe5f0",
        },
      },
      // ─── Typography ───────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // ─── Spacing & sizing helpers ─────────────────────────────────
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};
