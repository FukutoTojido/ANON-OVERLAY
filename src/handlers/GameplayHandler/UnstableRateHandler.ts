import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class UnstableRateHandler extends CountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ur",
			format: {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			},
			numberSuffix: "UR",
			defaultValue: 0
		});

		engine.register_jq(".play?.unstableRate?", (_: number, ur: number) => {
			this.update(ur);
		});
	}
}
