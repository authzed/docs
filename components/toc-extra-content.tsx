import { Feedback } from "@/components/feedback";
import { FeatureNotes } from "@/components/feature-notes";

export function TocExtraContent() {
  return (
    <>
      {/* Page-specific; renders nothing outside the Materialize section. */}
      <FeatureNotes placement="rail" />
      <Feedback />
    </>
  );
}
