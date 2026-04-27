import type ZEngine from "@fukutotojido/z-engine";
import { Vibrant } from "node-vibrant/browser";

type Swatch = Awaited<
	ReturnType<InstanceType<typeof Vibrant>["getPalette"]>
>["Vibrant"];

export interface Palette {
	Vibrant: Swatch;
	Muted: Swatch;
	DarkVibrant: Swatch;
	DarkMuted: Swatch;
	LightVibrant: Swatch;
	LightMuted: Swatch;
}

export default class BackgroundHandler {
	palette: Palette = {
		Vibrant: null,
		Muted: null,
		DarkVibrant: null,
		DarkMuted: null,
		LightVibrant: null,
		LightMuted: null,
	};

	constructor(engine: ZEngine, onUpdate?: (palette: Palette) => void) {
		engine.register_jq(
			".directPath?.beatmapBackground?",
			async (_: string, background: string) => {
				const app = document.querySelector<HTMLDivElement>("#app");
				if (!app) return;

				const rankingPanel = document.querySelector<HTMLDivElement>("#rankingPanel");
				if (!rankingPanel) return;

				const url = `${import.meta.env.VITE_BASE_URL}/Songs/${background.replaceAll("\\", "/")}`;
				app.style.backgroundImage = `linear-gradient(to bottom, rgb(0 0 0 /.6), rgb(0 0 0 /.6) 100%), url("${url}")`;
				rankingPanel.style.backgroundImage = `linear-gradient(to bottom, transparent 40%, rgb(0 0 0 /.6) 100%), url("${url}")`;

				try {
					this.palette = await Vibrant.from(url).getPalette();
				} catch {
					this.palette = {
						Vibrant: null,
						Muted: null,
						DarkVibrant: null,
						DarkMuted: null,
						LightVibrant: null,
						LightMuted: null,
					};
				}
				
				document.documentElement.style.setProperty("--accent", this.palette.Muted?.hex ?? "#f84f84");
				
				onUpdate?.(this.palette);
			},
		);
	}
}
