import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class PerformanceHandler extends CountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#performance",
			format: {
				maximumFractionDigits: 0,
			},
			numberSuffix: "pp",
			defaultValue: 0,
		});

		engine.register_jq(".play?.pp?.current?", (_: number, performance: number) => {
			this.update(performance);
		});
	}
}
