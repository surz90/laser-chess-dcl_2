import { Cell, Piece } from "../khet/cell";
import { GamePos, GameColor, PieceType, Orientation } from "../khet/gameTypes";
import { genFunc } from "../genFunc/genFunc";
import modelResources from "../resources/modelResources";

import utils from "../../node_modules/decentraland-ecs-utils/index"
import { MoveTransformComponent } from "../../node_modules/decentraland-ecs-utils/transform/component/move";
import { GameRotation } from "../gameTypes";
import { RotateTransformComponent } from "../../node_modules/decentraland-ecs-utils/transform/component/rotate";
import { themeData } from "../gameData/themeData";

export class CellView{
    constructor(){

    }
}

export class PieceView {
    chessPos: GamePos
    worldPos: Vector3
    orientation: Orientation

    centerPos: Vector3 = new Vector3(16, 0, 16)
    scale: number = 1

    piece: Piece
    pieceModel: Entity = new Entity()
    animationClipList: { celeAnim: AnimationState, shootAnim: AnimationState, reflectAnim: AnimationState, dieAnim: AnimationState, blockAnim: AnimationState} = {
        celeAnim: null,
        shootAnim: null,
        reflectAnim: null,
        dieAnim: null,
        blockAnim: null
    }

    resource = modelResources.FREE_1

    constructor(cell: Cell, pos: GamePos) {
        //log(cell.piece, cell.position)

        this.pieceTypeToModel(cell, pos)
    }
    calcDiffRotation(_orientationOrigin: Orientation, _orientationTarget: Orientation) {

        let diff = _orientationTarget - _orientationOrigin

        return diff * 90
    }
    move(chessPosTarget: GamePos) {
        this.chessPos = chessPosTarget

        //Define start and end positions
        let StartPos = this.worldPos
        this.worldPos = genFunc.chessPosToWorldPos(this.chessPos, this.centerPos, this.scale)
        let EndPos = this.worldPos
        try {
            this.pieceModel.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 0.25, () => {
                log('PIECE MOVEMENT DONE')
            }))
        }
        catch (err) {
            this.pieceModel.removeComponent(MoveTransformComponent)
            this.pieceModel.getComponent(Transform).position = EndPos
            log('PIECE MOVEMENT FAILED IN PIECE VIEW')
        }
    }
    rotate(_rotation: GameRotation) {
        let rotationOffset = 0
        if (_rotation === GameRotation.CW) rotationOffset = 1
        if (_rotation === GameRotation.CCW) rotationOffset = -1

        let startDegree = this.calcDiffRotation(0, this.orientation)
        let endOrientation = (this.orientation + rotationOffset + 4) % 4
        let endDegree = this.calcDiffRotation(0, endOrientation)

        log(startDegree, _rotation, endDegree)
        let startRot = Quaternion.Identity.setEuler(0, startDegree, 0)
        let endRot = Quaternion.Identity.setEuler(0, endDegree, 0)

        this.orientation = endOrientation

        //log('PIECE VIEW ROTATION: ', startRot.eulerAngles, endRot.eulerAngles)
        try {
            this.pieceModel.addComponent(new utils.RotateTransformComponent(startRot, endRot, 0.25, () => {
                this.pieceModel.getComponent(Transform).rotation = endRot
                log('PIECE ROTATION DONE', this.orientation)
            }))
        }
        catch (err) {
            this.pieceModel.removeComponent(RotateTransformComponent)
            this.pieceModel.getComponent(Transform).rotation = endRot
            log('PIECE ROTATION FAILED IN PIECE VIEW')
        }
    }
    show() {
        this.pieceModel.getComponent(Transform).scale.setAll(1)
        this.stopAnimation()
    }
    hide() {
        this.pieceModel.getComponent(Transform).scale.setAll(0)
        this.stopAnimation()
    }
    resetPiece() {
        this.chessPos = null
        this.orientation = null
        this.piece = null
    }
    pieceTypeToModel(cell: Cell, pos: GamePos) {
        if (this.pieceModel.isAddedToEngine()) engine.removeEntity(this.pieceModel)

        this.chessPos = pos
        this.orientation = cell.piece.orientation
        //log(this.chessPos)

        this.worldPos = genFunc.chessPosToWorldPos(this.chessPos, this.centerPos, this.scale)

        this.piece = cell.piece

        this.pieceModel.addComponentOrReplace(new Transform({
            position: this.worldPos.add(new Vector3(0, 0, 0))
        }))


        this.pieceModel.getComponent(Transform).rotation.setEuler(
            0,
            this.calcDiffRotation(0, cell.piece.orientation),
            0
        )

        //update model and load animation
        this.updateModelResource(this.resource)
    }
    loadAnimation() {
        let currentTheme = themeData.getCurrentTheme()
        let themeDat = themeData.getCurrentThemeData()

        this.animationClipList.blockAnim = null
        this.animationClipList.celeAnim = null
        this.animationClipList.dieAnim = null
        this.animationClipList.reflectAnim = null
        this.animationClipList.shootAnim = null

        this.pieceModel.removeComponent(Animator)
        this.pieceModel.addComponent(new Animator())

        //CELEBRATION
        this.animationClipList.celeAnim = new AnimationState("cele")
        this.pieceModel.getComponent(Animator).addClip(this.animationClipList.celeAnim)
        this.animationClipList.celeAnim.playing = false
        this.animationClipList.celeAnim.setParams({ looping: false, speed: themeDat.animationSpeed.cele })
        //

        //BLOCK
        this.animationClipList.blockAnim = new AnimationState("block")
        this.pieceModel.getComponent(Animator).addClip(this.animationClipList.blockAnim)
        this.animationClipList.blockAnim.playing = false
        this.animationClipList.blockAnim.setParams({ looping: false, speed: themeDat.animationSpeed.block })
        //

        //SHOOT
        this.animationClipList.shootAnim = new AnimationState("shoot")
        this.pieceModel.getComponent(Animator).addClip(this.animationClipList.shootAnim)
        this.animationClipList.shootAnim.playing = false
        this.animationClipList.shootAnim.setParams({ looping: false, speed: themeDat.animationSpeed.shoot })
        //

        //REFLECT
        this.animationClipList.reflectAnim = new AnimationState("reflect")
        this.pieceModel.getComponent(Animator).addClip(this.animationClipList.reflectAnim)
        this.animationClipList.reflectAnim.playing = false
        this.animationClipList.reflectAnim.setParams({ looping: false, speed: themeDat.animationSpeed.reflect })
        //

        //DIE
        this.animationClipList.dieAnim = new AnimationState("die")
        this.pieceModel.getComponent(Animator).addClip(this.animationClipList.dieAnim)
        this.animationClipList.dieAnim.playing = false
        this.animationClipList.dieAnim.setParams({ looping: false, speed: themeDat.animationSpeed.die })
        //
    }
    stopAnimation() {
        this.pieceModel.getComponent(Animator).getClip("cele").stop()
        this.pieceModel.getComponent(Animator).getClip("block").stop()
        this.pieceModel.getComponent(Animator).getClip("shoot").stop()
        this.pieceModel.getComponent(Animator).getClip("reflect").stop()
        this.pieceModel.getComponent(Animator).getClip("die").stop()

        this.pieceModel.getComponent(Animator).getClip("cele").reset()
        this.pieceModel.getComponent(Animator).getClip("block").reset()
        this.pieceModel.getComponent(Animator).getClip("shoot").reset()
        this.pieceModel.getComponent(Animator).getClip("reflect").reset()
        this.pieceModel.getComponent(Animator).getClip("die").reset()
    }

    updateModelResource(resource) {
        if (this.pieceModel.isAddedToEngine()) engine.removeEntity(this.pieceModel)
        this.resource = resource

        if (this.piece.color === GameColor.RED) {
            if (this.piece.type === PieceType.SPHINX) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.red_sphinx)
            }
            else if (this.piece.type === PieceType.PHARAOH) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.red_pharaoh)
            }
            else if (this.piece.type === PieceType.SCARAB) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.red_scarab)
            }
            else if (this.piece.type === PieceType.PYRAMID) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.red_pyramid)
            }
            else if (this.piece.type === PieceType.ANUBIS) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.red_anubis)
            }
            else {
                log('piece type information not valid !')
            }
        }
        else if (this.piece.color === GameColor.SILVER) {
            if (this.piece.type === PieceType.SPHINX) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.silver_sphinx)
            }
            else if (this.piece.type === PieceType.PHARAOH) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.silver_pharaoh)
            }
            else if (this.piece.type === PieceType.SCARAB) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.silver_scarab)
            }
            else if (this.piece.type === PieceType.PYRAMID) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.silver_pyramid)
            }
            else if (this.piece.type === PieceType.ANUBIS) {
                this.pieceModel.addComponentOrReplace(resource.pieceModel.silver_anubis)
            }
            else {
                log('piece type information not valid !')
            }
        }
        else {
            log('piece information not valid !')
        }
        log('update model done')

        const delayAddEntity = new Entity()
        delayAddEntity.addComponent(new utils.Delay(1000, () => {
            engine.addEntity(this.pieceModel)
            engine.removeEntity(delayAddEntity)
        }))
        engine.addEntity(delayAddEntity)

        const delayStop = new Entity()
        delayStop.addComponent(new utils.Delay(1000, () => {
            this.loadAnimation()
            log('load animation done')
            this.stopAnimation()
            log('stop all animation done')
            engine.removeEntity(delayStop)
        }))
        engine.addEntity(delayStop)
    }
}