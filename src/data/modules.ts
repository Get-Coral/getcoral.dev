export type ModuleStatus = "active" | "mvp" | "idea";
export type ModuleAccent = "teal" | "coral";

export interface CoralModule {
	slug: string;
	name: string;
	emoji: string;
	tagline: string;
	description: string;
	longDescription: string;
	status: ModuleStatus;
	statusLabel: string;
	repo: string;
	docs: string;
	containerUrl?: string;
	accent: ModuleAccent;
	bestFor: string[];
	highlights: string[];
	stack: string[];
}

export const modules: CoralModule[] = [
	{
		slug: "aurora",
		name: "Aurora",
		emoji: "🎬",
		tagline: "High-end cinematic Jellyfin frontend",
		description:
			"The Netflix-quality client Jellyfin deserves. Full-bleed backdrops, smooth transitions, rich playback, and a proper big-screen feel.",
		longDescription:
			"Aurora is Coral's premium Jellyfin frontend. It keeps Jellyfin as the source of truth while layering on a more cinematic home experience, richer detail views, embedded playback, favorites, genre browsing, and translation-ready UI foundations.",
		status: "active",
		statusLabel: "In Progress",
		repo: "https://github.com/Get-Coral/aurora",
		docs: "https://docs.getcoral.dev/modules/aurora/",
		containerUrl: "https://hub.docker.com/r/getcoral/aurora",
		accent: "teal",
		bestFor: [
			"Living room playback",
			"Modern Jellyfin browsing",
			"Shared household installs",
		],
		highlights: [
			"Featured, continue-watching, favorites, and recommendation rails",
			"Embedded playback with progress sync back to Jellyfin",
			"Rich movie and series detail views with cast and related titles",
			"Genre browsing, pagination, and local-first onboarding with SQLite",
		],
		stack: [
			"TanStack Start",
			"React 19",
			"TanStack Router",
			"TanStack Query",
			"Tailwind v4",
		],
	},
	{
		slug: "kapow",
		name: "KAPOW!",
		emoji: "🎤",
		tagline: "Comic-book karaoke queue manager for bars and parties",
		description:
			"Hosts create a room, guests scan a QR code, search for tracks, and vote songs up the queue while the host controls the night from a booth view.",
		longDescription:
			"KAPOW! is Coral's group karaoke module. It is built for bars, events, and parties where a host needs a live queue, a guest-friendly join flow, collaborative voting, and a dedicated display mode on the projector or TV.",
		status: "mvp",
		statusLabel: "MVP Built",
		repo: "https://github.com/Get-Coral/KAPOW",
		docs: "https://docs.getcoral.dev/modules/kapow/",
		containerUrl: "https://hub.docker.com/r/getcoral/kapow",
		accent: "coral",
		bestFor: [
			"Bars and karaoke nights",
			"Party queue management",
			"QR-code join flows",
		],
		highlights: [
			"Host rooms with QR join codes and dedicated host tokens",
			"Guest song search and queue submission from a phone",
			"Live voting that pushes the best pending song upward",
			"Separate guest, host, and TV display routes for the whole room",
		],
		stack: [
			"TanStack Start",
			"Supabase realtime",
			"dnd-kit",
			"Tailwind v4",
			"Jellyfin",
		],
	},
	{
		slug: "tide",
		name: "Tide",
		emoji: "🌊",
		tagline: "Torrent downloads with a calmer control surface",
		description:
			"Add torrents fast, enforce active queue limits, reprioritize files by piece selection, and inspect peers, trackers, and a piece map when you need the deep view.",
		longDescription:
			"Tide is Coral's torrent download manager. It is designed for self-hosters who want Transmission-like practicality with a cleaner home board, stronger queue controls, SQLite-backed state, and better swarm visibility.",
		status: "active",
		statusLabel: "Shipping",
		repo: "https://github.com/Get-Coral/tide",
		docs: "https://docs.getcoral.dev/modules/tide/",
		containerUrl: "https://hub.docker.com/r/getcoral/tide",
		accent: "teal",
		bestFor: [
			"Media acquisition workflows",
			"Self-hosted download boxes",
			"Queue-first torrent management",
		],
		highlights: [
			"Quick-add flow with clipboard paste and inline board controls",
			"Max active downloads and seeders with real queue enforcement",
			"Per-file piece selection priorities instead of metadata-only toggles",
			"Compact piece maps, tracker health, peer views, SQLite persistence, and optional basic auth",
		],
		stack: ["TanStack Start", "WebTorrent", "SQLite", "Tailwind v4", "Biome"],
	},
	{
		slug: "fathom",
		name: "Fathom",
		emoji: "📖",
		tagline: "Modern reading room for Jellyfin libraries",
		description:
			"A calm, cover-first interface for books, manga, comics, PDFs, and grouped collections pulled from your Jellyfin reading libraries.",
		longDescription:
			"Fathom is Coral's reading room. It turns Jellyfin libraries into a quieter browsing experience with featured shelves, recent additions, collection views, detailed title metadata, and local SQLite-backed connection storage.",
		status: "mvp",
		statusLabel: "MVP Built",
		repo: "https://github.com/Get-Coral/fathom",
		docs: "https://docs.getcoral.dev/modules/fathom/",
		containerUrl: "https://hub.docker.com/r/getcoral/fathom",
		accent: "teal",
		bestFor: [
			"Books and manga on a NAS",
			"Cover-first browsing",
			"Calm reading interfaces",
		],
		highlights: [
			"Featured shelves and recent additions for reading libraries",
			"Collection and library browsing with title detail views",
			"Support for books, manga, comics, PDFs, and more",
			"Jellyfin onboarding that can live in .env or local SQLite",
		],
		stack: [
			"TanStack Start",
			"React 19",
			"Tailwind v4",
			"SQLite",
			"Jellyfin API",
		],
	},
	{
		slug: "marquee",
		name: "Marquee",
		emoji: "📺",
		tagline: "Ambient now-playing display for Jellyfin spaces",
		description:
			"A passive, always-on screen for TVs and monitors that surfaces what is playing, what is next, and what was recently added without demanding interaction.",
		longDescription:
			"Marquee is the Coral module for presence instead of control. It is meant to turn a spare display into a beautiful ambient layer for your media setup, whether that is a living room TV, hallway panel, or wall-mounted dashboard.",
		status: "mvp",
		statusLabel: "MVP Built",
		repo: "https://github.com/Get-Coral/marquee",
		docs: "https://docs.getcoral.dev/modules/marquee/",
		containerUrl: "https://hub.docker.com/r/getcoral/marquee",
		accent: "coral",
		bestFor: [
			"Wall displays",
			"Passive household screens",
			"Now-playing ambience",
		],
		highlights: [
			"Designed as a passive screen rather than an interactive client",
			"Ideal for now-playing, up-next, and recently-added moments",
			"Built to sit nicely on a TV, hallway display, or dashboard monitor",
			"Will inherit Coral's shared app shell and Jellyfin integration foundations",
		],
		stack: [
			"TanStack Start",
			"Tailwind v4",
			"Jellyfin API",
			"Coral UI",
			"Astro-style ambient presentation",
		],
	},
	{
		slug: "encore",
		name: "Encore",
		emoji: "🎶",
		tagline: "Moderated guest music requests for house-party mode",
		description:
			"Guests browse Jellyfin music and send queue requests while the host approves, rejects, and controls what actually plays next.",
		longDescription:
			"Encore is Coral's guest request layer for music playback. It is meant for parties and shared spaces where you want collaborative input from guests without giving up host control over the queue.",
		status: "mvp",
		statusLabel: "MVP Built",
		repo: "https://github.com/Get-Coral/encore",
		docs: "https://docs.getcoral.dev/modules/encore/",
		containerUrl: "https://hub.docker.com/r/getcoral/encore",
		accent: "teal",
		bestFor: [
			"House parties",
			"Guest queue moderation",
			"Jellyfin music sharing",
		],
		highlights: [
			"Host-controlled guest request workflow for music sessions",
			"Share a URL and let guests browse your Jellyfin music catalog",
			"Approve or reject requests before they enter playback",
			"Simple local deployment with Coral's standard app stack",
		],
		stack: ["TanStack Start", "Tailwind v4", "Jellyfin API", "SQLite", "Biome"],
	},
	{
		slug: "librarian",
		name: "Librarian",
		emoji: "🗂️",
		tagline: "Media hygiene and enrichment for self-hosted libraries",
		description:
			"Scan, organize, enrich, and maintain your Jellyfin library with a management layer focused on metadata quality and long-term cleanliness.",
		longDescription:
			"Librarian is Coral's module for media hygiene. It is aimed at people who want stronger organization, metadata enrichment, duplicate detection, and bulk library operations while keeping Jellyfin as the source of truth.",
		status: "mvp",
		statusLabel: "MVP Built",
		repo: "https://github.com/Get-Coral/librarian",
		docs: "https://docs.getcoral.dev/modules/librarian/",
		containerUrl: "https://hub.docker.com/r/getcoral/librarian",
		accent: "coral",
		bestFor: [
			"Cleaning large libraries",
			"Metadata QA",
			"Bulk enrichment workflows",
		],
		highlights: [
			"Identify missing metadata, weak posters, and duplicates",
			"Prepare media for downstream Coral modules while keeping clean boundaries",
			"Queue bulk renaming, tagging, and enrichment operations",
			"Store local connection details in SQLite for self-hosted installs",
		],
		stack: [
			"TanStack Start",
			"TanStack Query",
			"Tailwind v4",
			"SQLite",
			"Jellyfin API",
		],
	},
];

export function getModuleBySlug(slug: string) {
	return modules.find((module) => module.slug === slug);
}
