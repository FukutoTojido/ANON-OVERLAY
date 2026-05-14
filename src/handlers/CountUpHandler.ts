import type ZEngine from "@fukutotojido/z-engine";
import { CountUp } from "countup.js";
import type NumberFlow from "number-flow";
import type { Format } from "number-flow";
import { continuous } from "number-flow/plugins";
import { defaultTimingFunction, query } from "../utils";
import BaseHandler, { type BaseConfig } from "./BaseHandler";

export type CountUpConfig = BaseConfig & {
	format?: Format;
	numberPrefix?: string;
	numberSuffix?: string;
};

export default class CountUpHandler extends BaseHandler {
	declare element: NumberFlow | null;
	countUp!: CountUp;

	constructor(
		public engine: ZEngine,
		public config: CountUpConfig,
	) {
		super(engine, config);
		if (!this.element) return;

		const { format, numberSuffix, numberPrefix, defaultValue } = config;

		if (query.has("odometer")) {
			this.element.plugins = [continuous];
			this.element.transformTiming = defaultTimingFunction;
			this.element.format = format;
			this.element.numberPrefix = numberPrefix;
			this.element.numberSuffix = numberSuffix;
			this.element.update(defaultValue ?? 0);

			return;
		}

		this.element.classList.add("tabular-nums");
		const formatter = new Intl.NumberFormat("en-US", format);
		this.countUp = new CountUp(this.element, defaultValue ?? 0, {
			autoAnimate: true,
			duration: 1,
			formattingFn: (value) =>
				`${numberPrefix ?? ""}${formatter.format(value)}${numberSuffix ?? ""}`,
		});

		this.countUp.start();
	}

	protected override update(
		value?: number,
		element: NumberFlow | null = this.element,
	) {
		if (!element) return;

		const isPreMap =
			this.engine.cache.beatmap?.time?.live <
			this.engine.cache?.beatmap?.time?.firstObject;

		if (typeof value !== "number" && !value) {
			return;
		}

		if (isPreMap) {
			if (query.has("odometer")) element.update(this.config.defaultValue ?? 0);
			if (!query.has("odometer"))
				this.countUp.update(this.config.defaultValue ?? 0);
			return;
		}

		if (query.has("odometer")) element.update(value);
		if (!query.has("odometer")) this.countUp.update(value);
	}
}
