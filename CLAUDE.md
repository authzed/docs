# AuthZed Docs

Documentation site for AuthZed and SpiceDB built with Next.js and Nextra.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Documentation**: Nextra 4.6 (docs theme)
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm 10.24.0
- **TypeScript**: 5.9.3 (non-strict mode, strict null checks enabled)
- **Content Format**: MDX (Markdown + JSX)

## Project Structure

```
app/
├── authzed/          # AuthZed product docs
├── spicedb/          # SpiceDB docs
├── best-practices/   # Best practices guides
├── mcp/              # MCP-related docs
├── page.mdx          # Homepage
├── layout.tsx        # Root layout
└── globals.css       # Global styles

components/
├── ui/               # Reusable UI components
├── banner.tsx
├── cta.tsx
└── youtube-wrapper.tsx

scripts/              # Build and utility scripts
```

## Content Conventions

### File Organization

- Each section has a `_meta.ts` file defining navigation order and titles
- Content files are `page.mdx` within directories (e.g., `app/authzed/guides/cloud/page.mdx`)
- Import path alias: `@/*` maps to root directory

### MDX Files

**Imports at top:**

```tsx
import { Callout } from "nextra/components";
import YouTube from "@/components/youtube-wrapper";
```

**Common patterns:**

- Use `<Callout type="info|warning|error">` for callouts
- Use `<YouTube videoId="..." className="youtubeContainer" />` for videos
- Standard markdown for content (headings, lists, code blocks, links)

### Code Style

- **Path aliases**: Use `@/` for imports from root (e.g., `@/components/banner`)
- **Components**: React functional components with TypeScript
- **Formatting**: Prettier (run `pnpm format`)
- **Linting**: Markdownlint with custom rules (run `pnpm lint:markdown`)

## Development

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm format           # Format code
pnpm lint:markdown    # Lint markdown files
```

## Known Quirks

- **Nextra breadcrumb 404s on section index paths.** `nextra-theme-docs`'s breadcrumb component links a top-level section's crumb (e.g. "SpiceDB", from `app/_meta.ts`) to `item.children[0].route` when that section has no index page of its own — the bare path of its first child folder (per that folder's `_meta.ts` order), not a recursively-resolved real page. If that first child also has no index page (true for `spicedb/getting-started`, `authzed/guides`, `materialize/getting-started`), every page in the section renders a breadcrumb crumb pointing at a 404. No content ever links to these bare paths directly — only the breadcrumb does, dynamically, on every page under that section — so the fix is a permanent redirect in `next.config.mjs` from the bare path to the intended real page, not an index page or a content edit. Watch for this again if a new top-level section (or a new first-listed subsection) is added without its own index page.
- **Link checker needs `--no-check-anchors`.** Nextra doesn't render heading `id`s into server-rendered HTML — they're attached client-side after hydration — so a static-HTML crawler (`filiph/linkcheck`, used by `link-checker.yaml`/`link-checker-full.yaml`) flags every `#fragment` link as a false-positive missing anchor without this flag. Both link-checker workflows pass it.
- **The Vercel preview-deploy wait step doesn't use `patrickedqvist/wait-for-vercel-preview`.** That action hardcodes `actorName: 'vercel[bot]'`, but this repo's own `vercel-preview.yml`/`vercel-production.yml` create GitHub Deployments as `github-actions[bot]` (no native Vercel GitHub App integration), so the action always timed out. `link-checker.yaml`'s `preview` job instead queries the Deployments API directly by commit sha + environment (`"Preview (GitHub Actions)"` for PRs, `"Production"` for pushes to main) via an inline `actions/github-script` step, mirroring the equivalent step in `authzed/web`'s `test.yml`.

## Notes

- Markdown linting is lenient (most rules disabled, custom sentence-per-line rule)
- TypeScript strict mode is off, but strict null checks are enforced
- Next.js uses webpack mode explicitly (`--webpack` flag)
