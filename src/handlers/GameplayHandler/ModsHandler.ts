import type ZEngine from "@fukutotojido/z-engine";
import { DEC_MODS, INC_MODS, MODS, type Mod, UTILS_MODS } from "../../const";

export default class ModsHandler {
	constructor(engine: ZEngine) {
		engine.register_jq(".play?.mods?.name?", (_: string, __: string, data) => {
			this.update(
				data?.play?.mods?.array?.map((mod: { acronym: Mod }) => mod.acronym) ??
					[],
			);
		});
	}

	update(_mods: Mod[]) {
		const element = document.querySelector<HTMLDivElement>("#mods");
		if (!element) return;

		const mods = _mods.filter((mod) => MODS.includes(mod));
		element.innerHTML = "";

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

			element.append(modEle);
		}
	}
}
