import { GameRectUI } from "../../basicUIModule/rectModule"
import { GameImageUI } from "../../basicUIModule/imageModule"
import { ChangeModeEvent } from "../../UIEventReceiver"
import { GameMode } from "../../../gameTypes"
import { MainMenuUI } from "../mainMenu"
import soundResources from "../../../resources/soundResources"

export class ModeMenuUI {
    controller: MainMenuUI
    state: boolean = true

    UIEvents: EventManager
    texture: object

    modeMainBtnRect: GameRectUI
    modeMainBtn: GameImageUI

    modeMenuRect: GameRectUI

    //modeMenuBg: GameImageUI
    title: GameImageUI
    tutorialBtn: GameImageUI
    multiplayerBtn: GameImageUI

    constructor(canvas, UIEvents, texture, controller) {
        this.UIEvents = UIEvents
        this.texture = texture
        this.controller = controller

        this.loadTexture(canvas, texture)
    }

    showMode() {
        this.modeMenuRect.show()
        this.state = false
    }

    hideMode() {
        this.modeMenuRect.hide()
        this.state = true
    }

    loadTexture(canvas, texture) {

        this.modeMainBtnRect = new GameRectUI(canvas, 1, Color4.Clear(), 0, 310, 77, 62, 'bottom', 'right')
        this.modeMainBtnRect.show()
        this.modeMainBtnRect.rect.isPointerBlocker = true

        this.modeMainBtn = new GameImageUI(
            this.modeMainBtnRect, texture.UITexture3,
            384, 3, 77, 62, 77, 62, 0, 0,
            'right', 'bottom'
        )
        this.modeMainBtn.uiImage.isPointerBlocker = true

        this.modeMenuRect = new GameRectUI(canvas, 1, Color4.Clear(), -71, 310, 150, 70, 'bottom', 'right')
        this.modeMenuRect.hide()
        this.modeMenuRect.rect.isPointerBlocker = true

        this.title = new GameImageUI(
            this.modeMenuRect, texture.UITexture3,
            0, 24, 130, 23, 130, 23, 0, 70,
            'left', 'bottom'
        )

        this.tutorialBtn = new GameImageUI(
            this.modeMenuRect, texture.UITexture3,
            229, 3, 150, 29, 147, 29, 0, 35,
            'left', 'bottom'
        )
        this.tutorialBtn.uiImage.isPointerBlocker = true

        this.multiplayerBtn = new GameImageUI(
            this.modeMenuRect, texture.UITexture3,
            229, 36, 150, 28, 150, 29, 0, 0,
            'left', 'bottom'
        )
        this.multiplayerBtn.uiImage.isPointerBlocker = true

        this.modeMainBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (this.state) {
                this.controller.hideAll()
                this.showMode()
            }
            else this.hideMode()
        })

        this.tutorialBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            this.UIEvents.fireEvent(new ChangeModeEvent(GameMode.TUTORIAL))
        })

        this.multiplayerBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            this.UIEvents.fireEvent(new ChangeModeEvent(GameMode.MULTIPLAYER))
        })
    }
}