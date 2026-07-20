"use client";

import "./feature-notes.css";
import { usePathname } from "next/navigation";
import { FEATURES, EARLY_ACCESS, featuresForPath } from "@/lib/materialize-features";

const DEDICATED = "https://authzed.com/docs/authzed/guides/picking-a-product#dedicated";

/* The early-access story for whichever feature(s) the current page documents —
   what the asterisk on the pill means. Renders nothing outside Materialize.

   Rendered TWICE, in two placements, with CSS showing exactly one:

     rail   — docked in the TOC column, the preferred home
     inline — directly under the pills, for narrow viewports

   Nextra hides the TOC below 80rem (`x:max-xl:hidden`), so on a laptop or
   phone the rail copy is gone and the asterisk would point at nothing. The
   inline copy takes over at exactly that breakpoint. Both are in the DOM;
   `display: none` keeps the hidden one out of the accessibility tree too.

   Tinted with the same feature token as its pill (app/globals.css) so the
   pill and the note read as one marker, not two unrelated notices. */
export function FeatureNotes({ placement }: { placement: "rail" | "inline" }) {
  const features = featuresForPath(usePathname()).filter((key) => EARLY_ACCESS[key]);
  if (features.length === 0) return null;

  return (
    <div className={`feature-notes feature-notes-${placement}`}>
      {features.map((key) => (
        <aside key={key} className={`feature-note feature-note-${key}`}>
          <p className="feature-note-head">
            <span className="feature-note-mark" aria-hidden="true">
              *
            </span>
            {FEATURES[key].label}
          </p>
          <p className="feature-note-body">
            In early access for{" "}
            <a href={DEDICATED} target="_blank" rel="noreferrer">
              AuthZed Dedicated
            </a>{" "}
            users. Talk to your account team to take part.
          </p>
        </aside>
      ))}
    </div>
  );
}
