"use client";

import "./product-badge.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCTS, PRODUCT_ORDER, availabilityForPath, type ProductKey } from "@/lib/products";

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
   nothing is excluded gets no negative pill at all.

   Sibling of feature-badge.tsx (Materialize feature identity). */
type Props = {
  available?: readonly ProductKey[];
  diy?: readonly ProductKey[];
};

export function ProductBadge(props: Props) {
  const fromRoute = availabilityForPath(usePathname());
  const available = props.available ?? fromRoute?.available;
  const diy = props.diy ?? fromRoute?.diy ?? [];
  if (!available) return null;

  const yes = PRODUCT_ORDER.filter((k) => available.includes(k));
  const build = PRODUCT_ORDER.filter((k) => !available.includes(k) && diy.includes(k));
  const missing = PRODUCT_ORDER.filter((k) => !available.includes(k) && !diy.includes(k));

  return (
    <span className="product-badge-row" role="group" aria-label="Product availability">
      <span className="product-badge-label">Available on</span>
      {yes.map((k) => (
        <Link key={k} href={PRODUCTS[k].href} className="product-badge product-badge-yes">
          {PRODUCTS[k].label}
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
      {missing.length > 0 && (
        <span className="product-badge product-badge-not">
          <span className="product-badge-glyph" aria-hidden="true">
            ✕
          </span>
          Not in {missing.map((k) => PRODUCTS[k].label).join(", ")}
        </span>
      )}
    </span>
  );
}
