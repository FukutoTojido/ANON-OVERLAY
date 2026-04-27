import type ZEngine from "@fukutotojido/z-engine";
import AccuracyHandler from "./AccuracyHandler";
import BackgroundHandler from "./BackgroundHandler";
import ComboHandler from "./ComboHandler";
import GradeHandler from "./GradeHandler";
import HitCountHandler from "./HitCountHandler";
import KeyCountHandler from "./KeyCountHandler";
import KeyGraphHandler from "./KeyGraphHandler";
import LeaderboardHandler from "./LeaderboardHandler";
import MaxComboHandler from "./MaxComboHandler";
import MetadataHandler from "./MetadataHandler";
import ModsHandler from "./ModsHandler";
import PerformanceHandler from "./PerformanceHandler";
import PlayerHandler from "./PlayerHandler";
import ScoreHandler from "./ScoreHandler";
import StatsHandler from "./StatsHandler";
import UnstableRateHandler from "./UnstableRateHandler";

export default class GameplayHandler {
	constructor(engine: ZEngine, precise: ZEngine) {
		const leaderboardHandler = new LeaderboardHandler(engine);
		new ScoreHandler(engine, (score) => leaderboardHandler.updateScore(score));
		new PlayerHandler(engine, (data) => leaderboardHandler.updateMe(data));

		new AccuracyHandler(engine);
		new ComboHandler(engine);
		new MaxComboHandler(engine);
		new UnstableRateHandler(engine);
		new PerformanceHandler(engine);
		new GradeHandler(engine);
		const keyGraphHandler = new KeyGraphHandler(precise);

		for (const value of [100, 50, 0]) {
			new HitCountHandler(engine, value as 100 | 50 | 0);
		}

		for (const stats of ["cs", "ar", "od", "sr"]) {
			new StatsHandler(engine, stats as "cs" | "ar" | "od" | "sr");
		}

		for (const key of ["artist", "title", "version"]) {
			new MetadataHandler(engine, key);
		}

		const k1CountHandler = new KeyCountHandler(precise, "k1");
		const k2CountHandler = new KeyCountHandler(precise, "k2");

		new BackgroundHandler(engine, (palette) => {
			keyGraphHandler.updateColor(palette);
			k1CountHandler.updateColor(palette);
			k2CountHandler.updateColor(palette);
		});

		new ModsHandler(engine);

		const element = document.querySelector("#app");
		if (!element) return;

		engine.register_jq(".state?.name?", (_: string, state: string, data) => {
			const visible = data?.settings?.intefaceVisible;

			if (state !== "play" || visible) {
				element.classList.add("hidden", "opacity-0");
				return;
			}

			element.classList.remove("hidden", "opacity-0");
		});

		engine.register_jq(
			".settings?.interfaceVisible?",
			(_: boolean, visible: boolean, data) => {
				const state = data?.state?.name;

				if (state !== "play" || visible) {
					element.classList.add("hidden", "opacity-0");
					return;
				}

				element.classList.remove("hidden", "opacity-0");
			},
		);
	}
}
