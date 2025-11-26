// Forked from https://github.com/shuding/nextra/blob/7c8c4989021cb556a2f2f9e72b814efa311d7c2b/packages/nextra-theme-docs/src/components/flexsearch.tsx
// MIT License

// Copyright (c) 2020 Shu Ding

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import cn from "clsx";
// flexsearch types are incorrect, they were overwritten in tsconfig.json
import { Document } from "flexsearch";
import { useRouter } from "next/router";
import type { SearchData } from "nextra";
import type { ReactElement, ReactNode } from "react";
import { useCallback, useState } from "react";
import ExternalIcon from "./ExternalIcon";
import { HighlightMatches } from "./HighlightMatches";
import { Search } from "./Search";
import { SearchResult } from "./types";

// Diff: Inlined definitions
export const DEFAULT_LOCALE = "en-US";

type SectionIndex = {
  id: string;
  url: string;
  title: string;
  pageId: string;
  content: string;
  display?: string;
};

type PageIndex = {
  id: number;
  title: string;
  content: string;
};

// Diff: Additional index for blog posts
type BlogIndex = {
  id: number;
  title: string;
  content: string;
  url: string;
  summary: string;
};

type Result = {
  _page_rk: number;
  _section_rk: number;
  route: string;
  prefix: ReactNode;
  children: ReactNode;
};

// This can be global for better caching.
const indexes: {
  // tuple is PageIndex, SectionIndex
  [locale: string]: [Document, Document];
} = {};

// Diff: Index for blog posts
// Associated type is BlogIndex
const blogIndex = new Document({
  cache: 100,
  tokenize: "forward",
  document: {
    id: "id",
    index: "content",
    store: ["title", "url", "summary"],
  },
});

// Caches promises that load the index
const loadIndexesPromises = new Map<string, Promise<void>>();
const loadIndexes = (basePath: string, locale: string): Promise<void> => {
  const key = basePath + "@" + locale;
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key)!;
  }
  const promise = loadIndexesImpl(basePath, locale);
  loadIndexesPromises.set(key, promise);
  return promise;
};

// Diff: Function for loading blog posts
const loadBlogData = async (basePath: string | undefined) => {
  const response = await fetch(`${basePath ?? ""}/feed.json`, {
    cache: "force-cache",
  });
  const content = await response.json();

  return content.items.map((item, i) => {
    return {
      id: i,
      title: item.title,
      content: item["content_html"],
      url: item.url,
      summary: item.summary,
    };
  });
};

const loadIndexesImpl = async (
  basePath: string,
  locale: string,
): Promise<void> => {
  const response = await fetch(
    `${basePath}/_next/static/chunks/nextra-data-${locale}.json`,
  );
  const searchData = (await response.json()) as SearchData;
  // Diff: Load blog data
  const blogData = await loadBlogData(basePath);

  // Associated type is PageIndex
  const pageIndex = new Document({
    cache: 100,
    tokenize: "full",
    document: {
      id: "id",
      index: "content",
      store: ["title"],
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
  });

  // Associated type is SectionIndex
  const sectionIndex = new Document({
    cache: 100,
    tokenize: "full",
    document: {
      id: "id",
      index: "content",
      tag: "pageId",
      store: ["title", "content", "url", "display"],
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
  });

  let pageId = 0;

  for (const [route, structurizedData] of Object.entries(searchData)) {
    let pageContent = "";
    ++pageId;

    for (const [key, content] of Object.entries(structurizedData.data)) {
      const [headingId, headingValue] = key.split("#");
      const url = route + (headingId ? "#" + headingId : "");
      const title = headingValue || structurizedData.title;
      const paragraphs = content.split("\n");

      sectionIndex.add({
        id: url,
        url,
        title,
        pageId: `page_${pageId}`,
        content: title,
        ...(paragraphs[0] && { display: paragraphs[0] }),
      });

      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          pageId: `page_${pageId}`,
          content: paragraphs[i],
        });
      }

      // Add the page itself.
      pageContent += ` ${title} ${content}`;
    }

    pageIndex.add({
      id: pageId,
      title: structurizedData.title,
      content: pageContent,
    });
  }

  // Diff: Add posts to index
  blogData.map((post) => {
    blogIndex.add(post);
  });

  indexes[locale] = [pageIndex, sectionIndex];
};

export function Flexsearch({
  className,
}: {
  className?: string;
}): ReactElement {
  const { locale = DEFAULT_LOCALE, basePath } = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [search, setSearch] = useState("");

  const doSearch = (search: string) => {
    if (!search) return;
    const [pageIndex, sectionIndex] = indexes[locale];

    // Show the results for the top 5 pages
    const pageResults =
      pageIndex.search(search, 5, {
        enrich: true,
        suggest: true,
      })[0]?.result || [];

    const results: Result[] = [];
    const pageTitleMatches: Record<number, number> = {};

    // Diff: Actually limit page results to 3
    for (let i = 0; i < Math.min(pageResults.length, 3); i++) {
      const result = pageResults[i];
      pageTitleMatches[i] = 0;

      // Show the top 5 results for each page
      const sectionResults =
        sectionIndex.search(search, 5, {
          enrich: true,
          suggest: true,
          tag: `page_${result.id}`,
        })[0]?.result || [];

      let isFirstItemOfPage = true;
      const occurred: Record<string, boolean> = {};

      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j];
        const isMatchingTitle = doc.display !== undefined;
        if (isMatchingTitle) {
          pageTitleMatches[i]++;
        }
        const { url, title } = doc;
        const content = doc.display || doc.content;
        if (occurred[url + "@" + content]) continue;
        occurred[url + "@" + content] = true;
        results.push({
          _page_rk: i,
          _section_rk: j,
          route: url,
          prefix: isFirstItemOfPage && (
            <div
              className={cn(
                "nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300",
                "contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50",
              )}
            >
              {result.doc.title}
            </div>
          ),
          children: (
            <>
              <div className="nx-text-base nx-font-semibold nx-leading-5">
                <HighlightMatches match={search} value={title} />
              </div>
              {content && (
                <div className="excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50">
                  <HighlightMatches match={search} value={content} />
                </div>
              )}
            </>
          ),
        });
        isFirstItemOfPage = false;
      }
    }

    // Diff: Adjust result sorting
    const pageCounts = new Map<number, number>();
    const docsSorted = results
      .sort((a, b) => {
        // Sort by number of matches in the title.
        if (a._page_rk === b._page_rk) {
          return a._section_rk - b._section_rk;
        }
        if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
          return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk];
        }
        return a._page_rk - b._page_rk;
      })
      .filter((result) => {
        const sectionCount = (pageCounts.get(result._page_rk) ?? 0) + 1;
        pageCounts.set(result._page_rk, sectionCount);
        // Limit section results to 3
        return sectionCount <= 3;
      }, [])
      .map((res) => ({
        id: `${res._page_rk}_${res._section_rk}`,
        route: res.route,
        prefix: res.prefix,
        children: res.children,
      }));

    const blogResults =
      blogIndex.search(search, 5, {
        enrich: true,
        suggest: true,
      })[0]?.result || [];

    // Diff: Include blog results
    blogResults.map((item, i) => {
      // Limit blog results to 3
      if (i >= 3) return;

      docsSorted.push({
        id: `${item.id}`,
        route: item.doc.url,
        prefix: (
          <div
            className={cn(
              "nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300",
              "contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50",
              "flex gap-1 items-center",
            )}
          >
            AuthZed Blog <ExternalIcon className="h-4" />
          </div>
        ),
        children: (
          <>
            <div className="nx-text-base nx-font-semibold nx-leading-5">
              <HighlightMatches match={search} value={item.doc.title} />
            </div>
            {item.doc.summary && (
              <div className="excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50">
                <HighlightMatches match={search} value={item.doc.summary} />
              </div>
            )}
          </>
        ),
      });
    });

    setResults(docsSorted);
  };

  const preload = useCallback(
    async (active: boolean) => {
      if (active && !indexes[locale]) {
        setLoading(true);
        try {
          await loadIndexes(basePath, locale);
        } catch (e) {
          setError(true);
        }
        setLoading(false);
      }
    },
    [locale, basePath],
  );

  const handleChange = async (value: string) => {
    setSearch(value);
    if (loading) {
      return;
    }
    if (!indexes[locale]) {
      setLoading(true);
      try {
        await loadIndexes(basePath, locale);
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    }
    doSearch(value);
  };

  return (
    <Search
      loading={loading}
      error={error}
      value={search}
      onChange={handleChange}
      onActive={preload}
      className={className}
      overlayClassName="nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]"
      results={results}
    />
  );
}
