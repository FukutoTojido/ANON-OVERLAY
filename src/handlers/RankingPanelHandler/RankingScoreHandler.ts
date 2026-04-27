import type ZEngine from "@fukutotojido/z-engine";
import RankingCountUpHandler from "./RankingCountUpHandler";

export default class RankingScoreHandler extends RankingCountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ranking-score",
			format: {
				maximumFractionDigits: 0,
			},
			defaultValue: 0,
		});

		engine.register_jq(".resultsScreen?.score?", (_: number, score: number) => {
			this.stored = score;
		});
	}
}
