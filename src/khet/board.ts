import { GameColor, CellColor, PieceType, Orientation, GamePos, GameRotation, MoveType, LaserRes, HitRes } from "./gameTypes"
import { Cell, Piece } from "./cell"
import { Laser } from "./laser"
import { GameState } from "../gameTypes"

type GameMove = {
	type: MoveType,
	origin: GamePos,
	move: GamePos, //| GameRotation,
	rotation: GameRotation,
	player: GameColor
}

export class LaserChess {
	board: Cell[][] = new Array(8)
	
	turn = GameColor.SILVER
	isGameEnd: boolean = false
	
	//push move for every successful moves
	gameActions: GameMove[] = []

	//FEN
	FEN: string = 'S1S3A1SP1SA1SY1E/2Y1S/3Y0W/Y1N1Y0S1C1NC1E1Y1E1Y0W/Y1E1Y0W1C0EC0N1Y1N1Y0S/6Y1E/7Y0N/2Y0WA0NP0NA0N3S0N 0'
	//FEN: string = 'S1S3A1SP1SA1SY1E/2Y1S/3Y0W/Y1N1Y0S1C1NC1E1Y1E1Y0W/Y1E1Y0W1C0EC0N1Y1N1Y0S/6Y1E/7Y0N/2Y0WA0NP0NA0N4 0'

    constructor() {
        //defining board
		for (let row = 0; row < this.board.length; row++) {
			this.board[row] = new Array(10)
            for (let col = 0; col < this.board[row].length; col++) {

                if (col === 0 || (col === 8 && (row === 0 || row === 7))) {
                    this.board[row][col] = new Cell(row, col, CellColor.RED)
                }
                else if (col === 9 || (col === 1 && (row === 0 || row === 7))) {
                    this.board[row][col] = new Cell(row, col, CellColor.SILVER)
                }
                else {
                    this.board[row][col] = new Cell(row, col, CellColor.NONE)
                }

            }
        }
	}
	resetBoard() {
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 10; col++) {
				this.board[row][col].piece = null
			}
		}
	}
	getBoard() {
		return this.board
    }
	loadGame(gameFEN: string = this.FEN) {
		this.resetBoard()

		this.isGameEnd = false

		this.FEN = gameFEN
		let turn = gameFEN.split(' ')[1]
		let FEN = gameFEN.split(' ')[0]

		let row = 7
		let col = 0
		for (let idx = 0; idx < FEN.length; idx++) {
			if (FEN[idx] === '/') {
				row = row - 1
				col = 0
			}
			else if (isPieceLetter(FEN[idx])) {
				let pieceType = letterToType(FEN[idx])
				if (pieceType === null) return
				idx += 1
				let pieceColor = +FEN[idx]
				idx += 1
				let pieceOrientation = letterToOrientation(FEN[idx])
				if (pieceOrientation === null) return

				this.setPiece(row, col, pieceType, pieceColor, pieceOrientation)

				col += 1
			}
			else {
				col = col + +FEN[idx]
			}
		}
		this.printBoard('piece_information')
	}

    setPiece(row: number, col: number, type: PieceType, color: GameColor, orientation: Orientation) {
        this.board[row][col].piece = new Piece(type, color, orientation)
	}
	getCell(row: number, col: number) {
		return this.board[row][col]
    }
	getTurn(){
		return this.turn
	}
	passTurn() {
		this.turn = (this.turn + 1) % 2
    }
	getPossibleMoves(originPos: GamePos, player: GameColor) {
		let possibleMove: GamePos[] = []
		let row = originPos.row
		let col = originPos.col

		let cell = this.board[row][col]

		if (cell.piece === null) {
			return null
		}
		else if (cell.piece.color !== player) {
			return null
		}
		else {
			//log('current piece: ', PieceType[cell.piece?.type], GameColor[cell.piece.color])

			if (cell.piece.type === PieceType.SPHINX) {
				return null
			}
			else {
				for (let rowNeighbour = -1; rowNeighbour <= 1; rowNeighbour++) {
					for (let colNeighbour = -1; colNeighbour <= 1; colNeighbour++) {

						if ((rowNeighbour !== 0 || colNeighbour !== 0)
							&& ((row + rowNeighbour) < 8 && (row + rowNeighbour) >= 0)
							&& ((col + colNeighbour) < 10 && (col + colNeighbour >= 0))) {

							//log('><><><', row + rowNeighbour, col + colNeighbour, cell.piece.color)
							
							let cellNeighbour = this.getCell(row + rowNeighbour, col + colNeighbour) 
							
							if (cellNeighbour.cellColor === CellColor.NONE
								|| (cellNeighbour.cellColor as Number) === (cell.piece?.color as Number)) {

								//log('  >', rowNeighbour, colNeighbour, cellNeighbour.piece, cellNeighbour.piece?.type)

								let targetPos: GamePos = {
									row: row + rowNeighbour,
									col: col + colNeighbour
								}

								if (cellNeighbour.piece === null) {
									possibleMove.push(targetPos)
								}
								else if (cell.piece.type === PieceType.SCARAB) {
									if (cellNeighbour.piece.type === PieceType.PYRAMID) {
										if (cell.cellColor === CellColor.NONE) {
											possibleMove.push(targetPos)
										}
										else if ((cell.cellColor as number) === (cellNeighbour.piece.color as number)) {
											possibleMove.push(targetPos)
                                        }
									}
									else if (cellNeighbour.piece.type === PieceType.ANUBIS) {
										if (cell.cellColor === CellColor.NONE) {
											possibleMove.push(targetPos)
										}
										else if ((cell.cellColor as number) === (cellNeighbour.piece.color as number)) {
											possibleMove.push(targetPos)
										}
									}
                                }
								/*
								else if (cell.piece.type === PieceType.SCARAB
									&& (cellNeighbour.piece.type === PieceType.PYRAMID
										|| cellNeighbour.piece.type === PieceType.ANUBIS)) {
									possibleMove.push(targetPos)
								}
								*/
							}
						}
                    }
                }
				return possibleMove
            }
        }
    }
	getPossibleRotation(originPos: GamePos, player: GameColor) {
		let possibleRotation: GameRotation[] = []
		let row = originPos.row
		let col = originPos.col

		let cell = this.board[row][col]
		
		if(cell.piece === null){
			return null
		}
		else if (cell.piece.color !== player) {
			return null
		}
		else {
			//log('current piece: ', PieceType[cell.piece?.type], ' orientation: ', Orientation[cell.piece.orientation])

			if (cell.piece?.orientation !== undefined) {
				let possibleOrientation = cell.piece?.possibleOrientation
				let currentOrientation = cell.piece?.orientation

				//let currentIdx = possibleOrientation.findIndex(e => (e === currentOrientation))
				let currentIdx = findIndex(possibleOrientation, e => (e === currentOrientation))

				//console.log('current orientation: ', currentOrientation)
				//log('possible orientation: ', possibleOrientation)
				//console.log('found at idx: ', currentIdx)

				//CHECK CLOCKWISE(ORIENTATION + 1), NORTH->EAST->SOUTH->WEST
				let possibleOrientCW = possibleOrientation[(currentIdx + 1) % possibleOrientation.length]
				let orientNextCW = ((currentOrientation as number) + 1) % 4

				if (Orientation[possibleOrientCW] === Orientation[orientNextCW]) {
					//console.log(Orientation[possibleOrientCW], Orientation[orientNextCW])
					//console.log('CW: possible')
					possibleRotation.push(GameRotation.CW)
				}
				else {
					//console.log('CW: not possible')
				}

				//CHECK COUNTER CLOCKWISE(ORIENTATION - 1), SOUTH->WEST->NORTH->EAST
				let possibleOrientCCW = possibleOrientation[(currentIdx + possibleOrientation.length - 1) % possibleOrientation.length]
				let orientNextCCW = ((currentOrientation as number) + 4 - 1) % 4

				if (Orientation[possibleOrientCCW] === Orientation[orientNextCCW]) {
					//console.log(Orientation[possibleOrientCCW], Orientation[orientNextCCW])
					//console.log('CCW: possible')
					possibleRotation.push(GameRotation.CCW)
				}
				else {
					//console.log('CCW: not possible')
				}

				return possibleRotation
			}
			else {
				return null
            }
		}
    }
	movePiece(originPos: GamePos, destPos: GamePos, player: GameColor) {
		let pieceOrigin = this.board[originPos.row][originPos.col].piece
		let pieceDestination = this.board[destPos.row][destPos.col].piece
		//let cellOrigin = this.board[originPos.row][originPos.col]
		//let cellDest = this.board[destPos.row][destPos.col]

		//get possible move from origin pos
		//log('\n---move piece---')
		//log('player:', GameColor[player], ' ', 'from:', originPos, ' to:', destPos)

		let possibleMove = this.getPossibleMoves(originPos, player)
		//log('possible moves: ', possibleMove)

		if (possibleMove !== null) {
			if (findIndex(possibleMove, ((e: { row: number; col: number }) => (e.row === destPos.row && e.col === destPos.col))) === -1) {
				return false
			}
			else {
				//process move and update board data
				//this.board[originPos.row][originPos.col] = cellDest
				//this.board[destPos.row][destPos.col] = cellOrigin

				this.board[originPos.row][originPos.col].piece = pieceDestination
				this.board[destPos.row][destPos.col].piece = pieceOrigin
				
				this.FEN = this.encodeFEN()

				//add to game actions
				this.gameActions.push({
					type: MoveType.MOVEMENT,
					origin: originPos,
					move: destPos,
					rotation: null,
					player: player
				})

				log(this.gameActions)

				return true
			}
		}
		else {
			return false
        }
	}
	rotatePiece(originPos: GamePos, rotation: GameRotation, player: GameColor) {
		let cell = this.board[originPos.row][originPos.col]

		//get possible rotation from originPos
		log('\n---rotate piece---')
		log('player:', GameColor[player], ' ', 'in:', originPos, 'rotation:', GameRotation[rotation])

		let possibleRotation = this.getPossibleRotation(originPos, player)
		log('possible rotation: ', possibleRotation)

		if (cell.piece !== null && possibleRotation !== null) {
			if (findIndex(possibleRotation, (e: GameRotation) => (e === rotation)) === -1) {
				return false
			}
			//rotation is in possibleRotation
			else {
				let currentOrientation = cell.piece.orientation

				if (rotation === GameRotation.CW) {
					cell.piece.orientation = ((currentOrientation as number) + 1) % 4
				}
				else if (rotation === GameRotation.CCW) {
					cell.piece.orientation = ((currentOrientation as number) + 4 - 1) % 4
				}
				
				this.FEN = this.encodeFEN()

				//add to game actions
				this.gameActions.push({
					type: MoveType.ROTATION,
					origin: originPos,
					move: null,
					rotation: rotation,
					player: player
				})

				log(this.gameActions)

				return true
            }
		}
		else {
			return false
		}
	}
	undoAction() {
		if (this.gameActions.length > 0) {
			let lastAction = this.gameActions.pop()
			//revert last action
			let originPos = lastAction.origin
			let originCell = this.board[originPos.row][originPos.col]

			if (lastAction.type === MoveType.MOVEMENT) {
				let destPos = lastAction.move

				let destCell = this.board[destPos.row][destPos.col]

				this.board[originPos.row][originPos.col] = destCell
				this.board[destPos.row][destPos.col] = originCell

				log(this.gameActions)

				return true
			}
			else if (lastAction.type === MoveType.ROTATION) {
				let rotation = lastAction.rotation

				let currentOrientation = originCell.piece.orientation
				let rotationReverse = (rotation + 1) % 2

				if (rotationReverse === GameRotation.CW) {
					originCell.piece.orientation = ((currentOrientation as number) + 1) % 4
				}
				else if (rotationReverse === GameRotation.CCW) {
					originCell.piece.orientation = ((currentOrientation as number) + 4 - 1) % 4
				}

				log(this.gameActions)

				return true

			}
			else {
				return false
			}
		}
		else {
			return false
        }
	}
	destroyPiece(originPos: GamePos) {
		if (this.board[originPos.row][originPos.col].piece.type === PieceType.PHARAOH) {
			this.isGameEnd = true
			log('Game End, result: ', this.getTurn())
        }
		this.board[originPos.row][originPos.col].piece = null
		return true
	}
	fireLaser(player: GameColor) {

		let startPos: GamePos
		let initDirection: Orientation

		let laser = new Laser()
		let path: LaserRes[] = []

		if (this.isGameEnd) {
			return path
		}

		if (player === GameColor.SILVER) {
			startPos = { row: 0, col: 9 }
			initDirection = this.board[0][9].piece!.orientation
		}
		else if (player === GameColor.RED) {
			startPos = { row: 7, col: 0 }
			initDirection = this.board[7][0].piece!.orientation
		}
		else {
			return path
        }

		laser.getLaserPath(this.board, startPos, initDirection, path)

		if (path[path.length - 1].res === HitRes.HIT) {
			this.destroyPiece(path[path.length - 1].pos)
			if (!this.isGameEnd) {
				this.passTurn()
            }
		}
		else {
			this.passTurn()
		}
		return path
	}
	gameEnd() {
		this.isGameEnd = true
    }
    printBoard(printArg: string = 'cell_color') {
		log('\n---' + printArg + '---')
        for (let row = this.board.length - 1; row >= 0; row--) {
			let rowToPrint = row.toString()
            for (let col = 0; col < this.board[row].length; col++) {
				if (printArg === 'cell_color') {
					if(this.board[row][col].cellColor !== CellColor.NONE) rowToPrint += ('  ' + this.board[row][col]!.cellColor + ' ')
					else rowToPrint += ('  ' + '-' + ' ')
				}
				else{
					if(this.board[row][col].piece !== null) {
						rowToPrint += (' ' + typeToLetter(this.board[row][col].piece?.type))
					}
					else rowToPrint += (' ' + '-')
				
					if(this.board[row][col].piece !== null) {
						rowToPrint += this.board[row][col].piece?.color
					}
					else rowToPrint += ('-')
			
					if (this.board[row][col].piece !== null){
						rowToPrint += orientationToLetter(this.board[row][col].piece?.orientation)
					}
					else rowToPrint += ('-')
				}
				
            }
            log(rowToPrint)
        }
		
		let rowToPrint = ' '
        for (let col = 0; col < this.board[0].length; col++){
			rowToPrint += '  ' + col.toString() + ' '
		}
        log(rowToPrint)
	}

	encodeFEN() {
		let FEN = ''
		for (let row = this.board.length - 1; row >= 0; row--) {
			let FENrow = ''
			let gap: number = 0
			for (let col = 0; col < this.board[row].length; col++) {
				if (this.board[row][col].piece !== null) {
					if (gap !== 0) {
						FENrow = FENrow + gap.toString()
						gap = 0
					}
					FENrow = FENrow + typeToLetter(this.board[row][col].piece?.type)
						+ this.board[row][col].piece?.color + orientationToLetter(this.board[row][col].piece?.orientation)
				}
				else {
					gap += 1
				}
			}
			if (row !== 0)
				FEN = FEN + FENrow + '/'
			else
				FEN = FEN + FENrow + ' '
		}
		FEN = FEN + this.getTurn()

		return FEN
	}
}

function isPieceLetter(pieceLetter: string) {
	if (pieceLetter === 'S' || pieceLetter === 'P' || pieceLetter === 'C'
		|| pieceLetter === 'Y' || pieceLetter === 'A')
		return true
	else
		return false
}

function typeToLetter(type: any) {
	if (type === PieceType.SPHINX) return 'S'
	if (type === PieceType.PHARAOH) return 'P'
	if (type === PieceType.SCARAB) return 'C'
	if (type === PieceType.PYRAMID) return 'Y'
	if (type === PieceType.ANUBIS) return 'A'
}
function letterToType(letter: string) {
	if (letter === 'S') return PieceType.SPHINX
	else if (letter === 'P') return PieceType.PHARAOH
	else if (letter === 'C') return PieceType.SCARAB
	else if (letter === 'Y') return PieceType.PYRAMID
	else if (letter === 'A') return PieceType.ANUBIS
	else return null
}

function colorToLetter(color: any) {
	if (color === GameColor.RED) return 'R'
	if (color === GameColor.SILVER) return 'S'
}
function orientationToLetter(orientation: any) {
	if (orientation === Orientation.NORTH) return 'N'
	if (orientation === Orientation.EAST) return 'E'
	if (orientation === Orientation.SOUTH) return 'S'
	if (orientation === Orientation.WEST) return 'W'
}
function letterToOrientation(letter: string) {
	if (letter === 'N') return Orientation.NORTH
	else if (letter === 'E') return Orientation.EAST
	else if (letter === 'S') return Orientation.SOUTH
	else if (letter === 'W') return Orientation.WEST
	else return null
}

function findIndex(arrObj: any, condition: Function) {
	for (let i = 0; i < arrObj.length; i++) {
		if (condition(arrObj[i])) {
			return i
		}
	}
	return -1
}