const env = (envvar, fallback) =>
  typeof process.env[envvar] !== 'undefined' ? process.env[envvar] : fallback;

module.exports = {
  title: 'SpiceDB and AuthZed Documentation',
  tagline:
    'Documentation for SpiceDB, the open-source standard for building authZ services, and AuthZed.',
  url: 'https://authzed.com',
  // Oct 1,2023 dsieczko: baseURL is /docs
  baseUrl: env('DOCUSAURUS_BASE_URL', '/'),
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://www.authzed/docs/',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'x-default',
        href: 'https://www.authzed/docs/',
      },
    },
  ],
  staticDirectories: ['static'],
  customFields: {
    amplitudeApiKey: env('AMPLITUDE_API_KEY', ''),
  },
  themeConfig: {
    announcementBar: {
      id: 'github_star',
      content:
        '<div class="announcement-bar"><div class="announcement-bar-left">📣 <span><strong>The Zanzibar Paper</strong>, annotated by AuthZed</span> <a href="https://authzed.com/zanzibar" target="_blank" class="banner-button">Read Paper</a></div><div><a class="outline" href="https://authzed.com/call?utm_source=docs" target="_blank">Talk with an Expert <i class="fa-solid fa-phone-flip"></i></a></div></div>',
      backgroundColor: '#15131d',
      textColor: '#fff',
      isCloseable: false,
    },
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'authzed',
        src: 'https://authzed.com/authzed-logo-multi.svg',
        href: 'https://authzed.com',
        target: '_self',
      },
      items: [
        {
          to: '/',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: 'https://play.authzed.com',
          label: 'Playground',
          position: 'left',
        },
        {
          to: 'https://app.authzed.com',
          label: 'Log In',
          position: 'left',
        },
        {
          to: 'https://github.com/authzed/spicedb',
          position: 'right',
          className: 'header-github-link',
        },
        {
          to: 'https://authzed.com/discord',
          position: 'right',
          className: 'header-discord-link',
        },
        {
          to: 'https://twitter.com/authzed',
          position: 'right',
          className: 'header-twitter-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} Authzed. All rights reserved.`,
    },
    algolia: {
      appId: env('ALGOLIA_APP_ID', 'test'),
      apiKey: env('ALGOLIA_API_KEY', 'test'),
      indexName: env('ALGOLIA_INDEX', 'test'),
      contextualSearch: true,
      searchParameters: {},
    },
  },
  plugins: [
    './webpack-fallbacks-plugin',
    [
      '@twilio-labs/docusaurus-plugin-segment',
      {
        writeKey: env('SEGMENT_WRITE_KEY', 'faketest'),
        allowedInDev: false,
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/authzed/docs/edit/main',
        },
        sitemap: { changefreq: 'daily' },
        blog: false,
        pages: false,
      },
    ],
  ],
};
