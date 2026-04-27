import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class MaxComboHandler extends CountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#maxCombo",
			format: {
				maximumFractionDigits: 0,
			},
			numberSuffix: "x",
			numberPrefix: "/",
			defaultValue: 0,
		});

		engine.register_jq(".play?.combo?.max?", (_: number, maxCombo: number) => {
			this.update(maxCombo);
		});
	}
}
