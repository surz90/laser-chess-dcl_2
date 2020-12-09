import { BoardView } from "../board/boardView"
import { MovementSystem } from "./gameMovement"
import { GameUI } from "../UI/gameUI"
import { LaserChess } from "../khet/board"
import { GameColor, PlayerStatus, GamePos, PieceType, GameMode } from "../gameTypes"
import { userData } from "../gameData/userData"
import { GameRotation } from "../khet/gameTypes"

import utils from "../../node_modules/decentraland-ecs-utils/index"
import modelResources from "../resources/modelResources"
import { genFunc } from "../genFunc/genFunc"
import { gameData } from "../gameData/gameData"
import { ClientMethod, WSSHandler } from "../serverEvent/websocketHandler"

export class GameTutorial {
    arrow: Entity = new Entity()

    STAGE: number = 0
    tutorialStage: any = null

    turn: GameColor
    khetPlay: LaserChess = new LaserChess()
    boardView: BoardView
    movementSystem: MovementSystem = new MovementSystem(this)
    gameUI: GameUI

    moveData: object
    result: boolean = false

    constructor(boardView: BoardView, gameUI: GameUI) {
        this.boardView = boardView
        this.gameUI = gameUI

        this.arrow.addComponent(modelResources.FREE_1.sceneModel.arrow)
        this.arrow.addComponent(new Transform({
            position: new Vector3(16, 2, 16),
            scale: Vector3.Zero()
        }))
        engine.addEntity(this.arrow)
    }
    enter() {
        this.gameUI.UIObjects.playerTurnUI.hidePlayerTurnUI()
        this.gameUI.UIObjects.gameInfoUI.hideGameInfoUI()

        this.STAGE = 0
        engine.addSystem(this.movementSystem)
        engine.addSystem(this)

        this._loadStage(this.STAGE)
    }
    leave() {
        this.gameUI.UIObjects.playerTurnUI.showPlayerTurnUI()
        this.gameUI.UIObjects.gameInfoUI.showGameInfoUI()

        this.gameUI.UIObjects.tutorialUI.hideTutorial()

        this.gameUI.UIObjects.tutorialUI.nextBtn.hide()
        this.gameUI.UIObjects.tutorialUI.reloadBtn.hide()
        this.arrow.getComponent(Transform).scale.setAll(0)

        userData.setInGameStatus(PlayerStatus.SPECTATOR)
        engine.removeSystem(this.movementSystem)
        engine.removeSystem(this)
    }

    movePiece(fromPos: GamePos, toPos: GamePos, player: GameColor) {
        let move = this.khetPlay.movePiece(fromPos, toPos, player)
        if (move) {
            log('move success!')
            this.khetPlay.printBoard('piece_information')
            this.movementSystem.resetTile()

            //update board view
            this.boardView.move(fromPos, toPos, player)

            //fire laser
            this.fireLaser(player)

            this.moveData = {
                method: ClientMethod.MOVE,
                data: {
                    originPos: fromPos, targetPos: toPos
                }
            }
            this.result = this._validateSolution(this.moveData)

            let fireDelayEnt = new Entity()
            fireDelayEnt.addComponent(new utils.Delay(3000, () => {

                if (this.result) {
                    this.gameUI.UIObjects.tutorialUI.showNotif('TUTORIAL ' + this.STAGE.toString() + ' DONE !')
                    this.gameUI.UIObjects.tutorialUI.nextBtn.show()
                }

                engine.removeEntity(fireDelayEnt)
            }))
            engine.addEntity(fireDelayEnt)

            return true
        }
        else {
            log('move failed!')
            this.khetPlay.printBoard('piece_information')
            return false
        }
    }

    rotatePiece(fromPos: GamePos, rotation: GameRotation, player: GameColor) {
        let rotateAction = this.khetPlay.rotatePiece(fromPos, rotation, player)

        if (rotateAction) {
            log('rotate success!')
            this.khetPlay.printBoard('piece_information')
            this.movementSystem.resetTile()

            //update board view
            this.boardView.rotate(fromPos, rotation, player)

            //fire laser
            this.fireLaser(player)
            this.moveData = {
                method: ClientMethod.ROTATE,
                data: {
                    originPos: fromPos, targetRot: rotation
                }
            }
            this.result = this._validateSolution(this.moveData)

            let fireDelayEnt = new Entity()
            fireDelayEnt.addComponent(new utils.Delay(3000, () => {

                if (this.result) {
                    this.gameUI.UIObjects.tutorialUI.showNotif('TUTORIAL ' + this.STAGE.toString() + ' DONE !')
                    this.gameUI.UIObjects.tutorialUI.nextBtn.show()
                }

                engine.removeEntity(fireDelayEnt)
            }))
            engine.addEntity(fireDelayEnt)



            return true
        }
        else {
            log('move failed!')
            this.khetPlay.printBoard('piece_information')
            return false
        }
    }

    rotateActivePiece(rotation: GameRotation) {
        let player = userData.getInGameStatus() as number

        let originPos = this.movementSystem.posLock

        log('ROTATION: ', GameRotation[rotation])

        this.rotatePiece(originPos, rotation, player)
    }

    fireLaser(playerFire: GameColor) {
        //this.UIEvents.fireEvent(new GamePlayNotifEvent(true, 'fire_laser', null))
        this.movementSystem.disableMove()

        let laserPath = this.khetPlay.fireLaser(playerFire)
        this.boardView.playLaser(laserPath, playerFire)
    }

    _loadNextStage() {
        this.STAGE = this.STAGE + 1
        this._loadStage(this.STAGE)
    }
    _loadStage(stage: number = this.STAGE) { 
        this.result = false

        this.gameUI.UIObjects.tutorialUI.hideTutorial()
        this.gameUI.UIObjects.tutorialUI.reloadBtn.hide()
        this.gameUI.UIObjects.tutorialUI.nextBtn.hide()

        if (stage < 5) {
            this.gameUI.UIObjects.tutorialUI.showNotif('LOADING TUTORIAL')
            let delayEnt = new Entity()
            delayEnt.addComponent(new utils.Delay(2000, () => {
                this.gameUI.UIObjects.tutorialUI.hideNotif()
                engine.removeEntity(delayEnt)
            }))
            engine.addEntity(delayEnt)
        }

        switch (stage) {
            case 0:
                this.turn = GameColor.SILVER
                userData.setInGameStatus(PlayerStatus.SILVER)

                this.arrow.getComponent(Transform).position = genFunc.chessPosToWorldPos({ row: 0, col: 9 }, new Vector3(16, 2.5, 16), 1)
                this.arrow.getComponent(Transform).scale.setAll(1)

                this.tutorialStage = new Tutorial_0(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
            case 1:
                this.turn = GameColor.SILVER
                userData.setInGameStatus(PlayerStatus.SILVER)

                this.arrow.getComponent(Transform).position = genFunc.chessPosToWorldPos({ row: 3, col: 8 }, new Vector3(16, 2.5, 16), 1)
                this.arrow.getComponent(Transform).scale.setAll(1)

                this.tutorialStage = new Tutorial_1(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
            case 2:
                this.turn = GameColor.SILVER
                userData.setInGameStatus(PlayerStatus.SILVER)

                this.arrow.getComponent(Transform).position = genFunc.chessPosToWorldPos({ row: 7, col: 5 }, new Vector3(16, 3, 16), 1)
                this.tutorialStage = new Tutorial_2(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
            case 3:
                this.turn = GameColor.SILVER
                userData.setInGameStatus(PlayerStatus.SILVER)

                this.arrow.getComponent(Transform).position = genFunc.chessPosToWorldPos({ row: 3, col: 4 }, new Vector3(16, 3, 16), 1)
                this.tutorialStage = new Tutorial_3(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
            case 4:
                this.turn = GameColor.SILVER
                userData.setInGameStatus(PlayerStatus.SILVER)
                this.arrow.getComponent(Transform).position = genFunc.chessPosToWorldPos({ row: 6, col: 5 }, new Vector3(16, 2.5, 16), 1)

                this.tutorialStage = new Tutorial_4(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
            case 5:
                this.tutorialStage = new Tutorial_5(this.khetPlay, this.boardView, this.movementSystem, this.gameUI)
                break
        }
    }
    _validateSolution(moveData: any) {
        if (this.tutorialStage.checkSolution(this.moveData)) {

            return true
            /*
            let delayEnt = new Entity()
            delayEnt.addComponent(new utils.Delay(5000, () => {
                this.gameUI.UIObjects.serverNotif.unsetNotif()
                this._loadNextStage()

                engine.removeEntity(delayEnt)
            }))
            engine.addEntity(delayEnt)
            */
        }
        else {
            return false
        }
    }
    update(dt: number) {
        if(gameData.getMode() === GameMode.TUTORIAL)
            this.arrow.getComponent(Transform).rotate(Vector3.Up(), dt * 90)
    }
}

export class Tutorial_0 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        let delayEnt = new Entity()
        delayEnt.addComponent(new utils.Delay(1000, () => {
            gameUI.UIObjects.tutorialUI.showTutorial(PieceType.SPHINX, 'Rotate the LASER\nand fire the laser beam !')
            gameUI.UIObjects.tutorialUI.reloadBtn.show()
            engine.removeEntity(delayEnt)
        }))
        engine.addEntity(delayEnt)

        let FEN = '0/0/0/0/0/0/0/9S0N 0'
        khetPlay.loadGame(FEN)
        boardView.loadBoard(khetPlay.board, FEN)
        movementSystem.enableMove()
    }
    checkSolution(moveData) {
        if (moveData.method === "ROTATE") {
            WSSHandler.sendMsg({
                method: ClientMethod.TUTORIAL,
                data: 0
            })
            return true
        }
        else return false
    }
}

export class Tutorial_1 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        let delayEnt = new Entity()
        delayEnt.addComponent(new utils.Delay(1000, () => {
            gameUI.UIObjects.tutorialUI.showTutorial(PieceType.PYRAMID, 'Deflect laser beam\nusing DEFLECTOR !')
            gameUI.UIObjects.tutorialUI.reloadBtn.show()
            engine.removeEntity(delayEnt)
        }))
        engine.addEntity(delayEnt)

        let FEN = '0/0/0/0/8Y0S/0/0/9S0N 0'
        khetPlay.loadGame(FEN)
        boardView.loadBoard(khetPlay.board, FEN)
        movementSystem.enableMove()
    }
    checkSolution(moveData) {
        if (moveData.method === "MOVE" &&
            moveData.data.targetPos.col === 9) {
            WSSHandler.sendMsg({
                method: ClientMethod.TUTORIAL,
                data: 1
            })
            return true
        }
        else return false
    }
}

export class Tutorial_2 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        let delayEnt = new Entity()
        delayEnt.addComponent(new utils.Delay(1000, () => {
            gameUI.UIObjects.tutorialUI.showTutorial(PieceType.PHARAOH, "Kill Opponent's King\nusing DEFLECTOR")
            gameUI.UIObjects.tutorialUI.reloadBtn.show()
            engine.removeEntity(delayEnt)
        }))
        engine.addEntity(delayEnt)

        let FEN = '5P1S/0/0/5Y1N/8Y0S/0/0/4P0N4S0N 0'
        khetPlay.loadGame(FEN)
        boardView.loadBoard(khetPlay.board, FEN)
        movementSystem.enableMove()
    }
    checkSolution(moveData) {
        if (moveData.method === "MOVE" &&
            moveData.data.targetPos.col === 9 &&
            moveData.data.targetPos.row === 4) {
            WSSHandler.sendMsg({
                method: ClientMethod.TUTORIAL,
                data: 2
            })
            return true
        }
        else return false
    }
}

export class Tutorial_3 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        gameUI.UIObjects.tutorialUI.showTutorial(PieceType.SCARAB, "Kill Opponent's King\nusing SWITCH !")
        gameUI.UIObjects.tutorialUI.reloadBtn.show()

        let FEN = '5P1SY1S/0/0/4C1E1Y0W/4C0E4Y0S/0/0/4P0N4S0N 0'
        khetPlay.loadGame(FEN)
        boardView.loadBoard(khetPlay.board, FEN)
        movementSystem.enableMove()
    }
    checkSolution(moveData) {
        log('MOVE SOL: ', moveData)
        if (moveData.method === 'ROTATE' &&
            moveData.data.originPos.col === 4 &&
            moveData.data.originPos.row === 3 && 
            moveData.data.targetRot === 1) {
            WSSHandler.sendMsg({
                method: ClientMethod.TUTORIAL,
                data: 3
            })
            return true
        }
        else return false
    }
}

export class Tutorial_4 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        gameUI.UIObjects.tutorialUI.showTutorial(PieceType.ANUBIS, "Eliminate Opponent's \nDEFENDER !")
        gameUI.UIObjects.tutorialUI.reloadBtn.show()

        let FEN = 'S1S4P1SY1S/5A1S3Y0S/0/4C1E1Y0W/Y1N4C0E3Y0S/0/0/4P0N4S0N 0'
        khetPlay.loadGame(FEN)
        boardView.loadBoard(khetPlay.board, FEN)
        movementSystem.disableMove()

        let delayEnt0 = new Entity()
        let delayEnt1 = new Entity()

        delayEnt0.addComponent(new utils.Delay(4000, () => {
            let laserPath = khetPlay.fireLaser(GameColor.RED)
            boardView.playLaser(laserPath, GameColor.RED)
        }))
        delayEnt1.addComponent(new utils.Delay(5000, () => {
            movementSystem.enableMove()
        }))

        engine.addEntity(delayEnt0)
        engine.addEntity(delayEnt1)
    }
    checkSolution(moveData) {
        log('MOVE SOL: ', moveData)
        if (moveData.method === 'MOVE' &&
            moveData.data.originPos.col === 9 &&
            moveData.data.originPos.row === 3 &&
            moveData.data.targetPos.col === 8) {
            WSSHandler.sendMsg({
                method: ClientMethod.TUTORIAL,
                data: 4
            })
            return true
        }
        else return false
    }
}

export class Tutorial_5 {
    constructor(khetPlay: LaserChess, boardView: BoardView, movementSystem: MovementSystem, gameUI: GameUI) {
        gameUI.UIObjects.tutorialUI.showTutorial(null, '')
        gameUI.UIObjects.tutorialUI.reloadBtn.hide()
        gameUI.UIObjects.tutorialUI.nextBtn.hide()
    }
}