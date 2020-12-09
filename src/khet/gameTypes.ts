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

export enum MoveType {
    ROTATION,
    MOVEMENT
}