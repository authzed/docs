import posthog from "posthog-js";
import { isEUVisitor, shouldOptOutCapturing } from "@/lib/consent";

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

const initPostHog = () => {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !isProd) {
    return;
  }

  const optOut = shouldOptOutCapturing(isEUVisitor());

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/i",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-11-30",
    person_profiles: "always",
    cross_subdomain_cookie: true,
    opt_out_capturing_by_default: optOut,
    opt_out_persistence_by_default: optOut,
    cookieless_mode: "on_reject",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
};

initPostHog();
