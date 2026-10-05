import { Feedback } from "@/components/feedback";
import { TocCTA } from "@/components/cta";
import { FeatureNotes } from "@/components/feature-notes";

export function TocExtraContent() {
  return (
    <>
      {/* Page-specific, so it sits above the generic Cloud prompt. Renders
          nothing outside the Materialize section. */}
      <FeatureNotes placement="rail" />
      <TocCTA />
      <Feedback />
    </>
  );
}
