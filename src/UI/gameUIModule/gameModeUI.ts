import { GameImageUI } from "../basicUIModule/imageModule"
import { GameTextUI } from "../basicUIModule/textModule"
import { GameRectUI } from "../basicUIModule/rectModule"
import { gameData } from "../../gameData/gameData"
import { GameMode } from "../../gameTypes"

export class GameModeUI {
    UIEvents: EventManager
    texture: object

    gameModeImg: GameImageUI
    gameModeTxt: GameTextUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
        log('Game Mode UI Success')
    }

    updateTxt() {
        if (gameData.getMode() === GameMode.MULTIPLAYER) {
            this.gameModeTxt.changeText('MULTIPLAYER')
        }
        else if (gameData.getMode() === GameMode.TUTORIAL) {
            this.gameModeTxt.changeText('TUTORIAL')
        }
        else if (gameData.getMode() === GameMode.SINGLEPLAYER) {
            this.gameModeTxt.changeText('SINGLE PLAYER')
        }
        if (gameData.getMode() === GameMode.NONE) {
            this.gameModeTxt.changeText('---')
        }
    }

    loadTexture(canvas, texture) {
        const rectGameMode = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 512, 50, 'bottom', 'center')
        rectGameMode.show()

        this.gameModeImg= new GameImageUI(
            rectGameMode, texture.UITexture2,
            0, 471, 512, 41, 512, 41, 0, 10,
            'center', 'bottom'
        )

        this.gameModeTxt = new GameTextUI(
            rectGameMode, '---', Color4.Black(), 20, 0, 7, 'center', 'center'
        )
        this.updateTxt()
    }
}
