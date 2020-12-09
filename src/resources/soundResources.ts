import { Sound } from "../sound";

export default {
    music: new Sound(new AudioClip("sounds/gameplaymusic.mp3"), true),
    shot: new Sound(new AudioClip("sounds/lasershot.mp3"), false),
    destroy: new Sound(new AudioClip("sounds/tilecollapse.mp3"), false),
    click: new Sound(new AudioClip("sounds/click.mp3"), false),
    join: new Sound(new AudioClip("sounds/join.mp3"), false),
    move: new Sound(new AudioClip("sounds/move.mp3"), false),
    hover: new Sound(new AudioClip("sounds/hover.mp3"), false)
}