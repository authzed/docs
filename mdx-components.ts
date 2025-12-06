import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { Component } from "react";

const docsComponents = getDocsMDXComponents();

export const useMDXComponents = (components?: Component) => ({
  ...docsComponents,
  ...components,
});
