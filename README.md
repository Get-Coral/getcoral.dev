# getcoral.dev

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-ElianCodes-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/ElianCodes)
[![Discord](https://img.shields.io/discord/1495441903297237043?label=Discord&logo=discord&logoColor=white&color=5865F2)](https://discord.gg/M3wzFpGbzp)

The official website for [Coral](https://getcoral.dev), an open-source ecosystem of independent Jellyfin modules.

## What this repo is

- Marketing site for the Coral ecosystem
- Home for the ecosystem story, the module index, comparisons and deployment guides
- The canonical entry point for search engines and AI assistants (`/llms.txt`, `/llms-full.txt`, structured data)
- Built with Astro, Solid islands, Tailwind CSS v4, and Biome

## Getting started

```sh
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:4321](http://localhost:4321).

## Stack

- Astro 7
- SolidJS via `@astrojs/solid-js`
- Tailwind CSS v4 through the Vite plugin
- Sitemap generation via `@astrojs/sitemap`
- Biome for linting and formatting
- TypeScript strict config

## Available scripts

| Command | What it does |
| :--- | :--- |
| `pnpm dev` | Start the local Astro dev server |
| `pnpm start` | Alias for `pnpm dev` |
| `pnpm build` | Run `astro check` and build the site |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro ...` | Run Astro CLI commands |
| `pnpm format` | Format the codebase with Biome |
| `pnpm lint` | Run Biome lint rules with autofix enabled |
| `pnpm check` | Run Biome checks without writing files |

## Project structure

```text
/
├── public/
│   ├── logos/                       # module brand marks
│   └── social-card.svg              # source for the default /og.png
├── src/
│   ├── components/
│   │   ├── AgentContext.astro       # WebMCP tools, on every page
│   │   ├── BaseHead.astro           # meta tags + the JSON-LD @graph
│   │   ├── Breadcrumbs.astro
│   │   ├── Faq.astro
│   │   ├── Icons.astro
│   │   ├── SiteFooter.astro
│   │   └── SiteNav.astro
│   ├── content/
│   │   ├── modules/                 # one .md per module
│   │   ├── comparisons/             # Coral vs the alternatives
│   │   └── guides/
│   ├── layouts/
│   │   └── Default.astro
│   ├── lib/
│   │   ├── ogCard.ts                # per-module OG card SVG
│   │   ├── schema.ts                # JSON-LD node builders
│   │   ├── site.ts                  # brand constants, single source of truth
│   │   └── stats.ts                 # build-time npm + Docker Hub counts
│   ├── pages/
│   │   ├── .well-known/
│   │   ├── apps/[slug].astro        # + apps/[slug]/og.png.ts
│   │   ├── compare/[slug].astro
│   │   ├── guides/[slug].astro
│   │   ├── llms.txt.ts
│   │   ├── llms-full.txt.ts
│   │   └── robots.txt.ts
│   ├── content.config.ts            # collection schemas
│   └── styles/
│       └── global.css
├── astro.config.ts
├── vercel.json
└── package.json
```

## Content

Module, comparison and guide copy lives in `src/content/` as Markdown with typed
frontmatter (`src/content.config.ts`). The schema caps `seoTitle` at 60 characters
and `seoDescription` at 155, so an over-long tag fails the build rather than
getting truncated in a search result.

Deployment facts in module frontmatter — `dockerImage`, `port`, `envVars`,
`version` — should only be set when they have been verified against the module's
docs or repo. They are published as `SoftwareApplication` structured data.

## URL shape

`trailingSlash: "never"` and `build.format: "file"` mean each page has exactly one
URL. The canonical tag, `og:url`, the sitemap entry and the breadcrumb `item` are
all derived from the same place in `BaseHead.astro` — if you add a page, do not
hand-write any of them.

The apex `getcoral.dev` is canonical. `www` must redirect to it, not the other way
around; that is configured in Vercel's domain settings rather than in this repo.

## TypeScript paths

This site includes a couple of path aliases:

- `@components/*` -> `src/components/*`
- `@layouts/*` -> `src/layouts/*`

## Part of Coral

Coral is a reef of independent modules that extend Jellyfin with focused, self-hosted experiences. This repo is the public front door for that ecosystem and should stay aligned with the product and module branding used across the other Coral repositories.

## License

[MIT](./LICENSE)
