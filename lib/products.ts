/* The AuthZed product tiers, in the order the Feature Matrix on
   authzed/guides/picking-a-product lists them, plus which tiers each docs
   page applies to. Single source for the product-availability pill
   (components/product-badge.tsx), which mdx-components.ts renders under
   every H1, so page markers and the matrix name the same tiers with the
   same links and no page has to carry its own markup.

   Paths are basePath-relative: usePathname() strips NEXT_PUBLIC_BASE_DIR. */

export const PRODUCTS = {
  "open-source": {
    label: "Open Source",
    href: "/authzed/guides/picking-a-product#open-source",
  },
  cloud: {
    label: "Cloud",
    href: "/authzed/guides/picking-a-product#cloud",
  },
  dedicated: {
    label: "Dedicated",
    href: "/authzed/guides/picking-a-product#dedicated",
  },
  enterprise: {
    label: "Enterprise",
    href: "/authzed/guides/picking-a-product#enterprise",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export const PRODUCT_ORDER: readonly ProductKey[] = [
  "open-source",
  "cloud",
  "dedicated",
  "enterprise",
];

export type Availability = {
  available: readonly ProductKey[];
  /* Tiers where you can build the equivalent yourself. Mirrors the Feature
     Matrix's DIY cells. */
  diy?: readonly ProductKey[];
};

const ALL: Availability = { available: PRODUCT_ORDER };
const MANAGED: Availability = { available: ["cloud", "dedicated", "enterprise"] };
const SELF_HOSTED: Availability = { available: ["open-source", "enterprise"] };
const DEDICATED: Availability = { available: ["dedicated"] };

/* Section defaults, longest prefix wins. A page not matched by anything
   here or in PAGE_AVAILABILITY renders no pill (the landing pages, the
   product-comparison guide). */
const SECTION_DEFAULTS: Record<string, Availability> = {
  "/spicedb": ALL,
  /* Installing and operating the binary yourself: Cloud and Dedicated run it
     for you, so these pages don't apply there. */
  "/spicedb/getting-started/install": SELF_HOSTED,
  "/spicedb/ops/operator": SELF_HOSTED,
  "/spicedb/ops/deploying-spicedb-operator": SELF_HOSTED,
  "/spicedb/ops/eks": SELF_HOSTED,
  "/authzed": MANAGED,
  "/materialize": DEDICATED,
  "/mcp": ALL,
};

/* Per-page facts, copied from the Feature Matrix where it has a row. Keep
   this list and the matrix in step. */
const PAGE_AVAILABILITY: Record<string, Availability | null> = {
  "/authzed/concepts/audit-logging": MANAGED,
  "/authzed/concepts/restricted-api-access": { ...MANAGED, diy: ["open-source"] },
  "/authzed/concepts/workload-isolation": {
    available: ["cloud", "dedicated"],
    diy: ["open-source", "enterprise"],
  },
  "/authzed/concepts/private-networking": { ...DEDICATED, diy: ["open-source", "enterprise"] },
  "/authzed/concepts/management-dashboard": { available: ["cloud", "dedicated"] },
  "/authzed/concepts/multi-region": { ...DEDICATED, diy: ["open-source", "enterprise"] },
  "/authzed/concepts/update-channels": {
    available: ["cloud", "dedicated"],
    diy: ["open-source", "enterprise"],
  },
  "/authzed/concepts/rate-limiting": MANAGED,
  "/authzed/concepts/security-embargo": MANAGED,
  "/authzed/concepts/deployments": { available: ["cloud", "dedicated"] },
  "/authzed/concepts/feature-maturity": MANAGED,
  "/authzed/guides/cloud": { available: ["cloud"] },
  "/authzed/guides/postgres-fdw": { available: ["cloud", "dedicated"] },
  "/authzed/guides/setting-up-private-networking": DEDICATED,
  "/authzed/guides/picking-a-product": null,
  "/authzed/api/http-api": MANAGED,
  "/spicedb/getting-started/discovering-spicedb": null,
  "/spicedb/getting-started/installing-zed": ALL,
};

export function availabilityForPath(pathname: string | null): Availability | null {
  if (!pathname) return null;
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (clean in PAGE_AVAILABILITY) return PAGE_AVAILABILITY[clean];
  let best: string | null = null;
  for (const prefix of Object.keys(SECTION_DEFAULTS)) {
    if (
      (clean === prefix || clean.startsWith(prefix + "/")) &&
      (!best || prefix.length > best.length)
    ) {
      best = prefix;
    }
  }
  return best ? SECTION_DEFAULTS[best] : null;
}
