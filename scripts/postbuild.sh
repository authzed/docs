#!/usr/bin/env sh

set -e

# Generate sitemap
pnpm exec next-sitemap

# Generate search
pagefind --site out --output-path public/_pagefind --verbose
