import type ZEngine from "@fukutotojido/z-engine";

export type BaseConfig = {
	id: string;
	defaultValue?: number;
	document?: Document | HTMLElement
};

export default class BaseHandler {
	element: HTMLElement | null = null;

	constructor(public engine: ZEngine, { document = window.document, ...config }: BaseConfig) {
		this.element = document.querySelector<HTMLElement>(config.id);
	}

	protected update(value?: string | number, element: HTMLElement | null = this.element) {
		if (!element) return;

		element.textContent = `${value ?? ""}`;
	}
}
