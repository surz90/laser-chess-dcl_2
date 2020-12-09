import { GameImageUI } from "../basicUIModule/imageModule"
import { GameTextUI } from "../basicUIModule/textModule"
import { GameRectUI } from "../basicUIModule/rectModule"
import { CancelJoinEvent } from "../UIEventReceiver"
import { gameData } from "../../gameData/gameData"
import { userData } from "../../gameData/userData"

export class GameInfoUI {
    UIEvents: EventManager
    texture: object

    playerSilverImg: GameImageUI
    playerRedImg: GameImageUI

    //silverTurnMarkImg: GameImageUI
    //redTurnMarkImg: GameImageUI

    playerSilverText: GameTextUI
    playerRedText: GameTextUI

    waitOpponentImg: GameImageUI
    waitOpponentText: GameTextUI
    //cancelWaitBtn: GameImageUI

    serverStatusText: GameTextUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
        log('Game Info UI Success')
    }
    
    updatePlayerName() {
        let players = gameData.getPlayer()
        if (players.SILVER === null) this.playerSilverText.changeText('---')
        else this.playerSilverText.changeText(players.SILVER)

        if (players.RED === null) this.playerRedText.changeText('---')
        else this.playerRedText.changeText(players.RED)
    }

    hideGameInfoUI() {
        this.playerSilverImg.hide()
        this.playerRedImg.hide()

        this.playerSilverText.hide()
        this.playerRedText.hide()
    }

    showGameInfoUI() {
        this.playerSilverImg.show()
        this.playerRedImg.show()

        this.playerSilverText.show()
        this.playerRedText.show()
    }

    showWait() {
        this.waitOpponentImg.show()
        this.waitOpponentText.show()
        
        let players = gameData.getPlayer()

        if (players.SILVER !== null) this.waitOpponentText.changeText(players.SILVER)
        else this.waitOpponentText.changeText(players.RED)

        /*
        if (players.SILVER === userData.getUserName() || players.RED === userData.getUserName()) {
            log(players, userData.getUserName())
            this.cancelWaitBtn.show()
        }
        */
    }

    hideWait() {
        this.waitOpponentImg.hide()
        this.waitOpponentText.hide()
        //this.cancelWaitBtn.hide()
    }

    setServerStatus(connectionStatus: string, color: Color4) {
        this.serverStatusText.changeColor(color)
        this.serverStatusText.changeText(connectionStatus, 12)
    }

    loadTexture(canvas, texture) {
        const rectPlayerInfo = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 1000, 100, 'top', 'center')
        rectPlayerInfo.show()

        this.playerSilverImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            14, 264, 166, 78, 166, 78, 0, -4,
            'left', 'top'
        )
        this.playerRedImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            198, 264, 166, 77, 166, 78, 0, -4,
            'right', 'top'
        )

        const silverTextRect = new GameRectUI(rectPlayerInfo.rect, 1, Color4.Clear(), 0, -30, 160, 40, 'top', 'left')
        silverTextRect.show()

        this.playerSilverText = new GameTextUI(
            silverTextRect, '---', Color4.White(), 20, 10, 0,
            'left', 'center'
        )

        const redTextRect = new GameRectUI(rectPlayerInfo.rect, 1, Color4.Clear(), 0, -30, 160, 40, 'top', 'right')
        redTextRect.show()

        this.playerRedText = new GameTextUI(
            redTextRect, '---', Color4.Red(), 20, -10, 0,
            'right', 'center'
        )

        this.waitOpponentImg = new GameImageUI(
            rectPlayerInfo, texture.UITexture1,
            2, 155, 431, 106, 431, 106, 0, 0,
            'center', 'top'
        )

        const waitTextRect = new GameRectUI( rectPlayerInfo.rect, 0.8, Color4.Clear(), 0, -5, 423, 45, 'top', 'center' )
        waitTextRect.show()

        this.waitOpponentText = new GameTextUI(
            waitTextRect, '---', Color4.Black(), 30,
            0, 0, 'center', 'center'
        )

        const serverStatusRect = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 300, 40, 'bottom', 'center')
        serverStatusRect.show()
        this.serverStatusText = new GameTextUI(
            serverStatusRect, 'CONNECTING TO SERVER', Color4.Yellow(), 12,
            0, 0, 'center', 'bottom'
        )

        this.waitOpponentImg.hide()
        this.waitOpponentText.hide()

        /*
        this.cancelWaitBtn.hide()

        log('cancel wait on click created')
        this.cancelWaitBtn.uiImage.onClick = new OnClick(() => {
            log('cancel play')
            this.UIEvents.fireEvent(new CancelJoinEvent())
        })
        */
    }
}
