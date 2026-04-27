import type ZEngine from "@fukutotojido/z-engine";
import RankingAccuracyHandler from "./RankingAccuracyHandler";
import RankingComboHandler from "./RankingComboHandler";
import RankingGradeHandler from "./RankingGradeHandler";
import RankingJudgementHandler from "./RankingJudgementHandler";
import RankingMetadataHandler from "./RankingMetadataHandler";
import RankingPerformanceHandler from "./RankingPerformanceHandler";
import RankingPlayerHandler from "./RankingPlayerHandler";
import RankingScoreHandler from "./RankingScoreHandler";
import RankingModsHandler from "./RankingModsHandler";

export default class RankingPanelHandler {
	constructor(engine: ZEngine) {
		new RankingScoreHandler(engine);
		new RankingAccuracyHandler(engine);
		new RankingComboHandler(engine);
		new RankingPerformanceHandler(engine);

		for (const value of [300, 100, 50, 0]) {
			new RankingJudgementHandler(engine, `${value}`);
		}

		for (const key of ["artist", "title", "version", "mapper"]) {
			new RankingMetadataHandler(engine, key);
		}

		new RankingPlayerHandler(engine);
		new RankingGradeHandler(engine);
		new RankingModsHandler(engine);

		const element = document.querySelector("#rankingPanel");
		if (!element) return;

		engine.register_jq(".state?.name?", (_: string, state: string) => {
			if (state !== "resultScreen") {
				element.classList.add("hidden", "opacity-0");
				return;
			}

			element.classList.remove("hidden", "opacity-0");
		});
	}
}
