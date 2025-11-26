import type { MetaRecord } from 'nextra'

export default {
  index: {
    title: "Best Practices",
    theme: {
      breadcrumb: false,
      sidebar: true,
      toc: true,
      pagination: false,
    },
  },
  priority: {
    title: "Essential",
    href: "#priority-a-essential",
  },
  "strongly-recommended": {
    title: "Strongly Recommended",
    href: "#priority-b-strongly-recommended",
  },
  recommended: {
    title: "Recommended",
    href: "#priority-c-recommended",
  },
} satisfies MetaRecord;
