import type ZEngine from "@fukutotojido/z-engine";
import RankingCountUpHandler from "./RankingCountUpHandler";

export default class RankingPerformanceHandler extends RankingCountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ranking-performance",
			format: {
				maximumFractionDigits: 0,
				useGrouping: true,
			},
			defaultValue: 0,
			numberSuffix: "pp",
		});

		
		engine.register_jq(".resultsScreen?.pp?.current?", (_: number, performance: number) => {
			this.stored = performance;
		});
	}
}
