import { GamePos } from "../khet/gameTypes"

export type IntersectData = {
    intersectPoint: Vector3,
    chessPos: GamePos,
    valid: boolean
}

export const genFunc = (function () {
    /*
     * 
     * _DEFAULT_RES is equal with 3D model size
     * 
    */
    const _DEFAULT_RES = 2

    function toWorldSnapPos(inputPos: Vector3, centerPos: Vector3, scale) {
        let resolution = _DEFAULT_RES * scale

        let snapPos = Vector3.Zero()
        let relPos = inputPos.subtract(centerPos)

        snapPos.x =
            Math.round((relPos.x + resolution / 2) / (resolution)) * (resolution) - resolution / 2
        snapPos.z =
            Math.round((relPos.z + resolution / 2) / (resolution)) * (resolution) - resolution / 2
        snapPos.y = relPos.y

        snapPos = snapPos.add(centerPos)

        return snapPos
    }

    function snapPosToBoardPos(inputPos: Vector3, centerPos: Vector3, scale) {
        let relPos = Vector3.Zero()
        let resolution = _DEFAULT_RES * scale

        relPos.x = inputPos.x - centerPos.x //+ _DEFAULT_RES * scale / 2
        relPos.z = inputPos.z - centerPos.z //+ _DEFAULT_RES * scale / 2
        relPos.y = 0

        //BOARD N = 8 --> CENTER IS SET IN THE CENTER OF THE BOARD
        let maxCornerBoardRow = (resolution * 8 / 2) - (resolution / 2)
        let maxCornerBoardCol = (resolution * 10 / 2) - (resolution / 2)

        let arrPos = Vector3.Zero()
        arrPos.x = Math.round((relPos.x + maxCornerBoardCol) / resolution) | 0
        arrPos.z = Math.round((relPos.z + maxCornerBoardRow) / resolution) | 0
        arrPos.y = 0

        //log("relative position: ", relPos, "\narr position: ", arrPos)

        if (arrPos.x > 9 || arrPos.x < 0 || arrPos.z > 7 || arrPos.z < 0) {
            return undefined
        }
        return arrPos
    }
    function boardPosToSnapPos(arrPos, centerPos: Vector3, scale){
        let relPos = Vector3.Zero()
        let resolution = _DEFAULT_RES * scale
        let maxCornerBoard = (resolution * 8 / 2) - (resolution / 2)

        relPos.x = arrPos.x * resolution - maxCornerBoard
        relPos.z = arrPos.z * resolution - maxCornerBoard
        relPos.y = 0

        let snapPos = Vector3.Zero()
        snapPos = relPos.add(centerPos)

        return snapPos
    }
    /*
    * return SNAP GLOBAL COORDINATE intersection with given XZ Plane
    */
    function findIntersectXZPlane(camera: Camera, centerPos: Vector3, scale) {
        let refVect = new Vector3(0, 0, 1)
        let cam = Vector3.Zero()
        let camRot = Quaternion.Zero()
        let intersectPoint = Vector3.Zero()
        let yOffset = centerPos.y

        cam.copyFrom(camera.position)
        camRot.copyFrom(camera.rotation)

        refVect.rotate(camRot)
        refVect.y += cam.y

        let t = (yOffset + 0.3 - 1 * (cam.y)) / ((refVect.y) - (cam.y))
        intersectPoint.x = (refVect.x) * t + cam.x
        intersectPoint.z = (refVect.z) * t + cam.z
        intersectPoint.y = yOffset

        let intersectPointSnap = toWorldSnapPos(intersectPoint, centerPos, scale)
        //log("intersectRaw: ", intersectPoint, "\nintersectSnap: ", intersectPointSnap)

        return intersectPointSnap
    }
    function snapPointToChessPos(intersectPointSnap: Vector3, centerPos: Vector3, scale: number){
        let boardPos = snapPosToBoardPos(intersectPointSnap, centerPos, scale)
        //log("arrPos: ", boardPos)

        /*
        let xNot = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        let zNot = ['1', '2', '3', '4', '5', '6', '7', '8']
        */

        if (boardPos === undefined) return undefined

        if (boardPos.x > 9 || boardPos.x < 0) return undefined
        if (boardPos.z > 7 || boardPos.z < 0) return undefined
        /*
        let chessPos = "" + xNot[boardPos.x] + zNot[boardPos.z]
        */
        let chessPos = {
            row: boardPos.z,
            col: boardPos.x
        }

        //log('chess pos: ', chessPos)
        return chessPos
    }
    function _chessPosToArrPos(chessPos: GamePos) {
        let arrPos: Vector3 = Vector3.Zero()
        /*
        const firstDigit = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const secondDigit = ['1', '2', '3', '4', '5', '6', '7', '8']
        let arrPosX: number, arrPosZ: number

        for (let i = 0; i < firstDigit.length; i++) {
            if (firstDigit[i] === chessPos[0]) {
                arrPosX = i
                break
            }
        }
        for (let i = 0; i < secondDigit.length; i++) {
            if (secondDigit[i] === chessPos[1]) {
                arrPosZ = i
                break
            }
        }
        */
        arrPos.x = chessPos.col - 1
        arrPos.z = chessPos.row
        return arrPos
    }
    return {
        getIntersectXZData(camera: Camera, centerPos: Vector3, scale) {
            let intersectPoint = findIntersectXZPlane(camera, centerPos, scale)
            let chessPos = snapPointToChessPos(intersectPoint, centerPos, scale)
            let valid = true

            if (chessPos === undefined)
                valid = false
            //log("intersectPoint: ", intersectPoint)
            //log("chessPos: ", chessPos)
            return {
                intersectPoint: intersectPoint,
                chessPos: chessPos,
                valid: valid
            }
        },
        chessPosToArrPos(chessPos: GamePos) {
            return _chessPosToArrPos(chessPos)
        },
        chessPosToWorldPos(chessPos: GamePos, centerPos: Vector3, scale) {
            let arrPos: Vector3 = _chessPosToArrPos(chessPos)
            let worldPos = boardPosToSnapPos(arrPos, centerPos, scale)

            return worldPos
        },
        isNumber(n) {
            return !isNaN(parseFloat(n)) && !isNaN(n - 0)
        },
        secToMinSec(timeSourceSec: number): string {
            let minStr = ''
            let minNum = 0
            let secStr = ''
            let secNum = 0

            minNum = Math.floor(timeSourceSec / 60)
            secNum = Math.floor(timeSourceSec % 60)

            if (Math.floor(minNum / 10) === 0) minStr = '0' + minNum.toString()
            else minStr = minNum.toString()

            if (Math.floor(secNum / 10) === 0) secStr = '0' + secNum.toString()
            else secStr = secNum.toString()

            return minStr + ':' + secStr
        },
    }
})()