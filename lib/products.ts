/* The AuthZed product tiers, in the order the Feature Matrix on
   authzed/guides/picking-a-product lists them. Single source for the
   product-availability pill (components/product-badge.tsx) so page markers
   and the matrix name the same tiers with the same links. */

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

export const FEATURE_MATRIX_HREF = "/authzed/guides/picking-a-product#feature-matrix";
