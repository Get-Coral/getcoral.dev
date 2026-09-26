import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const faqItem = z.object({
	question: z.string(),
	answer: z.string(),
});

const modules = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/modules" }),
	schema: z.object({
		name: z.string(),
		emoji: z.string(),
		/** Optional brand mark shown instead of the emoji. */
		logo: z.string().optional(),
		tagline: z.string(),
		/** Search-result title. Kept short; the tagline is often too long. */
		seoTitle: z.string().max(60),
		/** Search-result description. */
		seoDescription: z.string().max(155),
		/** Card copy on the homepage and module index. */
		description: z.string(),
		longDescription: z.string(),
		/** 40–60 words, written so an assistant can lift it as a whole answer. */
		answer: z.string(),
		status: z.enum(["active", "mvp", "idea"]),
		statusLabel: z.string(),
		repo: z.url(),
		docs: z.url(),
		containerUrl: z.url().optional(),
		accent: z.enum(["teal", "coral"]),
		/** Use-case grouping on /apps. */
		category: z.enum(["watch", "listen", "read", "manage", "display"]),
		order: z.number(),
		bestFor: z.array(z.string()),
		highlights: z.array(z.string()),
		stack: z.array(z.string()),
		/** Deployment facts. Only set when verified against docs or the repo. */
		dockerImage: z.string().optional(),
		port: z.number().optional(),
		composeSnippet: z.string().optional(),
		volumes: z.array(z.string()).default([]),
		envVars: z
			.array(
				z.object({
					name: z.string(),
					description: z.string(),
					required: z.boolean().default(false),
				}),
			)
			.default([]),
		requirements: z.array(z.string()).default([]),
		version: z.string().optional(),
		dateModified: z.string().optional(),
		faq: z.array(faqItem).default([]),
		/** Sibling module slugs, for related-content linking. */
		related: z.array(z.string()).default([]),
	}),
});

const comparisons = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/comparisons" }),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().max(60),
		seoDescription: z.string().max(155),
		/** The Coral module this comparison is about. */
		module: z.string(),
		/** The alternative being compared against. */
		alternative: z.string(),
		alternativeUrl: z.url(),
		answer: z.string(),
		chooseCoral: z.array(z.string()),
		chooseAlternative: z.array(z.string()),
		table: z.array(
			z.object({
				feature: z.string(),
				coral: z.string(),
				alternative: z.string(),
			}),
		),
		faq: z.array(faqItem).default([]),
		dateModified: z.string(),
	}),
});

const guides = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().max(60),
		seoDescription: z.string().max(155),
		answer: z.string(),
		faq: z.array(faqItem).default([]),
		datePublished: z.string(),
		dateModified: z.string(),
	}),
});

export const collections = { modules, comparisons, guides };
