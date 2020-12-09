import { ThemeShopUI } from "./menuUIModule/themeShopUI"
import { InfoMenuUI } from "./menuUIModule/infoMenu"
import { ModeMenuUI } from "./menuUIModule/modeMenu"
import { MaticMenuUI } from "./menuUIModule/maticMenu"

export class MainMenuUI {
    UIEvents: EventManager
    texture: object

    themeShopUI: ThemeShopUI
    modeMenuUI: ModeMenuUI
    infoMenuUI: InfoMenuUI
    maticMenuUI: MaticMenuUI

    constructor(canvas, UIEvents, texture) {
        this.themeShopUI = new ThemeShopUI(canvas, UIEvents, texture, this)
        this.modeMenuUI = new ModeMenuUI(canvas, UIEvents, texture, this)
        this.infoMenuUI = new InfoMenuUI(canvas, UIEvents, texture, this)
        this.maticMenuUI = new MaticMenuUI(canvas, UIEvents, texture, this)
    }
    hideAll() {
        this.themeShopUI.hideSHop()
        this.modeMenuUI.hideMode()
        this.infoMenuUI.hideInfo()
        this.maticMenuUI.hideMaticMenu()
    }
}