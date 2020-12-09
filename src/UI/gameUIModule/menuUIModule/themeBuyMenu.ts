import { GameRectUI } from "../../basicUIModule/rectModule"
import { GameImageUI } from "../../basicUIModule/imageModule"
import { UIEVentReceiver } from "../../UIEventReceiver"
import { ResourceController } from "../../../resources/resourcesController"
import { GameTextUI } from "../../basicUIModule/textModule"

import * as matic from "../../../../node_modules/@dcl/l2-utils/matic/index"
import * as mana from '../../../../node_modules/@dcl/crypto-utils/mana/index'

import { ClientMethod, WSSHandler } from "../../../serverEvent/websocketHandler"
import { userData } from "../../../gameData/userData"
import soundResources from "../../../resources/soundResources"


export class ThemeBuyMenu {
    canvas: UICanvas
    UIEvents: UIEVentReceiver
    texture: any
    controller: ResourceController

    manaPriceMTC: number
    manaPriceETH: number
    theme: string
    UIposx: number
    UIposy: number

    themeBuyRect: GameRectUI
    themeBuyImg: GameImageUI

    NFTlink: GameTextUI
    manaMTC: GameTextUI
    manaMTCBtn: GameImageUI
    manaETH: GameTextUI
    manaETHBtn: GameImageUI
    themeTxt: GameTextUI

    rectNotif: GameRectUI
    notif: GameTextUI

    constructor(canvas, UIEvents, texture, controller) {
        this.canvas = canvas
        this.UIEvents = UIEvents
        this.texture = texture
        this.controller = controller

        this.loadTexture(canvas, texture)
    }
    loadTexture(canvas, texture) {

        this.themeBuyRect = new GameRectUI(this.canvas, 1, Color4.Green(), 0, 0, 435, 90, 'center', 'center')
        this.themeBuyRect.rect.isPointerBlocker = true
        this.themeBuyRect.hide()

        this.rectNotif = new GameRectUI(this.themeBuyRect.rect, 0.8, Color4.Black(), 0, 35, 435, 30, 'top', 'center')
        this.rectNotif.show()
        this.notif = new GameTextUI(
            this.rectNotif, '', Color4.Yellow(), 14, 0, 0, 'center', 'center'
        )

        // 5 320 435 90
        this.themeBuyImg = new GameImageUI(
            this.themeBuyRect, this.texture.UITexture5,
            5, 320, 435, 90, 435, 90, 0, 0,
            'center', 'center'
        )

        this.manaMTCBtn = new GameImageUI(
            this.themeBuyRect, texture.UITexture5,
            151, 287, 132, 28, 132, 28, 0, 0,
            'right', 'top'
        )
        this.manaMTCBtn.uiImage.isPointerBlocker = true

        const manaMTCRect = new GameRectUI(this.themeBuyRect.rect, 0.8, Color4.Red(), -21, -7, 95, 28, 'top', 'right')
        manaMTCRect.show()
        this.manaMTC = new GameTextUI(manaMTCRect, '--- MANA', Color4.Black(), 18, 0, 0, 'center', 'center')


        this.manaETHBtn = new GameImageUI(
            this.themeBuyRect, texture.UITexture5,
            4, 287, 132, 28, 132, 28, 0, 0,
            'right', 'bottom'
        )
        this.manaETHBtn.uiImage.isPointerBlocker = true

        const manaETHRect = new GameRectUI(this.themeBuyRect.rect, 0.8, Color4.Red(), -21, -54, 95, 28, 'top', 'right')

        manaETHRect.show()
        this.manaETH = new GameTextUI(manaETHRect, '--- MANA', Color4.Black(), 18, 0, 0, 'center', 'center')
        
        const themeTextRect = new GameRectUI(this.themeBuyRect.rect, 0.8, Color4.Red(), 15, -3, 200, 22, 'top', 'left')
        themeTextRect.show()
        this.themeTxt = new GameTextUI(themeTextRect, '--- THEME', Color4.Black(), 18, 0, 0, 'left', 'top')


        this.manaMTCBtn.uiImage.onClick = new OnClick(() => {
            
            soundResources.click.getComponent(AudioSource).playOnce()
            this.manaETHBtn.hide()
            this.manaMTCBtn.hide()
            log('buy using matic clicked', this.manaPriceMTC)
            this.notif.changeText('please confirm transaction in your Metamask to continue')

            matic.sendMana('0x9Dc7f48F3c418e7F22042771A0Cb18234192E939', this.manaPriceMTC, true)
                .then((result: any) => {
                    log('transaction result: ', result)
                    
                    //inform server transaction hash
                    WSSHandler.sendMsg({
                        method: ClientMethod.BUYTHEME,
                        data: {
                            theme: this.theme,
                            chain: "MATIC",
                            tx: result.txId,
                            sender: userData.getUserEth()
                        }
                    })
                    this.notif.changeText('transaction done, thank you!')
                })
                .catch((err) => {
                    this.notif.changeText('transaction rejected!')
                    log('can not create transaction: ', err)
                })
        })
        this.manaETHBtn.uiImage.onClick = new OnClick(() => {
            this.manaETHBtn.hide()
            this.manaMTCBtn.hide()
            log('buy using ethereum clicked', this.manaPriceETH)
            this.notif.changeText('please confirm transaction in your Metamask to continue')

            mana.send('0x9Dc7f48F3c418e7F22042771A0Cb18234192E939', this.manaPriceETH)
                .then((result) => {
                    log('transaction result: ', this.theme, result, userData.getUserEth())

                    //inform server transaction hash
                    WSSHandler.sendMsg({
                        method: ClientMethod.BUYTHEME,
                        data: {
                            theme: this.theme,
                            chain: "ETH",
                            tx: result,
                            sender: userData.getUserEth()
                        }
                    })
                    this.notif.changeText('transaction done, waiting confirmation!')
                })
                .catch((err) => {
                    log('can not create transaction: ', err)
                })
        })
    }
    setBuyUI(_theme: string, _manaMTC: number, _manaETH: number, _NFTlink: string) {
        this.notif.changeText('')

        this.theme = _theme
        this.manaPriceMTC = _manaMTC
        this.manaPriceETH = _manaETH

        log(this.theme, this.manaPriceMTC, this.manaPriceETH)

        this.manaMTC.changeText(_manaMTC.toString() + ' MANA')
        this.manaETH.changeText(_manaETH.toString() + ' MANA')
        this.themeTxt.changeText(_theme + ' THEME')

        this.manaETHBtn.show()
        this.manaMTCBtn.show()

        this.themeBuyRect.show()
    }
    hideBuyUI() {
        this.themeBuyRect.hide()
        this.manaMTC.changeText('--- MANA')
        this.manaETH.changeText('--- MANA')
        this.themeTxt.changeText('--- THEME')
    }
    buyTheme() {

    }
    _sendMatic() {

    }
}