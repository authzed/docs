import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Yes, No } from "@/components/feature-icon";
import { PRODUCTS, PRODUCT_ORDER, availabilityForPath } from "@/lib/products";
import "./review.css";

export const metadata = { title: "Product availability review" };

/* REVIEW AID — one table of every docs page and the product pill it renders,
   so product can confirm the map in lib/products.ts in one sitting. Preview
   deploys and local dev only, hidden from the nav. Delete this route once
   the map is signed off. */
const SHOW = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

/* Rows whose tiers come straight from a Feature Matrix row on
   authzed/guides/picking-a-product. */
const MATRIX = new Set([
  "/authzed/concepts/audit-logging",
  "/authzed/concepts/restricted-api-access",
  "/authzed/concepts/workload-isolation",
  "/authzed/concepts/private-networking",
  "/authzed/concepts/management-dashboard",
  "/authzed/concepts/multi-region",
  "/authzed/concepts/update-channels",
  "/authzed/concepts/rate-limiting",
  "/authzed/concepts/security-embargo",
  "/authzed/guides/setting-up-private-networking",
]);

/* Rows set by judgment with no matrix row or section rule to lean on. */
const CONFIRM: Record<string, string> = {
  "/authzed/concepts/deployments": "Assumed Cloud + Dedicated (managed deployments).",
  "/authzed/concepts/feature-maturity": "Assumed all managed tiers.",
  "/authzed/api/http-api": "Assumed all managed tiers; page duplicates the SpiceDB HTTP API doc.",
  "/mcp": "Assumed all four; unclear which products the MCP servers target.",
  "/mcp/authzed/authzed-mcp-server": "Assumed all four.",
  "/mcp/authzed/spicedb-dev-mcp-server": "Assumed all four; reads as an OSS dev tool.",
  "/spicedb/getting-started/install":
    "Install pages read “Not in Cloud, Dedicated”. True, but product may prefer no pill here.",
};

type Row = { route: string; title: string };

function collectPages(): Row[] {
  const root = path.join(process.cwd(), "app");
  const out: Row[] = [];
  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name === "page.mdx") {
        const rel = path.relative(root, path.dirname(full));
        const route = "/" + rel.split(path.sep).join("/");
        const title =
          fs
            .readFileSync(full, "utf8")
            .match(/^title:\s*"?([^"\n]*)"?/m)?.[1]
            ?.trim() ?? "";
        out.push({ route: route === "/." ? "/" : route, title });
      }
    }
  };
  walk(root);
  return out.sort((a, b) => a.route.localeCompare(b.route));
}

function sourceOf(route: string): { kind: "matrix" | "section" | "confirm"; note?: string } {
  if (MATRIX.has(route)) return { kind: "matrix" };
  for (const [prefix, note] of Object.entries(CONFIRM)) {
    if (route === prefix || route.startsWith(prefix + "/")) return { kind: "confirm", note };
  }
  return { kind: "section" };
}

const SOURCE_LABEL = {
  matrix: "Feature Matrix",
  section: "Section default",
  confirm: "Please confirm",
} as const;

export default function ReviewPage() {
  if (!SHOW) notFound();
  const rows = collectPages().map((r) => ({
    ...r,
    a: availabilityForPath(r.route),
    src: sourceOf(r.route),
  }));
  const needs = rows.filter((r) => r.src.kind === "confirm").length;

  return (
    <div className="pa-review">
      <h1>Product availability review</h1>
      <p>
        Every docs page and the <em>Available on</em> pill it renders, from one map in{" "}
        <code>lib/products.ts</code>. Click a page to see the pill in place. Rows marked{" "}
        <strong>Please confirm</strong> ({needs}) were set by judgment; the rest come from a Feature
        Matrix row or from the section the page lives in. To change a row, comment on the PR with
        the page and the tiers.
      </p>
      <div className="pa-legend">
        <span>
          <Yes /> available
        </span>
        <span>
          <span className="pa-diy">DIY</span> build it yourself
        </span>
        <span>
          <No /> not in
        </span>
        <span>
          <span className="pa-none">·</span> no pill on this page
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            {PRODUCT_ORDER.map((k) => (
              <th key={k} className="pa-center">
                {PRODUCTS[k].label}
              </th>
            ))}
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ route, title, a, src }) => (
            <tr key={route} className={src.kind === "confirm" ? "pa-row-confirm" : undefined}>
              <td>
                <Link href={route}>{title || route}</Link>
                <div className="pa-route">{route}</div>
              </td>
              {PRODUCT_ORDER.map((k) => (
                <td key={k} className="pa-center">
                  {!a ? (
                    <span className="pa-none">·</span>
                  ) : a.available.includes(k) ? (
                    <Yes />
                  ) : (a.diy ?? []).includes(k) ? (
                    <span className="pa-diy">DIY</span>
                  ) : (
                    <No />
                  )}
                </td>
              ))}
              <td>
                <span className={`pa-src pa-src-${src.kind}`}>{SOURCE_LABEL[src.kind]}</span>
                {src.note && <div className="pa-note">{src.note}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
