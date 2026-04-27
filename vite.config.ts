import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
	base: "./",
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]",
				preserveModules: true,
			},
		},
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		minify: false,
	},
});
