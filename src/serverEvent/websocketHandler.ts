import { userData } from "../gameData/userData"
import { gameData } from "../gameData/gameData"
import { GameColor, GameMode, GameTheme } from "../gameTypes"
import { movePlayerTo } from '@decentraland/RestrictedActions'

import { GameLogic } from "../gameLogic/gameLogic"

import utils from "../../node_modules/decentraland-ecs-utils/index"
import { GameUI } from "../UI/gameUI"
import { themeData } from "../gameData/themeData"
import { ChangeThemeEvent } from "../UI/UIEventReceiver"


export const WSSHandler = (function () {
    let isInit: boolean = false
    let socket: WebSocket
    //let UIEvents: EventManager
    let gameUI: GameUI
    let gameLogic: GameLogic

    let readyState: any
    
    function openSocket(wssurl) {
        return new Promise((resolve, reject) => {

            socket = new WebSocket(wssurl)

            socket.onopen = (res) => {
                log('wss OK')
                readyState = socket.readyState
                resolve(socket.readyState)
                gameUI.UIObjects.gameInfoUI.setServerStatus('OPENING CONNECTION TO SERVER', Color4.Yellow())
            }

            socket.onerror = (res) => {
                log('wss ERR ')
                readyState = socket.readyState
                reject(socket.readyState)

                gameUI.UIObjects.gameInfoUI.setServerStatus('CONNECTION TO SERVER: FAILED', Color4.Red())
            }

            socket.onclose = (res) => {
                log('wss CLOSED')
                readyState = socket.readyState

                gameUI.UIObjects.gameInfoUI.setServerStatus('CONNECTION TO SERVER: FAILED', Color4.Red())
            }

            socket.onmessage = (event) => {
                socketMsgHandling(event.data)
            }
        })
    }

    function socketMsgHandling(_msg) {
        let msg: any = null
        let uuID: any = null
        let method: any = null
        let data: any = null

        try {
            msg = JSON.parse(_msg)
            method = msg.method
            data = msg.data
        }
        catch (err) {
            log(err)
            return
        }

        switch (method) {
            case ServerMethod.INIT:
                let uuID = data
                let method

                gameUI.UIObjects.gameInfoUI.setServerStatus('CONNECTION TO SERVER: OK', Color4.Green())

                if (socket.readyState === socket.CLOSED) {
                    method = ClientMethod.RECONNECT
                }
                if (socket.readyState === socket.OPEN) {
                    method = ClientMethod.REGISTER
                }

                sendMsg({
                    method: method,
                    data: {
                        dclID: userData.getUserName(),
                        ethAdd: userData.getUserEth(),
                        realm: userData.getUserRealm(),
                        sceneID: ''
                    }
                })
                sendMsg({
                    method: ClientMethod.REQGAMESTATE,
                    data: {}
                })
                break

            case ServerMethod.MESSAGE:
                gameUI.UIObjects.serverNotif.setNotif(data.text, 30)
                //this.UIEvents.fireEvent(new NotifMessageEvent(true, data.text))
                break

            /*
            case ServerMethod.UPDTHEME:
                let theme3avail = data.theme % 2
                let theme4avail = Math.floor(data.theme / 2)

                if (theme3avail === 1) themeData.addAvailableTheme(GameTheme.THEME3)
                if (theme4avail === 1) themeData.addAvailableTheme(GameTheme.THEME4)

                log(themeData.getAvailableTheme())
                break

            case ServerMethod.UPD_CH_THEME:
                if (data.theme % 2) themeData.addAvailableTheme(GameTheme.THEME3)
                if (Math.floor(data.theme / 2)) themeData.addAvailableTheme(GameTheme.THEME4)

                if (data.change === 1) gameUI.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME3))
                if (data.change === 2) gameUI.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME4))

                break
                */

            case ServerMethod.UPDPLAYER:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {

                    if (data.silver) gameData.setPlayer(GameColor.SILVER, data.silver)
                    else gameData.setPlayer(GameColor.SILVER, null)

                    if (data.red) gameData.setPlayer(GameColor.RED, data.red)
                    else gameData.setPlayer(GameColor.RED, null)

                    let players = gameData.getPlayer()
                    log('PLAYERS AFTER UPDATE: ', players)
                    gameUI.UIObjects.gameInfoUI.updatePlayerName()

                    if ((players.RED === null && players.SILVER === null) ||
                        (players.RED !== null && players.SILVER !== null)
                    ) {
                        gameUI.UIObjects.gameInfoUI.hideWait()
                        gameUI.UIObjects.loadingUI.hideLoading()
                    }
                    else {
                        gameUI.UIObjects.gameInfoUI.showWait()
                        gameUI.UIObjects.loadingUI.showLoading()
                    }

                    if (players.RED !== null && players.SILVER !== null) {
                        if (players.RED === userData.getUserName()) {
                            movePlayerTo(new Vector3(16, 15, 28))//, new Vector3(16, 0, 16))
                        }
                        else if (players.SILVER === userData.getUserName()) {
                            movePlayerTo(new Vector3(16, 15, 4))//, new Vector3(16, 0, 16))
                        }
                    }
                }
                break

            case ServerMethod.UPDBOARD:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    gameLogic.loadGame(data.FEN)
                }
                break

            case ServerMethod.UPDTURN:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    gameLogic.setTurn(data.turn, data.time)
                    gameUI.UIObjects.playerTurnUI.setTurn(data.turn)
                }
                break

            case ServerMethod.MOVE:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    let originPosMov = data.move.originPos
                    let targetPos = data.move.targetPos
                    gameLogic.movePiece(originPosMov, targetPos, gameLogic.turn)
                }
                break

            case ServerMethod.ROTATE:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    let originPosRot = data.move.originPos
                    let targetRot = data.move.targetRot
                    gameLogic.rotatePiece(originPosRot, targetRot, gameLogic.turn)
                }
                break

            case ServerMethod.FIRE:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    let playerFire = data.move.turn
                    gameUI.UIObjects.playerTurnUI.setTurn(playerFire)
                    gameLogic.fireLaser(playerFire)
                }
                break

            case ServerMethod.NEWGAME:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    gameUI.UIObjects.serverNotif.unsetNotif()
                    //this.UIEvents.fireEvent(new NotifMessageEvent(false, ''))
                    //movePlayerTo({ x: 1, y: 0, z: 1 }, {x: 8, y: 1, z: 8})
                    gameLogic.gameStart()
                }
                break

            case ServerMethod.ENDGAME:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    gameLogic.gameEnd()
                    gameUI.UIObjects.playerTurnUI.unsetTurn()
                }
                break

            case ServerMethod.RESET:
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    gameData.setPlayer(GameColor.SILVER, null)
                    gameData.setPlayer(GameColor.RED, null)

                    gameUI.UIObjects.gameInfoUI.updatePlayerName()
                    gameUI.UIObjects.serverNotif.unsetNotif()

                    gameLogic.gameRestart()
                }
                break
        }
    }

    async function sendMsg(_msg: any) {
        socket.send(JSON.stringify(_msg))
    }
    
    function wsConnect(_wssurl) {
        isInit = true
        gameUI.UIObjects.gameInfoUI.setServerStatus('CONNECTING TO SERVER', Color4.Yellow())

        //if (isInScene()) {
            gameUI.UIObjects.serverNotif.setNotif('LOADING SCENE\nPLEASE WAIT', 30)
            gameUI.UIObjects.loadingUI.showLoading()

            let delayStart = new Entity()

            delayStart.addComponent(new utils.Delay(10000, () => {
                openSocket(_wssurl)
                    .then(() => {
                        log("websocket connection OK ")
                    })
                    .then(() => {
                        gameUI.UIObjects.serverNotif.unsetNotif()
                        gameUI.UIObjects.loadingUI.hideLoading()
                    })
                    .catch((err) => {
                        log("can't connect to websocket ", err)
                        gameUI.UIObjects.serverNotif.unsetNotif()
                        gameUI.UIObjects.loadingUI.hideLoading()
                    })

                isInit = false
                engine.removeEntity(delayStart)
            }))

            engine.addEntity(delayStart)
        //}
        //else {
            //do nothing
        //}
    }
    

    return {
        getSocket() {
            return socket
        },
        init(_wssurl: string, _gameUI: GameUI, _gameLogic: GameLogic) {
            gameUI = _gameUI
            gameLogic = _gameLogic

            wsConnect(_wssurl)
        },
        connect(_wssurl: string) {
            wsConnect(_wssurl)
        },

        isInit() {
            return isInit
        },

        async sendMsg(_msg: any) {
            socket.send(JSON.stringify(_msg))
        },

        getReadyState() {
            return readyState
        }
    }
})()

export enum ClientMethod {
    REGISTER = 'REG',
    REQGAMESTATE = 'REQ',
    JOIN = 'JOIN',
    RECONNECT = 'RECONN',
    CANCELJOIN = 'CANCELJOIN',
    CONFIRMPLAY = 'CONFPLAY',
    MOVE = 'MOVE',
    ROTATE = 'ROTATE',
    TUTORIAL = 'TTRL',

    //theme
    AVAILTHEME = 'AVTHM',
    BUYTHEME = 'BYTHM'
}

export enum ServerMethod {
    MESSAGE = 'MESSAGE',

    UPDPLAYER = 'UPDPLAYER',
    UPDBOARD = 'UPDBOARD',
    UPDTURN = 'UPDTURN',

    MOVE = 'MOVE',
    ROTATE = 'ROTATE',
    FIRE = 'FIRE',

    RESET = 'RESET',
    NEWGAME = 'NEWGAME',
    ENDGAME = 'ENDGAME',
    INIT = 'INIT',

    //theme
    UPDTHEME = 'UPDTHM',
    UPD_CH_THEME = 'UNCTHM'
}