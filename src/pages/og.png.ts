import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const GET = async () => {
	const svg = readFileSync(path.join(process.cwd(), "public/social-card.svg"));
	const png = await sharp(svg).png().toBuffer();
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
