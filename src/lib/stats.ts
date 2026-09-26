/**
 * Fetches ecosystem counts at build time so /stats has indexable text.
 *
 * Previously every number on that page lived inside a remote shields.io SVG,
 * which meant a crawler saw a page with no content on it at all.
 */

export interface PackageStat {
	name: string;
	repo: string;
	weeklyDownloads: number | null;
}

export interface ImageStat {
	name: string;
	pulls: number | null;
	lastUpdated: string | null;
}

const NPM_PACKAGES = [
	{ name: "@get-coral/ui", repo: "https://github.com/Get-Coral/coral-ui" },
	{
		name: "@get-coral/jellyfin",
		repo: "https://github.com/Get-Coral/Jellyfin",
	},
	{
		name: "@get-coral/tsconfig",
		repo: "https://github.com/Get-Coral/coral/tree/main/dev-standards/packages/tsconfig",
	},
	{
		name: "@get-coral/biome-config",
		repo: "https://github.com/Get-Coral/coral/tree/main/dev-standards/packages/biome-config",
	},
	{ name: "create-coral", repo: "https://github.com/Get-Coral/create-coral" },
];

export const DOCKER_NAMESPACE = "getcoral";

const DOCKER_IMAGES = [
	"aurora",
	"kapow",
	"tide",
	"fathom",
	"marquee",
	"encore",
	"librarian",
];

/** A failed fetch yields null rather than breaking the build. */
const safeJson = async (
	url: string,
): Promise<Record<string, unknown> | null> => {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
		if (!res.ok) return null;
		return (await res.json()) as Record<string, unknown>;
	} catch {
		return null;
	}
};

export async function getPackageStats(): Promise<PackageStat[]> {
	return Promise.all(
		NPM_PACKAGES.map(async (pkg) => {
			const data = await safeJson(
				`https://api.npmjs.org/downloads/point/last-week/${pkg.name}`,
			);
			const downloads = data?.downloads;
			return {
				...pkg,
				weeklyDownloads: typeof downloads === "number" ? downloads : null,
			};
		}),
	);
}

export async function getImageStats(): Promise<ImageStat[]> {
	return Promise.all(
		DOCKER_IMAGES.map(async (name) => {
			const data = await safeJson(
				`https://hub.docker.com/v2/repositories/${DOCKER_NAMESPACE}/${name}`,
			);
			const pulls = data?.pull_count;
			const updated = data?.last_updated;
			return {
				name,
				pulls: typeof pulls === "number" ? pulls : null,
				lastUpdated: typeof updated === "string" ? updated.slice(0, 10) : null,
			};
		}),
	);
}

export const formatCount = (value: number | null) =>
	value === null ? "—" : value.toLocaleString("en-US");

export const sumCounts = (values: (number | null)[]) =>
	values.reduce<number>((total, v) => total + (v ?? 0), 0);
