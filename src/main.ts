import ZEngine from "@fukutotojido/z-engine";
import "number-flow";
import "remixicon/fonts/remixicon.css";
import GameplayHandler from "./handlers/GameplayHandler";
import RankingPanelHandler from "./handlers/RankingPanelHandler";
import "./style.css";
import { query } from "./utils";

const WS_URL = import.meta.env.DEV
	? import.meta.env.VITE_WS_URL
	: `ws://${window.location.host}/websocket/v2`;
const WS_PRECISE_URL = import.meta.env.DEV
	? import.meta.env.VITE_WS_PRECISE_URL
	: `ws://${window.location.host}/websocket/v2/precise`;

const engine = new ZEngine(WS_URL, [
	"state",
	{
		field: "beatmap",
		keys: [
			"time",
			"artist",
			"title",
			"version",
			"mapper",
			{
				field: "stats",
				keys: [
					{ field: "stars", keys: ["total"] },
					{ field: "cs", keys: ["converted"] },
					{ field: "ar", keys: ["converted"] },
					{ field: "od", keys: ["converted"] },
				],
			},
		],
	},
	{
		field: "play",
		keys: [
			"playerName",
			"score",
			"accuracy",
			"combo",
			{ field: "hits", keys: ["100", "50", "0"] },
			{ field: "rank", keys: ["current"] },
			{ field: "pp", keys: ["current"] },
			"unstableRate",
			{ field: "mods", keys: ["name", "array"] },
		],
	},
	"leaderboard",
	"directPath",
	"resultsScreen",
	{
		field: "settings",
		keys: ["interfaceVisible"],
	},
]);
const precise = new ZEngine(WS_PRECISE_URL);

new GameplayHandler(engine, precise);
new RankingPanelHandler(engine);

const hideMap = [
	["hide_np", "#np-container"],
	["hide_leaderboard", "#leaderboard"],
	["hide_combo", "#combo-container"],
	["hide_ur", "#ur-container"],
	["hide_judgements", "#judgements-container"],
	["hide_key", "#key-container"],
	["hide_profile", "#profile-container"],
	["hide_ranking", "#rankingPanel"],
	["hide_grade", "#grade-wrapper"],
	["hide_performance", "#performance-container"],
	["hide_score", "#score"],
	["hide_accuracy", "#accuracy-container"],
];

for (const [key, id] of hideMap) {
	if (!query.has(key)) continue;
	document.querySelector(id)?.classList.add("hidden!");
}
