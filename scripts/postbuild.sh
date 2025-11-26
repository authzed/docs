#!/usr/bin/env sh

set -e

# Generate sitemap
pnpm exec next-sitemap

# Generate search
pnpm gen:pagefind
