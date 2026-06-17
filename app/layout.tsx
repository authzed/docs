import { Layout, Navbar, Footer } from "nextra-theme-docs";
import Link from "next/link";
import { Head, Search, Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import Logo from "@/components/icons/logo.svg";
import LogoIcon from "@/components/icons/logo-icon.svg";
import BannerContents from "@/components/banner";
import Providers from "@/components/providers";
import { TocExtraContent } from "@/components/toc-extra-content";
import { ContentStatus } from "@/components/content-status";
import Scripts from "@/components/scripts";
import type { Metadata, ResolvingMetadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { default as OurLayout } from "@/components/layout";

export const generateMetadata = async (
  _props: unknown,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { description } = await parentPromise;
  return {
    metadataBase: new URL("https://authzed.com/docs"),
    title: {
      default: "Authzed Docs",
      template: "%s - Authzed Docs",
    },
    description: "Welcome to the SpiceDB and AuthZed docs site.",
    openGraph: {
      title: {
        default: "Authzed Docs",
        template: "%s - Authzed Docs",
      },
      description: description ?? undefined,
    },
    alternates: {
      // This is how you say "the current page is the canonical one",
      // using the metadataBase field.
      canonical: "./",
    },
  };
};

/** SpiceDB GitHub star count, cached hourly; falls back to a sane default. */
async function getStarCount(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/repos/authzed/spicedb", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const n = (await res.json())?.stargazers_count;
    if (typeof n !== "number") throw new Error("no count");
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  } catch {
    return "5.7k";
  }
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap();
  const enableSearch = process.env.NEXT_PUBLIC_ENABLE_SEARCH_BLOG_INTEGRATION === "true";
  const starCount = await getStarCount();

  const navbar = (
    <Navbar
      logo={
        <span className="docs-logo">
          <Logo />
          <span className="docs-logo-slug">/docs</span>
        </span>
      }
      logoLink="/"
      chatLink="https://authzed.com/discord"
      projectLink="https://github.com/authzed/spicedb"
    >
      <Link
        href="https://authzed.com/schedule-demo"
        className="nav-cta"
      >
        Book a demo
      </Link>
    </Navbar>
  );

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: { dark: 45, light: 290 },
          saturation: { dark: 100, light: 100 },
        }}
        // Sandworm background — stone-975 (dark) / stone-025 (light) — so every
        // docs page matches the branded home instead of Nextra's neutral #111.
        backgroundColor={{ dark: "#0c050f", light: "#f8f6f8" }}
      />
      <body>
        <Layout
          banner={
            <Banner dismissible={false}>
              <BannerContents stars={starCount} />
            </Banner>
          }
          navbar={navbar}
          footer={
            <Footer>
              <Link href="https://authzed.com" title="AuthZed">
                <LogoIcon height={20} />
              </Link>{" "}
              &copy; {new Date().getFullYear()} AuthZed.
            </Footer>
          }
          darkMode
          docsRepositoryBase="https://github.com/authzed/docs/tree/main"
          search={enableSearch && <Search />}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
          }}
          pageMap={pageMap}
          feedback={{
            content: null,
          }}
          toc={{ backToTop: true, extraContent: <TocExtraContent /> }}
        >
          <OurLayout>
            <SpeedInsights />
            <Providers><ContentStatus />{children}</Providers>
            <Scripts />
          </OurLayout>
        </Layout>
      </body>
    </html>
  );
}
