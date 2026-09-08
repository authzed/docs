import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { Component } from "react";
import { Yes, No, Absent } from "@/components/feature-icon";
import { FeatureBadge } from "@/components/feature-badge";

const docsComponents = getDocsMDXComponents();

export const useMDXComponents = (components?: Component) => ({
  ...docsComponents,
  Yes,
  No,
  Absent,
  FeatureBadge,
  ...components,
});
