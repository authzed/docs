"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Announcement bar — terminal style matching the marketing site
   (projects/web AnnouncementBar): sand-300 braille cursor, mono copy, a
   bracketed CTA, and a right-aligned GitHub repo + star. Styling lives in
   globals.css under `.docs-announce`. The braille cursor runs a short burst on
   load, then rests; hovering the bar runs it again. */
export default function Banner({ stars = "5.7k" }: { stars?: string }) {
  const pathname = usePathname();
  const isCommercial = pathname?.startsWith("/authzed/");
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSpin(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={"docs-announce" + (spin ? " spin" : "")}
      onMouseEnter={() => setSpin(true)}
      onMouseLeave={() => setSpin(false)}
    >
      <span className="da-spinner" aria-hidden="true" />
      <div className="da-body">
        {isCommercial ? (
          <>
            We annotated Google&rsquo;s Zanzibar paper with extra context and SpiceDB comparisons.{" "}
            <span className="da-bracket">[</span>
            <a href="https://authzed.com/zanzibar?utm_source=docs">Read the annotated paper</a>
            <span className="da-bracket">]</span>
          </>
        ) : (
          <>
            SpiceDB is 100% open source. <span className="da-bracket">[</span>
            <a href="https://github.com/authzed/spicedb">Star us on GitHub</a>
            <span className="da-bracket">]</span>
          </>
        )}
      </div>
      <div className="da-meta" aria-hidden="true">
        <span className="da-prompt">&gt;</span>
        <a href="https://github.com/authzed/spicedb">github.com/authzed/spicedb</a>
        <span className="da-star">★</span>
        <span>{stars}</span>
      </div>
    </div>
  );
}
