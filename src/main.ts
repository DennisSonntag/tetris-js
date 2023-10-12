import { COL, PIECES, ROW, SQ, Tetermino, VACANT, ctx, nextPieceCtx, scoreElement } from "./constants";

const board = [...Array(ROW)].map(() => Array(COL).fill(VACANT));

class Piece {
	shape: number[][][];
	color: string;
	tetrominoN: number;
	activeTetromino: number[][];
	upcomingTetromino: Tetermino;
	ghostTetromino: number[][];
	activeMinoX: number;
	activeMinoY: number;
	ghostMinoX: number;
	ghostMinoY: number;
	constructor() {
		const tetromino = PIECES[Math.floor(Math.random() * PIECES.length)]
		this.shape = tetromino.shape;
		this.color = tetromino.color;

		this.tetrominoN = 0; // we start from the first pattern
		this.activeTetromino = this.shape[this.tetrominoN];
		this.ghostTetromino = this.shape[this.tetrominoN];

		// we need to control the pieces
		this.activeMinoX = 3;
		this.activeMinoY = -2;

		this.ghostMinoX = 0;
		this.ghostMinoY = 0;

		this.upcomingTetromino = PIECES[Math.floor(Math.random() * PIECES.length)]

		this.updateGhostMinoPos()
	}

	fillNext() {
		nextPieceCtx.fillStyle = "white";
		nextPieceCtx.fillRect(0, 0, 200, 200);

		const color = this.upcomingTetromino.color;
		const tetermino = this.upcomingTetromino.shape[0]
		for (let row = 0; row < tetermino.length; row++) {
			for (let col = 0; col < tetermino.length; col++) {
				// we draw only occupied squares
				if (tetermino[row][col]) {
					const x = col + 1;
					const y = row + 1;
					nextPieceCtx.fillStyle = color;
					nextPieceCtx.fillRect(x * SQ, y * SQ, SQ, SQ);

					nextPieceCtx.strokeStyle = "BLACK";
					nextPieceCtx.strokeRect(x * SQ, y * SQ, SQ, SQ);
				}
			}
		}
	}

	fill(color: string) {
		for (let row = 0; row < this.activeTetromino.length; row++) {
			for (let col = 0; col < this.activeTetromino.length; col++) {
				// we draw only occupied squares
				if (this.activeTetromino[row][col]) {
					drawSquare(this.activeMinoX + col, this.activeMinoY + row, color);
				}
				if (this.ghostTetromino[row][col]) {
					drawSquare(this.ghostMinoX + col, this.ghostMinoY + row, color === VACANT ? VACANT : "gray");
				}
			}
		}
	}

	draw() {
		this.fill(this.color);
		this.fillNext(this.color)
	}
	clear() {
		this.fill(VACANT);
	}

	moveDown() {
		if (!this.activeCollision(0, 1, this.activeTetromino)) {
			this.clear();
			this.activeMinoY++;
			this.draw();
		} else {
			// we lock the piece and generate a new one
			this.lock();
			// piece = randomPiece();
			this.getNextPiece();
		}

	}

	hardDrop() {
		while (true) {
			if (!this.activeCollision(0, 1, this.activeTetromino)) {
				this.clear();
				this.activeMinoY++;
				this.draw();
			} else {
				// we lock the piece and generate a new one
				this.lock();
				// piece = randomPiece();
				this.getNextPiece();
				break;
			}
		}

	}

	updateGhostMinoPos() {
		this.ghostMinoY = -2;
		this.ghostMinoX = this.activeMinoX;
		while (!this.ghostCollision(0, 1, this.ghostTetromino)) {
			if (!this.ghostCollision(0, 1, this.ghostTetromino)) {
				this.ghostMinoY++;
			} else {
				this.clear();
				this.draw();
				break;
			}
		}

	}

	moveRight() {
		if (!this.activeCollision(1, 0, this.activeTetromino)) {
			this.clear();
			this.activeMinoX++;
			this.updateGhostMinoPos()
			this.draw();
		}
	}

	moveLeft() {
		if (!this.activeCollision(-1, 0, this.activeTetromino)) {
			this.clear();
			this.activeMinoX--;
			this.updateGhostMinoPos()
			this.draw();
		}
	}

	rotate() {
		const nextPattern = this.shape[(this.tetrominoN + 1) % this.shape.length];
		let kick = 0;

		if (this.activeCollision(0, 0, nextPattern)) {
			if (this.activeMinoX > COL / 2) {
				// it's the right wall
				kick = -1; // we need to move the piece to the left
			} else {
				// it's the left wall
				kick = 1; // we need to move the piece to the right
			}
		}

		if (!this.activeCollision(kick, 0, nextPattern)) {
			this.clear();
			this.activeMinoX += kick;
			this.tetrominoN = (this.tetrominoN + 1) % this.shape.length; // (0+1)%4 => 1
			this.activeTetromino = this.shape[this.tetrominoN];
			this.ghostTetromino = this.shape[this.tetrominoN];
			this.updateGhostMinoPos()
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
				if (this.activeMinoY + row < 0) {
					alert("Game Over");
					gameOver = true;
					break;
				}
				// we lock the piece
				board[this.activeMinoY + row][this.activeMinoX + col] = this.color;
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
	activeCollision(x: number, y: number, piece: number[][]): boolean {
		for (let row = 0; row < piece.length; row++) {
			for (let col = 0; col < piece.length; col++) {
				// if the square is empty, we skip it
				if (!piece[row][col]) {
					continue;
				}
				// coordinates of the piece after movement
				const newX = this.activeMinoX + col + x;
				const newY = this.activeMinoY + row + y;

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
	ghostCollision(x: number, y: number, piece: number[][]): boolean {
		for (let row = 0; row < piece.length; row++) {
			for (let col = 0; col < piece.length; col++) {
				// if the square is empty, we skip it
				if (!piece[row][col]) {
					continue;
				}
				// coordinates of the piece after movement
				const newX = this.ghostMinoX + col + x;
				const newY = this.ghostMinoY + row + y;

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

	getNextPiece() {
		this.shape = this.upcomingTetromino.shape;
		this.color = this.upcomingTetromino.color;

		this.tetrominoN = 0; // we start from the first pattern
		this.activeTetromino = this.shape[this.tetrominoN];
		this.ghostTetromino = this.shape[this.tetrominoN];

		// we need to control the pieces
		this.activeMinoX = 3;
		this.activeMinoY = -2;

		this.ghostMinoX = 0;
		this.ghostMinoY = 0;

		this.updateGhostMinoPos()
		this.upcomingTetromino = PIECES[Math.floor(Math.random() * PIECES.length)]
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



const piece = new Piece()

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

	} else if (key === " ") {
		piece.hardDrop();
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

