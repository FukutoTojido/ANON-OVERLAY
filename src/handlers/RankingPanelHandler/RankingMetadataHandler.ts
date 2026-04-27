import type ZEngine from "@fukutotojido/z-engine";
import BaseHandler from "../BaseHandler";

export default class MetadataHandler extends BaseHandler {
	constructor(engine: ZEngine, key: string) {
		super(engine, {
			id: `#ranking-${key}`,
		});

		engine.register_jq(
			`.beatmap?.${key}?`,
			(_: number, stats: string) => {
				this.update(stats);
			},
		);
	}
}
