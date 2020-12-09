export enum PieceType {
    SPHINX,
    PHARAOH,
    PYRAMID,
    SCARAB,
    ANUBIS
}

export enum GameColor {
    SILVER,
    RED
}

export enum CellColor {
    SILVER,
    RED,
    NONE
}

export enum Orientation {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

export enum GameRotation {
	CW,
	CCW
}

export type GamePos = {
    row: number,
    col: number
}

export enum HitRes {
    PASS,
    REFLECT,
    HIT,
    BLOCK,
    OUT
}

export type LaserRes = {
    pos: GamePos,
    dir: Orientation,
    res: HitRes
}

export enum PlayerStatus {
    SILVER,
    RED,
    SPECTATOR
}

export enum GameTurn {
    SILVER,
    RED,
    LASER
}

export enum GameTheme {
    THEME1 = 'DEFAULT',
    THEME2 = 'RUINS',
    THEME3 = 'HALLOWEEN',
    THEME4 = 'POLAR'
}

export enum GameMode {
    NONE,
    TUTORIAL,
    SINGLEPLAYER,
    MULTIPLAYER
}

export enum GameState {
    STATE_SETUP, //waiting data from server and setup scene
    STATE_IDLE, //if no players is playing
    STATE_READY, //preparing the game after get 2 players playing
    STATE_PLAY, //game is in progress
    STATE_END //game is ended
}

export enum GameAction {
    INIT, //initialization of scene
    INIT_DONE,
    START_GAME,
    END_GAME
}
