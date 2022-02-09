const env = (envvar, fallback) => typeof process.env[envvar] !== 'undefined' ? process.env[envvar] : fallback;

module.exports = {
  title: 'authzed',
  tagline: 'Documentation for Authzed, the planet-scale, serverless database platform for SpiceDB.',
  favicon: 'img/favicon.svg',
  url: 'https://docs.authzed.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  customFields: {
    amplitudeApiKey: env('AMPLITUDE_API_KEY', ''),
  },
  themeConfig: {
    announcementBar: {
      id: 'github_star',
      content: '<a href="https://github.com/authzed/spicedb" target="_blank" style="text-decoration:none;font-size:100%;">🎉 <strong>Introducing SpiceDB!</strong> 🎉 An open source, Zanzibar-inspired database for permissions</a>',
      backgroundColor: '#842743',
      textColor: '#fff',
      isCloseable: false,
    },
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    hideableSidebar: false,
    navbar: {
      title: '',
      logo: {
        alt: 'authzed',
        src: 'img/authzed-logo.svg',
      },
      items: [
        {
          to: 'https://authzed.com',
          label: 'Home',
          position: 'left',
        },
        {
          to: 'https://play.authzed.com',
          label: 'Playground',
          position: 'left',
        },
        {
          to: 'https://app.authzed.com',
          label: 'Dashboard',
          position: 'left',
        },
        {
          to: 'https://github.com/authzed',
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
      copyright: `© ${new Date().getFullYear()} Authzed. All rights reserved.`
    },
    algolia: {
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
        googleAnalytics: { trackingID: env('GOOGLE_ANALYTICS_UA', 'UA-faketest') },
        sitemap: { changefreq: 'daily' },
        blog: false,
        pages: false,
      },
    ],
  ],
};
