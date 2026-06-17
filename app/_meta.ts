import type { MetaRecord } from "nextra";

export default {
  index: {
    title: "Documentation",
    display: "hidden",
    theme: {
      layout: "full",
      toc: false,
      sidebar: false,
      breadcrumb: false,
      pagination: false,
      timestamp: false,
      copyPage: false,
    },
  },
  spicedb: {
    title: "SpiceDB",
    type: "page",
  },
  authzed: {
    title: "Managed SpiceDB",
    type: "page",
  },
  materialize: {
    title: "Materialize",
    type: "page",
  },
  "best-practices": {
    title: "Best Practices",
    type: "page",
  },
  mcp: {
    title: "MCP",
    type: "page",
  },
  changes: {
    display: "hidden",
  },
} satisfies MetaRecord;
