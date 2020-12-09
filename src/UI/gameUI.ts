import UIResources from "../resources/UIResources"
import { GameInfoUI } from "./gameUIModule/gameInfoUI"
import { RotateBtnUI } from "./gameUIModule/rotateBtnUI"
import { ServerNotifUI } from "./gameUIModule/serverNotifUI"
import { PlayerTurnUI } from "./gameUIModule/playerTurnUI"
import { LoadingUI } from "./gameUIModule/loadingUI"
import { GameModeUI } from "./gameUIModule/gameModeUI"
import { MainMenuUI } from "./gameUIModule/mainMenu"
import { TutorialInfoUI } from "./gameUIModule/tutorialInfoUI"

export class GameUI {
    static canvas: UICanvas = new UICanvas()
    UIEvents: EventManager
    textureResource: object

    UIObjects: {
        serverNotif: ServerNotifUI,
        gameInfoUI: GameInfoUI,
        rotateBtnUI: RotateBtnUI,
        playerTurnUI: PlayerTurnUI,
        loadingUI: LoadingUI,
        gameModeUI: GameModeUI
        menuUI: MainMenuUI,
        tutorialUI: TutorialInfoUI,
        //maticMenuUI: MaticDepositWithdraw
    }

    constructor(UIEvents) {

        log('LOADING USER INTERFACE')


        this.UIEvents = UIEvents

        this.textureResource = UIResources.FREE_1

        this.UIObjects = {
            serverNotif: new ServerNotifUI(GameUI.canvas, this.UIEvents, this.textureResource),
            gameInfoUI: new GameInfoUI(GameUI.canvas, this.UIEvents, this.textureResource),
            rotateBtnUI: new RotateBtnUI(GameUI.canvas, this.UIEvents, this.textureResource),
            playerTurnUI: new PlayerTurnUI(GameUI.canvas, this.UIEvents, this.textureResource),
            loadingUI: new LoadingUI(GameUI.canvas, this.UIEvents, this.textureResource),
            gameModeUI: new GameModeUI(GameUI.canvas, this.UIEvents, this.textureResource),
            menuUI: new MainMenuUI(GameUI.canvas, this.UIEvents, this.textureResource),
            tutorialUI: new TutorialInfoUI(GameUI.canvas, this.UIEvents, this.textureResource)
        }
    }
}