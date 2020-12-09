import { GamePos, GameColor, Orientation, PieceType, HitRes, LaserRes } from "./gameTypes"
import { Cell } from "./cell"

export class Laser {
    path: GamePos[] = []
    board!: Cell[][]

    constructor() {

    }
    getLaserPath(board: Cell[][], pos: GamePos, direction: Orientation, path: LaserRes[]) {

        let lsr = this.laserPath(board, pos, direction)
        path.push(lsr)

        if (lsr === null) {
            path.push(null)
            return
        }
        else if (lsr.res === HitRes.BLOCK || lsr.res === HitRes.HIT || lsr.res === HitRes.OUT) {
            return
        }
        else {
            this.getLaserPath(board, lsr.pos, lsr.dir, path)
        }
    }
    posAfterDirection(pos: GamePos, laserDirection: Orientation) {
        let posNext: GamePos

        if (laserDirection === Orientation.NORTH) {
            posNext = { row: pos.row + 1, col: pos.col }
        }
        else if (laserDirection === Orientation.EAST) {
            posNext = { row: pos.row, col: pos.col + 1 }
        }
        else if (laserDirection === Orientation.SOUTH) {
            posNext = { row: pos.row - 1, col: pos.col }
        }
        else {
            //laserDirection === Orientation.WEST
            posNext = { row: pos.row, col: pos.col - 1 }
        }

        return posNext
    }
    isInArena(pos: GamePos) {
        if (pos.row > 7 || pos.row < 0 || pos.col > 9 || pos.col < 0) {
            //laser out of arena
            return false
        }
        else
            return true
    }
    laserPath(board: Cell[][], pos: GamePos, laserDirection: Orientation) {
        //log('-evaluate laser-')
        //log('cell: ', pos, 'direction: ', Orientation[laserDirection])

        let posNext: GamePos = pos
        let directionNext: Orientation = laserDirection
        let hitResult: HitRes = HitRes.PASS

        let laserResult: LaserRes

        if (!this.isInArena(pos)) {
            //log('out of arena')
            //laser out of arena
            laserResult = {
                pos: pos,
                dir: laserDirection,
                res: HitRes.OUT
            }
            return laserResult
        }

        let cell = board[pos.row][pos.col]

        if (cell.piece === null) {
            //no piece found, laser go through
            posNext = this.posAfterDirection(pos, laserDirection)

            laserResult = {
                pos: posNext,
                dir: laserDirection,
                res: HitRes.PASS
            }

            if (!this.isInArena(posNext)) {
                laserResult.res = HitRes.OUT
            }

            return laserResult
        }
        else {
            //log('piece: ', PieceType[cell.piece.type], ' orientation: ', Orientation[cell.piece.orientation])
            if (cell.piece.type === PieceType.SPHINX) {
                //sphinx not affected by laser
                
                if (cell.piece.orientation === laserDirection) {
                    let next = this.posAfterDirection(pos, laserDirection)
                    laserResult = {
                        pos: next,
                        dir: directionNext,
                        res: HitRes.PASS
                    }
                }
                else {
                    laserResult = {
                        pos: pos,
                        dir: laserDirection,
                        res: HitRes.BLOCK
                    }
                }
                return laserResult
            }
            else if (cell.piece.type === PieceType.PHARAOH) {
                laserResult = {
                    pos: pos,
                    dir: laserDirection,
                    res: HitRes.HIT
                }
                return laserResult
            }
            else if (cell.piece.type === PieceType.PYRAMID) {
                if (cell.piece.orientation === Orientation.NORTH) {
                    if (laserDirection === Orientation.WEST) {
                        directionNext = Orientation.NORTH
                        hitResult = HitRes.REFLECT
                    }
                    else if (laserDirection === Orientation.SOUTH) {
                        directionNext = Orientation.EAST
                        hitResult = HitRes.REFLECT
                    }
                    else {
                        laserResult = {
                            pos: pos,
                            dir: laserDirection,
                            res: HitRes.HIT
                        }
                        return laserResult
                    }
                }
                if (cell.piece.orientation === Orientation.EAST) {
                    if (laserDirection === Orientation.NORTH) {
                        directionNext = Orientation.EAST
                        hitResult = HitRes.REFLECT
                    }
                    else if (laserDirection === Orientation.WEST) {
                        directionNext = Orientation.SOUTH
                        hitResult = HitRes.REFLECT
                    }
                    else {
                        laserResult = {
                            pos: pos,
                            dir: laserDirection,
                            res: HitRes.HIT
                        }
                        return laserResult
                    }
                }
                if (cell.piece.orientation === Orientation.SOUTH) {
                    if (laserDirection === Orientation.NORTH) {
                        directionNext = Orientation.WEST
                        posNext = this.posAfterDirection(pos, directionNext)
                        hitResult = HitRes.REFLECT
                    }
                    else if (laserDirection === Orientation.EAST) {
                        directionNext = Orientation.SOUTH
                        posNext = this.posAfterDirection(pos, directionNext)
                        hitResult = HitRes.REFLECT
                    }
                    else {
                        laserResult = {
                            pos: pos,
                            dir: laserDirection,
                            res: HitRes.HIT
                        }
                        return laserResult
                    }
                }
                if (cell.piece.orientation === Orientation.WEST) {
                    if (laserDirection === Orientation.EAST) {
                        directionNext = Orientation.NORTH
                        hitResult = HitRes.REFLECT
                    }
                    else if (laserDirection === Orientation.SOUTH) {
                        directionNext = Orientation.WEST
                        hitResult = HitRes.REFLECT
                    }
                    else {
                        laserResult = {
                            pos: pos,
                            dir: laserDirection,
                            res: HitRes.HIT
                        }
                        return laserResult
                    }
                }
            }
            else if (cell.piece.type === PieceType.SCARAB) {
                hitResult = HitRes.REFLECT

                if (cell.piece.orientation === Orientation.NORTH) {
                    if (laserDirection === Orientation.NORTH) {
                        directionNext = Orientation.WEST
                    }
                    else if (laserDirection === Orientation.WEST) {
                        directionNext = Orientation.NORTH
                    }
                    else if (laserDirection === Orientation.EAST) {
                        directionNext = Orientation.SOUTH
                    }
                    else { // laserDirection === Orientation.SOUTH
                        directionNext = Orientation.EAST
                    }
                }

                else if (cell.piece.orientation === Orientation.EAST) {
                    if (laserDirection === Orientation.NORTH) {
                        directionNext = Orientation.EAST
                    }
                    else if (laserDirection === Orientation.WEST) {
                        directionNext = Orientation.SOUTH
                    }
                    else if (laserDirection === Orientation.EAST) {
                        directionNext = Orientation.NORTH
                    }
                    else { // laserDirection === Orientation.SOUTH
                        directionNext = Orientation.WEST
                    }
                }

            }
            else if (cell.piece.type === PieceType.ANUBIS) {
                let reverseLaserDir = (laserDirection + 2) % 4

                if (cell.piece.orientation === reverseLaserDir) {
                    laserResult = {
                        pos: pos,
                        dir: laserDirection,
                        res: HitRes.BLOCK
                    }
                    return laserResult
                }
                else {
                    laserResult = {
                        pos: pos,
                        dir: laserDirection,
                        res: HitRes.HIT
                    }
                    return laserResult
                }
            }
            else {
                return null
            }

            posNext = this.posAfterDirection(pos, directionNext)

            if (!this.isInArena(posNext)) {
                //log('out of arena BOT')
                //laser out of arena
                laserResult = {
                    pos: posNext,
                    dir: directionNext,
                    res: HitRes.OUT
                }
                return laserResult
            }

            laserResult = {
                pos: posNext,
                dir: directionNext,
                res: hitResult
            }
            return laserResult
        }
    }
}