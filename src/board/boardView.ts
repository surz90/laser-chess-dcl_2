import { GameColor, GameRotation, PieceType } from "../khet/gameTypes"
import { GamePos } from "../khet/gameTypes"
import { LaserChess } from "../khet/board"
import { GameLogic } from "../gameLogic/gameLogic"
import { PieceView } from "./pieceView"

import utils from "../../node_modules/decentraland-ecs-utils/index"
import { ActionsSequenceSystem } from "../../node_modules/decentraland-ecs-utils/actionsSequenceSystem/actionsSequenceSystem";
import modelResources from "../resources/modelResources"
import { LaserRes, HitRes, Orientation } from "../gameTypes"
import { genFunc } from "../genFunc/genFunc"
import { GameEffectAnimation } from "./gameEffect"
import { Cell } from "../khet/cell"
import { themeData } from "../gameData/themeData"
import soundResources from "../resources/soundResources"


export class BoardView {
    centerPos: Vector3
    scale: number
    
    pieceColection: PieceView[] = []

    laserSilver: Entity[] = []
    laserSilverDiagonal: Entity[] = []

    laserRed: Entity[] = []
    laserRedDiagonal: Entity[] = []

    silverPieceDestroyAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.silver_destroy, GameColor.SILVER, HitRes.HIT)
    redPieceDestroyAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.red_destroy, GameColor.RED, HitRes.HIT)

    silverPieceBlockAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.silver_shield, GameColor.SILVER, HitRes.BLOCK)
    redPieceBlockAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.red_shield, GameColor.RED, HitRes.BLOCK)

    silverLaserOutAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.silver_out, GameColor.SILVER, HitRes.OUT)
    redLaserOutAnim: GameEffectAnimation = new GameEffectAnimation(modelResources.FREE_1.effect.red_out, GameColor.RED, HitRes.OUT)

    laserHeight = 0.6

    constructor() {
        this.centerPos = new Vector3(16, 0, 16)
        this.scale = 1

        //this.gameLogicParent = _gameLogicParent
        //this.khetPlay = this.gameLogicParent.khetPlay

        for (let i = 0; i < 12; i++) {
            let laserSilverInit = new Entity()
            laserSilverInit.addComponent(new Transform({
                position: genFunc.chessPosToWorldPos({ row: 0, col: 9 }, this.centerPos, this.scale)
                    .add(new Vector3(0, this.laserHeight, 0)),
                scale: new Vector3(1, 1, 0)
            }))
            laserSilverInit.addComponent(modelResources.FREE_1.pieceModel.silver_laser)
            this.laserSilver.push(laserSilverInit)

            let laserSilverDiagInit = new Entity()
            laserSilverDiagInit.addComponent(new Transform({
                position: genFunc.chessPosToWorldPos({ row: 0, col: 9 }, this.centerPos, this.scale)
                    .add(new Vector3(0, this.laserHeight, 0)),
                scale: new Vector3(1, 1, 0)
            }))
            laserSilverDiagInit.addComponent(modelResources.FREE_1.pieceModel.silver_laser)
            this.laserSilverDiagonal.push(laserSilverDiagInit)

            engine.addEntity(this.laserSilver[i])
            engine.addEntity(this.laserSilverDiagonal[i])

            let laserRedInit = new Entity()
            laserRedInit.addComponent(new Transform({
                position: genFunc.chessPosToWorldPos({ row: 7, col: 0 }, this.centerPos, this.scale)
                    .add(new Vector3(0, this.laserHeight, 0)),
                scale: new Vector3(1, 1, 0)
            }))
            laserRedInit.addComponent(modelResources.FREE_1.pieceModel.red_laser)
            this.laserRed.push(laserRedInit)

            let laserRedDiagInit = new Entity()
            laserRedDiagInit.addComponent(new Transform({
                position: genFunc.chessPosToWorldPos({ row: 0, col: 9 }, this.centerPos, this.scale)
                    .add(new Vector3(0, this.laserHeight, 0)),
                scale: new Vector3(1, 1, 0)
            }))
            laserRedDiagInit.addComponent(modelResources.FREE_1.pieceModel.red_laser)
            this.laserRedDiagonal.push(laserRedDiagInit)

            engine.addEntity(this.laserRed[i])
            engine.addEntity(this.laserRedDiagonal[i])
        }

    }
    /*
    resetBoard() {
        log('RESET BOARD VIEW')
        let pieceIdx: number
        for (pieceIdx = 0; pieceIdx < this.pieceColection.length; pieceIdx++) {
            log('REMOVE PIECE OBJECT FROM BOARD: ', pieceIdx)
            engine.removeEntity(this.pieceColection[pieceIdx].pieceModel)
        }
        log('REMOVE PIECE: ', pieceIdx)
        this.pieceColection = []
    }
    */
    /*
    load() {
        log('LOAD PIECES MODEL TO SCENE !!')
        this.resetBoard()

        let delayAfterReset = new Entity()
        //delayAfterReset.addComponent(new utils.Delay(5000, () => {
            let board = this.gameLogicParent.khetPlay.board

            let numberPiece = 0
            for (let row = board.length - 1; row >= 0; row--) {
                for (let col = 0; col < board[row].length; col++) {
                    let cell = board[row][col]
                    let pos = {
                        row,
                        col
                    }
                    if (cell.piece) {
                        numberPiece += 1
                        this.pieceColection.push(new PieceView(cell, pos))
                    }
                }
            }
        log(numberPiece, ' is loaded for view')

            //engine.removeEntity(delayAfterReset)
        //}))
        //engine.addEntity(delayAfterReset)
    }
    */
    loadBoard(_board: Cell[][], _FEN: string) {
        log('LOADING BOARD')

        let board = _board
        let FEN = _FEN

        let numberPiece = 0
        for (let row = board.length - 1; row >= 0; row--) {
            for (let col = 0; col < board[row].length; col++) {
                let cell = board[row][col]
                let pos = {
                    row,
                    col
                }

                if (cell.piece) {
                    log(pos)
                    log(PieceType[cell.piece.type])
                    log(Orientation[cell.piece.orientation])

                    //log('POS: ', this.pieceColection[numberPiece].chessPos, pos)
                    //log('PIECE: ', PieceType[this.pieceColection[numberPiece].piece.type], PieceType[cell.piece.type])
                    //log('ORIENTATION: ', Orientation[this.pieceColection[numberPiece].piece.orientation], Orientation[cell.piece.orientation])

                    /*
                    let isPiece = this.getPiecefromPos(pos)

                    if (isPiece) {
                        log('FOUND PIECES IN SAME POSITION', isPiece.chessPos, PieceType[isPiece.piece.type])
                        isPiece.resetPiece()
                    }
                    */

                    if (!this.pieceColection[numberPiece]) {
                        log('ADD NEW PIECE', PieceType[cell.piece.type], GameColor[cell.piece.color], pos)
                        this.pieceColection.push(new PieceView(cell, pos))
                    }
                    else {
                        this.pieceColection[numberPiece].pieceTypeToModel(cell, pos)
                        /*
                        log('-------------')
                        log(this.pieceColection[numberPiece].chessPos.row, pos.row)
                        log(this.pieceColection[numberPiece].chessPos.col, pos.col)
                        log(this.pieceColection[numberPiece].piece.type, cell.piece.type)
                        log(this.pieceColection[numberPiece].piece.color, cell.piece.color)
                        log(this.pieceColection[numberPiece].piece.orientation, cell.piece.orientation)
                        log('-------------')

                        if (
                            this.pieceColection[numberPiece].chessPos !== null && (
                                this.pieceColection[numberPiece].chessPos.row === pos.row &&
                                this.pieceColection[numberPiece].chessPos.col === pos.col &&
                                this.pieceColection[numberPiece].piece.type === cell.piece.type &&
                                this.pieceColection[numberPiece].piece.color === cell.piece.color &&
                                this.pieceColection[numberPiece].piece.orientation === cell.piece.orientation)
                            )
                        {
                            //log('NO PIECE CHANGE: ', this.pieceColection[numberPiece], pos, PieceType[cell.piece.type], Orientation[cell.piece.orientation])
                        }
                        else {
                            this.pieceColection[numberPiece].pieceTypeToModel(cell, pos)
                            log(numberPiece, ': CHANGING PIECE: ', pos, cell)
                        }
                        */
                        this.pieceColection[numberPiece].stopAnimation()
                        this.pieceColection[numberPiece].show()
                    }
                    numberPiece += 1
                }
            }
        }

        //hide left pieces in collection
        for (let leftIdx = numberPiece; leftIdx < this.pieceColection.length; leftIdx++) {
            //this.pieceColection[leftIdx].pieceModel.getComponent(Transform).position.y = 2.5
            //this.pieceColection[leftIdx].pieceModel.getComponent(Transform).scale.setAll(0.3)
            this.pieceColection[leftIdx].stopAnimation()
            this.pieceColection[leftIdx].hide()
        }
    }
    move(fromPos: GamePos, toPos: GamePos, player: GameColor) {
        let pieceOrigin = this.getPiecefromPos(fromPos)
        let pieceTarget = this.getPiecefromPos(toPos)

        if (!pieceTarget) {
            pieceOrigin.move(toPos)
        }
        else {
            //swap piece
            pieceOrigin.move(toPos)
            pieceTarget.move(fromPos)

        }
    }
    rotate(fromPos: GamePos, rotation: GameRotation, player: GameColor) {
        log('BOARD VIEW ROTATION: ', GameRotation[rotation])
        let pieceOrigin = this.getPiecefromPos(fromPos)
        pieceOrigin.rotate(rotation)
    }

    calcDiffRotation(_orientationOrigin: Orientation, _orientationTarget: Orientation) {
        let diff = _orientationTarget - _orientationOrigin

        return diff * 90
    }
    calcReverseAngleROtation(_orientationTarget: Orientation) {
        let orientationOrigin = 0

        let diff = orientationOrigin - _orientationTarget

        return diff * -90 - 180
    }

    playLaser(_laserPath: LaserRes[], player: GameColor) {
        let laserPath = _laserPath
        //log('laser view data: ', GameColor[player])

        let laserArrayTarget: Entity[]
        let laserArrayDiagonal: Entity[]
        let laserDestroyAnim: GameEffectAnimation
        let laserBlockAnim: GameEffectAnimation
        let laserOutAnim: GameEffectAnimation

        if (player === GameColor.SILVER) {
            laserArrayTarget = this.laserSilver
            laserArrayDiagonal = this.laserSilverDiagonal
            laserDestroyAnim = this.silverPieceDestroyAnim
            laserOutAnim = this.silverLaserOutAnim
        }
        else if (player === GameColor.RED) {
            laserArrayTarget = this.laserRed
            laserArrayDiagonal = this.laserRedDiagonal
            laserDestroyAnim = this.redPieceDestroyAnim
            laserOutAnim = this.redLaserOutAnim
        }

        let laserSequenceSys, laserSequenceRotateSys, laserSequenceFinishSys,
            pieceDestroySequenceSys, pieceBlockSequenceSys, laserOutSequenceSys

        let laserSequence = new utils.ActionsSequenceSystem.SequenceBuilder()
        let laserSequenceRotate = new utils.ActionsSequenceSystem.SequenceBuilder()
        let laserSequenceFinish = new utils.ActionsSequenceSystem.SequenceBuilder()

        let pieceDestroySequence = new utils.ActionsSequenceSystem.SequenceBuilder()
        let pieceBlockSequence = new utils.ActionsSequenceSystem.SequenceBuilder()

        let laserOutSequence = new utils.ActionsSequenceSystem.SequenceBuilder()

        let startPos: GamePos, endPos: GamePos
        let dir: Orientation, res: HitRes

        let startWorldPos: Vector3

        let i_diag = 0
        for (let i = 0; i < laserPath.length; i++) {

            if (i === 0) {
                if (player === GameColor.SILVER) startPos = { row: 0, col: 9 }
                else startPos = { row: 7, col: 0 }

                //start playing sphinx animation
                let sphinxPieces = this.getPiecefromPos(startPos)

                log('FIRE ANIMATION: ', sphinxPieces.chessPos)
                //sphinxPieces.animationClipList.shootAnim.stop()
                //sphinxPieces.animationClipList.shootAnim.play()
                sphinxPieces.pieceModel.getComponent(Animator).getClip("shoot").stop()
                sphinxPieces.pieceModel.getComponent(Animator).getClip("shoot").play()
            }
            else {
                startPos = laserPath[i - 1].pos
            }

            endPos = laserPath[i].pos
            dir = laserPath[i].dir
            res = laserPath[i].res

            startWorldPos = genFunc.chessPosToWorldPos(startPos, this.centerPos, this.scale).add(new Vector3(0, this.laserHeight, 0))

            log(startPos, endPos, Orientation[dir], HitRes[res])

            if (res === HitRes.PASS || res === HitRes.REFLECT || res === HitRes.OUT) {
                if (i < laserArrayTarget.length) {
                    laserArrayTarget[i].getComponent(Transform).position = startWorldPos
                    laserArrayTarget[i].getComponent(Transform).rotation.setEuler(0, this.calcDiffRotation(0, dir), 0)
                }
                else {
                    let laserEntity = new Entity()
                    if (player === GameColor.SILVER) laserEntity.addComponent(modelResources.FREE_1.pieceModel.silver_laser)
                    else laserEntity.addComponent(modelResources.FREE_1.pieceModel.red_laser)

                    laserEntity.addComponent(new Transform({
                        position: startWorldPos,
                        scale: Vector3.Zero(),
                        rotation: Quaternion.Euler(0, this.calcDiffRotation(0, dir), 0)
                    }))

                    laserArrayTarget.push(laserEntity)

                    laserEntity = new Entity()
                    if (player === GameColor.SILVER) laserEntity.addComponent(modelResources.FREE_1.pieceModel.silver_laser)
                    else laserEntity.addComponent(modelResources.FREE_1.pieceModel.red_laser)

                    laserEntity.addComponent(new Transform({
                        position: startWorldPos,
                        scale: Vector3.Zero(),
                        rotation: Quaternion.Euler(0, this.calcDiffRotation(0, dir), 0)
                    }))

                    laserArrayDiagonal.push(laserEntity)

                    engine.addEntity(laserArrayTarget[i])
                    engine.addEntity(laserArrayDiagonal[i])
                }

                if (res === HitRes.REFLECT) {
                    let pieceTarget = this.getPiecefromPos(startPos)
                    laserSequence = laserSequence.then(new PieceReflectAction(pieceTarget, null))
                }

                if (i < laserPath.length - 1 && laserPath[i + 1].res === HitRes.REFLECT) {
                    if (i < laserPath.length - 2 && laserPath[i].res !== HitRes.REFLECT) {
                        laserSequence = laserSequence.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 0.5)))
                        laserSequenceFinish = laserSequenceFinish.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 0)))
                    }

                    let dirAve = 0
                    if (laserPath[i + 1].dir === 3 && laserPath[i].dir === 0 ||
                        laserPath[i + 1].dir === 0 && laserPath[i].dir === 3) {
                        dirAve = 3.5
                    }
                    else {
                        dirAve = (laserPath[i + 1].dir + laserPath[i].dir) / 2
                    }
                    log('DIR START: ', laserPath[i].dir, 'DIR END: ', laserPath[i + 1].dir, 'AVE: ', dirAve * 90)
                    laserArrayDiagonal[i].getComponent(Transform).position.copyFrom(laserArrayTarget[i].getComponent(Transform).position)
                    if (dir === Orientation.WEST) laserArrayDiagonal[i].getComponent(Transform).position.addInPlace(new Vector3(-1, 0, 0))
                    else if (dir === Orientation.EAST) laserArrayDiagonal[i].getComponent(Transform).position.addInPlace(new Vector3(1, 0, 0))
                    else if (dir === Orientation.NORTH) laserArrayDiagonal[i].getComponent(Transform).position.addInPlace(new Vector3(0, 0, 1))
                    else if (dir === Orientation.SOUTH) laserArrayDiagonal[i].getComponent(Transform).position.addInPlace(new Vector3(0, 0, -1))

                    laserArrayDiagonal[i].getComponent(Transform).rotation.setEuler(0, dirAve * 90, 0)
                    laserSequence = laserSequence.then(new ScaleAction(laserArrayDiagonal[i], new Vector3(1, 1, 0.707)))
                    laserSequenceFinish = laserSequenceFinish.then(new ScaleAction(laserArrayDiagonal[i], new Vector3(1, 1, 0)))
                }
                else if (i > 0 && laserPath[i].res === HitRes.REFLECT) {
                    if (dir === Orientation.WEST) laserArrayTarget[i].getComponent(Transform).position.addInPlace(new Vector3(-1, 0, 0))
                    else if (dir === Orientation.EAST) laserArrayTarget[i].getComponent(Transform).position.addInPlace(new Vector3(1, 0, 0))
                    else if (dir === Orientation.NORTH) laserArrayTarget[i].getComponent(Transform).position.addInPlace(new Vector3(0, 0, 1))
                    else if (dir === Orientation.SOUTH) laserArrayTarget[i].getComponent(Transform).position.addInPlace(new Vector3(0, 0, -1))

                    laserSequence = laserSequence.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 0.5)))
                    laserSequenceFinish = laserSequenceFinish.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 0)))
                }
                else {
                    laserSequence = laserSequence.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 1)))
                    //laserSequenceRotate = laserSequenceRotate.then(new LaserRotateAction(laserArrayTarget[i], genFunc.chessPosToWorldPos(endPos, this.centerPos, this.scale)
                    //    .add(new Vector3(0, 1.3, 0)), this.calcReverseAngleROtation(dir)))
                    laserSequenceFinish = laserSequenceFinish.then(new ScaleAction(laserArrayTarget[i], new Vector3(1, 1, 0)))
                }


                if (res === HitRes.OUT) {
                    laserOutSequence.then(new LaserOutAction(
                        genFunc.chessPosToWorldPos(endPos, this.centerPos, this.scale),
                        dir,
                        laserOutAnim
                    ))
                }
            }
            else if (res === HitRes.BLOCK) {
                let pieceTarget = this.getPiecefromPos(endPos)

                if (pieceTarget.piece.color === GameColor.SILVER) laserBlockAnim = this.silverPieceBlockAnim
                else if (pieceTarget.piece.color === GameColor.RED) laserBlockAnim = this.redPieceBlockAnim

                /*
                if (this.khetPlay.getCell(endPos.row, endPos.col).piece.color === GameColor.SILVER) {
                    laserBlockAnim = this.silverPieceBlockAnim
                }
                else if (this.khetPlay.getCell(endPos.row, endPos.col).piece.color === GameColor.RED) {
                    laserBlockAnim = this.redPieceBlockAnim
                }
                */
                pieceBlockSequence.then(new PieceBlockAction(
                    pieceTarget,
                    laserBlockAnim
                ))
            }
            else if (res === HitRes.HIT){
                let pieceTarget = this.getPiecefromPos(endPos)

                pieceDestroySequence.then(new PieceDestroyAction(
                    pieceTarget,
                    laserDestroyAnim
                ))
            }

        }

        laserSequenceSys = new utils.ActionsSequenceSystem(laserSequence)
        laserSequenceRotateSys = new utils.ActionsSequenceSystem(laserSequenceRotate)
        laserSequenceFinishSys = new utils.ActionsSequenceSystem(laserSequenceFinish)

        pieceDestroySequenceSys = new utils.ActionsSequenceSystem(pieceDestroySequence)
        pieceBlockSequenceSys = new utils.ActionsSequenceSystem(pieceBlockSequence)

        laserOutSequenceSys = new utils.ActionsSequenceSystem(laserOutSequence)

        laserSequenceSys.setOnFinishCallback(() => {
            //engine.addSystem(laserSequenceRotateSys)

            let delayEnt = new Entity()
            if (res === HitRes.OUT)
                engine.addSystem(laserOutSequenceSys)

            if (res === HitRes.HIT)
                engine.addSystem(pieceDestroySequenceSys)

            if (res === HitRes.BLOCK)
                engine.addSystem(pieceBlockSequenceSys)

            delayEnt.addComponent(new utils.Delay(1500, () => {
                engine.addSystem(laserSequenceFinishSys)
                //this.resetLaserEntity(player)
                engine.removeEntity(delayEnt)
            }))

            engine.addEntity(delayEnt)
        })
        /*
        laserSequenceRotateSys.setOnFinishCallback(() => {
            let delayEnt = new Entity()
            if (res === HitRes.OUT)
                engine.addSystem(laserOutSequenceSys)

            if (res === HitRes.HIT)
                engine.addSystem(pieceDestroySequenceSys)

            if (res === HitRes.BLOCK)
                engine.addSystem(pieceBlockSequenceSys)

            delayEnt.addComponent(new utils.Delay(1500, () => {
                engine.addSystem(laserSequenceFinishSys)
                //this.resetLaserEntity(player)
                engine.removeEntity(delayEnt)
            }))

            engine.addEntity(delayEnt)
        })
        */
        laserSequenceFinishSys.setOnFinishCallback(() => {
            let delayEnt = new Entity()
            delayEnt.addComponent(new utils.Delay(5000, () => {
                //engine.addSystem(laserSequenceFinishSys)
                this.resetLaserEntity(player)
                engine.removeEntity(delayEnt)
            }))

            engine.addEntity(delayEnt)
        })

        engine.addSystem(laserSequenceSys)
    }

    resetLaserEntity(player: GameColor) {
        let laserArrayTarget: Entity[]
        if (player === GameColor.SILVER) laserArrayTarget = this.laserSilver
        else laserArrayTarget = this.laserRed

        for (let i = 0; i < laserArrayTarget.length; i++) {
            laserArrayTarget[i].getComponent(Transform).scale.set(1, 1, 0)
        }
    }
    getPiecefromPos(pos: GamePos) {
        for (let i = 0; i < this.pieceColection.length; i++) {
            if (this.pieceColection[i].chessPos) {
                if (this.pieceColection[i].chessPos.row === pos.row && this.pieceColection[i].chessPos.col === pos.col)
                    return this.pieceColection[i]
            }
        }
        return null
    }

    changeModel(resource: any) {
        log('change model')
        for (let i = 0; i < this.pieceColection.length; i++) {
            this.pieceColection[i].updateModelResource(resource)
            this.pieceColection[i].stopAnimation()
        }
        this.laserHeight = themeData.getCurrentThemeData().laserHeight
    }
}

class ScaleAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false;
    entity: Entity
    scale: Vector3

    constructor(entity: Entity, scale: Vector3) {
        this.entity = entity
        this.scale = scale
    }

    //Method when action starts
    onStart(): void {
        const transform = this.entity.getComponent(Transform)
        this.hasFinished = false

        this.entity.addComponentOrReplace(new utils.ScaleTransformComponent(transform.scale, this.scale, 0.02,
            () => {
                this.hasFinished = true
            }, utils.InterpolationType.LINEAR))
    }
    //Method to run on every frame
    update(dt: number): void {
    }
    //Method to run at the end
    onFinish(): void {
    }
}

class LaserRotateAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false;
    entity: Entity
    pos: Vector3
    XZRotation: number

    constructor(entity: Entity, endPos: Vector3, reverseAngle: number) {
        this.entity = entity
        this.pos = endPos
        this.XZRotation = reverseAngle
    }

    //Method when action starts
    onStart(): void {
        this.hasFinished = false
        let transform = this.entity.getComponent(Transform)

        transform.rotation.setEuler(0, this.XZRotation, 0)
        transform.position = this.pos

        this.hasFinished = true
    }
    //Method to run on every frame
    update(dt: number): void {
    }
    //Method to run at the end
    onFinish(): void {
    }
}

class PieceDestroyAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false
    piece: PieceView
    gameEffect: GameEffectAnimation

    constructor(piece: PieceView, gameEffect: GameEffectAnimation) {
        this.piece = piece
        this.gameEffect = gameEffect
        this.gameEffect.setPos(this.piece.worldPos, 1.25)
    }

    //Method when action starts
    onStart(): void {
        soundResources.destroy.getComponent(AudioSource).playOnce()

        this.hasFinished = false

        this.gameEffect.playAnim()
        let delayEnt = new Entity()

        log('DESTROY ANIMATION: ', this.piece.chessPos)

        try {
            this.piece.stopAnimation()
            this.piece.animationClipList.dieAnim.play()

            delayEnt.addComponent(new utils.Delay(2000, () => {
                this.piece.hide()
                this.hasFinished = true
                engine.removeEntity(delayEnt)
            }))
        }
        catch (err) {
            log("can't play animation")
            this.hasFinished = true
        }
        engine.addEntity(delayEnt)
    }
    //Method to run on every frame
    update(dt: number): void {
        /*
        if(!this.hasFinished)
            this.piece.pieceModel.getComponent(Transform).rotate(new Vector3(0, 1, 0), 450 * dt)
        */
    }
    //Method to run at the end
    onFinish(): void {
    }
}

class PieceReflectAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false
    piece: PieceView
    gameEffect: GameEffectAnimation | null

    constructor(piece: PieceView, gameEffect: GameEffectAnimation | null) {
        this.piece = piece
        this.gameEffect = gameEffect
    }
    onStart() {
        this.hasFinished = false
        log('REFLECT ANIMATION: ', this.piece.chessPos)
        try {
            this.piece.animationClipList.reflectAnim.stop()
            this.piece.animationClipList.reflectAnim.play()
        }
        catch(err){
            log("can't play animation")
        }
        this.hasFinished = true
    }
    update(dt: number): void {
    }
    onFinish() {

    }
}

class PieceBlockAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false
    piece: PieceView
    gameEffect: GameEffectAnimation

    constructor(piece: PieceView, gameEffect: GameEffectAnimation) {
        this.piece = piece
        this.gameEffect = gameEffect

        log('BLOCK ACTION POSITION origin: ', this.piece.worldPos)
        log('BLOCK ACTION ROTATION origin: ', this.piece.orientation)
        
        let posOffset = Vector3.Zero()
        if (this.piece.orientation === Orientation.NORTH) {
            posOffset = new Vector3(0, 0, 1)
        }
        else if (this.piece.orientation === Orientation.EAST) {
            posOffset = new Vector3(1, 0, 0)
        }
        else if (this.piece.orientation === Orientation.SOUTH) {
            posOffset = new Vector3(0, 0, -1)
        }
        else if (this.piece.orientation === Orientation.WEST) {
            posOffset = new Vector3(-1, 0, 0)
        }

        log('BLOCK ACTION POSITION: ', this.piece.worldPos.add(posOffset))

        let Zrotation = this.calcDiffRotation(0, this.piece.orientation)
        let rotation = Quaternion.Identity.setEuler(0, Zrotation, 0)

        this.gameEffect.setPos(this.piece.worldPos.add(posOffset), 2, rotation)
    }

    calcDiffRotation(_orientationOrigin: Orientation, _orientationTarget: Orientation) {
        let diff = _orientationTarget - _orientationOrigin

        return diff * 90
    }

    //Method when action starts
    onStart(): void {
        this.hasFinished = false

        //currently sphinx model don't have block animation
        try {
            if (this.piece.piece.type !== PieceType.SPHINX) {
                log('FIRE ANIMATION: ', this.piece.chessPos)

                this.piece.animationClipList.blockAnim.stop()
                this.piece.animationClipList.blockAnim.play()
            }
            this.gameEffect.playAnim()
        }
        catch (err) {
            log("can't play animation")
        }
        this.hasFinished = true
    }
    //Method to run on every frame
    update(dt: number): void {
    }
    //Method to run at the end
    onFinish(): void {
    }
}

class LaserOutAction implements ActionsSequenceSystem.IAction {
    hasFinished: boolean = false
    pos: Vector3
    orientation: Orientation
    gameEffect: GameEffectAnimation

    constructor(pos: Vector3, laserOrientation: Orientation, gameEffect: GameEffectAnimation) {
        this.pos = pos
        this.orientation = laserOrientation
        this.gameEffect = gameEffect

        let rotationQuat = Quaternion.Identity.setEuler(0, this.calcReverseAngleROtation(this.orientation), 0)
        this.gameEffect.setPos(this.pos, 1.25, rotationQuat)

        log('LASER OUT ACTION: ', Orientation[this.orientation], pos, this.calcReverseAngleROtation(this.orientation))
    }

    calcReverseAngleROtation(_orientationTarget: Orientation) {
        let diff = _orientationTarget

        return diff * 90 - 180
    }
    calcDiffRotation(_orientationOrigin: Orientation, _orientationTarget: Orientation) {
        let diff = _orientationTarget - _orientationOrigin

        return diff * 90
    }

    //Method when action starts
    onStart(): void {
        this.hasFinished = false

        this.gameEffect.playAnim()
        this.hasFinished = true
    }
    //Method to run on every frame
    update(dt: number): void {
    }
    //Method to run at the end
    onFinish(): void {
    }
}