import "./product-badge.css";
import Link from "next/link";
import {
  FEATURE_MATRIX_HREF,
  PRODUCTS,
  PRODUCT_ORDER,
  type ProductKey,
} from "@/lib/products";

/* Which AuthZed products a page's feature ships on. Used in MDX right under
   the H1 of a concept page:

     <ProductBadge available={["cloud", "dedicated", "enterprise"]} />
     <ProductBadge available={["dedicated"]} diy={["open-source", "enterprise"]} />

   Every tier is always rendered, in Feature Matrix order, so the reader sees
   what a feature is NOT on as clearly as what it is on. A prose sentence
   ("exclusive to AuthZed products") blends into the intro; a struck-out
   "Open Source" pill does not. `diy` mirrors the matrix's DIY cells: you can
   build it yourself, we don't ship it.

   Sibling of feature-badge.tsx (Materialize feature identity). This one is
   props-driven rather than route-driven because availability is per-page
   data the author states, not something derivable from the URL. */
type Props = {
  available: readonly ProductKey[];
  diy?: readonly ProductKey[];
};

export function ProductBadge({ available, diy = [] }: Props) {
  return (
    <span
      className="product-badge-row"
      role="group"
      aria-label="Product availability"
    >
      <Link href={FEATURE_MATRIX_HREF} className="product-badge-label">
        Available on
      </Link>
      {PRODUCT_ORDER.map((key) => {
        const { label, href } = PRODUCTS[key];
        const state = available.includes(key)
          ? "yes"
          : diy.includes(key)
            ? "diy"
            : "no";
        return (
          <Link
            key={key}
            href={href}
            className={`product-badge product-badge-${state}`}
          >
            {state === "no" ? <s>{label}</s> : label}
            {state === "diy" && (
              <span className="product-badge-suffix">DIY</span>
            )}
            <span className="product-badge-sr">
              {state === "yes"
                ? " (available)"
                : state === "diy"
                  ? " (build it yourself)"
                  : " (not available)"}
            </span>
          </Link>
        );
      })}
    </span>
  );
}
