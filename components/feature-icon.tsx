import type { CSSProperties } from "react";

/* Feature-matrix marks for docs tables — Lucide check / x glyphs in Sandworm
   colors, matching the marketing site's pricing comparison: a teal→violet
   gradient disc with a dark check for "yes", a red-outlined disc with a red x
   for "no". Used in MDX as <Yes /> / <No /> (registered in mdx-components.ts).
   Self-contained inline Sandworm values so it works on any docs page. */

const disc: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "9999px",
  verticalAlign: "middle",
};

export function Yes() {
  return (
    <span
      role="img"
      aria-label="Yes"
      style={{
        ...disc,
        // teal-300 → teal-400 → violet-500 (Sandworm)
        background:
          "linear-gradient(135deg, hsl(175 28% 73%), hsl(176 29% 57%) 45%, hsl(253 73% 63%))",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="hsl(280 37% 8%)" /* stone-950 */
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function No() {
  return (
    <span role="img" aria-label="No" style={{ ...disc, border: "2px solid hsl(351 55% 53%)" }}>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="hsl(351 55% 53%)" /* red-600 */
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </span>
  );
}
