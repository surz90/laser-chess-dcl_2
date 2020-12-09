import modelResources from "../resources/modelResources"
import { genFunc, IntersectData } from "../genFunc/genFunc"
import { LaserChess } from "../khet/board"
import { userData } from "../gameData/userData"
import { GameColor, GamePos, GameRotation, GameMode, GameTheme } from "../gameTypes"
import { GameLogic } from "./gameLogic"

import { gameData } from "../gameData/gameData"
import { pieceIcon } from "../board/iconView"
import { PieceType } from "../khet/gameTypes"
import { themeData } from "../gameData/themeData"
import soundResources from "../resources/soundResources"

export class MovementSystem {
    gameLogicParent: GameLogic
    UIEvents: EventManager
    movementEnable: boolean = false

    khetPlay: LaserChess

    cam: Camera
    intersectData: IntersectData
    centerPoint: any
    scale: any

    isSelectLock: boolean
    posLock: GamePos
    possibleMoves: GamePos[] = []
    possibleRotations: GameRotation[] = []

    tileHover: Entity
    tileLock: Entity
    tileLastMove: Entity
    tilePossibleMove: Entity[] = []

    iconModel: any
    currentIcon: any
    input = Input.instance

    constructor(_gameLogicParent: any) {
        this.gameLogicParent = _gameLogicParent

        this.khetPlay = this.gameLogicParent.khetPlay

        this.cam = Camera.instance
        this.centerPoint = new Vector3(16, 0, 16)
        this.scale = 1

        this.isSelectLock = false

        this.tileHover = new Entity()
        this.tileHover.addComponent(modelResources.FREE_1.movementMode.tile_hover)
        this.tileHover.addComponent(new Transform({
            position: this.centerPoint,
            scale: Vector3.Zero()
        }))
        engine.addEntity(this.tileHover)

        this.tileLock = new Entity()
        this.tileLock.addComponent(modelResources.FREE_1.movementMode.tile_lock)
        this.tileLock.addComponent(new Transform({
            position: this.centerPoint,
            scale: Vector3.Zero()
        }))
        engine.addEntity(this.tileLock)


        for (let i = 0; i < 8; i++) {
            this.tilePossibleMove.push(new Entity)
            this.tilePossibleMove[i].addComponent(modelResources.FREE_1.movementMode.tile_possible_move)
            this.tilePossibleMove[i].addComponent(new Transform({
                position: this.centerPoint.add(new Vector3(0, 0.25, 0)),
                scale: Vector3.Zero()
            }))
            engine.addEntity(this.tilePossibleMove[i])
        }

        this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, e => {
            this.clickMoveLogic()
        })

        this.loadIconModel()
    }
    loadIconModel() {
        this.iconModel = {
            sSphinx: new Entity(),
            sPharaoh: new Entity(),
            sPyramid: new Entity(),
            sScarab: new Entity(),
            sAnubis: new Entity(),
            rSphinx: new Entity(),
            rPharaoh: new Entity(),
            rPyramid: new Entity(),
            rScarab: new Entity(),
            rAnubis: new Entity()
        }
        this.iconModel.sSphinx = new pieceIcon(modelResources.ICON.silver_sphinx)
        this.iconModel.sPharaoh = new pieceIcon(modelResources.ICON.silver_pharaoh)
        this.iconModel.sPyramid = new pieceIcon(modelResources.ICON.silver_pyramid)
        this.iconModel.sScarab = new pieceIcon(modelResources.ICON.silver_scarab)
        this.iconModel.sAnubis = new pieceIcon(modelResources.ICON.silver_anubis)

        this.iconModel.rSphinx = new pieceIcon(modelResources.ICON.red_sphinx)
        this.iconModel.rPharaoh = new pieceIcon(modelResources.ICON.red_pharaoh)
        this.iconModel.rPyramid = new pieceIcon(modelResources.ICON.red_pyramid)
        this.iconModel.rScarab = new pieceIcon(modelResources.ICON.red_scarab)
        this.iconModel.rAnubis = new pieceIcon(modelResources.ICON.red_anubis)
    }
    clickMoveLogic() {
        if (this.movementEnable) {
            if ((this.gameLogicParent.turn as number) !== userData.getInGameStatus() && gameData.getMode() !== GameMode.TUTORIAL) {
                return
            }

            let chessPosSelect = this.intersectData.chessPos
            let userInGameStatus = userData.getInGameStatus()

            //log(this.intersectData)
            if (this.intersectData.valid) {
                let cellSelect = this.khetPlay.getCell(this.intersectData.chessPos.row, this.intersectData.chessPos.col)

                if (!this.isSelectLock) {
                    if (cellSelect.piece) {

                        if ((cellSelect.piece.color as number) === userInGameStatus) {
                            log('own piece')
                            this.lockingTile(chessPosSelect, userInGameStatus)
                        }
                        else {
                            log('opponent piece')
                            this.resetTile()
                        }
                    }
                    else {
                        log('empty cell')
                        this.resetTile()
                    }
                }
                else {
                    let intersectPos = this.intersectData.chessPos

                    if (this.posLock.row === intersectPos.row && this.posLock.col === intersectPos.col) {
                        this.resetTile()
                    }
                    else {
                        let selectIndex = findIndex(this.possibleMoves, ((e: { row: number; col: number }) => (e.row === intersectPos.row && e.col === intersectPos.col)))
                        if (selectIndex === -1) {
                            this.resetTile()
                            this.clickMoveLogic()
                        }
                        else {
                            log('move valid')
                            let destinationPos = this.possibleMoves[selectIndex]

                            //SUBMIT MOVE PIECE TO GAME LOGIC
                            this.gameLogicParent.movePiece(this.posLock, destinationPos, (userInGameStatus as number))
                            this.resetTile()
                        }
                    }
                }
            }
            else {
                this.resetTile()
            }
        }
    }
    lockingTile(_chessPosSelect: GamePos, _userInGameStatus) {
        soundResources.hover.getComponent(AudioSource).playOnce()

        this.isSelectLock = true
        this.possibleMoves = this.khetPlay.getPossibleMoves(_chessPosSelect, (_userInGameStatus as number))
        this.posLock = _chessPosSelect

        if(this.possibleMoves === null) this.possibleMoves = []

        //log(this.possibleMoves)
        for (let i = 0; i < 8; i++) {
            if (i < this.possibleMoves.length) {
                this.tilePossibleMove[i].getComponent(Transform).scale.setAll(1)
                this.tilePossibleMove[i].getComponent(Transform).position =
                    genFunc.chessPosToWorldPos(this.possibleMoves[i], this.centerPoint, this.scale)
                //.add(new Vector3(0, 0.25, 0))
            }
            else {
                this.tilePossibleMove[i].getComponent(Transform).scale.setAll(0)
            }
        }

        this.possibleRotations = this.khetPlay.getPossibleRotation(_chessPosSelect, (_userInGameStatus as number))
        //log(this.possibleRotations)

        //this.UIEvents.fireEvent(new PieceRotateEvent(true, this.possibleRotations))
        this.gameLogicParent.gameUI.UIObjects.rotateBtnUI.showRotateBtn(this.possibleRotations)

        this.isSelectLock = true
        this.tileLock.getComponent(Transform).position = this.intersectData.intersectPoint
        this.tileLock.getComponent(Transform).scale.setAll(1.01)

    }
    resetTile() {
        this.possibleMoves = []
        this.isSelectLock = false
        this.posLock = null

        this.tileLock.getComponent(Transform).scale.setAll(0)

        //this.UIEvents.fireEvent(new PieceRotateEvent(false, []))
        this.gameLogicParent.gameUI.UIObjects.rotateBtnUI.hideRotateBtn()

        for (let i = 0; i < 8; i++) {
            this.tilePossibleMove[i].getComponent(Transform).scale.setAll(0)
        }
    }
    enableMove() {
        log('movement system started')
        this.movementEnable = true
    }
    disableMove() {
        this.movementEnable = false
        this.resetTile()
        this.tileHover.getComponent(Transform).scale.setAll(0)
    }
    updateModel() {

    }
    hoverMove(intData: GamePos) {
        //log(intData)
        if (themeData.getCurrentTheme() !== GameTheme.THEME1) {
            if (this.currentIcon !== undefined) this.currentIcon.hide()
            let cellSelect = this.khetPlay.getCell(intData.row, intData.col)

            if (cellSelect.piece && themeData.getCurrentTheme() !== GameTheme.THEME2) {
                if (cellSelect.piece.type === PieceType.ANUBIS) {
                    if (cellSelect.piece.color === GameColor.RED) this.currentIcon = this.iconModel.rAnubis
                    else this.currentIcon = this.iconModel.sAnubis
                }
                else if (cellSelect.piece.type === PieceType.PHARAOH) {
                    if (cellSelect.piece.color === GameColor.RED) this.currentIcon = this.iconModel.rPharaoh
                    else this.currentIcon = this.iconModel.sPharaoh
                }
                else if (cellSelect.piece.type === PieceType.PYRAMID) {
                    if (cellSelect.piece.color === GameColor.RED) this.currentIcon = this.iconModel.rPyramid
                    else this.currentIcon = this.iconModel.sPyramid
                }
                else if (cellSelect.piece.type === PieceType.SCARAB) {
                    if (cellSelect.piece.color === GameColor.RED) this.currentIcon = this.iconModel.rScarab
                    else this.currentIcon = this.iconModel.sScarab
                }
                else {
                    if (cellSelect.piece.color === GameColor.RED) this.currentIcon = this.iconModel.rSphinx
                    else this.currentIcon = this.iconModel.sSphinx
                }

                this.currentIcon.setPosRot(intData, cellSelect.piece.orientation)
                this.currentIcon.show()
            }
        }
    }
    update(dt: number) {
        if (this.movementEnable) {
            //log(this.gameLogicParent.turn, PlayerStatus[userData.getInGameStatus()])
            if ((this.gameLogicParent.turn as number) === userData.getInGameStatus() || gameData.getMode() === GameMode.TUTORIAL) {

                let intersectData = genFunc.getIntersectXZData(this.cam, this.centerPoint, this.scale)
                let tileHoverTransform = this.tileHover.getComponent(Transform)


                if (intersectData.valid) {
                    if (this.intersectData === undefined || this.intersectData.chessPos === undefined) {
                        this.hoverMove(intersectData.chessPos)
                        this.intersectData = intersectData
                    }

                    else if (intersectData.chessPos.row === this.intersectData.chessPos.row
                        && intersectData.chessPos.col === this.intersectData.chessPos.col
                    ) { }
                    else {
                        this.hoverMove(intersectData.chessPos)
                        this.intersectData = intersectData
                    }

                    tileHoverTransform.scale.setAll(1)
                    tileHoverTransform.position = (this.intersectData.intersectPoint as Vector3).add(new Vector3(0, 0, 0))
                }
                else {
                    this.intersectData = intersectData
                    tileHoverTransform.scale.setAll(0)
                    if (this.currentIcon !== undefined) this.currentIcon.hide()
                }

                /*
                if (intersectData.chessPos !== undefined) {
                    if (this.intersectData === undefined) {
                        this.intersectData = intersectData
                        //this.hoverMove(intersectData.chessPos)
                    }
                    else {
                        if (intersectData.chessPos.col === this.intersectData.chessPos.col
                            && intersectData.chessPos.row === this.intersectData.chessPos.row
                        ) { }
                        else {
                            this.intersectData = intersectData

                            //this.hoverMove(intersectData.chessPos)
                        }
                    }

                }
                else {
                    this.intersectData = intersectData
                    if (this.currentIcon !== undefined) this.currentIcon.hide()
                }                    
                */
            }
        }
    }
}


function findIndex(arrObj: any, condition: Function) {
    for (let i = 0; i < arrObj.length; i++) {
        if (condition(arrObj[i])) {
            return i
        }
    }
    return -1
}