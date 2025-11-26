import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Layout from "@/components/layout";
import "../globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <SpeedInsights />
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
      </PostHogProvider>
    </Layout>
  );
}
