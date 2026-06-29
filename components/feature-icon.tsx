import "./feature-icon.css";

/* Feature-matrix marks for docs tables — Lucide check / x glyphs in Sandworm
   colors, matching the marketing pricing comparison. Theme-aware styling lives
   in feature-icon.css. Used in MDX as <Yes /> / <No /> (mdx-components.ts). */

export function Yes() {
  return (
    <span role="img" aria-label="Yes" className="feature-mark feature-yes">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
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
    <span role="img" aria-label="No" className="feature-mark feature-no">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
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
