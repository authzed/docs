import "server-only";

/* Data for the docs home (components/docs-home.tsx).
   Both feeds are fetched at build/ISR time and self-update on revalidate.
   Each has a real, accurate fallback so the page never shows fabricated or
   empty data if GitHub is unreachable or the dynamic stream is too thin. */

export type Release = { ver: string; date: string; latest?: boolean; href: string };
export type WhatsNewItem = { date: string; title: string; href: string };

const REVALIDATE = 60 * 60 * 6; // 6h — releases/PRs don't move faster than this

const GH_HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---- Releases: SpiceDB GitHub releases (clean, fully dynamic) --------------

const FALLBACK_RELEASES: Release[] = [
  { ver: "v1.53.0", date: "May 13, 2026", latest: true, href: "https://github.com/authzed/spicedb/releases/tag/v1.53.0" },
  { ver: "v1.52.0", date: "Apr 30, 2026", href: "https://github.com/authzed/spicedb/releases/tag/v1.52.0" },
  { ver: "v1.51.1", date: "Apr 14, 2026", href: "https://github.com/authzed/spicedb/releases/tag/v1.51.1" },
];

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/authzed/spicedb/releases?per_page=10",
      { headers: GH_HEADERS, next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return FALLBACK_RELEASES;
    const data = (await res.json()) as Array<{
      tag_name: string;
      published_at: string;
      html_url: string;
      draft: boolean;
      prerelease: boolean;
    }>;
    const rels = data
      .filter((r) => !r.draft && !r.prerelease && r.published_at)
      .slice(0, 3)
      .map((r, i) => ({
        ver: r.tag_name,
        date: fmtDate(r.published_at),
        latest: i === 0,
        href: r.html_url,
      }));
    return rels.length ? rels : FALLBACK_RELEASES;
  } catch {
    return FALLBACK_RELEASES;
  }
}

// ---- What's New: recent merged docs PRs -----------------------------------
// The docs repo's merge stream is mostly automated syncs + chores, so we
// filter hard and fall back to a real curated list when too little survives.

const FALLBACK_WHATSNEW: WhatsNewItem[] = [
  { date: "Jun 2026", title: "Materialize promoted to its own documentation section", href: "/materialize/getting-started/overview" },
  { date: "May 27, 2026", title: "Native dark-mode support for the API reference", href: "https://github.com/authzed/docs/pull/501" },
  { date: "May 19, 2026", title: "Guide: using Postgres FDW with SpiceDB", href: "/spicedb/ops/postgres-fdw" },
  { date: "Apr 2026", title: "MCP server reference for connecting AI agents", href: "/mcp" },
];

// drop bot/chore/tooling churn that isn't reader-facing "what's new"
const NOISE =
  /^(auto-generated|chore|ci|build|test|refactor|style|revert|bump|deps)\b|dependabot|patch-\d|update (zed|spicedb) docs/i;

function cleanTitle(t: string): string {
  const stripped = t.replace(/^(feat|fix|docs|add)(\([^)]*\))?:\s*/i, "").trim();
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

export async function getWhatsNew(): Promise<WhatsNewItem[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/authzed/docs/pulls?state=closed&per_page=40&sort=updated&direction=desc",
      { headers: GH_HEADERS, next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return FALLBACK_WHATSNEW;
    const data = (await res.json()) as Array<{
      title: string;
      merged_at: string | null;
      html_url: string;
    }>;
    const items = data
      .filter((p) => p.merged_at && !NOISE.test(p.title))
      .slice(0, 4)
      .map((p) => ({
        date: fmtDate(p.merged_at as string),
        title: cleanTitle(p.title),
        href: p.html_url,
      }));
    // only trust the dynamic feed when it surfaces a real list; otherwise the
    // curated fallback reads far better than 1–2 stray PRs
    return items.length >= 3 ? items : FALLBACK_WHATSNEW;
  } catch {
    return FALLBACK_WHATSNEW;
  }
}
