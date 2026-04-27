import type ZEngine from "@fukutotojido/z-engine";
import type { Data } from "@fukutotojido/z-engine";
import { debounce } from "../../utils";
import type { PlayerData } from "./PlayerHandler";

type Entry = {
	name: string;
	score: number;
};

class LeaderboardEntry {
	static TEMPLATE =
		document.querySelector<HTMLTemplateElement>("#leaderboard-entry");

	element!: HTMLDivElement;

	constructor(public entry: Entry) {
		if (!LeaderboardEntry.TEMPLATE || !LeaderboardEntry.TEMPLATE.content)
			return;

		const fragment = document.importNode(
			LeaderboardEntry.TEMPLATE.content,
			true,
		);

		const element = fragment.querySelector<HTMLDivElement>("div");
		if (!element) return;

		this.element = element;

		const userName = this.element.querySelector<HTMLDivElement>(
			"[data-label='user-name']",
		);
		const userScore = this.element.querySelector<HTMLDivElement>(
			"[data-label='user-score']",
		);

		if (userName) userName.textContent = entry.name;
		if (userScore)
			userScore.textContent = new Intl.NumberFormat("en-US").format(
				entry.score,
			);

		this.position = 0;
	}

	set position(val: number) {
		if (!this.element) return;

		const userRank = this.element.querySelector<HTMLDivElement>(
			"[data-label='user-rank']",
		);
		if (userRank) userRank.textContent = `#${val}`;
	}
}

class LeaderboardMeEntry extends LeaderboardEntry {
	constructor() {
		super({ name: "", score: 0 });

		this.element?.classList.add(
			"bg-linear-to-r",
			"from-accent",
			"to-transparent",
			"absolute",
		);
	}

	set name(val: string) {
		const userName = this.element?.querySelector<HTMLDivElement>(
			"[data-label='user-name']",
		);
		if (userName) userName.textContent = val;
	}

	set score(val: number) {
		const userScore = this.element?.querySelector<HTMLDivElement>(
			"[data-label='user-score']",
		);
		if (userScore)
			userScore.textContent = new Intl.NumberFormat("en-US").format(val);
	}
}

export default class LeaderboardHandler {
	me: LeaderboardMeEntry;
	entries: LeaderboardEntry[] = [];

	leaderboardContainer: HTMLDivElement | null;

	constructor(engine: ZEngine) {
		this.me = new LeaderboardMeEntry();

		const leaderboard = document.querySelector<HTMLDivElement>("#leaderboard");
		const leaderboardContainer = document.querySelector<HTMLDivElement>(
			"#leaderboardContainer",
		);

		leaderboard?.append(this.me.element);

		engine.register_jq(
			".leaderboard? | length",
			debounce((_: number, __: number, data: Data) => {
				if (!leaderboardContainer) return;

				const leaderboard = data?.leaderboard ?? [];
				leaderboardContainer.innerHTML = "";

				this.entries = leaderboard
					.slice(0, -1)
					.map((entry: Entry) => new LeaderboardEntry(entry));

				for (let i = 0; i < this.entries.length; i++) {
					const entry = this.entries[i];
					entry.position = i + 1;
					leaderboardContainer.append(entry.element);
				}

				this.updateScore(data.play?.score ?? 0);
			}, 500),
		);

		this.leaderboardContainer = leaderboardContainer;
	}

	updateMe(data: PlayerData) {
		const { username } = data;
		this.me.name = username;
	}

	updateScore(score: number) {
		this.me.score = score;

		const currPos = this.getCurrentPosition(score);

		this.me.element.style.transform = `translateY(${Math.max(0, Math.min(6, currPos)) * 50}px)`;
		this.me.position = currPos + 1;

		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i];

			if (entry.entry.score <= score) {
				entry.element.dataset.isLower = "true";
				entry.position = i + 1 + 1;
			} else {
				entry.element.dataset.isLower = "";
				entry.position = i + 1;
			}
		}

		if (!this.leaderboardContainer) return;
		this.leaderboardContainer.style.transform = `translateY(-${Math.max(0, currPos - 6) * 50}px)`;
	}

	private getCurrentPosition(score: number) {
		if (this.entries.length === 0) return 0;

		let mid: number;
		let l = 0;
		let r = this.entries.length - 1;

		while (l <= r) {
			mid = Math.round((l + r) / 2);

			const midScore = this.entries[mid].entry.score;

			if (midScore <= score) r = mid - 1;
			if (midScore > score) l = mid + 1;
		}

		return this.entries[l]?.entry.score <= score
			? l
			: this.entries[r]?.entry.score <= score
				? r
				: this.entries.length;
	}
}
