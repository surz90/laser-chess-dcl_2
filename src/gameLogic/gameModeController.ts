import { GameLogic } from "./gameLogic";
import { GameTutorial } from "./gameTutorial";
import { BoardView } from "../board/boardView";
import { gameData } from "../gameData/gameData";
import { GameMode, PlayerStatus, GameTurn } from "../gameTypes";
import { userData } from "../gameData/userData";
import { GameUI } from "../UI/gameUI";
//import { WSSSocketHandler, ClientMethod } from "../serverEvent/wssHandler";
import { GameColor } from "../khet/gameTypes";
import { WSSHandler, ClientMethod } from "../serverEvent/websocketHandler";


export class GameController {
    boardView: BoardView

    UIEvents: EventManager
    gameUI: GameUI
    gamePvP: GameLogic
    gameTutorial: GameTutorial
    //wss: WSSSocketHandler

    constructor(gameUI, UIEvents, boardView, gamePvP, gameTutorial) {
        this.gameUI = gameUI
        this.UIEvents = UIEvents
        this.boardView = boardView
        this.gamePvP = gamePvP
        this.gameTutorial = gameTutorial
        //this.wss = wss
    }

    startPvPMode() {
        //log(GameMode[gameData.getMode()])
        if (gameData.getMode() === GameMode.MULTIPLAYER) {
            log('ALREADY IN MULTIPLAYER MODE')
        }
        else {
            gameData.setMode(GameMode.MULTIPLAYER)
            log('CHANGE TO MULTIPLAYER MODE')
            this.gameUI.UIObjects.gameModeUI.updateTxt()

            this.gameUI.UIObjects.menuUI.hideAll()

            this.gameTutorial.leave()

            let enterMsg = {
                method: ClientMethod.REQGAMESTATE,
                data: {}
            }
            //this.wss.sendMsg(enterMsg)
            WSSHandler.sendMsg(enterMsg)
        }
    }

    startTutorialMode() {
        //log(GameMode[gameData.getMode()], PlayerStatus[userData.getInGameStatus()])
        if (gameData.getMode() === GameMode.TUTORIAL) {
            log('ALREADY IN TUTORIAL MODE')
        }
        else if (gameData.getMode() === GameMode.MULTIPLAYER && userData.getInGameStatus() !== PlayerStatus.SPECTATOR) {
            log(gameData.getMode(), 'play as : ', PlayerStatus[userData.getInGameStatus()])
            log('PLEASE FINISH YOUR CURRENT GAME BEFORE CHANGING MODE!')
        }
        else {
            gameData.setMode(GameMode.TUTORIAL)
            log('CHANGE TO TUTORIAL MODE')
            this.gameUI.UIObjects.gameModeUI.updateTxt()

            this.gameUI.UIObjects.menuUI.hideAll()

            this.gamePvP.leave()
            this.gameTutorial.enter()
        }
        //this.gamePvP.leave()
        //this.gameTutorial.enter()
    }
}