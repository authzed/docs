import type { MetaRecord } from 'nextra'

export default {
  index: {
    title: "Model Context Protocol",
    theme: {
      breadcrumb: true,
      sidebar: true,
      toc: true,
      pagination: false,
    },
  },
  authzed: "AuthZed MCP",
  "mcp-reference": {
    title: "MCP Reference Implementations",
    href: "https://github.com/authzed/mcp-server-reference",
  },
} satisfies MetaRecord;
