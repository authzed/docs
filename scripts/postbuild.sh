#!/usr/bin/env sh

set -e

# Generate sitemap
pnpm exec next-sitemap

# Generate search
pagefind --site .next/server/app --output-path public/_pagefind --verbose
