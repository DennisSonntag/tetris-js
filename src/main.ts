import { COL, PIECES, ROW, SQ, Tetermino, VACANT, ctx, scoreElement } from "./constants";

const board = [...Array(ROW)].map(() => Array(COL).fill(VACANT));

class Piece {
	shape: number[][][];
	color: string;
	tetrominoN: number;
	activeTetromino: number[][];
	x: number;
	y: number;
	constructor(tetromino: Tetermino) {
		this.shape = tetromino.shape;
		this.color = tetromino.color;

		this.tetrominoN = 0; // we start from the first pattern
		this.activeTetromino = this.shape[this.tetrominoN];

		// we need to control the pieces
		this.x = 3;
		this.y = -2;
	}

	fill(color: string) {
		for (let row = 0; row < this.activeTetromino.length; row++) {
			for (let col = 0; col < this.activeTetromino.length; col++) {
				// we draw only occupied squares
				if (this.activeTetromino[row][col]) {
					drawSquare(this.x + col, this.y + row, color);
				}
			}
		}
	}

	draw() {
		this.fill(this.color);
	}
	clear() {
		this.fill(VACANT);
	}

	moveDown() {
		if (!this.collision(0, 1, this.activeTetromino)) {
			this.clear();
			this.y++;
			this.draw();
		} else {
			// we lock the piece and generate a new one
			this.lock();
			piece = randomPiece();
		}

	}

	moveRight() {
		if (!this.collision(1, 0, this.activeTetromino)) {
			this.clear();
			this.x++;
			this.draw();
		}
	}

	moveLeft() {
		if (!this.collision(-1, 0, this.activeTetromino)) {
			this.clear();
			this.x--;
			this.draw();
		}
	}

	rotate() {
		const nextPattern = this.shape[(this.tetrominoN + 1) % this.shape.length];
		let kick = 0;

		if (this.collision(0, 0, nextPattern)) {
			if (this.x > COL / 2) {
				// it's the right wall
				kick = -1; // we need to move the piece to the left
			} else {
				// it's the left wall
				kick = 1; // we need to move the piece to the right
			}
		}

		if (!this.collision(kick, 0, nextPattern)) {
			this.clear();
			this.x += kick;
			this.tetrominoN = (this.tetrominoN + 1) % this.shape.length; // (0+1)%4 => 1
			this.activeTetromino = this.shape[this.tetrominoN];
			this.draw();
		}
	}
	lock() {
		for (let row = 0; row < this.activeTetromino.length; row++) {
			for (let col = 0; col < this.activeTetromino.length; col++) {
				if (!this.activeTetromino[row][col]) {
					continue;
				}
				// pieces to lock on top = game over
				if (this.y + row < 0) {
					alert("Game Over");
					gameOver = true;
					break;
				}
				// we lock the piece
				board[this.y + row][this.x + col] = this.color;
			}
		}
		// remove full rows
		for (let row = 0; row < ROW; row++) {
			let isRowFull = true;
			for (let col = 0; col < COL; col++) {
				isRowFull = isRowFull && (board[row][col] != VACANT);
			}
			if (isRowFull) {
				// if the row is full
				// we move down all the rows above it
				for (let y = row; y > 1; y--) {
					for (let col = 0; col < COL; col++) {
						board[y][col] = board[y - 1][col];
					}
				}
				// the top row board[0][..] has no row above it
				for (let col = 0; col < COL; col++) {
					board[0][col] = VACANT;
				}
				score += 10;
			}
		}
		drawBoard();

		scoreElement.innerHTML = String(score);
	}
	collision(x: number, y: number, piece: number[][]): boolean {
		for (let row = 0; row < piece.length; row++) {
			for (let col = 0; col < piece.length; col++) {
				// if the square is empty, we skip it
				if (!piece[row][col]) {
					continue;
				}
				// coordinates of the piece after movement
				const newX = this.x + col + x;
				const newY = this.y + row + y;

				if (newX < 0 || newX >= COL || newY >= ROW) {
					return true;
				}
				// skip newY < 0; board[-1] will crush our game
				if (newY < 0) {
					continue;
				}
				// check if there is a locked piece alrady in place
				if (board[newY][newX] != VACANT) {
					return true;
				}
			}
		}
		return false;
	}

}
function drawSquare(x: number, y: number, color: string) {
	ctx.fillStyle = color;
	ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

	ctx.strokeStyle = "BLACK";
	ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard() {
	for (let row = 0; row < ROW; row++) {
		for (let col = 0; col < COL; col++) {
			drawSquare(col, row, board[row][col]);
		}
	}
}

drawBoard();


const randomPiece = (): Piece => new Piece(PIECES[Math.floor(Math.random() * PIECES.length)]);

let piece = randomPiece();

let score = 0;

document.addEventListener("keydown", ({ key }) => {
	if (key === "ArrowLeft") {
		piece.moveLeft();
	} else if (key === "ArrowUp") {
		piece.rotate();
	} else if (key === "ArrowRight") {
		piece.moveRight();
	} else if (key === "ArrowDown") {
		piece.moveDown();
	}

});

let gameOver = false;

setInterval(() => {
	if (!gameOver) {
		piece.moveDown();
	} else {
		return
	}
}, 1000)

