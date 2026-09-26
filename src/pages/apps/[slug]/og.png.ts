import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { ogCardSvg } from "../../../lib/ogCard";

export async function getStaticPaths() {
	const modules = await getCollection("modules");
	return modules.map((entry) => ({
		params: { slug: entry.id },
		props: { entry },
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const { data } = props.entry;
	const svg = ogCardSvg({
		eyebrow: "Coral module",
		title: data.name,
		subtitle: data.tagline,
		accent: data.accent,
		footer: `getcoral.dev/apps · ${data.statusLabel} · MIT licensed`,
	});
	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
