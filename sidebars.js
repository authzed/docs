module.exports = {
  someSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'reference/api',
        'reference/clients',
        {
          type: 'link',
          label: 'API Documentation',
          href: 'https://buf.build/authzed/api/docs/main/authzed.api.v1',
        },
        'reference/api-consistency',
        'reference/schema-lang',
        'reference/zedtokens-and-zookies',
        'reference/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/first-app',
        'guides/schema',
      ],
    },
    {
      type: 'category',
      label: 'SpiceDB',
      collapsed: false,
      items: [
        'spicedb/feature-overview',
        'spicedb/selecting-a-datastore',
      ],
    },
    {
      type: 'category',
      label: 'Authzed',
      collapsed: false,
      items: [
        'authzed/pricing',
      ],
    },
  ],
};
