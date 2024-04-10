#!/usr/bin/env sh

set -e

# Generate sitemap
pnpm exec next-sitemap

# Update blog search data
curl -o public/feed.json  https://authzed.com/feed/json
