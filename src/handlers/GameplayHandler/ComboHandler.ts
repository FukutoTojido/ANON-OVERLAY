import type ZEngine from "@fukutotojido/z-engine";
import CountUpHandler from "../CountUpHandler";

export default class ComboHandler extends CountUpHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#combo",
			format: {
				maximumFractionDigits: 0,
			},
			numberSuffix: "x",
			defaultValue: 0,
		});

		engine.register_jq(
			".play?.combo?.current?",
			(_: number, combo: number, data) => {
				this.update(combo);

				if (data?.play?.combo?.max > combo) {
					document
						.querySelector<HTMLDivElement>("#maxComboContainer")
						?.classList.remove("w-0", "opacity-0");
				} else {
					document
						.querySelector<HTMLDivElement>("#maxComboContainer")
						?.classList.add("w-0", "opacity-0");
				}
			},
		);
	}
}
