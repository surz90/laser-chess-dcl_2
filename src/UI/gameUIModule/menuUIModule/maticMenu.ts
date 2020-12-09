import { GameRectUI } from "../../basicUIModule/rectModule"
import { GameImageUI } from "../../basicUIModule/imageModule"
import { ChangeThemeEvent } from "../../UIEventReceiver"
import { GameTheme } from "../../../gameTypes"
import { MainMenuUI } from "../mainMenu"
import { GameTextUI } from "../../basicUIModule/textModule"
import { Laser } from "../../../khet/laser"
import { MaticDepositWithdraw } from "./maticDepositWithdraw"
import soundResources from "../../../resources/soundResources"


export class MaticMenuUI {
    controller: MainMenuUI

    UIEvents: EventManager
    texture: object
    state: boolean = true

    maticMenuBtnRect: GameRectUI
    maticMenuBtn: GameImageUI

    maticMenu: MaticDepositWithdraw
    
    constructor(canvas, UIEvents, texture, controller) {
        this.UIEvents = UIEvents
        this.texture = texture
        this.controller = controller

        this.maticMenu = new MaticDepositWithdraw(canvas, UIEvents, texture)
        this.maticMenu.hideMaticMenu()

        this.loadTexture(canvas, texture)
    }

    showMaticMenu() {
        //this.infoMenuRect.show()
        this.state = false
        this.maticMenu.showMaticMenu()
    }

    hideMaticMenu() {
        //this.infoMenuRect.hide()
        this.state = true
        this.maticMenu.hideMaticMenu()
    }

    loadTexture(canvas, texture) {

        this.maticMenuBtnRect = new GameRectUI(canvas, 1, Color4.Clear(), 0, 100, 77, 62, 'bottom', 'right')
        this.maticMenuBtnRect.show()
        this.maticMenuBtnRect.rect.isPointerBlocker = true

        this.maticMenuBtn = new GameImageUI(
            this.maticMenuBtnRect, texture.UITexture3,
            383, 229, 77, 62, 77, 62, 0, 0,
            'right', 'bottom'
        )
        this.maticMenuBtn.uiImage.isPointerBlocker = true

        this.maticMenuBtn.uiImage.onClick = new OnClick(() => {
            
            soundResources.click.getComponent(AudioSource).playOnce()
            if (this.state) {
                this.controller.hideAll()
                this.showMaticMenu()
                log('MATIC MENU SHOW', this.state)
            }
            else {
                this.hideMaticMenu()
                log('MATIC MENU HIDE', this.state)
            }
        })

    }
}