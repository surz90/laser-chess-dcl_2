import { PieceType, GameColor, Orientation, CellColor } from "./gameTypes"

export class Cell {
    position!: number
    cellColor!: CellColor

    piece!: Piece | null

    constructor(posRow: number, posCol: number, cellColor: CellColor) {
        this.position = posRow * 8 + posCol * 10
        this.cellColor = cellColor
        this.piece = null
    }
}

export class Piece {
    type!: PieceType
    color!: GameColor
    orientation!: Orientation

    possibleOrientation!: Orientation[]

    constructor(type: PieceType, color: GameColor, orientation: Orientation) {
        this.type = type
        this.color = color
        this.orientation = orientation

        this.possibleOrientation = this.getPossibleOrientation()
    }
    getPossibleOrientation() {
        if (this.type === PieceType.PYRAMID || this.type === PieceType.ANUBIS) {
            return [Orientation.NORTH, Orientation.EAST, Orientation.SOUTH, Orientation.WEST]
        }
        else if (this.type === PieceType.SPHINX) {
            if (this.color === GameColor.RED) {
                return [Orientation.EAST, Orientation.SOUTH]
            }
            else if (this.color === GameColor.SILVER) {
                return [Orientation.NORTH, Orientation.WEST]
            }
            else {
                return []
            }
        }
        else if (this.type === PieceType.PHARAOH) {
            if (this.color === GameColor.RED) {
                return [Orientation.SOUTH]
            }
            else if (this.color === GameColor.SILVER) {
                return [Orientation.NORTH]
            }
            else {
                return []
            }
        }
        else if (this.type === PieceType.SCARAB) {
            return [Orientation.NORTH, Orientation.EAST]
        }
        else return []
    }
}