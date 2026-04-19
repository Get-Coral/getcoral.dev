# getcoral.dev

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-ElianCodes-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/ElianCodes)
[![Discord](https://img.shields.io/discord/1495441903297237043?label=Discord&logo=discord&logoColor=white&color=5865F2)](https://discord.gg/M3wzFpGbzp)

The official website for [Coral](https://getcoral.dev), an open-source ecosystem of independent Jellyfin modules.

## What this repo is

- Marketing site for the Coral ecosystem
- Home for the ecosystem story, module index, and philosophy
- Built with Astro, Solid islands, Tailwind CSS v4, and Biome

## Getting started

```sh
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:4321](http://localhost:4321).

## Stack

- Astro 6
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
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BaseFooter.astro
│   │   ├── BaseHead.astro
│   │   ├── BaseHeader.astro
│   │   └── Counter.tsx
│   ├── layouts/
│   │   ├── Default.astro
│   │   └── PageSupportingDarkmode.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── robots.txt.ts
│   └── styles/
│       └── global.css
├── astro.config.ts
├── biome.json
├── package.json
└── tsconfig.json
```

## Notes

- `src/pages/index.astro` contains the Coral homepage content and module list.
- `src/layouts/Default.astro` sets the site-wide metadata defaults.
- `src/styles/global.css` contains the full visual system for the landing page.
- `astro.config.ts` includes the site URL, Solid integration, sitemap integration, and Tailwind's Vite plugin.

## TypeScript paths

This site includes a couple of path aliases:

- `@components/*` -> `src/components/*`
- `@layouts/*` -> `src/layouts/*`

## Part of Coral

Coral is a reef of independent modules that extend Jellyfin with focused, self-hosted experiences. This repo is the public front door for that ecosystem and should stay aligned with the product and module branding used across the other Coral repositories.

## License

[MIT](./LICENSE)
