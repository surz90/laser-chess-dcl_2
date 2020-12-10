import modelResources from "./resources/modelResources"
import { gameData } from "./gameData/gameData"
import { userData } from "./gameData/userData"
import { PlayerStatus, GameMode, GameTheme } from "./gameTypes"
import { GameColor } from "./khet/gameTypes"
import utils from "../node_modules/decentraland-ecs-utils/index"
import { WSSHandler, ClientMethod } from "./serverEvent/websocketHandler"
import { themeData } from "./gameData/themeData"
import soundResources from "./resources/soundResources"

export class PlayerMatching {
    //wssHandler: WSSSocketHandler
    UIEvents: EventManager

    scenePivot: Entity = new Entity()

    silverJoinActive: boolean = false
    joinAreaSilver: Entity = new Entity()
    joinAreaActiveSilver: Entity = new Entity()
    silverArrow: Entity = new Entity()

    redJoinActive: boolean = false
    joinAreaRed: Entity = new Entity()
    joinAreaActiveRed: Entity = new Entity()
    redArrow: Entity = new Entity()


    inGameStatusState: PlayerStatus

    constructor(UIEvents: EventManager) {
        this.UIEvents = UIEvents

        this._setModel(modelResources.FREE_1)
        this._loadingModel()
        engine.addSystem(this)
    }
    _setModel(themeResource: any) {
        this.joinAreaSilver.addComponentOrReplace(themeResource.sceneModel.silver_join_area)
        this.joinAreaActiveSilver.addComponentOrReplace(themeResource.sceneModel.silver_join_area_active)
        this.joinAreaRed.addComponentOrReplace(themeResource.sceneModel.red_join_area)
        this.joinAreaActiveRed.addComponentOrReplace(themeResource.sceneModel.red_join_area_active)

        this.silverArrow.addComponentOrReplace(themeResource.sceneModel.arrow_silver)
        this.redArrow.addComponentOrReplace(themeResource.sceneModel.arrow_red)
    }
    _loadingModel() {
        this.scenePivot.addComponent(new Transform({
            position: new Vector3(16, 0, 16)
        }))

        let triggerBox = new utils.TriggerBoxShape(new Vector3(5, 10, 5), Vector3.Zero())

        this.joinAreaSilver.setParent(this.scenePivot)
        this.joinAreaSilver.addComponent(new Transform({
            position: new Vector3(0, 0, -12)
        }))
        this.silverArrow.setParent(this.scenePivot)
        this.silverArrow.addComponent(new Transform({
            position: new Vector3(0, 3, -12),
            scale: new Vector3(1.5, 1.5, 1.5)
        }))

        this.joinAreaSilver.addComponent(new utils.TriggerComponent(triggerBox, null, null, null, null,
            () => {
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    if (gameData.getPlayer().SILVER === null) {
                        soundResources.join.getComponent(AudioSource).playOnce()

                        log('SILVER PLAYER: JOIN')
                        let playerJoinMsg = {
                            method: ClientMethod.JOIN,
                            data: {
                                color: GameColor.SILVER
                            }
                        }
                        WSSHandler.sendMsg(playerJoinMsg)
                    }
                }
            },
            () => {
                if (gameData.getPlayer().SILVER === userData.getUserName()
                    && gameData.getPlayer().RED === null
                ) {
                    log('SILVER PLAYER: CANCEL')
                    this.cancelJoin()
                }
            },
            false
        ))
        this.joinAreaSilver.getComponent(utils.TriggerComponent).enabled = false

        this.joinAreaRed.setParent(this.scenePivot)
        this.joinAreaRed.addComponent(new Transform({
            position: new Vector3(0, 0, 12)
        }))
        this.redArrow.setParent(this.scenePivot)
        this.redArrow.addComponent(new Transform({
            position: new Vector3(0, 3, 12),
            scale: new Vector3(1.5, 1.5, 1.5)
        }))

        this.joinAreaRed.addComponent(new utils.TriggerComponent(triggerBox, null, null, null, null,
            () => {
                if (gameData.getMode() === GameMode.MULTIPLAYER) {
                    if (gameData.getPlayer().RED === null) {
                        soundResources.join.getComponent(AudioSource).playOnce()

                        log('RED PLAYER: JOIN')
                        let playerJoinMsg = {
                            method: ClientMethod.JOIN,
                            data: {
                                color: GameColor.RED
                            }
                        }
                        WSSHandler.sendMsg(playerJoinMsg)
                    }
                }
            },
            () => {
                if (gameData.getPlayer().RED === userData.getUserName()
                    && gameData.getPlayer().SILVER === null) {
                        log('RED PLAYER: CANCEL')
                        this.cancelJoin()
                    }
            },
            false
        ))
        this.joinAreaRed.getComponent(utils.TriggerComponent).enabled = false

        this.joinAreaActiveSilver.setParent(this.scenePivot)
        this.joinAreaActiveSilver.addComponent(new Transform({
            position: new Vector3(0, 0, -12),
            scale: new Vector3(0, 0, 0)
        }))

        this.joinAreaActiveRed.setParent(this.scenePivot)
        this.joinAreaActiveRed.addComponent(new Transform({
            position: new Vector3(0, 0, 12),
            scale: new Vector3(0, 0, 0)
        }))

        engine.addEntity(this.scenePivot)
    }

    cancelJoin() {
        log('request cancel join to server')
        let cancelJoinMsg = {
            method: ClientMethod.CANCELJOIN,
            data: {}
        }
        WSSHandler.sendMsg(cancelJoinMsg)
    }
    
    updateModelResource(theme) {
        let modelResource = themeData.getCurrentThemeData().resources
        this.joinAreaRed.addComponentOrReplace(modelResource.model.sceneModel.red_join_area)
        this.joinAreaSilver.addComponentOrReplace(modelResource.model.sceneModel.silver_join_area)

        this.joinAreaActiveRed.addComponentOrReplace(modelResource.model.sceneModel.red_join_area_active)
        this.joinAreaActiveSilver.addComponentOrReplace(modelResource.model.sceneModel.silver_join_area_active)

        if (theme === GameTheme.THEME1 || theme === GameTheme.THEME4 || theme === GameTheme.THEME2) {
            this.joinAreaActiveRed.getComponent(Transform).position = new Vector3(0, 0, 12)
            this.joinAreaRed.getComponent(Transform).position = new Vector3(0, 0, 12)

            this.joinAreaActiveSilver.getComponent(Transform).position = new Vector3(0, 0, -12)
            this.joinAreaSilver.getComponent(Transform).position = new Vector3(0, 0, -12)

            this.silverArrow.getComponent(Transform).position = new Vector3(0, 3, -12)
            this.redArrow.getComponent(Transform).position = new Vector3(0, 3, 12)
        }
        else if (theme === GameTheme.THEME3) {
            this.joinAreaActiveRed.getComponent(Transform).position = new Vector3(-5, 0, 12)
            this.joinAreaRed.getComponent(Transform).position = new Vector3(-5, 0, 12)

            this.joinAreaActiveSilver.getComponent(Transform).position = new Vector3(5, 0, -12)
            this.joinAreaSilver.getComponent(Transform).position = new Vector3(5, 0, -12)

            this.silverArrow.getComponent(Transform).position = new Vector3(5, 3, -12)
            this.redArrow.getComponent(Transform).position = new Vector3(-5, 3, 12)
        }
    }


    update(dt: number) {
        if (WSSHandler.getReadyState() === WebSocket.OPEN) {
            if (gameData.getMode() === GameMode.MULTIPLAYER) {
                if (gameData.getPlayer().RED === null) {
                    this.joinAreaActiveRed.getComponent(Transform).scale.setAll(1)
                    this.joinAreaActiveRed.getComponent(Transform).rotate(Vector3.Up(), 180 * dt)
                    this.joinAreaRed.getComponent(utils.TriggerComponent).enabled = true

                    this.redArrow.getComponent(Transform).scale.setAll(1.5)
                    this.redArrow.getComponent(Transform).rotate(Vector3.Up(), 30 * dt)
                }
                else {
                    this.joinAreaActiveRed.getComponent(Transform).scale.setAll(0)
                    this.redArrow.getComponent(Transform).scale.setAll(0)

                    if (gameData.getPlayer().RED !== userData.getUserName())
                        this.joinAreaRed.getComponent(utils.TriggerComponent).enabled = false
                }
                if (gameData.getPlayer().SILVER === null) {
                    this.joinAreaActiveSilver.getComponent(Transform).scale.setAll(1)
                    this.joinAreaActiveSilver.getComponent(Transform).rotate(Vector3.Up(), 180 * dt)
                    this.joinAreaSilver.getComponent(utils.TriggerComponent).enabled = true

                    this.silverArrow.getComponent(Transform).scale.setAll(1.5)
                    this.silverArrow.getComponent(Transform).rotate(Vector3.Up(), 30 * dt)
                }
                else {
                    this.joinAreaActiveSilver.getComponent(Transform).scale.setAll(0)
                    this.silverArrow.getComponent(Transform).scale.setAll(0)

                    if (gameData.getPlayer().SILVER !== userData.getUserName())
                        this.joinAreaSilver.getComponent(utils.TriggerComponent).enabled = false
                }
            }
        }
    }
}
