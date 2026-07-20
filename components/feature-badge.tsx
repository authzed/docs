import "./feature-badge.css";
import Link from "next/link";

const FEATURES = {
  "accelerated-queries": {
    label: "Accelerated Queries",
    status: "GA",
    href: "/materialize/getting-started/overview#accelerated-queries",
  },
  "event-streams": {
    label: "Event Streams",
    status: "Early Access",
    href: "/materialize/getting-started/overview#event-streams",
  },
} as const;

/* Marks which Materialize feature a page belongs to, and that feature's
   release status (an intrinsic property of the feature, not of the page).
   Used in MDX as <FeatureBadge feature="event-streams" /> right under the
   H1 (mdx-components.ts). Links back to that feature's definition on the
   Overview page. */
export function FeatureBadge({ feature }: { feature: keyof typeof FEATURES }) {
  const { label, status, href } = FEATURES[feature];
  return (
    <Link href={href} className={`feature-badge feature-badge-${feature}`}>
      {label} · {status}
    </Link>
  );
}
