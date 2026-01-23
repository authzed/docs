import { Layout, Navbar, Footer } from "nextra-theme-docs";
import Link from "next/link";
import { Head, Search, Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import Logo from "@/components/icons/logo.svg";
import LogoIcon from "@/components/icons/logo-icon.svg";
import BannerContents from "@/components/banner";
import Providers from "@/components/providers";
import { TocCTA } from "@/components/cta";
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

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap();
  const enableSearch = process.env.NEXT_PUBLIC_ENABLE_SEARCH_BLOG_INTEGRATION === "true";

  const navbar = (
    <Navbar
      logo={<Logo />}
      logoLink="https://authzed.com"
      chatLink="https://authzed.com/discord"
      projectLink="https://github.com/authzed/spicedb"
    />
  );

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: { dark: 45, light: 290 },
          saturation: { dark: 100, light: 100 },
        }}
      />
      <body>
        <Layout
          banner={
            <Banner dismissible={false}>
              <BannerContents />
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
            content: (
              <span>
                Something unclear?
                <br />
                Create an issue →
              </span>
            ),
          }}
          toc={{ backToTop: true, extraContent: <TocCTA /> }}
        >
          <OurLayout>
            <SpeedInsights />
            <Providers>{children}</Providers>
            <Scripts />
          </OurLayout>
        </Layout>
      </body>
    </html>
  );
}
