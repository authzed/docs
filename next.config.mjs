import nextra from 'nextra'
import { getHighlighter, BUNDLED_LANGUAGES } from 'shiki'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  flexsearch: { codeblocks: false },
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: options =>
        getHighlighter({
          ...options,
          langs: [
            ...BUNDLED_LANGUAGES,
            {
              id: 'zed',
              scopeName: 'source.authzed',
              aliases: ['zed', 'authzed'],
              path: '../../../../../public/authzed.tmLanguage.json',
            },
            {
              id: 'cel',
              scopeName: 'source.cel',
              aliases: ['cel'],
              path: '../../../../../public/cel.tmLanguage.json',
            },
            {
              id: 'textproto',
              scopeName: 'source.textproto',
              aliases: ['textproto'],
              path: '../../../../../public/textproto.tmLanguage.json',
            },
          ]
        })
    }
  },
})

export default withNextra({
  basePath: process.env.BASE_DIR ?? undefined,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yaml$/,
          // type: 'json',
          use: 'yaml-loader',
        },
        {
          test: /\.svg$/,
          use: '@svgr/webpack',
        },
      ]
    );
    return config;
  },
});
