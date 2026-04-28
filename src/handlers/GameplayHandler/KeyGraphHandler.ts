import type ZEngine from "@fukutotojido/z-engine";
import { Item, List } from "linked-list";
import type { Palette } from "./BackgroundHandler";
import CanvasWorker from "./workers/CanvasWorker?worker";

export type KeyArray = {
	timestamp: number;
	state: 0 | 1;
};

export class KeyArrayNode extends Item {
	declare prev: KeyArrayNode | null;
	declare next: KeyArrayNode | null;

	constructor(public data: KeyArray) {
		super();
	}
}

export default class KeyGraphHandler {
	key1Array: List<KeyArrayNode> = new List();
	key2Array: List<KeyArrayNode> = new List();

	canvas = document.querySelector<HTMLCanvasElement>("#key-graph");

	static TIME_WINDOW = 300;

	private _k1Color = "white";
	private _k2Color = "white";

	worker = new CanvasWorker();

	constructor(engine: ZEngine) {
		const canvas = document.querySelector<HTMLCanvasElement>("#key-graph");
		if (!canvas) return;

		const offscreen = canvas.transferControlToOffscreen();
		this.worker.postMessage(
			{
				type: "canvas",
				data: offscreen,
			},
			[offscreen],
		);

		engine.register_jq(
			".keys?.k1?.isPressed?",
			(_: boolean, isPressed: boolean) => {
				this.processKeyInputs(this.key1Array, isPressed);

				this.worker.postMessage({
					type: "arrayK1",
					data: {
						now: performance.now(),
						array: this.key1Array.toArray(),
					},
				});

				const ele = document.querySelector<HTMLDivElement>("#k1-container");
				if (!ele) return;

				if (isPressed) {
					ele.classList.add("pressed");
				} else {
					ele.classList.remove("pressed");
				}
			},
		);

		engine.register_jq(
			".keys?.k2?.isPressed?",
			(_: boolean, isPressed: boolean) => {
				this.processKeyInputs(this.key2Array, isPressed);

				this.worker.postMessage({
					type: "arrayK2",
					data: {
						now: performance.now(),
						array: this.key2Array.toArray(),
					},
				});

				const ele = document.querySelector<HTMLDivElement>("#k2-container");
				if (!ele) return;

				if (isPressed) {
					ele.classList.add("pressed");
				} else {
					ele.classList.remove("pressed");
				}
			},
		);
	}

	processKeyInputs(list: List<KeyArrayNode>, isPressed: boolean) {
		const now = performance.now();
		const data: KeyArray = {
			timestamp: now,
			state: isPressed ? 1 : 0,
		};

		while (
			list.head?.next?.data.timestamp &&
			list.head.next.data.timestamp < now - KeyGraphHandler.TIME_WINDOW
		) {
			const newHead = list.head.next;
			const oldHead = list.head;

			newHead.prev = null;
			oldHead.next = null;

			oldHead.detach();

			list.head = newHead;
		}

		const newNode = new KeyArrayNode(data);
		list.append(newNode);
	}

	updateColor(palette: Palette) {
		this._k1Color = palette.Muted?.hex ?? "white;";
		this._k2Color = palette.LightMuted?.hex ?? "white;";

		this.worker.postMessage({
			type: "color",
			data: {
				k1Color: this._k1Color,
				k2Color: this._k2Color,
			},
		});
	}
}
