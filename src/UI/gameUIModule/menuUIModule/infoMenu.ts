import { GameRectUI } from "../../basicUIModule/rectModule"
import { GameImageUI } from "../../basicUIModule/imageModule"
import { ChangeThemeEvent } from "../../UIEventReceiver"
import { GameTheme } from "../../../gameTypes"
import { MainMenuUI } from "../mainMenu"
import { GameTextUI } from "../../basicUIModule/textModule"
import soundResources from "../../../resources/soundResources"

export class InfoMenuUI {
    controller: MainMenuUI
    state: boolean = true

    UIEvents: EventManager
    texture: object

    infoMainBtnRect: GameRectUI
    infoMainBtn: GameImageUI

    infoMenuRect: GameRectUI
    title: GameImageUI
    infoImg: GameImageUI
    infoTxt: GameTextUI

    constructor(canvas, UIEvents, texture, controller) {
        this.UIEvents = UIEvents
        this.texture = texture
        this.controller = controller

        this.loadTexture(canvas, texture)
    }

    showInfo() {
        this.infoMenuRect.show()
        this.state = false
    }

    hideInfo() {
        this.infoMenuRect.hide()
        this.state = true
    }

    loadTexture(canvas, texture) {

        this.infoMainBtnRect = new GameRectUI(canvas, 1, Color4.Clear(), 0, 170, 77, 62, 'bottom', 'right')
        this.infoMainBtnRect.show()
        this.infoMainBtnRect.rect.isPointerBlocker = true

        this.infoMainBtn = new GameImageUI(
            this.infoMainBtnRect, texture.UITexture3,
            384, 150, 77, 62, 77, 62, 0, 0,
            'right', 'bottom'
        )
        this.infoMainBtn.uiImage.isPointerBlocker = true

        
        this.infoMenuRect = new GameRectUI(canvas, 1, Color4.Clear(), -68, 170, 236, 127, 'bottom', 'right')
        this.infoMenuRect.show()
        this.infoMenuRect.rect.isPointerBlocker = true

        this.title = new GameImageUI(
            this.infoMenuRect, texture.UITexture3,
            0, 0, 210, 22, 210, 23, 0, 145,
            'left', 'bottom'
        )

        this.infoImg = new GameImageUI(
            this.infoMenuRect, texture.UITexture3,
            150, 74, 230, 138, 230, 138, 0, 0,
            'left', 'bottom'
        )
        this.infoMenuRect.hide()

        this.infoMainBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (this.state) {
                this.controller.hideAll()
                this.showInfo()
            }
            else this.hideInfo()
        })

        this.infoTxt = new GameTextUI(
            this.infoMenuRect, 'LASER CHESS DCL V1.0\nMUSIC: Underclocked\n(underunderclocked mix)\n   by Eric Skiff\n   https://soundcloud.com/\neric-skiff',

            Color4.White(), 15, 10, 0, 'left', 'center'
        )
    }
}