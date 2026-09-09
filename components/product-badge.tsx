import "./product-badge.css";
import Link from "next/link";
import { PRODUCTS, PRODUCT_ORDER, type ProductKey } from "@/lib/products";

/* Which AuthZed products a page's feature ships on. Used in MDX right under
   the H1 of a concept page:

     <ProductBadge available={["cloud", "dedicated", "enterprise"]} />
     <ProductBadge available={["dedicated"]} diy={["open-source", "enterprise"]} />

   Reads left to right as a sentence: AVAILABLE ON, the tiers that have it
   (sand), the tiers where you build it yourself (dashed, DIY suffix; mirrors
   the Feature Matrix's DIY cells), then one stone "Not in …" pill naming the
   tiers that don't. The negative is spelled out rather than shown by
   striking or dimming a pill: a reader who lands mid-page from a deep link
   needs "not in Open Source" in one glance, not a decode. A page where
   nothing is excluded gets no negative pill at all.

   Sibling of feature-badge.tsx (Materialize feature identity). This one is
   props-driven rather than route-driven because availability is per-page
   data the author states, not something derivable from the URL. */
type Props = {
  available: readonly ProductKey[];
  diy?: readonly ProductKey[];
};

export function ProductBadge({ available, diy = [] }: Props) {
  const yes = PRODUCT_ORDER.filter((k) => available.includes(k));
  const build = PRODUCT_ORDER.filter(
    (k) => !available.includes(k) && diy.includes(k),
  );
  const missing = PRODUCT_ORDER.filter(
    (k) => !available.includes(k) && !diy.includes(k),
  );

  return (
    <span
      className="product-badge-row"
      role="group"
      aria-label="Product availability"
    >
      <span className="product-badge-label">Available on</span>
      {yes.map((k) => (
        <Link
          key={k}
          href={PRODUCTS[k].href}
          className="product-badge product-badge-yes"
        >
          {PRODUCTS[k].label}
        </Link>
      ))}
      {build.map((k) => (
        <Link
          key={k}
          href={PRODUCTS[k].href}
          className="product-badge product-badge-diy"
        >
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
