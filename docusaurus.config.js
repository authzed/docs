const env = (envvar, fallback) => typeof process.env[envvar] !== 'undefined' ? process.env[envvar] : fallback;

module.exports = {
  title: 'authzed',
  tagline:
    'Documentation for Authzed, the planet-scale, serverless database platform for SpiceDB.',
  favicon: 'img/favicon.svg',
  url: 'https://authzed.com',
  baseUrl: env('DOCUSAURUS_BASE_URL', '/'),
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  staticDirectories: ['static'],
  customFields: {
    amplitudeApiKey: env('AMPLITUDE_API_KEY', ''),
  },
  themeConfig: {
    announcementBar: {
      id: 'github_star',
      content:
        '<a href="https://zanzibar.tech" target="_blank" style="text-decoration:none; display:inline-block;"><strong>The Zanzibar Paper, annotated by AuthZed</strong> 📰 <span style="display: inline-block">Read the seminal paper with expert commentary.</span></a>',
      backgroundColor: '#842743',
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
        src: 'img/authzed-logo.svg',
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
          label: 'Authzed Dashboard',
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
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          { to: '/spicedb-dedicated/overview', from: '/products/dedicated' },
          { to: '/spicedb-self-hosted/overview', from: '/products/enterprise' },
          { to: '/spicedb-self-hosted/overview', from: '/spicedb-enterprise/overview' },
          { to: '/spicedb-serverless/overview', from: '/products/serverless' },
          { to: '/reference/clients', from: '/reference/zed' },
          {
            to: '/reference/glossary',
            from: [
              '/authz/abac',
              '/authz/acl-filtering',
              '/authz/authn-authz',
              '/authz/new-enemy',
              '/authz/oidc',
              '/authz/policy-engine',
              '/authz/rbac',
              '/authz/what-else',
              '/concepts/authz',
              '/concepts/terminology',
            ],
          },
        ],
      },
    ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: env('GOOGLE_ANALYTICS_GA4', 'G-faketest'),
        anonymizeIP: false,
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
