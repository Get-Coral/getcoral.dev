import type { APIRoute } from "astro";

const catalog = {
	linkset: [
		{
			anchor: "https://getcoral.dev",
			"service-doc": [{ href: "https://docs.getcoral.dev" }],
			describedby: [{ href: "https://github.com/Get-Coral" }],
		},
		{
			anchor: "https://docs.getcoral.dev",
			"service-doc": [
				{ href: "https://docs.getcoral.dev/libraries/jellyfin/" },
				{ href: "https://docs.getcoral.dev/libraries/coral-ui/" },
				{ href: "https://docs.getcoral.dev/libraries/npm-packages/" },
			],
		},
	],
};

export const GET: APIRoute = () => {
	return new Response(JSON.stringify(catalog), {
		headers: {
			"Content-Type": "application/linkset+json",
		},
	});
};
