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

## Notes

- Markdown linting is lenient (most rules disabled, custom sentence-per-line rule)
- TypeScript strict mode is off, but strict null checks are enforced
- Next.js uses webpack mode explicitly (`--webpack` flag)
