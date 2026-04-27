import type ZEngine from "@fukutotojido/z-engine";
import RankingCountUpHandler from "./RankingCountUpHandler";

export default class RankingAccuracyHandler extends RankingCountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ranking-accuracy",
			format: {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			},
			defaultValue: 0,
			numberSuffix: "%",
		});

		engine.register_jq(".resultsScreen?.accuracy?", (_: number, accuracy: number) => {
			this.stored = accuracy;
		});
	}
}
