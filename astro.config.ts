// SitemapItem.changefreq wants the enum member, not the string literal.
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://getcoral.dev",
	// One URL per page. Without this, /apps/tide and /apps/tide/ both resolve,
	// and the sitemap and canonical tags disagree about which one is real.
	trailingSlash: "never",
	build: { format: "file" },
	integrations: [
		solidJs(),
		sitemap({
			serialize(item) {
				const weekly = ChangeFreqEnum.WEEKLY;
				const monthly = ChangeFreqEnum.MONTHLY;
				const path = new URL(item.url).pathname;
				if (path === "/") {
					return { ...item, changefreq: weekly, priority: 1.0 };
				}
				if (path === "/apps") {
					return { ...item, changefreq: weekly, priority: 0.9 };
				}
				if (path.startsWith("/apps/")) {
					return { ...item, changefreq: weekly, priority: 0.8 };
				}
				if (path.startsWith("/compare/") || path.startsWith("/guides/")) {
					return { ...item, changefreq: monthly, priority: 0.7 };
				}
				return { ...item, changefreq: weekly, priority: 0.5 };
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
