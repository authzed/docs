import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { createElement, Fragment, type Component, type ComponentProps } from "react";
import { Yes, No } from "@/components/feature-icon";
import { FeatureBadge } from "@/components/feature-badge";
import { ProductBadge } from "@/components/product-badge";

const docsComponents = getDocsMDXComponents();
const DocsH1 = docsComponents.h1!;

/* Every page title carries the product-availability pill (lib/products.ts
   decides the tiers from the route; pages with no entry render nothing). */
function H1WithProducts(props: ComponentProps<typeof DocsH1>) {
  return createElement(Fragment, null, createElement(DocsH1, props), createElement(ProductBadge));
}

export const useMDXComponents = (components?: Component) => ({
  ...docsComponents,
  h1: H1WithProducts,
  Yes,
  No,
  FeatureBadge,
  ProductBadge,
  ...components,
});
