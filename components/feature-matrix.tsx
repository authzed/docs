import "./feature-matrix.css";
import type { ReactNode } from "react";

/* Wraps a markdown feature matrix so it reads like the pricing and Support
   comparison tables on authzed.com instead of Nextra's default zebra table:
   mono row labels, horizontal rules only, a group-label row for a feature
   family (a bold first cell with the rest empty), row hover, plain-text
   column headers. Used in MDX as <FeatureMatrix>…table…</FeatureMatrix>
   (mdx-components.ts). Styling lives in feature-matrix.css. */
export function FeatureMatrix({ children }: { children: ReactNode }) {
  return <div className="feature-matrix">{children}</div>;
}
