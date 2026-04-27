import type ZEngine from "@fukutotojido/z-engine";
import { getPlayerData } from "../../utils";
import BaseHandler from "../BaseHandler";

export type PlayerData = {
	username: string;
	id: number;
};

type FetchedData = {
	name: string;
	performance: string;
	avatar: string;
	id: number;
};

export default class RankingPlayerHandler extends BaseHandler {
	constructor(
		engine: ZEngine,
		private onUpdate?: (data: PlayerData) => void,
	) {
		super(engine, { id: "#ranking-user-name" });

		let controller: AbortController | null = null;
		engine.register_jq(
			".resultsScreen?.playerName?",
			async (_: number, playerName: string) => {
				controller?.abort();
				controller = await this.update(playerName);
			},
		);
	}

	override async update(playerName: string) {
		const controller = new AbortController();

		const data = {
			name: playerName,
			performance: "loading... ",
			avatar: "",
			id: -1,
		};

		this.applyData(data);

		try {
			if (!playerName) {
				data.name = "?";
				throw new Error("Empty Username");
			}

			const {
				username,
				statistics: { pp },
				avatar_url,
				id,
			} = await getPlayerData(playerName, controller);

			data.name = username;
			data.performance = new Intl.NumberFormat("en-US", {
				maximumFractionDigits: 0,
			}).format(pp);
			data.avatar = `url("${avatar_url}")`;
			data.id = id;
		} catch {
			data.performance = "-- ";
			data.avatar = "url('https://a.ppy.sh')";
		}

		this.applyData(data);

		this.onUpdate?.({
			username: data.name,
			id: data.id,
		});

		return controller;
	}

	private applyData(data: FetchedData) {
		const userName = this.element;
		const userPerformance = document.querySelector<HTMLDivElement>(
			"#ranking-user-performance",
		);
		const userAvatar = document.querySelector<HTMLImageElement>(
			"#ranking-user-avatar",
		);

		if (!userName || !userPerformance || !userAvatar) return;

		const { name, performance, avatar } = data;

		userName.textContent = name;
		userPerformance.textContent = performance;
		userAvatar.style.backgroundImage = avatar;
	}
}
