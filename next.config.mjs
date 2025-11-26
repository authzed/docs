import nextra from "nextra";
import { createHighlighter } from "shiki";
import { readFileSync } from "fs";
import { join } from "path";

const authzedGrammar = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "./grammars/authzed.tmLanguage.json"),
    "utf8",
  ),
);
const celGrammar = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "./grammars/cel.tmLanguage.json"),
    "utf8",
  ),
);
const textProtoGrammar = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "./grammars/textproto.tmLanguage.json"),
    "utf8",
  ),
);

const withNextra = nextra({
  contentDirBasePath: '/docs',
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
  // NOTE: when you're using the `content` dir approach with nextra,
  // you need this setting to make it so that static HTML is generated
  // during the build step. This is also what enables pagefind to work.
  output: "export",
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
