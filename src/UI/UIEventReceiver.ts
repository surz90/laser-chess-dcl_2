import { GameRotation } from "../khet/gameTypes"
import { GameLogic } from "../gameLogic/gameLogic"
import { GameUI } from "./gameUI"
import { PlayerMatching } from "../playerMatching"
import { GameColor, GameTheme, GameMode } from "../gameTypes"
import { ResourceController } from "../resources/resourcesController"
import { GameController } from "../gameLogic/gameModeController"
import { GameTutorial } from "../gameLogic/gameTutorial"
import { gameData } from "../gameData/gameData"


@EventConstructor()
export class ChangeThemeEvent {
    theme: GameTheme
    constructor(theme) {
        this.theme = theme
    }
}

@EventConstructor()
export class CancelJoinEvent {
    constructor() { }
}


@EventConstructor()
export class PieceRotateEvent {
    enable: boolean = false
    possibleRotations: GameRotation[]
    constructor(enable: boolean, possibleRotations: GameRotation[] = []) {
        this.enable = enable
        this.possibleRotations = possibleRotations
    }
}
@EventConstructor()
export class ExecuteRotationEvent {
    rotation: GameRotation
    constructor(rotation: GameRotation) {
        this.rotation = rotation
    }
}
@EventConstructor()
export class GamePlayNotifEvent {
    enable: boolean = false
    notifType: string
    turn: GameColor | null
    constructor(enable: boolean, notifType: string = '', turn: GameColor | null) {
        this.enable = enable
        this.notifType = notifType
        this.turn = turn
    }
}
@EventConstructor()
export class GamePlayTimerEvent {
    enable: boolean = false
    turn: GameColor | null
    timeData: string
    constructor(enable: boolean, turn: GameColor | null, timeData: string) {
        this.enable = enable
        this.turn = turn
        this.timeData = timeData
    }
}
@EventConstructor()
export class PlayerMatchingEvent {
    enable: boolean = false
    eventType: string
    constructor(enable: boolean, eventType: string = '') {
        this.enable = enable
        this.eventType = eventType
    }
}
@EventConstructor()
export class NotifMessageEvent {
    enable: boolean = false
    msgText: string
    constructor(enable: boolean, msgText: string = '') {
        this.enable = enable
        this.msgText = msgText
    }
}

@EventConstructor()
export class ChangeModeEvent {
    mode: GameMode
    constructor(mode: GameMode) {
        this.mode = mode
    }
}
@EventConstructor()
export class TutorialBtnEvent {
    eventID: string
    constructor(eventID: string) {
        this.eventID = eventID
    }
}


export class UIEVentReceiver {
    gameLogic: GameLogic
    gameTutorial: GameTutorial
    gameUI: GameUI
    UIEvents: EventManager
    resourceController: ResourceController
    gameController: GameController

    constructor(gameUI: GameUI, gameLogic: GameLogic, gameTutorial: GameTutorial, playerMatching: PlayerMatching, UIEvents: EventManager, resourceController: ResourceController, gameController: GameController) {
        this.UIEvents = UIEvents
        this.gameUI = gameUI
        this.gameLogic = gameLogic
        this.gameTutorial = gameTutorial
        this.resourceController = resourceController
        this.gameController = gameController

        this.UIEvents.addListener(CancelJoinEvent, null, () => {
            playerMatching.cancelJoin()
        })

        this.UIEvents.addListener(ChangeThemeEvent, null, ({ theme }) => {
            log('changing UI Event')
            this.resourceController.setTheme(theme)
            //if (this.resourceController.setTheme(theme)) {
            //    this.gameUI.UIObjects.menuUI.themeShopUI.hideSHop()
            //}
        })

        this.UIEvents.addListener(ExecuteRotationEvent, null, ({ rotation }) => {
            if (gameData.getMode() === GameMode.MULTIPLAYER) {
                log('<UI> ROTATE: ', GameRotation[rotation])
                gameLogic.rotateActivePiece(rotation)
            }
            else if (gameData.getMode() === GameMode.TUTORIAL) {
                log('<UI> ROTATE: ', GameRotation[rotation])
                gameTutorial.rotateActivePiece(rotation)
            }
        })

        this.UIEvents.addListener(ChangeModeEvent, null, ({ mode }) => {
            log('<UI> CHANGE MODE: ', GameMode[mode])
            if(mode === GameMode.MULTIPLAYER)
                gameController.startPvPMode()

            else if (mode === GameMode.TUTORIAL)
                gameController.startTutorialMode()
        })

        this.UIEvents.addListener(TutorialBtnEvent, null, ({ eventID }) => {
            if (eventID === 'next') {
                log('NEXT TUTORIAL')
                this.gameTutorial._loadNextStage()
            }
            else if (eventID === 'reload') {
                log('RELOAD TUTORIAL')
                this.gameTutorial._loadStage()
            }
        })
    }
}