/**
 * Single source of truth for the things that describe Coral itself.
 *
 * These used to be retyped in every page and in three different JSON-LD
 * blocks, which is how the site ended up describing itself ten different
 * ways across ten URLs.
 */

export const SITE_URL = "https://getcoral.dev";

/** The brand name. Schema used to say "Get Coral" while everything else said "Coral". */
export const SITE_NAME = "Coral";

/** Describes the site as a whole. Never swap this for a page description. */
export const SITE_DESCRIPTION =
	"Coral is an open-source ecosystem of independent Jellyfin modules. Each one runs as a Docker container, talks to your Jellyfin server, and does one thing brilliantly.";

export const SITE_TAGLINE = "Open Source Jellyfin Ecosystem Modules";

/** Profile URLs that let search engines and models resolve Coral to one entity. */
export const SAME_AS = [
	"https://github.com/Get-Coral",
	"https://hub.docker.com/u/getcoral",
	"https://www.npmjs.com/org/get-coral",
	"https://discord.gg/M3wzFpGbzp",
];

export const DOCS_URL = "https://docs.getcoral.dev";
export const GITHUB_ORG_URL = "https://github.com/Get-Coral";
export const DISCORD_URL = "https://discord.gg/M3wzFpGbzp";
export const SPONSORS_URL = "https://github.com/sponsors/ElianCodes";
export const LICENSE_URL = "https://opensource.org/licenses/MIT";

/** Stable @id anchors so every node in the graph points at one entity. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (pathOrUrl: string) =>
	new URL(pathOrUrl, SITE_URL).toString();

/**
 * Titles over ~60 chars and descriptions over ~155 get truncated in search
 * results. Warn at build time rather than discovering it in a SERP.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;
