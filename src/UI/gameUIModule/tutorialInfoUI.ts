import { GameRectUI } from "../basicUIModule/rectModule"
import { GameImageUI } from "../basicUIModule/imageModule"
import { ChangeThemeEvent, TutorialBtnEvent } from "../UIEventReceiver"
import { GameTheme, PieceType } from "../../gameTypes"
import { MainMenuUI } from "./mainMenu"
import { GameTextUI } from "../basicUIModule/textModule"
import soundResources from "../../resources/soundResources"

export class TutorialInfoUI {
    UIEvents: EventManager
    texture: object

    loadIntervalEntity: Entity

    tutorialNotifBg: GameImageUI
    tutorialNotifTxt: GameTextUI

    tutorialImgSphinx: GameImageUI
    tutorialImgPharaoh: GameImageUI
    tutorialImgPyramid: GameImageUI
    tutorialImgScarab: GameImageUI
    tutorialImgAnubis: GameImageUI

    tutorialImgEnd: GameImageUI

    tutorialQuestBg: GameImageUI
    tutorialQuestTxt: GameTextUI

    nextBtn: GameImageUI
    reloadBtn: GameImageUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
    }

    showNotif(notifTxt: string, size = 24) {
        this.tutorialNotifBg.show()
        this.tutorialNotifTxt.show()
        this.tutorialNotifTxt.changeText(notifTxt, size)
    }
    hideNotif() {
        this.tutorialNotifBg.hide()
        this.tutorialNotifTxt.hide()
    }

    showTutorial(piece: PieceType, questTxt: string) {
        this.hideTutorial()

        if (piece !== null) {
            this.tutorialQuestBg.show()
            this.tutorialQuestTxt.changeText(questTxt, 18)
        }

        if (questTxt === '')
            this.tutorialQuestTxt.hide()
        else
            this.tutorialQuestTxt.show()

        switch (piece) {
            case PieceType.SPHINX:
                this.tutorialImgSphinx.show()
                break
            case PieceType.PHARAOH:
                this.tutorialImgPharaoh.show()
                break
            case PieceType.PYRAMID:
                this.tutorialImgPyramid.show()
                break
            case PieceType.SCARAB:
                this.tutorialImgScarab.show()
                break
            case PieceType.ANUBIS:
                this.tutorialImgAnubis.show()
                break
            case null:
                this.tutorialImgEnd.show()
                break
        }

    }

    hideTutorial() {
        this.tutorialImgSphinx.hide()
        this.tutorialImgPharaoh.hide()
        this.tutorialImgPyramid.hide()
        this.tutorialImgScarab.hide()
        this.tutorialImgAnubis.hide()

        this.tutorialImgEnd.hide()
        this.tutorialNotifBg.hide()
        this.tutorialNotifTxt.hide()

        this.tutorialQuestBg.hide()
        this.tutorialQuestTxt.hide()
    }

    loadTexture(canvas, texture) {
        const rectNotif = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 1000, 74, 'top', 'center')
        rectNotif.show()

        this.tutorialNotifBg = new GameImageUI(
            rectNotif, texture.UITexture1,
            126, 438, 280, 74, 280 * 1.2, 74 * 1.2, 0, 0,
            'center', 'top'
        )
        this.tutorialNotifTxt = new GameTextUI(
            rectNotif, '---', Color4.Black(), 25,
            0, 0, 'center', 'center'
        )
        this.tutorialNotifBg.hide()
        this.tutorialNotifTxt.hide()


        const rectTutorialInfo = new GameRectUI(canvas, 0.9, Color4.Clear(), 20, -140, 1000, 300, 'top', 'left')
        rectTutorialInfo.show()

        this.tutorialImgSphinx = new GameImageUI(
            rectTutorialInfo, texture.UITexture4,
            2, 2, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        )
        this.tutorialImgSphinx.hide()

        this.tutorialImgPyramid = new GameImageUI(
            rectTutorialInfo, texture.UITexture4,
            2, 127, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        )
        this.tutorialImgPyramid.hide()

        this.tutorialImgScarab = new GameImageUI(
            rectTutorialInfo, texture.UITexture4,
            2, 253, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        )
        this.tutorialImgScarab.hide()

        this.tutorialImgAnubis = new GameImageUI(
            rectTutorialInfo, texture.UITexture4,
            2, 378, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        )
        this.tutorialImgAnubis.hide()

        this.tutorialImgPharaoh = new GameImageUI(
            rectTutorialInfo, texture.UITexture5,
            3, 2, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        )
        this.tutorialImgPharaoh.hide()

        this.tutorialImgEnd = new GameImageUI(
            rectTutorialInfo, texture.UITexture5,
            3, 127, 506, 122, 506, 122, 0, 0,
            'left', 'top'
        ) 
        this.tutorialImgEnd.hide()

        this.tutorialQuestBg = new GameImageUI(
            rectTutorialInfo, texture.UITexture3,
            2, 432, 279, 78, 279, 78, 20, -107,
            'left', 'top'
        )
        this.tutorialQuestBg.hide()

        const rectQuestTxt = new GameRectUI(
            canvas, 1, Color4.Clear(), 50, -265, 260, 60, 
            'top', 'left'
        )
        rectQuestTxt.show()
        this.tutorialQuestTxt = new GameTextUI(
            rectQuestTxt, '', Color4.Yellow(), 18, 0, 0,
            'center', 'center'
        )
        this.tutorialQuestTxt.hide()

        const rectBtn = new GameRectUI(canvas, 1, Color4.Clear(), 320, -265, 81, 70, 'top', 'left')
        rectBtn.rect.isPointerBlocker = true
        rectBtn.show()
        this.nextBtn = new GameImageUI(
            rectBtn, texture.UITexture3, 285, 481, 81, 29, 81, 29, 0, -30
        )
        this.nextBtn.uiImage.isPointerBlocker = true
        this.reloadBtn = new GameImageUI(
            rectBtn, texture.UITexture3, 284, 450, 81, 29, 81, 29, 0, 0
        )
        this.reloadBtn.uiImage.isPointerBlocker = true

        this.reloadBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            this.UIEvents.fireEvent(new TutorialBtnEvent('reload'))
        })

        this.nextBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            this.UIEvents.fireEvent(new TutorialBtnEvent('next'))
        })

        this.reloadBtn.hide()
        this.nextBtn.hide()
        //this.tutorialQuestTxt.uiText.textWrapping = true
    }
}