import type { APIRoute } from "astro";

// Content-Signal has to sit inside the User-agent group it applies to. A
// Sitemap line ends the group, so this must come before it.
const robotsTxt = `
User-agent: *
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
