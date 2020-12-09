import { GameRectUI } from "../basicUIModule/rectModule"
import { GameImageUI } from "../basicUIModule/imageModule"
import { GameRotation } from "../../khet/gameTypes"
import { ExecuteRotationEvent } from "../UIEventReceiver"
import soundResources from "../../resources/soundResources"

export class RotateBtnUI {
    UIEvents: EventManager
    texture: object

    rectGameBtn: GameRectUI

    rotationBtnBg: GameImageUI
    cwBtnOK: GameImageUI
    ccwBtnOK: GameImageUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
        log('game play button UI success')
    }

    showRotateBtn(rot: GameRotation[]) {
        if (rot.length === 0) {
            this.rotationBtnBg.hide()
            this.ccwBtnOK.hide()
            this.cwBtnOK.hide()
        }
        else if (rot.length === 1) {
            this.rotationBtnBg.show()
            if (rot[0] === GameRotation.CW) {
                this.ccwBtnOK.hide()
                this.cwBtnOK.changePos(60, -30)
                this.cwBtnOK.show()
            }
            else {
                this.cwBtnOK.hide()
                this.ccwBtnOK.changePos(60, -30)
                this.ccwBtnOK.show()
            }
        }
        else if (rot.length === 2) {
            this.rotationBtnBg.show()
            this.cwBtnOK.changePos(60 - 40, -30)
            this.ccwBtnOK.changePos(60 + 40, -30)
            this.ccwBtnOK.show()
            this.cwBtnOK.show()
        }
    }

    hideRotateBtn() {
        this.rotationBtnBg.hide()
        this.cwBtnOK.hide()
        this.ccwBtnOK.hide()
    }

    loadTexture(canvas, texture) {

        this.rectGameBtn = new GameRectUI(canvas, 1, Color4.Clear(), 0, 40, 175, 129, 'bottom', 'center')
        this.rectGameBtn.show()

        this.rectGameBtn.rect.isPointerBlocker = true

        this.rotationBtnBg = new GameImageUI(
            this.rectGameBtn, texture.UITexture1,
            2, 2, 175, 129, 175, 129, 0, 0
        )

        this.cwBtnOK = new GameImageUI(
            this.rectGameBtn, texture.UITexture1,
            181, 2, 61, 61, 61, 61, 20, -30
        )
        this.cwBtnOK.uiImage.isPointerBlocker = true

        this.ccwBtnOK = new GameImageUI(
            this.rectGameBtn, texture.UITexture1,
            253, 2, 61, 61, 61, 61, 100, -30
        )
        this.ccwBtnOK.uiImage.isPointerBlocker = true

        this.rotationBtnBg.hide()
        this.cwBtnOK.hide()
        this.ccwBtnOK.hide()


        this.cwBtnOK.uiImage.onClick = new OnClick(() => {
            
            soundResources.click.getComponent(AudioSource).playOnce()
            log('CW CLICKED')
            this.UIEvents.fireEvent(new ExecuteRotationEvent(GameRotation.CW))
        })
        this.ccwBtnOK.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('CCW CLICKED')
            this.UIEvents.fireEvent(new ExecuteRotationEvent(GameRotation.CCW))
        })
    }
}