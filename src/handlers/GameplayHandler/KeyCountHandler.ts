import type ZEngine from "@fukutotojido/z-engine";
import type { Palette } from "./BackgroundHandler";
import CountUpHandler from "../CountUpHandler";

export default class KeyCountHandler extends CountUpHandler {
	constructor(
		engine: ZEngine,
		public id: "k1" | "k2" | "m1" | "m2",
	) {
		super(engine, {
			id: `#${id}`,
			format: {
				maximumFractionDigits: 0,
			},
			defaultValue: 0,
		});

		engine.register_jq(`.keys?.${id}?.count?`, (_: number, count: number) => {
			this.update(count);
		});
	}

	updateColor(palette: Palette) {
		const ele = document.querySelector<HTMLDivElement>(`#${this.id}-container`);
		if (!ele) return;

		if (this.id.includes("1"))
			ele.style.backgroundColor = palette.Muted?.hex ?? "white";

		if (this.id.includes("2"))
			ele.style.backgroundColor = palette.LightMuted?.hex ?? "white";
	}
}
