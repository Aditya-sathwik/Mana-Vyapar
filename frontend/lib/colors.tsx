/**
 * Official project colors for Mana-Vyapar.
 * Extracted from root theme and production UI components.
 */

export const COLORS = {
  // Root Brand Primary (Emerald)
  primary: {
    base: "#059467",       // Merchant brand primary
    dark: "#047854",       // Deep emerald
    light: "#d1fae5",      // Sage highlight
    vibrant: "#10b981",    // Standard emerald-500 used for logos/active states
  },

  // Semantic Layers
  background: {
    dark: "#09090b",       // The core dark background used in Dashboards & Auth
    surface: "#0f172a",    // Dark slate foundation
    light: "#f5f8f7",      // Light mode background
  },

  // Surfaces & Borders
  surface: {
    dark: "#0f172a",
    soft: "#1e293b",
  },
  border: {
    dark: "#1e293b",
    light: "#e2e8f0",
  },

  // Typography
  text: {
    primary: "#ffffff",
    secondary: "#94a3b8",
    muted: "#64748b",
  },

  // UI Surfaces (Mapped to Tailwind Slates)
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",        // Borders in dark mode
    900: "#09090b",        // Cards/Inputs backgrounds
  },

  // Functional
  accent: "#f59e0b",       // Warning/Orange accent
  error: "#ef4444",        // Red/Destructive
  success: "#10b981",
  white: "#ffffff",
};

export default COLORS;
