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
    title: "Managed Materialize",
    type: "page",
  },
  mcp: {
    title: "MCP",
    type: "page",
  },
  changes: {
    display: "hidden",
  },
  review: {
    display: "hidden",
  },
} satisfies MetaRecord;
