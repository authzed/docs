import { useRouter } from 'next/router';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import Banner from './components/banner';
import { NavCTA, TocCTA } from './components/cta';
import Footer from './components/footer';
import { Logo } from './components/logo';
import { Flexsearch } from './components/nextra/Flexsearch';

const config: DocsThemeConfig = {
  logo: Logo,
  logoLink: 'https://authzed.com',
  project: { link: 'https://github.com/authzed/spicedb' },
  useNextSeoProps() {
    const { asPath } = useRouter();
    const { title, frontMatter } = useConfig();
    const desc =
      frontMatter.description ||
      'Welcome to the SpiceDB and AuthZed docs site.';

    const defaultConfig = {
      defaultTitle: 'AuthZed Docs',
      titleTemplate: '%s – AuthZed Docs',
      description: desc,
      canonical: `https://authzed.com${
        process.env.NEXT_PUBLIC_BASE_DIR ?? ''
      }${asPath}`,
      openGraph: {
        title,
        description: desc,
      },
    };

    return defaultConfig;
  },
  head: () => {
    const isProd = process.env.VERCEL_ENV === 'production';

    return (
      <>
        {isProd && (
          <script
            defer
            data-domain="authzed.com"
            data-api="/api/event"
            src="/js/script.js"
          ></script>
        )}
      </>
    );
  },
  darkMode: true,
  primaryHue: { dark: 45, light: 290 },
  primarySaturation: { dark: 100, light: 100 },
  chat: { link: 'https://authzed.com/discord' },
  docsRepositoryBase: 'https://github.com/authzed/docs/blob/main',
  banner: {
    dismissible: false,
    text: <Banner />,
  },
  navbar: {
    extraContent: <NavCTA />,
  },
  sidebar: {
    toggleButton: true,
    defaultMenuCollapseLevel: 1,
  },
  feedback: {
    content: (
      <span>
        Something unclear?
        <br />
        Create an issue →
      </span>
    ),
  },
  toc: { backToTop: true, extraContent: <TocCTA /> },
  footer: {
    component: <Footer />,
  },
  ...(process.env.NEXT_PUBLIC_ENABLE_SEARCH_BLOG_INTEGRATION === 'true'
    ? {
        search: {
          component: <Flexsearch />,
        },
      }
    : {}),
};

export default config;
