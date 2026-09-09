"use client";

import "./product-badge.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCTS, PRODUCT_ORDER, availabilityForPath, type ProductKey } from "@/lib/products";
import { featuresForPath } from "@/lib/materialize-features";
import { FeatureBadge } from "./feature-badge";

/* Which AuthZed products a page applies to. Rendered under every H1 by
   mdx-components.ts; the tiers come from the route via lib/products.ts
   (section defaults plus per-page facts), so pages carry no markup. Props
   are accepted for a one-off placement with explicit tiers:

     <ProductBadge available={["dedicated"]} diy={["open-source", "enterprise"]} />

   Reads left to right as a sentence: AVAILABLE ON, the tiers that have it
   (sand), the tiers where you build it yourself (dashed, DIY suffix; mirrors
   the Feature Matrix's DIY cells), then one stone "Not in …" pill naming the
   tiers that don't. The negative is spelled out rather than shown by
   striking or dimming a pill: a reader who lands mid-page from a deep link
   needs "not in Open Source" in one glance, not a decode. A page where
   nothing is excluded gets no negative pill at all, and a page on exactly
   one tier says "Dedicated only" instead of listing the three it is not on.

   On Materialize pages the feature pills (feature-badge.tsx) join this row
   after a divider, so a page has one header strip, not two stacked rows. */
type Props = {
  available?: readonly ProductKey[];
  diy?: readonly ProductKey[];
};

export function ProductBadge(props: Props) {
  const pathname = usePathname();
  const fromRoute = availabilityForPath(pathname);
  const hasFeatures = featuresForPath(pathname).length > 0;
  const available = props.available ?? fromRoute?.available;
  const diy = props.diy ?? fromRoute?.diy ?? [];
  if (!available) return null;

  const yes = PRODUCT_ORDER.filter((k) => available.includes(k));
  const build = PRODUCT_ORDER.filter((k) => !available.includes(k) && diy.includes(k));
  const missing = PRODUCT_ORDER.filter((k) => !available.includes(k) && !diy.includes(k));
  const only = yes.length === 1 && build.length === 0 && missing.length > 0;

  return (
    <span className="product-badge-row" role="group" aria-label="Product availability">
      <span className="product-badge-label">Available on</span>
      {yes.map((k) => (
        <Link key={k} href={PRODUCTS[k].href} className="product-badge product-badge-yes">
          {PRODUCTS[k].label}
          {only && " only"}
        </Link>
      ))}
      {build.map((k) => (
        <Link key={k} href={PRODUCTS[k].href} className="product-badge product-badge-diy">
          {PRODUCTS[k].label}
          <span className="product-badge-suffix" aria-hidden="true">
            DIY
          </span>
          <span className="product-badge-sr"> (build it yourself)</span>
        </Link>
      ))}
      {missing.length > 0 && !only && (
        <span className="product-badge product-badge-not">
          <span className="product-badge-glyph" aria-hidden="true">
            ✕
          </span>
          Not in {missing.map((k) => PRODUCTS[k].label).join(", ")}
        </span>
      )}
      {hasFeatures && (
        <>
          <span className="product-badge-divider" aria-hidden="true" />
          <FeatureBadge />
        </>
      )}
    </span>
  );
}
