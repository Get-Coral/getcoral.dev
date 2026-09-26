import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_URL } from "../lib/site";

/** Every page's prose in one request, so an agent does not have to crawl. */
export const GET: APIRoute = async () => {
	const modules = (await getCollection("modules")).sort(
		(a, b) => a.data.order - b.data.order,
	);
	const comparisons = await getCollection("comparisons");
	const guides = await getCollection("guides");

	const faqBlock = (faq: { question: string; answer: string }[]) =>
		faq.length
			? `\n### Frequently asked questions\n\n${faq
					.map((f) => `**${f.question}**\n\n${f.answer}`)
					.join("\n\n")}\n`
			: "";

	const sections: string[] = [
		`# Coral\n\n> ${SITE_DESCRIPTION}\n\nSource: ${SITE_URL}\nLicense: MIT\n`,
	];

	sections.push("\n---\n\n# Modules\n");
	for (const m of modules) {
		sections.push(
			[
				`## ${m.data.name} — ${m.data.tagline}`,
				`URL: ${SITE_URL}/apps/${m.id}`,
				`Repository: ${m.data.repo}`,
				`Documentation: ${m.data.docs}`,
				m.data.containerUrl ? `Container: ${m.data.containerUrl}` : null,
				m.data.version ? `Version: ${m.data.version}` : null,
				`Status: ${m.data.statusLabel}`,
				"",
				m.data.answer,
				"",
				m.data.longDescription,
				"",
				`### Features\n\n${m.data.highlights.map((h) => `- ${h}`).join("\n")}`,
				m.data.requirements.length
					? `\n### Requirements\n\n${m.data.requirements.map((r) => `- ${r}`).join("\n")}`
					: "",
				m.data.composeSnippet
					? `\n### Docker Compose\n\n\`\`\`yaml\n${m.data.composeSnippet}\n\`\`\``
					: "",
				m.data.envVars.length
					? `\n### Environment variables\n\n${m.data.envVars
							.map(
								(e) =>
									`- \`${e.name}\`${e.required ? " (required)" : ""}: ${e.description}`,
							)
							.join("\n")}`
					: "",
				m.body ? `\n${m.body.trim()}` : "",
				faqBlock(m.data.faq),
			]
				.filter((line) => line !== null && line !== "")
				.join("\n"),
		);
	}

	if (comparisons.length) {
		sections.push("\n---\n\n# Comparisons\n");
		for (const c of comparisons) {
			sections.push(
				[
					`## ${c.data.title}`,
					`URL: ${SITE_URL}/compare/${c.id}`,
					"",
					c.data.answer,
					"",
					`### Choose ${c.data.module} if\n\n${c.data.chooseCoral.map((i) => `- ${i}`).join("\n")}`,
					"",
					`### Choose ${c.data.alternative} if\n\n${c.data.chooseAlternative.map((i) => `- ${i}`).join("\n")}`,
					"",
					c.body?.trim() ?? "",
					faqBlock(c.data.faq),
				].join("\n"),
			);
		}
	}

	if (guides.length) {
		sections.push("\n---\n\n# Guides\n");
		for (const g of guides) {
			sections.push(
				[
					`## ${g.data.title}`,
					`URL: ${SITE_URL}/guides/${g.id}`,
					"",
					g.data.answer,
					"",
					g.body?.trim() ?? "",
					faqBlock(g.data.faq),
				].join("\n"),
			);
		}
	}

	return new Response(`${sections.join("\n")}\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
