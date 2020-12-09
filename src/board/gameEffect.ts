import { GameColor } from "../gameTypes"
import { HitRes } from "../khet/gameTypes"

export class GameEffectAnimation {
    effectModel: Entity = new Entity()
    effectAnimator: Animator = new Animator()
    clipAnim: AnimationState[] = []

    modelScale: number = 0

    constructor(model: GLTFShape, color: GameColor, effectType: HitRes) {
        //add GLTF model
        this.effectModel.addComponent(model)

        this.effectModel.addComponent(new Transform({
            position: new Vector3(16, 0, 16),
            scale: Vector3.Zero()
        }))

        this.effectModel.addComponent(this.effectAnimator)

        engine.addEntity(this.effectModel)
        this.addClip(color, effectType)
    }
    setPos(pos: Vector3, scale: number = 1, rot: Quaternion = Quaternion.Identity) {
        //add position
        this.effectModel.addComponentOrReplace(new Transform({
            position: pos.add(new Vector3(0, -0.5 * scale, 0)),
            rotation: rot,
            scale: Vector3.Zero()
        }))

        this.modelScale = scale
    }
    addClip(color: GameColor, effectType: HitRes) {
        let name: string = ''
        let numberOfClip = 0
        let animationSpeed = 1

        if (effectType === HitRes.HIT) {
            numberOfClip = 60
            animationSpeed = 3.5
            if (color === GameColor.SILVER)
                name = 'action'
            if (color === GameColor.RED)
                name = 'redaction'
        }
        if (effectType === HitRes.BLOCK) {
            numberOfClip = 46
            animationSpeed = 3.5
            if (color === GameColor.SILVER)
                name = 'silver_shieldaction'
            if (color === GameColor.RED)
                name = 'red_shieldaction'
        }
        if (effectType === HitRes.OUT) {
            numberOfClip = 60
            animationSpeed = 3.5
            if (color === GameColor.SILVER)
                name = 'silver_outaction'
            if (color === GameColor.RED)
                name = 'red_outaction'
        }

        for (let i = 0; i < numberOfClip; i++) {
            let animationName = name + i.toString()
            //log(animationName)
            this.clipAnim.push(new AnimationState(animationName))
            this.clipAnim[i].speed = animationSpeed
            this.clipAnim[i].looping = false
            this.effectAnimator.addClip(this.clipAnim[i])
        }
        this.resetAnim()
    }
    resetAnim() {
        for (let i = 0; i < this.clipAnim.length; i++) {
            this.clipAnim[i].reset()
        }
    }
    playAnim() {
        this.resetAnim()
        for (let i = 0; i < this.clipAnim.length; i++) {
            this.clipAnim[i].play()
        }
        this.effectModel.getComponent(Transform).scale.setAll(this.modelScale)
    }
}
