"use client";

import "./feature-badge.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FEATURES, EARLY_ACCESS, featuresForPath } from "@/lib/materialize-features";
import { FeatureNotes } from "./feature-notes";

/* Marks which Materialize feature a page belongs to. Used in MDX as a bare
   <FeatureBadge /> right under the H1 (mdx-components.ts) — the feature is
   read from the route via lib/materialize-features.ts, so a page that spans
   both features (Snapshots) renders both pills without repeating itself.

   Identity, not status: a pill has no room to say what "Early Access" means
   or who to contact, so it carries an asterisk instead, and the note in the
   TOC rail (feature-notes.tsx) tells that story in the matching colour. */
export function FeatureBadge() {
  const features = featuresForPath(usePathname());
  if (features.length === 0) return null;

  return (
    <>
      <span className="feature-badge-row">
        {features.map((key) => {
          const { label, href } = FEATURES[key];
          return (
            <Link key={key} href={href} className={`feature-badge feature-badge-${key}`}>
              {label}
              {EARLY_ACCESS[key] && (
                <>
                  <span className="feature-badge-mark" aria-hidden="true">
                    *
                  </span>
                  <span className="feature-badge-sr"> (in early access)</span>
                </>
              )}
            </Link>
          );
        })}
      </span>
      {/* Shown only below Nextra's TOC breakpoint, where the rail copy is
          hidden and the asterisk would otherwise point at nothing. */}
      <FeatureNotes placement="inline" />
    </>
  );
}
