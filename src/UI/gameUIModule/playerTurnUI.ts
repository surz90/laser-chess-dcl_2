import { GameImageUI } from "../basicUIModule/imageModule"
import { GameTextUI } from "../basicUIModule/textModule"
import { GameRectUI } from "../basicUIModule/rectModule"
import { GameTurn, PlayerStatus } from "../../gameTypes"
import { userData } from "../../gameData/userData"

export class PlayerTurnUI {
    UIEvents: EventManager
    texture: object

    turnImg: GameImageUI
    turnText: GameTextUI
    
    silverTurnMarkImg: GameImageUI
    redTurnMarkImg: GameImageUI

    silverTimeActive: GameImageUI
    redTimeActive: GameImageUI
    silverTimeNA: GameImageUI
    redTimeNA: GameImageUI

    silverTimeText: GameTextUI
    redTimeText: GameTextUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)

        //this.setTurn(GameTurn.LASER)
    }
    setTime(turn: GameTurn, timeData: number) {
        if (turn === GameTurn.SILVER) {
            this.silverTimeText.changeText(timeData.toString())
            this.redTimeText.changeText('-')
        }
        else if (turn === GameTurn.RED) {
            this.redTimeText.changeText(timeData.toString())
            this.silverTimeText.changeText('-')
        }
    }
    unsetTime() {

    }

    setTurn(turn: GameTurn) {
        if (turn === GameTurn.RED) {
            this.redTurnMarkImg.show()
            this.silverTurnMarkImg.hide()

            this.redTimeActive.show()
            //this.redTimeNA.hide()
            this.silverTimeActive.hide()
            //this.silverTimeNA.show()

            this.turnText.changeColor(Color4.Black())

            if (userData.getInGameStatus() === PlayerStatus.RED) {
                this.turnText.changeText('YOUR TURN !!')
                this.turnText.changeColor(Color4.Red())
            }
            else if (userData.getInGameStatus() === PlayerStatus.SILVER) {
                this.turnText.changeText('OPPONENT TURN')
            }
            else {
                this.turnText.changeText('PLAYER 2 TURN')
            }
        }
        else if (turn === GameTurn.SILVER) {
            this.silverTurnMarkImg.show()
            this.redTurnMarkImg.hide()

            this.silverTimeActive.show()
            //this.silverTimeNA.hide()
            this.redTimeActive.hide()
            //this.redTimeNA.show()

            if (userData.getInGameStatus() === PlayerStatus.SILVER) {
                this.turnText.changeText('YOUR TURN !!')
                this.turnText.changeColor(Color4.Red())
            }
            else if (userData.getInGameStatus() === PlayerStatus.RED) {
                this.turnText.changeText('OPPONENT TURN')
            }
            else {
                this.turnText.changeText('PLAYER 1 TURN')
            }
        }
        else if (turn === GameTurn.LASER) {
            this.turnText.changeText('FIRE LASER !')
            this.turnText.changeColor(Color4.Blue())
        }
        this.turnImg.show()
        this.turnText.show()
    }
    unsetTurn() {
        this.turnImg.hide()
        this.turnText.hide()
    }

    hidePlayerTurnUI() {
        this.turnImg.hide()
        this.turnText.hide()
        this.silverTurnMarkImg.hide()
        this.redTurnMarkImg.hide()
        this.silverTimeActive.hide()
        this.redTimeActive.hide()
        this.silverTimeNA.hide()
        this.redTimeNA.hide()
        this.silverTimeText.hide()
        this.redTimeText.hide()
    }
    showPlayerTurnUI() {
        this.silverTimeNA.show()
        this.redTimeNA.show()
        this.silverTimeText.show()
        this.redTimeText.show()
    }

    loadTexture(canvas, texture) {
        const rectPlayerInfo = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 1000, 100, 'top', 'center')
        rectPlayerInfo.show()

        this.turnImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            126, 438, 280, 74, 280, 74, 0, 0,
            'center', 'top'
        )
        this.turnText = new GameTextUI(
            rectPlayerInfo, '', Color4.Black(), 25,
            0, -10, 'center', 'top'
        )

        this.turnImg.hide()

        this.silverTurnMarkImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            8, 344, 178, 88, 178, 88, -6, 0,
            'left', 'top'
        )
        this.redTurnMarkImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            192, 344, 178, 88, 178, 88, 6, 0,
            'right', 'top'
        )
        this.silverTurnMarkImg.hide()
        this.redTurnMarkImg.hide()


        this.silverTimeActive = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            374, 340, 89, 93, 89, 93, -288, 0,
            'center', 'top'
        )
        this.silverTimeNA = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            385, 273, 64, 59, 64, 59, -290, -13,
            'center', 'top'
        )

        this.redTimeActive = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            374, 340, 89, 93, 89, 93, 290, 0,
            'center', 'top'
        )
        this.redTimeNA = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            385, 273, 64, 59, 64, 59, 290, -13,
            'center', 'top'
        )

        this.silverTimeActive.hide()
        this.silverTimeNA.show()
        this.redTimeActive.hide()
        this.redTimeNA.show()

        const silverTimeRect = new GameRectUI(rectPlayerInfo.rect, 0.9, Color4.Clear(), -290, -18, 50, 50, 'top', 'center')
        silverTimeRect.show()

        this.silverTimeText = new GameTextUI(
            silverTimeRect, '--', Color4.Black(),
            24, 0, 0,
            'center', 'center'
        )

        const redTimeRect = new GameRectUI(rectPlayerInfo.rect, 1, Color4.Clear(), 290, -18, 50, 50, 'top', 'center')
        redTimeRect.show()

        this.redTimeText = new GameTextUI(
            redTimeRect, '--', Color4.Black(),
            24, 0, 0,
            'center', 'center'
        )
    }
}
