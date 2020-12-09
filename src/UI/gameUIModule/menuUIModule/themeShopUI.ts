import { GameRectUI } from "../../basicUIModule/rectModule"
import { GameImageUI } from "../../basicUIModule/imageModule"
import { ChangeThemeEvent } from "../../UIEventReceiver"
import { GameTheme } from "../../../gameTypes"
import { MainMenuUI } from "../mainMenu"
import { GameTextUI } from "../../basicUIModule/textModule"
import { ThemeBuyMenu } from "./themeBuyMenu"
import { themeData } from "../../../gameData/themeData"
import { WSSHandler } from "../../../serverEvent/websocketHandler"

import * as matic from "../../../../node_modules/@dcl/l2-utils/matic/index"
import soundResources from "../../../resources/soundResources"

export class ThemeShopUI {
    controller: MainMenuUI
    state: boolean =  true

    UIEvents: EventManager
    texture: object

    themeBuyMenu: ThemeBuyMenu

    shopBtnRect: GameRectUI
    shopBtnImg: GameImageUI

    shopMenuRect: GameRectUI
    title: GameImageUI
    menuTheme1: GameImageUI
    menuTheme2: GameImageUI
    menuTheme2Info: GameTextUI
    menuTheme3: GameImageUI
    menuTheme3Info: GameTextUI
    menuTheme4: GameImageUI
    menuTheme4Info: GameTextUI
    buyBtn: GameImageUI
    useBtn: GameImageUI

    constructor(canvas, UIEvents, texture, controller) {
        this.UIEvents = UIEvents
        this.texture = texture
        this.controller = controller
        this.loadTexture(canvas, texture)

        this.themeBuyMenu = new ThemeBuyMenu(canvas, UIEvents, texture, controller)
    }

    showShop() {
        this.shopMenuRect.show()
        this.state = false
        this.themeBuyMenu.hideBuyUI()
    }

    hideSHop() {
        this.shopMenuRect.hide()
        this.state = true
        this.themeBuyMenu.hideBuyUI()
    }

    loadTexture(canvas, texture) {

        this.shopBtnRect = new GameRectUI(canvas, 1, Color4.Clear(), 0, 240, 77, 62, 'bottom', 'right')
        this.shopBtnRect.show()
        this.shopBtnRect.rect.isPointerBlocker = true

        this.shopBtnImg = new GameImageUI(
            this.shopBtnRect, texture.UITexture3,
            384, 77, 77, 62, 77, 62, 0, 0,
            'right', 'bottom'
        )
        this.shopBtnImg.uiImage.isPointerBlocker = true


        this.shopMenuRect = new GameRectUI(canvas, 1, Color4.Clear(), -71, 240, 150, 140, 'bottom', 'right')
        this.shopMenuRect.hide()
        this.shopMenuRect.rect.isPointerBlocker = true

        this.title = new GameImageUI(
            this.shopMenuRect, texture.UITexture3,
            0, 48, 130, 23, 130, 23, 0, 140,
            'left', 'bottom'
        )

        this.menuTheme1 = new GameImageUI(
            this.shopMenuRect, texture.UITexture3,
            229, 229, 147, 29, 147, 29, 0, 105,
            'left', 'bottom'
        )
        this.menuTheme1.uiImage.isPointerBlocker = true

        this.menuTheme2 = new GameImageUI(
            this.shopMenuRect, texture.UITexture3,
            229, 260, 147, 29, 147, 29, 0, 70,
            'left', 'bottom'
        )
        this.menuTheme2.uiImage.isPointerBlocker = true

        //this.menuTheme2Info = new GameTextUI(
        //    this.shopMenuRect, 'COMING SOON', Color4.Red(), 14, -150, 70, 'right', 'bottom'
        //)


        this.menuTheme3 = new GameImageUI(
            this.shopMenuRect, texture.UITexture3,
            229, 291, 147, 29, 147, 29, 0, 35,
            'left', 'bottom'
        )
        this.menuTheme3.uiImage.isPointerBlocker = true

        //this.menuTheme3Info = new GameTextUI(
        //    this.shopMenuRect, 'FREE TRIAL', Color4.Green(), 14, -150, 35, 'right', 'bottom'
        //)

        this.menuTheme4 = new GameImageUI(
            this.shopMenuRect, texture.UITexture3,
            229, 322, 150, 28, 150, 29, 0, 0,
            'left', 'bottom'
        )
        this.menuTheme4.uiImage.isPointerBlocker = true

        //this.menuTheme4Info = new GameTextUI(
        //   this.shopMenuRect, 'COMING SOON', Color4.Red(), 14, -150, 0, 'right', 'bottom'
        //)

        this.shopBtnImg.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (this.state) {
                this.controller.hideAll()
                this.showShop()
            }
            else this.hideSHop()
        })

        this.menuTheme1.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (WSSHandler.getReadyState() !== WebSocket.OPEN) return

            this.themeBuyMenu.hideBuyUI()
            log('THEME 1')
            /*
            if (themeData.getAvailableTheme().indexOf(GameTheme.THEME1) !== -1) {
                log('theme 1 available')
            }
            else {
                log('theme 1 not available')
            }
            let themeDat = themeData.getThemeList().THEME1
            this.themeBuyMenu.setBuyUI(GameTheme.THEME1, themeDat.price, themeDat.price * 2, '---')
            this.hideSHop()
            */
            this.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME1))
        })
        this.menuTheme2.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (WSSHandler.getReadyState() !== WebSocket.OPEN) return

            this.themeBuyMenu.hideBuyUI()
            log('THEME 2')
            /*
            if (themeData.getAvailableTheme().indexOf(GameTheme.THEME2) !== -1) {
                log('theme 2 available')
            }
            else {
                log('theme 2 not available')
            }
            let themeDat = themeData.getThemeList().THEME2
            this.themeBuyMenu.setBuyUI(GameTheme.THEME2, themeDat.price, themeDat.price * 2, '---')
            this.hideSHop()
            */
            this.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME2))
        })
        this.menuTheme3.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (WSSHandler.getReadyState() !== WebSocket.OPEN) return

            this.themeBuyMenu.hideBuyUI()
            log('THEME 3')

            if (themeData.getAvailableTheme().indexOf(GameTheme.THEME3) !== -1) {
                this.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME3))
                log('theme 3 available')
            }
            else {
                log('theme 3 not available')
                let themeDat = themeData.getThemeList().THEME3
                this.themeBuyMenu.setBuyUI(GameTheme.THEME3, themeDat.priceMatic, themeDat.priceEth, '---')
            }
        })
        this.menuTheme4.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()

            if (WSSHandler.getReadyState() !== WebSocket.OPEN) return

            this.themeBuyMenu.hideBuyUI()
            log('THEME 4')

            if (themeData.getAvailableTheme().indexOf(GameTheme.THEME4) !== -1) {
                this.UIEvents.fireEvent(new ChangeThemeEvent(GameTheme.THEME4))
            }
            else {
                log('theme 4 not available')
                let themeDat = themeData.getThemeList().THEME4
                this.themeBuyMenu.setBuyUI(GameTheme.THEME4, themeDat.priceMatic, themeDat.priceEth, '---')
            }
        })
    }
}