import { LaserChess } from "./board"
import { Piece } from "./cell"
import { PieceType, GameColor, Orientation, GameRotation, HitRes } from "./gameTypes"
import { Laser } from "./laser"

/*
let khetGame = new LaserChess()
khetGame.loadGame('classic')
khetGame.printBoard('cell_color')
khetGame.printBoard('piece_information')

let move = null
let rotate = null


move = khetGame.movePiece({ row: 4, col: 2 }, { row: 5, col: 2 }, GameColor.SILVER)
if (move) log('move success')
else log('move failed')

khetGame.printBoard('piece_information')

move = khetGame.undoAction()
if (move) log('move success')
else log('move failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 1, col: 7 }, GameRotation.CCW, GameColor.SILVER)
if (rotate) log('rotate success')
else log('rotate failed')

khetGame.printBoard('piece_information')

move = khetGame.undoAction()
if (move) log('move success')
else log('move failed')

khetGame.printBoard('piece_information')
*/
/*
let move = null
let rotate = null

//TEST MOVEMENT
move = khetGame.movePiece({ row: 4, col: 2 }, { row: 5, col: 2 }, GameColor.SILVER)
if (move) console.log('move success')
else console.log('move failed')

khetGame.printBoard('piece_information')

move = khetGame.movePiece({ row: 2, col: 6 }, { row: 3, col: 6 }, GameColor.RED)
if (move) console.log('move success')
else console.log('move failed')

khetGame.printBoard('piece_information')

move = khetGame.movePiece({ row: 3, col: 5 }, { row: 3, col: 6 }, GameColor.SILVER)
if (move) console.log('move success')
else console.log('move failed')

khetGame.printBoard('piece_information')

//TEST ROTATION
rotate = khetGame.rotatePiece({ row: 1, col: 7 }, GameRotation.CCW, GameColor.SILVER)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')
if (rotate) console.log('rotate success')
else console.log('rotate failed')

rotate = khetGame.rotatePiece({ row: 3, col: 9 }, GameRotation.CCW, GameColor.SILVER)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 3, col: 6 }, GameRotation.CCW, GameColor.SILVER)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 3, col: 9 }, GameRotation.CW, GameColor.SILVER)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 7, col: 0 }, GameRotation.CCW, GameColor.RED)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 7, col: 0 }, GameRotation.CCW, GameColor.RED)
if (rotate) console.log('rotate success')
else console.log('rotate failed')

khetGame.printBoard('piece_information')

rotate = khetGame.rotatePiece({ row: 1, col: 8 }, GameRotation.CCW, GameColor.RED)
if (rotate) console.log('rotate success')
else console.log('rotate failed')
*/

/*
 * LASER TEST
 */
/*
khetGame.printBoard('piece_information')
khetGame.fireLaser(GameColor.SILVER)

khetGame.printBoard('piece_information')

let rotate = khetGame.rotatePiece({ row: 3, col: 9 }, GameRotation.CCW, GameColor.SILVER)
if (rotate) log('rotate success')
else log('rotate failed')

log('\n---LASER PATH TEST---')
let board = khetGame.getBoard()

//khetGame.fireLaser(GameColor.RED)
khetGame.fireLaser(GameColor.SILVER)
*/

/*
 * RED PIECES TEST
 */
/*
console.log('RED PIECE')

let pieceRed = new Piece(PieceType.SPHINX, GameColor.RED, Orientation.SOUTH)
console.log(PieceType[pieceRed.type], pieceRed.possibleOrientation)

pieceRed = new Piece(PieceType.PHARAOH, GameColor.RED, Orientation.SOUTH)
console.log(PieceType[pieceRed.type], pieceRed.possibleOrientation)

pieceRed = new Piece(PieceType.SCARAB, GameColor.RED, Orientation.SOUTH)
console.log(PieceType[pieceRed.type], pieceRed.possibleOrientation)

pieceRed = new Piece(PieceType.PYRAMID, GameColor.RED, Orientation.SOUTH)
console.log(PieceType[pieceRed.type], pieceRed.possibleOrientation)

pieceRed = new Piece(PieceType.ANUBIS, GameColor.RED, Orientation.SOUTH)
console.log(PieceType[pieceRed.type], pieceRed.possibleOrientation)
*/


/*
 * SILVER PIECES TEST
 */
/*
console.log('SILVER PIECE')

let pieceSilver = new Piece(PieceType.SPHINX, GameColor.SILVER, Orientation.SOUTH)
console.log(PieceType[pieceSilver.type], pieceSilver.possibleOrientation)

pieceSilver = new Piece(PieceType.PHARAOH, GameColor.SILVER, Orientation.SOUTH)
console.log(PieceType[pieceSilver.type], pieceSilver.possibleOrientation)

pieceSilver = new Piece(PieceType.SCARAB, GameColor.SILVER, Orientation.SOUTH)
console.log(PieceType[pieceSilver.type], pieceSilver.possibleOrientation)

pieceSilver = new Piece(PieceType.PYRAMID, GameColor.SILVER, Orientation.SOUTH)
console.log(PieceType[pieceSilver.type], pieceSilver.possibleOrientation)

pieceSilver = new Piece(PieceType.ANUBIS, GameColor.SILVER, Orientation.SOUTH)
console.log(PieceType[pieceSilver.type], pieceSilver.possibleOrientation)

*/
