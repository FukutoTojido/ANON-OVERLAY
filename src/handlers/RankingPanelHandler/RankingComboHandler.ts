import type ZEngine from "@fukutotojido/z-engine";
import RankingCountUpHandler from "./RankingCountUpHandler";

export default class RankingComboHandler extends RankingCountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ranking-combo",
			format: {
				maximumFractionDigits: 0,
				useGrouping: true,
			},
			defaultValue: 0,
			numberSuffix: "x",
		});

		
		engine.register_jq(".resultsScreen?.maxCombo?", (_: number, combo: number) => {
			this.stored = combo;
		});
	}
}
