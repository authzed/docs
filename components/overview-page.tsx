// Adapted from the nextra docs site.

import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import type { PageMapItem } from "nextra";
import { Cards } from "nextra/components";
import { getIndexPageMap, getPageMap } from "nextra/page-map";

type Props = {
  filePath: string;
  pageMap?: PageMapItem[];
};

export const OverviewPage = async ({ filePath, pageMap: $pageMap }: Props) => {
  const { h2: H2 } = getMDXComponents();
  // NOTE: this is pretty hacky - it's reaching into nextra internals. a route looks like
  // /docs/foo/bar/baz, and a filepath is the filepath to this content.
  const currentRoute = filePath
    .replace("content", "/docs")
    .replace("/index.mdx", "");
  const pageMap = $pageMap ?? (await getPageMap(currentRoute));

  return getIndexPageMap(pageMap).map((pageItem, index) => {
    if (!Array.isArray(pageItem)) {
      return <H2 key={index}>{pageItem.title}</H2>;
    }
    return (
      <Cards key={index}>
        {pageItem.map((item) => (
          <Cards.Card
            key={item.name}
            // @ts-expect-error -- title doesn't exist on mdxfile
            title={item.title}
            // @ts-expect-error -- nor does href. but it seems to work.
            href={item.route || item.href}
          />
        ))}
      </Cards>
    );
  });
};
