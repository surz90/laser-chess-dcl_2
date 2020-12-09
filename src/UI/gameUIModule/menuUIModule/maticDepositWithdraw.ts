import { GameImageUI } from "../../basicUIModule/imageModule"
import { GameTextUI } from "../../basicUIModule/textModule"
import { GameRectUI } from "../../basicUIModule/rectModule"
import { userData } from "../../../gameData/userData"

//import * as layerTwo from "../../../../node_modules/@dcl/l2-utils/index"
import * as matic from "../../../../node_modules/@dcl/l2-utils/matic/index"
import soundResources from "../../../resources/soundResources"

export class MaticDepositWithdraw {
    UIEvents: EventManager
    texture: object

    isTransaction: boolean = false

    rectMaticMenu: GameRectUI

    maticMenuBg: GameImageUI
    manaETHBal: GameTextUI
    manaMATICBal: GameTextUI

    depositBtn: GameRectUI
    withdrawBtn: GameRectUI
    refreshBtn: GameRectUI

    depositMenuRect: GameRectUI
    depositValue: number | null
    depositInputRect: GameRectUI
    depositInputTxt: UIInputText

    withdrawMenuRect: GameRectUI
    withdrawValue: number | null
    withdrawInputRect: GameRectUI
    withdrawInputTxt: UIInputText

    gotoMaticWalletBtn: GameImageUI

    rectNotif: GameRectUI
    notif: GameTextUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
        this.updateMaticBalance()
        log('Game Info UI Success')
    }

    updateMaticBalance() {
        if (this.depositMenuRect) this.depositMenuRect.hide()
        if (this.withdrawMenuRect) this.withdrawMenuRect.hide()

        if (!this.isTransaction) {
            executeTask(async () => {
                this.notif.changeColor(Color4.Yellow())
                this.notif.changeText('updating balance')
                this.rectNotif.show()

                this.isTransaction = true
                const network = 'mainnet'

                const balance = await matic.balance(userData.getUserEth(), network)
                log('address: ', userData.getUserEth(), ' balance :', balance)

                log('MANA (ETH Network): ', balance.l1)
                log('MANA (MATIC Network): ', balance.l2)

                this.manaETHBal.changeText(Number(balance.l1).toFixed(2).toString() + ' MANA')
                this.manaMATICBal.changeText(Number(balance.l2).toFixed(2).toString() + ' MANA')

            })
                .then(() => {
                    this.isTransaction = false
                    this.notif.changeText('')
                    this.rectNotif.hide()
                    log('request balance done')
                })
                .catch(() => {
                    this.isTransaction = false
                    this.notif.changeColor(Color4.Red())
                    this.notif.changeText('failed to fetch user balance')
                    this.rectNotif.show()
                })
        }
        else {
            log('you have pending transaction')
        }
    }

    depositMatic(value: number) {
        if (!this.isTransaction) {
            executeTask(async () => {
                this.notif.changeColor(Color4.Yellow())
                this.notif.changeText('DEPOSIT TO MATIC NETWORK\n<confirm all your transactions \non the Metamask wallet>')
                this.rectNotif.show()
                this.isTransaction = true

                const network = 'mainnet'
                matic.depositMana(value, network)
                    .then((value) => {
                        this.isTransaction = false
                        this.notif.changeText('')
                        this.rectNotif.hide()
                        log('transaction log: ', value)
                        this.updateMaticBalance()
                    })
                    .catch((err) => {
                        this.isTransaction = false
                        this.notif.changeColor(Color4.Red())
                        this.notif.changeText('deposit to Matic Network failed')
                        this.rectNotif.show()
                        log('transaction failed: ', err)
                    })
            })
        }
        else {
            log('you have pending transaction')
        }
    }

    withrawfromMatic() {
        if (!this.isTransaction) {
        }
        else {
            log('you have pending transaction')
        }
    }

    showMaticMenu() {
        this.rectMaticMenu.show()
        if(!this.isTransaction) this.updateMaticBalance()
    }

    hideMaticMenu() {
        this.rectMaticMenu.hide()
        if (this.depositMenuRect) this.depositMenuRect.hide()
        if (this.withdrawMenuRect) this.withdrawMenuRect.hide()
    }

    createDepositInputBox(texture) {
        this.depositValue = null

        if (this.depositMenuRect) this.depositMenuRect.hide()
        if (this.withdrawMenuRect) this.withdrawMenuRect.hide()

        this.depositMenuRect = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 0, -290, 243, 66, 'top', 'left')
        this.depositMenuRect.rect.isPointerBlocker = true
        this.depositMenuRect.show()
        const depositMenuImg = new GameImageUI(
            this.depositMenuRect, texture.UITexture6,
            2, 291, 243, 66, 243, 66, 0, 0,
            'center', 'center'
        )

        this.depositInputRect = new GameRectUI(this.depositMenuRect.rect, 1, Color4.Clear(), 12, -25, 144, 31, 'top', 'left')
        this.depositInputRect.rect.isPointerBlocker = true
        this.depositInputRect.show()

        this.depositInputTxt = new UIInputText(this.depositInputRect.rect)
        this.depositInputTxt.placeholder = "MANA amount"
        this.depositInputTxt.placeholderColor = Color4.Gray()
        this.depositInputTxt.color = Color4.White()
        this.depositInputTxt.vTextAlign = 'center'
        this.depositInputTxt.hTextAlign = 'center'

        this.depositInputTxt.background = Color4.Blue()
        this.depositInputTxt.width = "100%"
        this.depositInputTxt.height = "100%"

        this.depositInputTxt.vAlign = "center"
        this.depositInputTxt.hAlign = "center"
        this.depositInputTxt.fontSize = 18

        this.depositInputTxt.onChanged = new OnChanged((data: { value: string }) => {
            this.depositValue = +data.value
        })

        const depositBtnRect = new GameRectUI(this.depositMenuRect.rect, 1, Color4.Clear(), 170, -25, 65, 31, 'top', 'left')
        depositBtnRect.rect.isPointerBlocker = true
        depositBtnRect.show()

        const depositBntImg = new GameImageUI(
            depositBtnRect, texture.UITexture6,
            1, 358, 65, 31, 65, 31, 0, 0,
            'center', 'center'
        )
        depositBntImg.uiImage.isPointerBlocker = true

        depositBntImg.uiImage.onClick = new OnClick(() => {
            
            soundResources.click.getComponent(AudioSource).playOnce()
            if (!isNaN(this.depositValue)) {
                log('deposit value: ', this.depositValue)
                this.depositMatic(this.depositValue)
            }
            else {
                log('deposit input not valid, please input only number')
            }
            this.depositMenuRect.hide()
        })
    }

    createWithdrawInputBox(texture) {
        this.withdrawValue = null

        if (this.depositMenuRect) this.depositMenuRect.hide()
        if (this.withdrawMenuRect) this.withdrawMenuRect.hide()

        this.withdrawMenuRect = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 0, -290, 243, 66, 'top', 'left')
        this.withdrawMenuRect.rect.isPointerBlocker = true
        this.withdrawMenuRect.show()
        const withdrawMenuImg = new GameImageUI(
            this.withdrawMenuRect, texture.UITexture6,
            2, 390, 243, 66, 243, 66, 0, 0,
            'center', 'center'
        )

        this.gotoMaticWalletBtn = new GameImageUI(
            this.withdrawMenuRect, texture.UITexture6,
            136, 363, 120, 22, 120, 22, 0, 7,
            'center', 'bottom')

        this.gotoMaticWalletBtn.uiImage.isPointerBlocker = true

        this.gotoMaticWalletBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            openExternalURL('https://wallet.matic.network/')
            this.withdrawMenuRect.hide()
        })

        /*
        this.withdrawInputRect = new GameRectUI(this.withdrawMenuRect.rect, 1, Color4.Clear(), 12, -25, 144, 31, 'top', 'left')
        this.withdrawInputRect.rect.isPointerBlocker = true
        this.withdrawInputRect.show()

        this.withdrawInputTxt = new UIInputText(this.withdrawInputRect.rect)
        this.withdrawInputTxt.placeholder = "MANA amount"
        this.withdrawInputTxt.placeholderColor = Color4.Gray()
        this.withdrawInputTxt.color = Color4.White()
        this.withdrawInputTxt.vTextAlign = 'center'
        this.withdrawInputTxt.hTextAlign = 'center'

        this.withdrawInputTxt.background = Color4.Blue()
        this.withdrawInputTxt.width = "100%"
        this.withdrawInputTxt.height = "100%"

        this.withdrawInputTxt.vAlign = "center"
        this.withdrawInputTxt.hAlign = "center"
        this.withdrawInputTxt.fontSize = 18

        this.withdrawInputTxt.onChanged = new OnChanged((data: { value: string }) => {
            this.withdrawValue = +data.value
        })

        const withdrawBtnRect = new GameRectUI(this.withdrawMenuRect.rect, 1, Color4.Clear(), 170, -25, 65, 31, 'top', 'left')
        withdrawBtnRect.rect.isPointerBlocker = true
        withdrawBtnRect.show()

        const withdrawBntImg = new GameImageUI(
            withdrawBtnRect, texture.UITexture6,
            1, 358, 65, 31, 65, 31, 0, 0,
            'center', 'center'
        )
        withdrawBntImg.uiImage.isPointerBlocker = true

        withdrawBntImg.uiImage.onClick = new OnClick(() => {
            if (!isNaN(this.depositValue)) {
                log('withdraw value: ', this.depositValue)
                this.withrawfromMatic()
                //this.depositMatic(this.depositValue)
            }
            else {
                log('withdraw input not valid, please input only number')
            }
            this.withdrawMenuRect.hide()
        })
        */
    }

    loadTexture(canvas, texture) {
        this.rectMaticMenu = new GameRectUI(canvas, 1, Color4.Clear(), -100, 27, 241, 357, 'bottom', 'right')
        this.rectMaticMenu.rect.isPointerBlocker = true
        this.rectMaticMenu.hide()

        this.rectNotif = new GameRectUI(this.rectMaticMenu.rect, 0.8, Color4.Black(), 0, 60, 240, 50, 'top', 'center')
        this.rectNotif.show()
        this.notif = new GameTextUI(
            this.rectNotif, '---', Color4.Yellow(), 14, 0, 0, 'center', 'center'
        )

        this.maticMenuBg = new GameImageUI(
            this.rectMaticMenu, texture.UITexture6,
            2, 2, 241, 285, 241, 285, 0, 0,
            'left', 'top'
        )

        const manaEthRect = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 0, -68, 220, 50, 'top', 'center')
        manaEthRect.show()
        this.manaETHBal = new GameTextUI(
            manaEthRect, '--- MANA', Color4.Black(), 22, 0, 0, 'center', 'center'
        )

        const manaMaticRect = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 0, -185, 220, 50, 'top', 'center')
        manaMaticRect.show()
        this.manaMATICBal = new GameTextUI(
            manaMaticRect, '--- MANA', Color4.Yellow(), 22, 0, 0, 'center', 'center'
        )

        this.depositBtn = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 30, -115, 60, 60, 'top', 'left')
        this.depositBtn.rect.isPointerBlocker = true
        this.depositBtn.show()
        const depoBtn = new GameImageUI(
            this.depositBtn, texture.UITexture6,
            272, 5, 55, 55, 55, 55, 0, 0,
            'center', 'center'
        )
        depoBtn.uiImage.isPointerBlocker = true

        this.withdrawBtn = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), -30, -115, 60, 60, 'top', 'right')
        this.withdrawBtn.rect.isPointerBlocker = true
        this.withdrawBtn.show()
        const wdBtn = new GameImageUI(
            this.withdrawBtn, texture.UITexture6,
            338, 5, 55, 55, 55, 55, 0, 0,
            'center', 'center'
        )
        wdBtn.uiImage.isPointerBlocker = true

        this.refreshBtn = new GameRectUI(this.rectMaticMenu.rect, 1, Color4.Clear(), 0, -115, 60, 60, 'top', 'center')
        this.refreshBtn.rect.isPointerBlocker = true
        this.refreshBtn.show()
        const rfBtn = new GameImageUI(
            this.refreshBtn, texture.UITexture6,
            402, 5, 55, 55, 55, 55, 0, 0,
            'center', 'center'
        )
        rfBtn.uiImage.isPointerBlocker = true

        depoBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            //this.depositMatic(100)
            if (!this.isTransaction) {
                this.createDepositInputBox(texture)
            }
        })

        wdBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            if (!this.isTransaction) {
                this.createWithdrawInputBox(texture)

                /*
                this.isTransaction = true

                executeTask(async () => {
                    layerTwo.matic.sendMana('0x9Dc7f48F3c418e7F22042771A0Cb18234192E939', 5, true)
                        .then((value) => {
                            log('transaction log: ', value)
                            this.isTransaction = false
                        })
                        .catch((err) => {
                            log('withdrawal failed')
                            this.isTransaction = false
                        })
                })
                */
            }
        })

        rfBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            this.updateMaticBalance()
        })
    }
}
