import type ZEngine from "@fukutotojido/z-engine";
import { Item, List } from "linked-list";
import type { Palette } from "./BackgroundHandler";

type KeyArray = {
	timestamp: number;
	state: 0 | 1;
};

class KeyArrayNode extends Item {
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

	constructor(engine: ZEngine) {
		requestAnimationFrame(() => {
			this.draw();
		});

		engine.register_jq(
			".keys?.k1?.isPressed?",
			(_: boolean, isPressed: boolean) => {
				this.processKeyInputs(this.key1Array, isPressed);

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

	draw() {
		const now = performance.now();
		const context = this.canvas?.getContext("2d");

		if (!context) {
			requestAnimationFrame(() => {
				this.draw();
			});
			return;
		}

		context.clearRect(0, 0, 100, 45);

		let cur1 = this.key1Array.head;
		while (cur1 !== null) {
			if (cur1.data.state === 0) {
				cur1 = cur1.next;
				continue;
			}

			this.drawKey(1, now, cur1.data, cur1.next?.data, context);
			cur1 = cur1.next;
		}

		let cur2 = this.key2Array.head;
		while (cur2 !== null) {
			if (cur2.data.state === 0) {
				cur2 = cur2.next;
				continue;
			}

			this.drawKey(2, now, cur2.data, cur2.next?.data, context);
			cur2 = cur2.next;
		}

		requestAnimationFrame(() => {
			this.draw();
		});
	}

	drawKey(
		key: 1 | 2,
		now: number,
		curr: KeyArray,
		next: KeyArray | undefined,
		context: CanvasRenderingContext2D,
	) {
		// Assume our 100px windows correlated to TIME_WINDOW
		// Which means 1ms is equal to 100px / TIME_WINDOW

		const rate = 100 / KeyGraphHandler.TIME_WINDOW;
		const deltaNext = now - (next?.timestamp ?? now);
		const distanceNext = deltaNext * rate;

		const delta = now - curr.timestamp;
		const distance = delta * rate;

		context.beginPath();
		context.roundRect(
			100 - distance,
			key === 1 ? 0 : 25,
			distance - distanceNext,
			20,
			5,
		);
		context.fillStyle =
			(key === 1 && this._k1Color) || (key === 2 && this._k2Color) || "white";
		context.fill();
		context.closePath();
	}

	updateColor(palette: Palette) {	
		this._k1Color = palette.Muted?.hex ?? "white;";
		this._k2Color = palette.LightMuted?.hex ?? "white;";
	}
}
