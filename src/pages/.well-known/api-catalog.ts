import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { DOCS_URL, GITHUB_ORG_URL, SITE_URL } from "../../lib/site";

export const GET: APIRoute = async () => {
	const modules = (await getCollection("modules")).sort(
		(a, b) => a.data.order - b.data.order,
	);

	const catalog = {
		linkset: [
			{
				anchor: SITE_URL,
				"service-doc": [{ href: DOCS_URL }],
				describedby: [
					{ href: GITHUB_ORG_URL },
					{ href: `${SITE_URL}/llms.txt`, type: "text/plain" },
					{ href: `${SITE_URL}/llms-full.txt`, type: "text/plain" },
				],
				item: modules.map((entry) => ({
					href: `${SITE_URL}/apps/${entry.id}`,
					title: `${entry.data.name} — ${entry.data.tagline}`,
				})),
			},
			{
				anchor: DOCS_URL,
				"service-doc": [
					{ href: `${DOCS_URL}/libraries/jellyfin/` },
					{ href: `${DOCS_URL}/libraries/coral-ui/` },
					{ href: `${DOCS_URL}/libraries/npm-packages/` },
				],
			},
		],
	};

	return new Response(JSON.stringify(catalog), {
		headers: { "Content-Type": "application/linkset+json" },
	});
};
