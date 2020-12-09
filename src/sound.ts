
export class Sound extends Entity {
    constructor(audio: AudioClip, loop: boolean, transform?: Vector3) {
        super()
        engine.addEntity(this)
        this.addComponent(new AudioSource(audio))
        this.getComponent(AudioSource).loop = loop
        this.addComponent(new Transform())
        if (transform) {
            this.getComponent(Transform).position = transform
        } else {
            this.getComponent(Transform).position = Camera.instance.position
        }
    }

    playAudioAtPosition(transform: Vector3): void {
        this.getComponent(Transform).position = transform
        this.getComponent(AudioSource).playOnce()
    }

    setVolume(_volume: number) {
        this.getComponent(AudioSource).volume = _volume
    }
}