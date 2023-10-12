
export type Tetermino = {
	color: string;
	shape: number[][][]
}
const I: Tetermino = {
	color: "cyan",
	shape: [
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		]
	]
}

const J: Tetermino = {
	color: "orange",
	shape: [
		[
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]
	]
}

const L: Tetermino = {
	color: "purple",
	shape: [
		[
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 0]
		],
		[
			[1, 1, 0],
			[0, 1, 0],
			[0, 1, 0]
		]
	]
};

const O: Tetermino = {
	color: "blue",
	shape: [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		]
	]
};

const S: Tetermino = {
	color: "green",
	shape: [
		[
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1]
		],
		[
			[0, 0, 0],
			[0, 1, 1],
			[1, 1, 0]
		],
		[
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	]
};

const T: Tetermino = {
	color: "yellow",
	shape: [
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 1, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	]
};

const Z: Tetermino = {
	color: "red",
	shape: [
		[
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 1, 0],
			[1, 1, 0],
			[1, 0, 0]
		]
	]
};

export const PIECES = [I, J, L, O, S, T, Z];
const canvas = document.getElementById("tetris") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const scoreElement = document.getElementById("score") as HTMLParagraphElement;

export const ROW = 20;
export const COL = 10;
export const SQ = canvas.height / ROW;
export const VACANT = "WHITE"; // color of an empty square
