import nextra from "nextra";
import { createHighlighter } from "shiki";
import authzedGrammar from "./grammars/authzed.tmLanguage.json" with { type: "json" };
import celGrammar from "./grammars/cel.tmLanguage.json" with { type: "json" };
import textProtoGrammar from "./grammars/textproto.tmLanguage.json" with { type: "json" };

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: (options) =>
        createHighlighter({
          ...options,
          langs: [
            {
              name: "zed",
              scopeName: "source.authzed",
              aliases: ["zed", "authzed"],
              ...authzedGrammar,
            },
            {
              name: "cel",
              scopeName: "source.cel",
              aliases: ["cel"],
              ...celGrammar,
            },
            {
              name: "textproto",
              scopeName: "source.textproto",
              aliases: ["textproto"],
              ...textProtoGrammar,
            },
          ],
        }),
    },
  },
});

export default withNextra({
  basePath: process.env.NEXT_PUBLIC_BASE_DIR ?? undefined,
  // This is necessary because we're using CDN domains.
  // It adds `cross-origin="anonymous"` to script tags
  crossOrigin: "anonymous",
  assetPrefix:
    process.env.VERCEL_ENV === "production"
      ? "https://docs-authzed.vercel.app/docs"
      : undefined,
  webpack: (config) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yaml$/,
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ],
    );
    return config;
  },
});
