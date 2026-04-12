import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://getcoral.dev",
	integrations: [solidJs(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
