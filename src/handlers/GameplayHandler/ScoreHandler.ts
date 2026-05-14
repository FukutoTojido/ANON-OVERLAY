import type ZEngine from "@fukutotojido/z-engine";
import { CountUp } from "countup.js";
import BaseHandler from "../BaseHandler";

export default class ScoreHandler extends BaseHandler {
	countUp!: CountUp;

	constructor(
		engine: ZEngine,
		private onUpdate?: (score: number) => void,
	) {
		super(engine, { id: "#score" });
		if (!this.element) return;
		const formatter = new Intl.NumberFormat("en-US", {
			minimumIntegerDigits: 6,
		});

		this.countUp = new CountUp(this.element, 0, {
			decimalPlaces: 0,
			autoAnimate: true,
			duration: 1,
			formattingFn: (value) => formatter.format(value),
		});

		this.countUp.start();

		engine.register_jq(".play?.score?", (_: number, score: number) => {
			const value = this.update(score);
			this.onUpdate?.(value);
		});
	}

	override update(value?: number, element: HTMLElement | null = this.element) {
		if (!element) return 0;

		const isPreMap =
			this.engine.cache.beatmap?.time?.live <
			this.engine.cache?.beatmap?.time?.firstObject;

		if (isPreMap) {
			this.countUp.update(0);
			this.onUpdate?.(0);
			return 0;
		}

		this.countUp.update(value ?? 0);
		return value ?? 0;
	}
}
