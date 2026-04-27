import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class AccuracyHandler extends CountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#accuracy",
			format: {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			},
			numberSuffix: "%",
			defaultValue: 100
		});

		engine.register_jq(".play?.accuracy?", (_: number, accuracy: number) => {
			this.update(accuracy);
		});
	}
}
