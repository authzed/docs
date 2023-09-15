const env = (envvar, fallback) =>
  typeof process.env[envvar] !== 'undefined' ? process.env[envvar] : fallback;

module.exports = {
  title: 'SpiceDB and AuthZed Documentation',
  tagline:
    'Documentation for SpiceDB, the open-source standard for building authZ services, and AuthZed.',
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
      '<span class="announcement-bar">📣 <span><strong>The Zanzibar Paper</strong>, annotated by AuthZed</span> <a href="https://zanzibar.tech" target="_blank" class="banner-button">Read Paper</a></span>',
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
          { to: '/spicedb-enterprise/overview', from: '/products/enterprise' },
          {
            to: '/spicedb-enterprise/overview',
            from: '/spicedb-self-hosted/overview',
          },
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
              '/concepts/check',
              '/concepts/namespaces',
              '/concepts/relations',
              '/concepts/terminology',
              '/concepts/tuples',
              '/v0/concepts/,',
            ],
          },
          {
            to: '/',
            from: [
              '/authzed/pricing',
              '/api/overview',
              '/operator/installing',
              '/v0/api',
            ],
          },
        ],
      },
    ],
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
