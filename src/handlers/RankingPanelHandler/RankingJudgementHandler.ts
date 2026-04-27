import type ZEngine from "@fukutotojido/z-engine";
import RankingCountUpHandler from "./RankingCountUpHandler";

export default class RankingJudgementHandler extends RankingCountUpHandler {
	constructor(engine: ZEngine, id: string) {
		super(engine, {
			id: `#ranking-h${id}`,
			format: {
				maximumFractionDigits: 0,
			},
			defaultValue: 0,
		});

		engine.register_jq(
			`.resultsScreen?.hits?."${id}"`,
			(_: number, count: number) => {
				this.stored = count;
			},
		);
	}
}
