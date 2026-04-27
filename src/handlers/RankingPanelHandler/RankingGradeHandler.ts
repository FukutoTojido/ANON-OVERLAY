import type ZEngine from "@fukutotojido/z-engine";
import BaseHandler from "../BaseHandler";

type Grade = "X" | "XH" | "S" | "SH" | "A" | "B" | "C" | "D";

export default class RankingGradeHandler extends BaseHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#ranking-grade",
		});

		engine.register_jq(".resultsScreen?.rank?", (_: string, grade: Grade) => {
			this.update(grade);
		});
	}

	override update(grade: string) {
		for (const element of document.querySelectorAll<HTMLDivElement>(
			".ranking-grade",
		)) {
			element.classList.add("hidden", "opacity-0");
		}

		switch (grade) {
			case "XH":
			case "X": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-x")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
			case "SH":
			case "S": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-s")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
			case "A": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-a")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
			case "B": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-b")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
			case "C": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-c")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
			case "D": {
				document
					.querySelector<HTMLDivElement>("#ranking-grade-d")
					?.classList.remove("hidden", "opacity-0");
				break;
			}
		}
	}
}
