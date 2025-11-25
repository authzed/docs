import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  // prefix: '', // NOTE: nextra-docs-theme uses 'nx-' as a prefix. Unprefixed classes will take precendence over nx- prefixed classes.
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  theme: {
    // Copied from nextra-docs-theme to match
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    // Copied from nextra-docs-theme to match
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    // Copied from nextra-docs-theme to match
    letterSpacing: {
      tight: "-0.015em",
    },
    extend: {
      // All default color palettees are available
      colors: {
        dark: "#111",
        transparent: "transparent",
        current: "currentColor",
        black: "#000",
        white: "#fff",
        primary: colors.neutral,
      },
    },
  },
  plugins: [],
  darkMode: ["class", 'html[class~="dark"]'],
} satisfies Config;
