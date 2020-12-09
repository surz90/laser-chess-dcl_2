import { GamePos } from "../gameTypes";
import { genFunc } from "../genFunc/genFunc";

export class pieceIcon extends Entity {
    yOffset = 2.5
    constructor(pieceIcon: GLTFShape) {
        super()
        this.addComponent(pieceIcon)
        this.addComponent(new Transform({
            position: new Vector3(16, this.yOffset, 16),
            scale: new Vector3(0, 0, 0)
        }))
        engine.addEntity(this)
    }
    calcDiffRotation(_orientationOrigin: Orientation, _orientationTarget: Orientation) {
        let diff = _orientationTarget - _orientationOrigin
        return diff * 90
    }

    setPosRot(chessPos: GamePos, orientation: Orientation) {
        this.getComponent(Transform).position = genFunc.chessPosToWorldPos(chessPos, new Vector3(16, this.yOffset, 16), 1)
        this.getComponent(Transform).rotation.setEuler(
            0,
            this.calcDiffRotation(0, orientation),
            0
        )
    }
    show() {
        this.getComponent(Transform).scale.setAll(1)
    }
    hide() {
        this.getComponent(Transform).scale.setAll(0)
    }
}