import type ZEngine from "@fukutotojido/z-engine";
import { debounce } from "../../utils";
import CountUpHandler, { type CountUpConfig } from "../CountUpHandler";

export default class RankingCountUpHandler extends CountUpHandler {
	protected stored: number = 0;

	constructor(engine: ZEngine, config: CountUpConfig) {
		super(engine, config);

		if (!this.element) return;

		this.element.transformTiming = {
			easing: "ease-out",
			duration: 1000,
		};

		engine.register_jq(
			".state?.name?",
			debounce((_: string, state: string) => {
				if (state !== "resultScreen") {
					this.update(0);
					return;
				}

				this.update(this.stored);
			}, 200),
		);
	}
}
