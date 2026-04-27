import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class HitCountHandler extends CountUpHandler {
	constructor(engine: ZEngine, value: 100 | 50 | 0) {
		super(engine, {
			id: `#h${value}`,
			format: {
				maximumFractionDigits: 0,
			},
			defaultValue: 0,
		});

		engine.register_jq(`.play?.hits?."${value}"`, (_: number, value: number) => {
			this.update(value);
		});
	}
}
