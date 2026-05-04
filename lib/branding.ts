/**
 * Brahmando / Brahmexa Branding Configuration
 * ─────────────────────────────────────────────
 * Single source of truth for all brand tokens.
 * All UI components should consume from this file.
 *
 * TO ADD LOGOS: replace the `logoPath` / `iconPath` values with
 * paths under /public/branding/ once assets are provided.
 */

export const branding = {
  // ─── Names & messaging ─────────────────────────────────────────
  name: "Brahmando",
  fullName: "Brahmando — R&D Repository of ManjuLAB · a Brahmexa group brand",
  tagline:
    "Repository of ManjuLAB R&D. Offered to ManjuLAB customers and community partners.",
  company: "ManjuLAB",
  companySite: "https://manjulab.com",
  groupBrand: "Brahmexa",
  groupBrandTagline: "Democratizing Intelligence",
  /** Same values as `groupBrand` / `groupBrandTagline`; kept for backward-compatible imports. */
  aiBrand: "Brahmexa",
  aiBrandTagline: "Democratizing Intelligence",
  developer: "ManjuLAB",
  host: "Brahmando",
  domain: "brahmando.com",
  accessModel: {
    customer: true,
    community: true,
    public: false,
  },
  groupMembers: ["ManjuLAB", "Brahmando", "… other Brahmexa group companies"] as const,

  // ─── Logo paths (served from /public/branding/) ───────────────
  logos: {
    brahmando: {
      wordmark: "/branding/brahmando-logo.jpg",
      icon: "/branding/brahmando-logo.jpg",
    },
    brahmexa: {
      wordmark: "/branding/brahmexa-logo.jpeg",
      icon: "/branding/brahmexa-logo.jpeg",
    },
    manjulab: {
      wordmark: "/branding/manjulab-logo.png",
      icon: "/branding/manjulab-logo.png",
    },
  },

  // ─── Colours (mirrors tailwind.config.js) ─────────────────────
  colors: {
    primary:    "#3b82f6",   // brand-500
    primaryDark:"#2563eb",   // brand-600
    navy:       "#1e3a8a",   // brand-900
    white:      "#ffffff",
    background: "#f8fafc",   // surface-muted
    border:     "#e2e8f0",   // surface-border
    text:       "#0f172a",   // slate-900
    textMuted:  "#64748b",   // slate-500
  },

  // ─── Typography ────────────────────────────────────────────────
  typography: {
    fontSans: "Inter, system-ui, sans-serif",
    fontMono: "JetBrains Mono, monospace",
  },
} as const;

export type Branding = typeof branding;
