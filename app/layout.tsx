import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import Link from "next/link";
import { Head, Search, Banner } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import Logo from '@/components/icons/logo.svg'
import LogoIcon from '@/components/icons/logo-icon.svg'
import BannerContents from '@/components/banner'
import { TocCTA } from "@/components/cta";
import type { Metadata } from 'next'

// TODO: make sure this is all right
export const metadata: Metadata = {
  metadataBase: new URL('https://authzed.com'),
  title: {
    default: "Authzed Docs",
    template: '%s - Authzed Docs'
  },
  description: "Welcome to the SpiceDB and AuthZed docs site.",
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  const enableSearch = process.env.NEXT_PUBLIC_ENABLE_SEARCH_BLOG_INTEGRATION === "true";

  const navbar = (
    <Navbar
      logo={<Logo />}
      logoLink="https://authzed.com"
      chatLink="https://authzed.com/discord"
      projectLink="https://github.com/authzed/spicedb"
    />
  )
  // TODO
  /*
    const { title: titleContent, frontMatter } = useConfig();
    const desc =
      frontMatter.description ||
      ;
    const resolvedTitle = titleContent
      ? `${titleContent} - Authzed Docs`
      : "Authzed Docs";

        <meta property="og:title" content={resolvedTitle} />
        <meta property="og:description" content={desc} />
        <link
          rel="canonical"
          href={`https://authzed.com${
            process.env.NEXT_PUBLIC_BASE_DIR ?? ""
          }${asPath}`}
        />
   */

  return (
    <html
    lang="en"
    dir="ltr"
    suppressHydrationWarning
    >
    <Head color={{
      hue: { dark: 45, light: 290 },
      saturation: { dark: 100, light: 100 },
    }}
    />
      <body
      // This is how we tell pagefind that this is a doc page
      // which should rank higher than blogs in search results.
      data-pagefind-sort="internal:1"
      >
        <Layout
          banner={
            <Banner dismissible={false}>
            <BannerContents />
            </Banner>
          }
          navbar={navbar}
          footer={<Footer>
            <Link href="https://authzed.com" title="AuthZed">
              <LogoIcon height={20} />
            </Link>
            {' '}
          &copy; {new Date().getFullYear()} AuthZed.
            </Footer>
            }
          darkMode
          docsRepositoryBase="https://github.com/authzed/docs/tree/main"
          search={enableSearch && <Search
            searchOptions={{
              sort: {
                // This is how we rank blog stuff below docs stuff.
                external: "desc"
              }
            }}
            />}
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
          {children}
        </Layout>
      </body>
    </html>
  )
}
