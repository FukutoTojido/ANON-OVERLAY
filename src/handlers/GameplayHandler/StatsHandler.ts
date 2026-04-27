import type ZEngine from "@fukutotojido/z-engine";
import BaseHandler from "../BaseHandler";

export default class StatsHandler extends BaseHandler {
	constructor(engine: ZEngine, stats: "cs" | "ar" | "od" | "sr") {
		super(engine, {
			id: `#${stats}`,
		});

		engine.register_jq(
			(stats !== "sr" && `.beatmap?.stats?.${stats}?.converted?`) || `.beatmap?.stats?.stars?.total?`,
			(_: number, stats: number) => {
				this.update(stats.toFixed(2).replaceAll(/\.0+$|0+$/g, ""));
			},
		);
	}
}
