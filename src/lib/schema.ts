import {
	absoluteUrl,
	LICENSE_URL,
	ORGANIZATION_ID,
	SAME_AS,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	WEBSITE_ID,
} from "./site";

type Node = Record<string, unknown>;

/** A reference to another node in the same graph, rather than a duplicate of it. */
export const ref = (id: string) => ({ "@id": id });

export const organizationNode = (): Node => ({
	"@type": "Organization",
	"@id": ORGANIZATION_ID,
	name: SITE_NAME,
	alternateName: "Get Coral",
	url: `${SITE_URL}/`,
	description: SITE_DESCRIPTION,
	logo: {
		"@type": "ImageObject",
		"@id": `${SITE_URL}/#logo`,
		url: absoluteUrl("/icon-512.png"),
		width: 512,
		height: 512,
		caption: SITE_NAME,
	},
	image: ref(`${SITE_URL}/#logo`),
	sameAs: SAME_AS,
});

export const webSiteNode = (): Node => ({
	"@type": "WebSite",
	"@id": WEBSITE_ID,
	name: SITE_NAME,
	url: `${SITE_URL}/`,
	description: SITE_DESCRIPTION,
	inLanguage: "en",
	publisher: ref(ORGANIZATION_ID),
});

export const webPageNode = (opts: {
	url: string;
	name: string;
	description: string;
	image: string;
	imageAlt?: string;
	breadcrumbId?: string;
	dateModified?: string;
}): Node => {
	const node: Node = {
		"@type": "WebPage",
		"@id": `${opts.url}#webpage`,
		url: opts.url,
		name: opts.name,
		description: opts.description,
		inLanguage: "en",
		isPartOf: ref(WEBSITE_ID),
		about: ref(ORGANIZATION_ID),
		primaryImageOfPage: {
			"@type": "ImageObject",
			url: opts.image,
			...(opts.imageAlt ? { caption: opts.imageAlt } : {}),
		},
	};
	if (opts.breadcrumbId) node.breadcrumb = ref(opts.breadcrumbId);
	if (opts.dateModified) node.dateModified = opts.dateModified;
	return node;
};

export const breadcrumbNode = (
	pageUrl: string,
	trail: { name: string; url: string }[],
): Node => ({
	"@type": "BreadcrumbList",
	"@id": `${pageUrl}#breadcrumb`,
	itemListElement: trail.map((crumb, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: crumb.name,
		item: crumb.url,
	})),
});

/**
 * Deliberately has no aggregateRating. Google's Software App rich result
 * effectively requires one, but Coral has no real ratings and inventing them
 * is a manual action. The markup still earns its keep with LLMs.
 */
export const softwareApplicationNode = (module: {
	slug: string;
	name: string;
	tagline: string;
	longDescription: string;
	repo: string;
	docs: string;
	containerUrl?: string;
	highlights: string[];
	bestFor: string[];
	stack: string[];
	version?: string;
	dateModified?: string;
}): Node => {
	const url = `${SITE_URL}/apps/${module.slug}`;
	return {
		"@type": "SoftwareApplication",
		"@id": `${url}#software`,
		name: module.name,
		alternateName: `${module.name} for Jellyfin`,
		headline: module.tagline,
		description: module.longDescription,
		url,
		applicationCategory: "MultimediaApplication",
		applicationSubCategory: "Self-hosted media server module",
		// "Docker" is not an operating system. The container runs anywhere
		// Docker does; the Docker requirement belongs in softwareRequirements.
		operatingSystem: "Linux, macOS, Windows",
		softwareRequirements: "Docker, a running Jellyfin server",
		featureList: module.highlights,
		keywords: [...module.stack, ...module.bestFor].join(", "),
		codeRepository: module.repo,
		softwareHelp: { "@type": "CreativeWork", url: module.docs },
		license: LICENSE_URL,
		isAccessibleForFree: true,
		author: ref(ORGANIZATION_ID),
		publisher: ref(ORGANIZATION_ID),
		maintainer: ref(ORGANIZATION_ID),
		image: absoluteUrl(`/apps/${module.slug}/og.png`),
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
		...(module.containerUrl
			? { installUrl: module.containerUrl, downloadUrl: module.containerUrl }
			: {}),
		...(module.version ? { softwareVersion: module.version } : {}),
		...(module.dateModified ? { dateModified: module.dateModified } : {}),
	};
};

export const faqNode = (
	pageUrl: string,
	faq: { question: string; answer: string }[],
): Node => ({
	"@type": "FAQPage",
	"@id": `${pageUrl}#faq`,
	mainEntity: faq.map((item) => ({
		"@type": "Question",
		name: item.question,
		acceptedAnswer: { "@type": "Answer", text: item.answer },
	})),
});

export const itemListNode = (
	pageUrl: string,
	items: { name: string; url: string; description: string }[],
): Node => ({
	"@type": "ItemList",
	"@id": `${pageUrl}#itemlist`,
	itemListOrder: "https://schema.org/ItemListUnordered",
	numberOfItems: items.length,
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		description: item.description,
		url: item.url,
	})),
});

/** Wraps nodes into the single @graph the whole site shares. */
export const graph = (nodes: Node[]) => ({
	"@context": "https://schema.org",
	"@graph": nodes,
});
