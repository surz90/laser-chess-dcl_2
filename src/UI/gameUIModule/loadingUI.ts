import { GameImageUI } from "../basicUIModule/imageModule"
import { GameRectUI } from "../basicUIModule/rectModule"
import utils from "../../../node_modules/decentraland-ecs-utils/index"

export class LoadingUI {
    UIEvents: EventManager
    texture: object

    loadIntervalEntity: Entity

    rectLoading: GameRectUI

    dotPos: number = -100
    loadingDotImg: GameImageUI[] = []
    dotMoveImg: GameImageUI

    constructor(canvas, UIEvents, texture) {
        this.UIEvents = UIEvents
        this.texture = texture

        this.loadTexture(canvas, texture)
    }

    showLoading() {
        this.rectLoading.show()

        this.loadIntervalEntity = new Entity()
        this.loadIntervalEntity.addComponentOrReplace(new utils.Interval(500, () => {
            this.dotMoveImg.changePos(this.dotPos, 0)

            this.dotPos += 50
            if (this.dotPos === 150) this.dotPos = -100
        }))

        if(!this.loadIntervalEntity.alive)
            engine.addEntity(this.loadIntervalEntity)
    }

    hideLoading() {
        this.rectLoading.hide()
        this.dotPos = -100
        this.dotMoveImg.changePos(this.dotPos, 0)

        if (this.loadIntervalEntity.alive)
            engine.removeEntity(this.loadIntervalEntity)
    }

    loadTexture(canvas, texture) {
        this.rectLoading = new GameRectUI(canvas, 1, Color4.Clear(), 0, -200, 500, 50, 'top', 'center')

        for (let i = -2; i <= 2; i++) {
            let posX = 50 * i
            this.loadingDotImg[0] = new GameImageUI(
                this.rectLoading , texture.UITexture1,
                11, 461, 45, 45, 45, 45, posX, 0,
                'center', 'center'
            )
            //this.loadingDotImg[i].show()
        }

        this.dotMoveImg = new GameImageUI(
            this.rectLoading , texture.UITexture1,
            64, 461, 45, 45, 45, 45, -100, 0,
            'center', 'center'
        )
    }
}
