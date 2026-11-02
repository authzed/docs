#!/usr/bin/env sh

set -e

# Generate sitemap
pnpm exec next-sitemap

# Generate search
pagefind --site .next/server/app --output-path public/_pagefind --verbose

# Fail if the search index is (nearly) empty. This happens when pages stop
# being prerendered (e.g. a dynamic API like cookies() in the root layout),
# since Pagefind only indexes static HTML.
MIN_PAGES=5
PAGE_COUNT=$(node -e 'const e=require("./public/_pagefind/pagefind-entry.json");console.log(Object.values(e.languages).reduce((n,l)=>n+l.page_count,0))')
if [ "$PAGE_COUNT" -lt "$MIN_PAGES" ]; then
  echo "error: Pagefind indexed only $PAGE_COUNT pages (expected at least $MIN_PAGES). Are pages still statically prerendered?" >&2
  exit 1
fi
echo "Pagefind indexed $PAGE_COUNT pages"
