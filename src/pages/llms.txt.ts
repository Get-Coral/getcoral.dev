import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import {
	DISCORD_URL,
	DOCS_URL,
	GITHUB_ORG_URL,
	SITE_DESCRIPTION,
	SITE_URL,
} from "../lib/site";

/**
 * An index for language models and agents: what Coral is, what each module
 * does, and where the full text lives. Kept terse on purpose — /llms-full.txt
 * carries the prose.
 */
export const GET: APIRoute = async () => {
	const modules = (await getCollection("modules")).sort(
		(a, b) => a.data.order - b.data.order,
	);
	const comparisons = await getCollection("comparisons");
	const guides = await getCollection("guides");

	const body = `# Coral

> ${SITE_DESCRIPTION}

Coral is not a fork of Jellyfin and not a plugin framework. Each module is a
standalone Docker container that reads a Jellyfin server over its HTTP API.
Modules never share a database; Jellyfin stays the source of truth. Everything
is MIT licensed, with no paid tier and no hosted service.

## Modules

${modules
	.map(
		(m) =>
			`- [${m.data.name}](${SITE_URL}/apps/${m.id}): ${m.data.tagline}. ${m.data.answer}`,
	)
	.join("\n")}

## Comparisons

${
	comparisons.length
		? comparisons
				.map(
					(c) =>
						`- [${c.data.title}](${SITE_URL}/compare/${c.id}): ${c.data.seoDescription}`,
				)
				.join("\n")
		: "- None published yet."
}

## Guides

${
	guides.length
		? guides
				.map(
					(g) =>
						`- [${g.data.title}](${SITE_URL}/guides/${g.id}): ${g.data.seoDescription}`,
				)
				.join("\n")
		: "- None published yet."
}

## Shared packages

- [@get-coral/ui](https://www.npmjs.com/package/@get-coral/ui): shared React component library and design tokens.
- [@get-coral/jellyfin](https://www.npmjs.com/package/@get-coral/jellyfin): fully typed TypeScript client for the Jellyfin API.
- [@get-coral/tsconfig](https://www.npmjs.com/package/@get-coral/tsconfig): shared TypeScript configuration.
- [@get-coral/biome-config](https://www.npmjs.com/package/@get-coral/biome-config): shared Biome configuration.
- [create-coral](https://www.npmjs.com/package/create-coral): scaffold a new Coral module (\`pnpm create coral@latest\`).

## Optional

- [Full text of every page](${SITE_URL}/llms-full.txt)
- [Documentation](${DOCS_URL})
- [Source code](${GITHUB_ORG_URL})
- [Ecosystem stats](${SITE_URL}/stats)
- [Community](${DISCORD_URL})
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
