module.exports = {
  someSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'guides/first-app',
        'guides/schema',
        'guides/defining-a-subject-type',
        'guides/writing-relationships',
        'guides/validation-and-testing',
        'guides/debugging',
      ],
    },
    {
      type: 'category',
      label: 'SpiceDB',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'gRPC API Reference',
          href: 'https://buf.build/authzed/api/docs/main:authzed.api.v1',
        },
        {
          type: 'link',
          label: 'REST API Reference',
          href: 'https://www.postman.com/authzed/workspace/spicedb/overview',
        },
        'spicedb/installing',
        'spicedb/operator',
        'spicedb/feature-overview',
        'spicedb/selecting-a-datastore',
        'spicedb/enabling-watch-api',
        'spicedb/configuring-dispatch',
        'spicedb/updating',
      ],
    },
	{
      type: 'category',
      label: 'SpiceDB Dedicated',
      collapsed: true,
      items: [
        'spicedb-dedicated/fgam',
      ],
    },
    {
      type: 'category',
      label: 'Products',
      collapsed: true,
      items: [
        'products/serverless',
        'products/dedicated',
        'products/enterprise',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/api',
        'reference/clients',
        'reference/api-consistency',
        'reference/schema-lang',
        'reference/zedtokens-and-zookies',
        'reference/glossary',
        'reference/caveats',
        {
          type: 'link',
          label: 'gRPC API Reference',
          href: 'https://buf.build/authzed/api/docs/main:authzed.api.v1',
        },
        {
          type: 'link',
          label: 'REST API Reference',
          href: 'https://www.postman.com/authzed/workspace/spicedb/overview',
        },
      ],
    },
    'support',
  ],
};
