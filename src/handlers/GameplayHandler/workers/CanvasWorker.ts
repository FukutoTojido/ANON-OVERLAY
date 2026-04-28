import type { KeyArray, KeyArrayNode } from "../KeyGraphHandler";

type CanvasMessage = {
	type: "canvas";
	data: OffscreenCanvas;
};

type ColorMessage = {
	type: "color";
	data: {
		k1Color: string;
		k2Color: string;
	};
};

type ArrayK1Message = {
	type: "arrayK1";
	data: {
		now: number;
		array: KeyArrayNode[];
	};
};

type ArrayK2Message = {
	type: "arrayK2";
	data: {
		now: number;
		array: KeyArrayNode[];
	};
};

type WorkerMessage =
	| CanvasMessage
	| ColorMessage
	| ArrayK1Message
	| ArrayK2Message;

const TIME_WINDOW = 300;

let canvas: OffscreenCanvas | undefined;
let k1Color: string = "white";
let k2Color: string = "white";

let key1Array: KeyArrayNode[] = [];
let key2Array: KeyArrayNode[] = [];

let k1Offset = 0;
let k2Offset = 0;

requestAnimationFrame(() => {
	draw();
});

const draw = () => {
	const now = performance.now();
	const context = canvas?.getContext("2d");

	if (!context) {
		requestAnimationFrame(() => {
			draw();
		});
		return;
	}

	context.clearRect(0, 0, 100, 45);

	for (let i = 0; i < key1Array.length; i++) {
		const curr = key1Array[i];
		const next = key1Array[i + 1];

		if (curr.data.state === 0) {
			continue;
		}

		drawKey(1, now, curr.data, next?.data, context);
	}

	for (let i = 0; i < key2Array.length; i++) {
		const curr = key2Array[i];
		const next = key2Array[i + 1];

		if (curr.data.state === 0) {
			continue;
		}

		drawKey(2, now, curr.data, next?.data, context);
	}

	requestAnimationFrame(() => {
		draw();
	});
};

const drawKey = (
	key: 1 | 2,
	now: number,
	curr: KeyArray,
	next: KeyArray | undefined,
	context: OffscreenCanvasRenderingContext2D,
) => {
	// Assume our 100px windows correlated to TIME_WINDOW
	// Which means 1ms is equal to 100px / TIME_WINDOW

	const offset = (key === 1 ? k1Offset : k2Offset);
	const _now = now + offset;
	
	const rate = 100 / TIME_WINDOW;
	const deltaNext =
		Math.max(0, _now - (next?.timestamp ?? _now));
	const distanceNext = deltaNext * rate;

	const delta = _now - curr.timestamp;
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
		(key === 1 && k1Color) || (key === 2 && k2Color) || "white";
	context.fill();
	context.closePath();
};

self.addEventListener(
	"message",
	({ data: { type, data } }: { data: WorkerMessage }) => {
		switch (type) {
			case "canvas": {
				canvas = data;
				break;
			}
			case "color": {
				k1Color = data.k1Color;
				k2Color = data.k2Color;
				break;
			}
			case "arrayK1": {
				key1Array = data.array;
				k1Offset = data.now - performance.now();
				break;
			}
			case "arrayK2": {
				key2Array = data.array;
				k2Offset =  data.now - performance.now();
				break;
			}
		}
	},
);
