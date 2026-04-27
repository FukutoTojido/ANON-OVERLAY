import type ZEngine from "@fukutotojido/z-engine";
import BaseHandler from "../BaseHandler";

type Grade = "X" | "XH" | "S" | "SH" | "A" | "B" | "C" | "D";

export default class GradeHandler extends BaseHandler {
	constructor(engine: ZEngine) {
		super(engine, {
			id: "#grade",
		});

		engine.register_jq(".play?.rank?.current", (_: string, grade: Grade) => {
			this.update(grade);
		});
	}

	override update(value: Grade, element: HTMLElement | null = this.element) {
		if (!element) return;

		switch (value) {
			case "XH":
			case "X": {
				element.style.transform = "translateY(0px)";
				break;
			}
			case "SH":
			case "S": {
				element.style.transform = "translateY(-48px)";
				break;
			}
			case "A": {
				element.style.transform = "translateY(-96px)";
				break;
			}
			case "B": {
				element.style.transform = "translateY(-144px)";
				break;
			}
			case "C": {
				element.style.transform = "translateY(-192px)";
				break;
			}
			case "D": {
				element.style.transform = "translateY(-240px)";
				break;
			}
		}
	}
}
