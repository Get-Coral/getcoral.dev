const COLORS = {
	teal: "#2dd4bf",
	coral: "#ff6b6b",
} as const;

const escapeXml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

/** Greedy wrap at a character budget, since we have no font metrics here. */
const wrap = (text: string, perLine: number, maxLines: number) => {
	const lines: string[] = [];
	let current = "";
	for (const word of text.split(/\s+/)) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length > perLine && current) {
			lines.push(current);
			current = word;
			if (lines.length === maxLines) break;
		} else {
			current = candidate;
		}
	}
	if (current && lines.length < maxLines) lines.push(current);
	return lines;
};

export interface OgCardOptions {
	eyebrow: string;
	title: string;
	subtitle: string;
	accent: keyof typeof COLORS;
	footer?: string;
}

/**
 * Builds a 1200x630 card as SVG. Rendered to PNG by the endpoints with sharp.
 * Uses generic system font families because the rasteriser has no access to
 * the webfonts the site loads.
 */
export function ogCardSvg({
	eyebrow,
	title,
	subtitle,
	accent,
	footer = "getcoral.dev · MIT licensed · Docker native",
}: OgCardOptions): string {
	const color = COLORS[accent];
	const titleLines = wrap(title, 26, 2);
	const subtitleLines = wrap(subtitle, 52, 2);
	const titleSize = titleLines.length > 1 ? 72 : 84;

	const titleY = 250;
	const subtitleY = titleY + (titleLines.length - 1) * (titleSize + 8) + 76;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(`${title} — ${subtitle}`)}">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.025)"/>
    </pattern>
    <radialGradient id="glowA" gradientUnits="userSpaceOnUse" cx="-80" cy="-60" r="700">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" gradientUnits="userSpaceOnUse" cx="1340" cy="740" r="680">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#060d12"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>
  <rect x="80" y="76" width="${Math.max(160, eyebrow.length * 11 + 52)}" height="44" rx="22" fill="${color}1a" stroke="${color}38" stroke-width="1"/>
  <text x="106" y="104" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="16" letter-spacing="2" font-weight="600">${escapeXml(eyebrow.toUpperCase())}</text>
${titleLines
	.map(
		(line, i) =>
			`  <text x="80" y="${titleY + i * (titleSize + 8)}" fill="#f4f7fa" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="600">${escapeXml(line)}</text>`,
	)
	.join("\n")}
${subtitleLines
	.map(
		(line, i) =>
			`  <text x="80" y="${subtitleY + i * 42}" fill="#93a4b3" font-family="Arial, Helvetica, sans-serif" font-size="30">${escapeXml(line)}</text>`,
	)
	.join("\n")}
  <rect x="80" y="516" width="1040" height="1" fill="rgba(255,255,255,0.1)"/>
  <text x="80" y="566" fill="#7c8b99" font-family="Arial, Helvetica, sans-serif" font-size="22">${escapeXml(footer)}</text>
</svg>`;
}
