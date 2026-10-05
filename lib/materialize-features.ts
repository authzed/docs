/* Which Materialize feature each page documents.

   Single source of truth for both markers: the inline pill under the H1
   (components/feature-badge.tsx) and the early-access note in the TOC rail
   (components/feature-notes.tsx). The rail lives in a global Nextra slot
   that can't see page props, so both read the route instead — that way the
   pill and the note can never disagree about what a page belongs to.

   Paths are basePath-relative: usePathname() strips NEXT_PUBLIC_BASE_DIR. */

export const FEATURES = {
  "accelerated-queries": {
    label: "Accelerated Queries",
    href: "/materialize/getting-started/overview#accelerated-queries",
  },
  "event-streams": {
    label: "Event Streams",
    href: "/materialize/getting-started/overview#event-streams",
  },
} as const;

export type FeatureKey = keyof typeof FEATURES;

/* Per-feature because the note is colour-matched to its pill, and because
   these go GA on different dates — Accelerated Queries reached GA first. */
export const EARLY_ACCESS: Record<FeatureKey, boolean> = {
  "accelerated-queries": false,
  "event-streams": true,
};

const PAGE_FEATURES: Record<string, readonly FeatureKey[]> = {
  "/materialize/api/client-sdks": ["event-streams"],
  "/materialize/api/lookup-permission-sets": ["event-streams"],
  "/materialize/api/watch-permission-sets": ["event-streams"],
  "/materialize/api/download-permission-sets": ["event-streams"],
  "/materialize/concepts/managing-client-state": ["event-streams"],
  "/materialize/concepts/permission-set-lifecycle": ["event-streams"],
  "/materialize/concepts/permission-sets": ["event-streams"],
  "/materialize/concepts/snapshots": ["accelerated-queries", "event-streams"],
  "/materialize/concepts/hydration": ["accelerated-queries", "event-streams"],
  "/materialize/concepts/watched-permissions": ["accelerated-queries", "event-streams"],
  "/materialize/getting-started/limitations": ["accelerated-queries", "event-streams"],
  "/materialize/guides/recommended-architecture": ["event-streams"],
  "/materialize/guides/relational-database": ["event-streams"],
};

export function featuresForPath(pathname: string | null): readonly FeatureKey[] {
  if (!pathname) return [];
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PAGE_FEATURES[clean] ?? [];
}
