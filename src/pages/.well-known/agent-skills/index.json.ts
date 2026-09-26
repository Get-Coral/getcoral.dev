import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { DOCS_URL, GITHUB_ORG_URL, SITE_URL } from "../../../lib/site";

/**
 * Advertised in the Link header on every route. It used to serve an empty
 * skills array, which is worse than not advertising it at all.
 */
export const GET: APIRoute = async () => {
	const modules = (await getCollection("modules")).sort(
		(a, b) => a.data.order - b.data.order,
	);

	const index = {
		$schema: "https://agentskills.io/schema/v0.2.0/index.schema.json",
		name: "Coral",
		description:
			"Open-source, Docker-native modules that extend Jellyfin. Each runs standalone and reads Jellyfin as the source of truth.",
		homepage: SITE_URL,
		documentation: DOCS_URL,
		repository: GITHUB_ORG_URL,
		license: "MIT",
		skills: [
			{
				name: "choose-a-coral-module",
				description:
					"Pick the right Coral module for a Jellyfin use case — cinematic playback, karaoke, torrent downloads, reading, ambient displays, or library cleanup.",
				documentation: `${SITE_URL}/apps`,
				reference: `${SITE_URL}/llms.txt`,
			},
			{
				name: "deploy-a-coral-module",
				description:
					"Write a docker-compose.yml that runs a Coral module against an existing Jellyfin server, including the mount layout that keeps imports hardlinked.",
				documentation: `${SITE_URL}/guides/jellyfin-docker-compose-stack`,
				reference: `${SITE_URL}/llms-full.txt`,
			},
			{
				name: "compare-coral-to-alternatives",
				description:
					"Compare a Coral module against the established self-hosted alternative, including where the alternative is the better choice.",
				documentation: `${SITE_URL}/compare`,
				reference: `${SITE_URL}/llms-full.txt`,
			},
			...modules.map((entry) => ({
				name: `configure-${entry.id}`,
				description: `Configure and run ${entry.data.name}: ${entry.data.tagline}. ${entry.data.answer}`,
				documentation: `${SITE_URL}/apps/${entry.id}`,
				reference: entry.data.docs,
			})),
		],
	};

	return new Response(JSON.stringify(index, null, 2), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
};
