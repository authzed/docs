"use client";

import "./docs-home.css";
import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import type { Release, WhatsNewItem } from "@/lib/home-data";

/* Internal links go through next/link so the deploy's basePath (/docs) is
   applied; external links fall back to a plain anchor. */
function Lnk({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children?: ReactNode;
}) {
  const Tag = (href.startsWith("/") ? Link : "a") as ElementType;
  return (
    <Tag href={href} className={className}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------------------
   AuthZed Docs — home / welcome experience ("Editorial Pro")
   The docs index as an exquisitely typeset technical manual: oversized tabular
   numerals, a brand-gradient spine, print-grade type, and entries that expand
   on hover/focus to reveal their real sub-navigation. Pure-CSS disclosure —
   content is fully visible without JS and under reduced-motion.
   Styling + Sandworm tokens are scoped under `.docs-home` in docs-home.css.
   --------------------------------------------------------------------------- */

type Sublink = { label: string; href: string };
type Entry = {
  num: string;
  name: string;
  href: string;
  desc: string;
  tag: string;
  accent: string; // a Sandworm accent var, e.g. "var(--magenta-500)"
  badge?: string;
  sublinks: Sublink[];
};

const ENTRIES: Entry[] = [
  {
    num: "01",
    name: "SpiceDB",
    href: "/spicedb/getting-started/discovering-spicedb",
    desc: "The open–source Zanzibar database — schema language, modeling, operations, and the gRPC / HTTP APIs.",
    tag: "Open source",
    accent: "var(--magenta-500)",
    sublinks: [
      { label: "Getting Started", href: "/spicedb/getting-started/discovering-spicedb" },
      { label: "Concepts", href: "/spicedb/concepts/zanzibar" },
      { label: "Modeling", href: "/spicedb/modeling/developing-a-schema" },
      { label: "Operations", href: "/spicedb/ops/operator" },
      { label: "API Reference", href: "/spicedb/api/http-api" },
      { label: "Best Practices", href: "/spicedb/best-practices" },
    ],
  },
  {
    num: "02",
    name: "Managed SpiceDB",
    href: "/authzed/guides/cloud",
    desc: "Managed, hosted SpiceDB — Cloud and Dedicated, private networking, audit logging, and more.",
    tag: "Managed platform",
    accent: "var(--teal-500)",
    sublinks: [
      { label: "Guides", href: "/authzed/guides/picking-a-product" },
      { label: "Concepts", href: "/authzed/concepts/audit-logging" },
      { label: "API Reference", href: "/authzed/api/http-api" },
    ],
  },
  {
    num: "03",
    name: "Materialize",
    href: "/materialize/getting-started/overview",
    desc: "Precomputed permissions and change streams — materialized permission sets for search, filtering, and reverse indexes at scale.",
    tag: "Managed platform",
    accent: "var(--violet-500)",
    badge: "New",
    sublinks: [
      { label: "Overview", href: "/materialize/getting-started/overview" },
      { label: "Concepts", href: "/materialize/concepts/permission-sets" },
      { label: "API Reference", href: "/materialize/api/watch-permission-sets" },
    ],
  },
  {
    num: "04",
    name: "MCP",
    href: "/mcp",
    desc: "Model Context Protocol servers — connect AuthZed and SpiceDB to AI agents and assistants.",
    tag: "Guides & reference",
    accent: "var(--blue-500)",
    sublinks: [
      { label: "Overview", href: "/mcp" },
      { label: "AuthZed Server", href: "/mcp" },
      { label: "SpiceDB Dev Server", href: "/mcp" },
    ],
  },
];

const ArrowIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

/* Hero texture — the relationship graph as an ambient field. Straight edges, a
   dense jittered lattice of objects with many connections, several relations
   lighting up as signals travel them, and a hard radial fade at every border so
   it dissolves off-frame — implying the graph keeps going. Deterministic layout
   (seeded, no Math.random) keeps server/client markup identical. aria-hidden. */
type GPoint = [number, number];

function gseed(i: number, s: number): number {
  const x = Math.sin(i * 127.1 + s * 311.7 + 7.13) * 43758.5453;
  return x - Math.floor(x);
}

// organic jittered field spilling past the 0–380 viewBox so the outer ring
// dissolves under the radial mask — free-floating, no grid (a snapped grid
// read too stiff)
const G_NODES: GPoint[] = (() => {
  const cols = 8,
    rows = 8,
    span = 450,
    origin = -35,
    out: GPoint[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = origin + (c / (cols - 1)) * span + (gseed(i, 1) - 0.5) * 52;
      const y = origin + (r / (rows - 1)) * span + (gseed(i, 2) - 0.5) * 52;
      out.push([+x.toFixed(1), +y.toFixed(1)]);
    }
  }
  return out;
})();

// connect each object to its 3 nearest neighbours → many straight relations
const G_EDGES: [number, number][] = (() => {
  const out: [number, number][] = [],
    seen = new Set<string>();
  G_NODES.forEach((a, i) => {
    G_NODES.map((b, j) => [j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2] as [number, number])
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 3)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([i, j]);
        }
      });
  });
  return out;
})();

function polyD(ids: number[]): string {
  return ids.map((id, k) => `${k ? "L" : "M"}${G_NODES[id][0]} ${G_NODES[id][1]}`).join(" ");
}

// nodes inside the visible core (off-frame nodes only exist to bleed the fade)
const G_VISIBLE = G_NODES.map((n, i) => [i, n] as [number, GPoint]).filter(
  ([, n]) => n[0] > 18 && n[0] < 362 && n[1] > 18 && n[1] < 362,
);

// a "check" — nearest-neighbour walk from a seed node, winding through the field
function walk(start: number, steps: number): number[] {
  let curr = start;
  const path = [curr],
    used = new Set([curr]);
  for (let s = 0; s < steps; s++) {
    let best = -1,
      bd = Infinity;
    G_VISIBLE.forEach(([j]) => {
      if (used.has(j)) return;
      const d = (G_NODES[curr][0] - G_NODES[j][0]) ** 2 + (G_NODES[curr][1] - G_NODES[j][1]) ** 2;
      if (d < bd) {
        bd = d;
        best = j;
      }
    });
    if (best < 0) break;
    used.add(best);
    path.push(best);
    curr = best;
  }
  return path;
}
const nearest = (ax: number, ay: number) =>
  G_VISIBLE.reduce((a, b) => {
    const da = (G_NODES[a][0] - ax) ** 2 + (G_NODES[a][1] - ay) ** 2;
    const db = (b[1][0] - ax) ** 2 + (b[1][1] - ay) ** 2;
    return db < da ? b[0] : a;
  }, G_VISIBLE[0][0]);

// six different checks of mixed length (long winders + short hops), each seeded
// from a different region and lit in its own colour — they take turns resolving
// (sequenced in CSS via --i, one 3s slot each of an 18s loop)
const CHECK_SPECS: { at: [number, number]; len: number; acc: string }[] = [
  { at: [50, 70], len: 13, acc: "var(--violet-400)" },
  { at: [330, 90], len: 4, acc: "var(--magenta-400)" },
  { at: [300, 310], len: 9, acc: "var(--blue-500)" },
  { at: [80, 300], len: 3, acc: "var(--sand-300)" },
  { at: [200, 180], len: 11, acc: "var(--red-400)" },
  { at: [250, 120], len: 5, acc: "var(--violet-400)" },
];
const G_CHECKS = CHECK_SPECS.map((s) => ({
  path: walk(nearest(s.at[0], s.at[1]), s.len),
  acc: s.acc,
}));

function HeroGraph() {
  return (
    <div className="hero-graph" aria-hidden="true">
      <svg viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* relations — faint teal field; each edge breathes on its own clock so
            the visible web keeps shifting (always a different set of traces) */}
        <g className="g-mesh">
          {G_EDGES.map(([i, j], k) => {
            const a = G_NODES[i],
              b = G_NODES[j];
            return (
              <line
                key={k}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                style={{
                  animationDuration: `${(5 + gseed(k, 7) * 6).toFixed(1)}s`,
                  animationDelay: `${(-gseed(k, 8) * 11).toFixed(1)}s`,
                }}
              />
            );
          })}
        </g>

        {/* idle objects */}
        {G_NODES.map((n, i) => (
          <circle
            key={i}
            className={`g-obj${i % 3 === 0 ? " g-tw" : ""}`}
            cx={n[0]}
            cy={n[1]}
            r="2.2"
            style={
              i % 3 === 0 ? { animationDelay: `${(gseed(i, 3) * -4).toFixed(1)}s` } : undefined
            }
          />
        ))}

        {/* the checks — each takes its turn threading the graph */}
        {G_CHECKS.map((chk, ci) => {
          const d = polyD(chk.path);
          const end = chk.path[chk.path.length - 1];
          return (
            <g
              className="g-check"
              key={ci}
              style={{ ["--acc" as string]: chk.acc, ["--i" as string]: ci }}
            >
              <path className="g-trace-halo" d={d} filter="url(#hg-glow)" pathLength={100} />
              <path className="g-trace" d={d} pathLength={100} />
              <path className="g-trace-spark" d={d} pathLength={100} />
              {chk.path.map((id, k) => {
                const n = G_NODES[id];
                const f = chk.path.length > 1 ? k / (chk.path.length - 1) : 0;
                return (
                  <circle
                    key={`n${id}`}
                    className={`g-tnode${id === end ? " g-tnode--end" : ""}`}
                    cx={n[0]}
                    cy={n[1]}
                    r={id === end ? 3.2 : 2.6}
                    style={{ ["--f" as string]: f.toFixed(3) }}
                  />
                );
              })}
              {chk.path.map((id, k) => {
                const n = G_NODES[id];
                const f = chk.path.length > 1 ? k / (chk.path.length - 1) : 0;
                return (
                  <circle
                    key={`c${id}`}
                    className="g-tcore"
                    cx={n[0]}
                    cy={n[1]}
                    r="1.3"
                    style={{ ["--f" as string]: f.toFixed(3) }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Focus Nextra's navbar search so the hero search affordance works. */
function openSearch() {
  if (typeof document === "undefined") return;
  const input = document.querySelector<HTMLInputElement>(
    '.nextra-search input, input[type="search"]',
  );
  if (input) {
    input.focus();
    input.click();
  }
}

export function DocsHome({
  releases,
  whatsNew,
}: {
  releases: Release[];
  whatsNew: WhatsNewItem[];
}) {
  return (
    <div className="docs-home">
      <div className="page">
        <main>
          <section className="hero">
            <div className="hero-text">
              <h1>
                Everything you need to build <em>with SpiceDB.</em>
              </h1>
              <p className="standfirst">
                Relationship-based access control, the Google Zanzibar way: model a{" "}
                <code>schema</code>, write <code>relationships</code>, and call{" "}
                <code>CheckPermission</code> from your code. Quickstarts, schema modeling, client
                SDKs, and full gRPC and HTTP API references — for the open-source SpiceDB engine and
                the managed AuthZed platform.
              </p>
              <div className="hero-tools">
                <Lnk className="hero-btn" href="/spicedb/getting-started/discovering-spicedb">
                  Get started with SpiceDB
                  <ArrowIcon />
                </Lnk>
                <button
                  className="hero-search"
                  type="button"
                  onClick={openSearch}
                  aria-label="Search the documentation"
                >
                  <span className="ico">
                    <SearchIcon />
                  </span>
                  <span className="grow">Search the docs…</span>
                  <kbd>⌘K</kbd>
                </button>
              </div>
            </div>
            <HeroGraph />
          </section>

          <section aria-label="Documentation index">
            <div className="index-head">
              <span>Docs Index</span>
              <span>Four surfaces</span>
            </div>

            {ENTRIES.map((e) => (
              <article className="entry" key={e.num} style={{ ["--accent" as string]: e.accent }}>
                <div className="entry-row">
                  <span className="entry-num">{e.num}</span>
                  <div className="entry-main">
                    <h2 className="entry-name">
                      <Lnk className="entry-title" href={e.href}>
                        {e.name}
                      </Lnk>
                      {e.badge && <span className="pill">{e.badge}</span>}
                    </h2>
                    <p className="entry-desc">{e.desc}</p>
                    <div className="entry-more">
                      <div>
                        <div className="entry-sublinks">
                          {e.sublinks.map((s) => (
                            <Lnk key={s.label} href={s.href}>
                              {s.label}
                            </Lnk>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="entry-meta">
                    <span className="entry-tag">{e.tag}</span>
                    <span className="entry-arrow">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="activity" aria-label="What's new and latest releases">
            <div className="activity-col">
              <div className="activity-label">What&rsquo;s new</div>
              <p className="activity-sub">Recent additions across the documentation.</p>
              <div className="whatsnew">
                {whatsNew.map((n) => (
                  <Lnk className="wn-row" href={n.href} key={n.title}>
                    <span className="wn-date">{n.date}</span>
                    <span className="wn-title">{n.title}</span>
                  </Lnk>
                ))}
              </div>
            </div>
            <div className="activity-col">
              <div className="activity-label">Latest releases</div>
              <p className="activity-sub">Recent SpiceDB open&ndash;source releases.</p>
              <div className="releases">
                {releases.map((r) => (
                  <Lnk className="rel-row" href={r.href} key={r.ver}>
                    <span className="rel-ver">
                      {r.ver}
                      {r.latest && <span className="rel-tag">Latest</span>}
                    </span>
                    <span className="rel-meta">{r.date}</span>
                  </Lnk>
                ))}
              </div>
            </div>
          </section>

          <footer className="colophon">
            <p>
              Permissions modeled as a <b>graph</b>, not a tangle of <code>if</code> statements.
            </p>
            <div className="links">
              <Lnk href="https://github.com/authzed/spicedb">GitHub</Lnk>
              <Lnk href="https://authzed.com/discord">Discord</Lnk>
              <Lnk href="https://authzed.com">authzed.com</Lnk>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
