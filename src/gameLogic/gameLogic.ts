import { LaserChess } from "../khet/board"
import { gameData } from "../gameData/gameData"
import { PlayerStatus, GameColor, GameMode } from "../gameTypes"
import { GamePos, GameRotation } from "../khet/gameTypes"
import { MovementSystem } from "./gameMovement"
import { BoardView } from "../board/boardView"
import { userData } from "../gameData/userData"

import { movePlayerTo } from '@decentraland/RestrictedActions'
import utils from "../../node_modules/decentraland-ecs-utils/index"

import { GameUI } from "../UI/gameUI"
import { WSSHandler, ClientMethod } from "../serverEvent/websocketHandler"
import soundResources from "../resources/soundResources"
//import { movePlayerTo } from '@decentraland/RestrictedActions'



export class GameLogic {
    khetPlay: LaserChess

    movementSystem: MovementSystem
    boardView: BoardView

    //wssHandler: WSSSocketHandler

    gameUI: GameUI
    turn: GameColor = null

    isStart = false
    isEnd = false

    silverTime: number = null
    redTime: number = null

    timeUIInterval: number = 0.5 //update timer every 0.5 second
    timeUICount: number = 0

    constructor(gameUI: GameUI, boardView: BoardView) {
        this.gameUI = gameUI
        this.boardView = boardView

        this.khetPlay = new LaserChess()
        this.khetPlay.loadGame()

        this.movementSystem = new MovementSystem(this)
        engine.addSystem(this.movementSystem)

        this.boardView.loadBoard(this.khetPlay.board, this.khetPlay.FEN.split(' ')[0])

        const triggerBox = new utils.TriggerBoxShape(new Vector3(32, 1, 32), Vector3.Zero())
        const playerFallMoveBack = new Entity()

        playerFallMoveBack.addComponent(new Transform({
            position: new Vector3(16, 8, 16)
        }))

        playerFallMoveBack.addComponent(new utils.TriggerComponent(triggerBox, null, null, null, null,
            () => {
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    if (gameData.getPlayer().SILVER === userData.getUserName() && gameData.getPlayer().RED !== null) {
                        movePlayerTo(new Vector3(16, 20, 4), new Vector3(16, 0, 16))
                    }
                    else if (gameData.getPlayer().RED === userData.getUserName() && gameData.getPlayer().SILVER !== null) {
                        movePlayerTo(new Vector3(16, 20, 28), new Vector3(16, 0, 16))
                    }
                }
            },
            () => { },
            false
        ))
        engine.addEntity(playerFallMoveBack)

        engine.addSystem(this)
    }
    /*
    setWss(wssHandler: WSSSocketHandler) {
        this.wssHandler = wssHandler
    }
    */
    enter() {
    }
    leave() {
        log('LEAVING GAME')
        this.khetPlay.loadGame('0/0/0/0/0/0/0/0 0')
    }
    loadGame(FEN: string) {
        if (FEN.split(' ')[0] === this.khetPlay.FEN.split(' ')[0]) {
            log('FEN RECEIVED MATCH: ', FEN.split(' ')[0])
            return
        }

        else {
            log('FEN RECEIVED NOT MATCH!!!')
            log('SERVER FEN: ', FEN)
            log('CLIENT FEN: ', this.khetPlay.FEN)
            this.khetPlay.loadGame(FEN)
            this.boardView.loadBoard(this.khetPlay.board, FEN)
        }
        //this.khetPlay.printBoard('cell_color')
        //this.khetPlay.printBoard('piece_information')
    }
    gameStart() {
        this.isStart = true
        this.isEnd = false
        log('GAME START')
        this.movementSystem.enableMove()
    }
    gameEnd() {
        this.isEnd = true
        log('GAME END')
        this.movementSystem.disableMove()
        userData.setInGameStatus(PlayerStatus.SPECTATOR)
    }
    gameRestart() {
        //this.UIEvents.fireEvent(new GamePlayNotifEvent(false, '', null))

    }

    movePiece(fromPos: GamePos, toPos: GamePos, player: GameColor) {
        let move = this.khetPlay.movePiece(fromPos, toPos, player)
        if (move) {
            soundResources.move.getComponent(AudioSource).playOnce()
            log('move success!')
            this.khetPlay.printBoard('piece_information')
            this.movementSystem.resetTile()

            //update board view
            this.boardView.move(fromPos, toPos, player)

            //let laserPath = this.khetPlay.fireLaser(player)
            //this.boardView.playLaser(laserPath, player)

            if (this.turn === (userData.getInGameStatus() as number)) {
                //this.wssHandler.sendMsg({ method: ClientMethod.MOVE, data: { originPos: fromPos, targetPos: toPos } })
                WSSHandler.sendMsg({ method: ClientMethod.MOVE, data: { originPos: fromPos, targetPos: toPos } })
            }
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
            soundResources.move.getComponent(AudioSource).playOnce()
            log('rotate success!')
            this.khetPlay.printBoard('piece_information')
            this.movementSystem.resetTile()

            //update board view
            this.boardView.rotate(fromPos, rotation, player)

            //fire laser
            //this.fireLaser(player)

            //let laserPath = this.khetPlay.fireLaser(player)
            //this.boardView.playLaser(laserPath, player)

            if (this.turn === (userData.getInGameStatus() as number)) {
                //this.wssHandler.sendMsg({ method: ClientMethod.ROTATE, data: { originPos: fromPos, targetRot: rotation } })
                WSSHandler.sendMsg({ method: ClientMethod.ROTATE, data: { originPos: fromPos, targetRot: rotation } })
            }

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
        soundResources.shot.getComponent(AudioSource).playOnce()
        
        //this.UIEvents.fireEvent(new GamePlayNotifEvent(true, 'fire_laser', null))
        this.movementSystem.disableMove()

        let laserPath = this.khetPlay.fireLaser(playerFire)
        this.boardView.playLaser(laserPath, playerFire)
    }

    setTurn(_turn: GameColor | null, timeTurn: string) {
        log('SET TURN: ', _turn, 'PLAYER STATUS: ', userData.getInGameStatus(), ' TIME: ', timeTurn)
        this.turn = _turn
        if (this.turn === GameColor.SILVER) {
            this.silverTime = +timeTurn / 1000
        }
        else if (this.turn === GameColor.RED) {
            this.redTime = +timeTurn / 1000
        }

        if (this.turn === (userData.getInGameStatus() as number) && userData.getInGameStatus() !== PlayerStatus.SPECTATOR) {
            this.movementSystem.enableMove()
        }
        else {
            this.movementSystem.disableMove()
        }

        //else {
        //    this.UIEvents.fireEvent(new PieceRotateEvent(false))
        //    this.movementSystem.disableMove()
        //}
        /*
        if(this.turn === null) return

        if (this.turn === (userData.getInGameStatus() as number)) {
            this.UIEvents.fireEvent(new GamePlayNotifEvent(true, 'your_turn', this.turn))
            this.movementSystem.enableMove()
        }
        else {
            this.UIEvents.fireEvent(new GamePlayNotifEvent(true, 'opponent_turn', this.turn))
            this.movementSystem.disableMove()
        }
        */
    }

    updateModelResource(resource: any) {
        this.boardView.changeModel(resource)
    }

    update(dt: number) {

        if (this.isStart && !this.isEnd) {
            if (gameData.getMode() === GameMode.MULTIPLAYER) {
                if (this.turn === GameColor.SILVER) {
                    this.silverTime -= dt
                    if (this.silverTime < 0) this.silverTime = 0

                    if (this.timeUICount > this.timeUIInterval) {
                        this.timeUICount = 0
                        this.gameUI.UIObjects.playerTurnUI.setTime(GameColor.SILVER as number, Math.round(this.silverTime))
                    }
                    //this.UIEvents.fireEvent(new GamePlayTimerEvent(true, this.turn, Math.round(this.silverTime).toString()))
                }
                else if (this.turn === GameColor.RED) {
                    this.redTime -= dt
                    if (this.redTime < 0) this.redTime = 0

                    if (this.timeUICount > this.timeUIInterval) {
                        this.timeUICount = 0
                        this.gameUI.UIObjects.playerTurnUI.setTime(GameColor.RED as number, Math.round(this.redTime))
                    }
                    //this.UIEvents.fireEvent(new GamePlayTimerEvent(true, this.turn, Math.round(this.redTime).toString()))
                }
                else {
                    //this.UIEvents.fireEvent(new GamePlayTimerEvent(true, this.turn, ''))
                }

                this.timeUICount += dt
            }
        }
    }
}