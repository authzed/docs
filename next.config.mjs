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
  // Best Practices moved under SpiceDB (it's SpiceDB-specific content). Keep
  // the old indexed URL working. Fragments are preserved by the browser.
  async redirects() {
    return [
      { source: "/best-practices", destination: "/spicedb/best-practices", permanent: true },
      {
        source: "/best-practices/:path*",
        destination: "/spicedb/best-practices/:path*",
        permanent: true,
      },
      // Materialize was promoted from a single concept page to a top-level
      // section (PR #562). Keep the old indexed URL working.
      {
        source: "/authzed/concepts/authzed-materialize",
        destination: "/materialize/getting-started/overview",
        permanent: true,
      },
      // The Ops pages below moved on 2026-02-05 without redirects, leaving
      // ~2 months of indexed URLs 404ing. ai-agent-authorization and
      // secure-rag-pipelines moved into the new Tutorials section; the
      // langchain/langgraph RAG page was folded into the langchain-spicedb
      // integration page.
      {
        source: "/spicedb/ops/ai-agent-authorization",
        destination: "/spicedb/tutorials/ai-agent-authorization",
        permanent: true,
      },
      {
        source: "/spicedb/ops/secure-rag-pipelines",
        destination: "/spicedb/tutorials/secure-rag-pipelines",
        permanent: true,
      },
      {
        source: "/spicedb/ops/spicedb-langchain-langgraph-rag",
        destination: "/spicedb/integrations/langchain-spicedb",
        permanent: true,
      },
      // /spicedb/getting-started, /authzed/guides, and /materialize/getting-started
      // are section folders with no index page of their own. Nextra's breadcrumb
      // component links a section's top-level crumb (e.g. "SpiceDB") to its first
      // child folder's bare route rather than resolving to a real leaf page, so
      // without these redirects those crumbs 404.
      {
        source: "/spicedb/getting-started",
        destination: "/spicedb/getting-started/discovering-spicedb",
        permanent: true,
      },
      {
        source: "/authzed/guides",
        destination: "/authzed/guides/cloud",
        permanent: true,
      },
      {
        source: "/materialize/getting-started",
        destination: "/materialize/getting-started/overview",
        permanent: true,
      },
    ];
  },
  // NOTE: we still use webpack instead of turbopack for dev
  // because turbopack doesn't support non-serializable nextjs options.
  // The rehypePrettyCodeOptions in the block above include a function,
  // which cannot be serialized. If nextra figures out how to provide
  // those options in a different manner or if turbopack starts supporting
  // them we can migrate.
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
