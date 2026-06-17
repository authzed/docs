import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { Component } from "react";
import { Yes, No } from "@/components/feature-icon";

const docsComponents = getDocsMDXComponents();

export const useMDXComponents = (components?: Component) => ({
  ...docsComponents,
  Yes,
  No,
  ...components,
});
