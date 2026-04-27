import type ZEngine from "@fukutotojido/z-engine";
import type NumberFlow from "number-flow";
import type { Format } from "number-flow";
import { continuous } from "number-flow/plugins";
import { defaultTimingFunction } from "../utils";
import BaseHandler, { type BaseConfig } from "./BaseHandler";

export type CountUpConfig = BaseConfig & {
	format?: Format;
	numberPrefix?: string;
	numberSuffix?: string;
};

export default class CountUpHandler extends BaseHandler {
	declare element: NumberFlow | null;

	constructor(
		public engine: ZEngine,
		public config: CountUpConfig,
	) {
		super(engine, config);
		if (!this.element) return;

		const { format, numberSuffix, numberPrefix, defaultValue } = config;

		this.element.plugins = [continuous];
		this.element.transformTiming = defaultTimingFunction;

		this.element.format = format;
		this.element.numberPrefix = numberPrefix;
		this.element.numberSuffix = numberSuffix;
		this.element.update(defaultValue ?? 0);
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
			element.update(this.config.defaultValue ?? 0);
			return;
		}

		element.update(value);
	}
}
