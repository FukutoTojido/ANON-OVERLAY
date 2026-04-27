import type ZEngine from "@fukutotojido/z-engine";
import { DEC_MODS, INC_MODS, MODS, type Mod, UTILS_MODS } from "../../const";
import { debounce } from "../../utils";

export default class RankingModsHandler {
	element: HTMLDivElement | null;

	constructor(engine: ZEngine) {
		this.element = document.querySelector<HTMLDivElement>("#ranking-mods");

		engine.register_jq(
			".resultsScreen?.mods?.name?",
			debounce((_: string, __: string, data) => {
				this.update(
					data?.resultsScreen?.mods?.array?.map(
						(mod: { acronym: Mod }) => mod.acronym,
					) ?? [],
				);
			}, 200),
		);
	}

	update(_mods: Mod[]) {
		if (!this.element) return;

		const container = document.querySelector<HTMLDivElement>(
			"#ranking-mods-container",
		);
		if (!container) return;

		this.element.innerHTML = "";
		
		const mods = _mods.filter((mod) => MODS.includes(mod));
		if (!mods.length) {
			container.classList.add("translate-x-100");
			return;
		}

		container.classList.remove("translate-x-100");

		for (const mod of mods) {
			if (!MODS.includes(mod)) continue;

			const modEle = document.createElement("div");
			modEle.classList.add("mod");

			if ((INC_MODS as unknown as string[]).includes(mod)) {
				modEle.classList.add("inc");
			}

			if ((DEC_MODS as unknown as string[]).includes(mod)) {
				modEle.classList.add("dec");
			}

			if ((UTILS_MODS as unknown as string[]).includes(mod)) {
				modEle.classList.add("utils");
			}

			modEle.classList.add(mod);

			this.element.append(modEle);
		}
	}
}
