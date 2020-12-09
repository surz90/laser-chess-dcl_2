import { GameImageUI } from "../basicUIModule/imageModule"
import { GameTextUI } from "../basicUIModule/textModule"
import { GameRectUI } from "../basicUIModule/rectModule"

export class ServerNotifUI {
	UIEvents: EventManager
	texture: object

	///////////////////////////////
	notifImg: GameImageUI
	notifText: GameTextUI

	constructor(canvas, UIEvents, texture) {
		this.UIEvents = UIEvents
		this.texture = texture

		this.loadTexture(canvas, texture)
	}

	setNotif(msgStr, msgFontSize = 40) {
		this.notifImg.show()
		this.notifText.changeText(msgStr, msgFontSize)
		this.notifText.show()
	}
	unsetNotif() {
		this.notifImg.hide()
		this.notifText.hide()
	}

	loadTexture(canvas, texture) {
		const rectNotif = new GameRectUI(canvas, 1, Color4.Clear(), 0, 0, 512, 127, 'center', 'center')
		rectNotif.show()

		this.notifImg = new GameImageUI(
			rectNotif, texture.UITexture2,
			0, 225, 512, 123, 512, 123, 0, 0,
			'center', 'center'
		)

		const notifTextRect = new GameRectUI(rectNotif.rect, 0.8, Color4.Clear(), 0, 10, 512, 108, 'center', 'center')
		notifTextRect.show()

		this.notifText = new GameTextUI(
			notifTextRect, '---', Color4.Black(), 40, 0, 0,
			'center', 'center'
		)
		//this.notifText.uiText.adaptHeight = true
		//this.notifText.uiText.adaptWidth = true
		/*
		this.notifText.uiText.width = 512
		this.notifText.uiText.height = 102
		log(this.notifText.uiText.width, this.notifText.uiText.height)
		this.notifText.uiText.textWrapping = true
		*/
		this.notifText.show()
	}
}
