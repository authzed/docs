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
  const onPage = featuresForPath(usePathname());
  const early = onPage.filter((key) => EARLY_ACCESS[key]);
  if (early.length === 0) return null;

  /* The head line names the feature because the rail sits in its own column,
     far from the pill it answers. Inline it lands directly under that pill, so
     the name is already on screen and the head just repeats it — and on a
     dual-feature page (Snapshots) the identical body prints twice underneath.
     Collapse to a single headless note whenever every pill on the page carries
     the asterisk. Keep the heads when only some do: once one feature reaches
     GA the reader needs to know which pill the note is about. */
  if (placement === "inline" && early.length === onPage.length) {
    /* Accent only when there's exactly one pill to match it to. Two pills
       would force the note to pick a side, so those get a neutral rule. */
    const tint = early.length === 1 ? ` feature-note-${early[0]}` : "";
    return (
      <div className={`feature-notes feature-notes-${placement}`}>
        <aside className={`feature-note feature-note-collapsed${tint}`}>
          <p className="feature-note-body">
            <span className="feature-note-mark" aria-hidden="true">
              *
            </span>
            <EarlyAccessCopy />
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className={`feature-notes feature-notes-${placement}`}>
      {early.map((key) => (
        <aside key={key} className={`feature-note feature-note-${key}`}>
          <p className="feature-note-head">
            <span className="feature-note-mark" aria-hidden="true">
              *
            </span>
            {FEATURES[key].label}
          </p>
          <p className="feature-note-body">
            <EarlyAccessCopy />
          </p>
        </aside>
      ))}
    </div>
  );
}

/* Feature-independent by design — it's the same offer for both. That's what
   makes the collapsed placement safe to render once. */
function EarlyAccessCopy() {
  return (
    <>
      In early access for{" "}
      <a href={DEDICATED} target="_blank" rel="noreferrer">
        AuthZed Dedicated
      </a>{" "}
      users. Talk to your account team to take part.
    </>
  );
}
