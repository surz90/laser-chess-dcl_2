import modelResources from "./resources/modelResources"
import { ResourceController } from "./resources/resourcesController"
import { PlayerMatching } from "./playerMatching"
import { GameLogic } from "./gameLogic/gameLogic"
import { GameUI } from "./UI/gameUI"
import { UIEVentReceiver } from "./UI/UIEventReceiver"

import { getUserData, getUserPublicKey } from '@decentraland/Identity'
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'

import { GameTutorial } from "./gameLogic/gameTutorial"
import { BoardView } from "./board/boardView"
import { GameController } from "./gameLogic/gameModeController"
import { WSSHandler } from "./serverEvent/websocketHandler"
import { userData } from "./gameData/userData"
import utils from "../node_modules/decentraland-ecs-utils/index"
import soundResources from "./resources/soundResources"

const ID = '2'

soundResources.music.setVolume(0.5)
soundResources.music.getComponent(AudioSource).playing = true

//const wssUrl = 'ws://localhost:8080'
const wssUrl = 'wss://155-138-227-54.nip.io/broadcast'

//LOADING BASE SCENE
const centerScene = new Vector3(16, 0, 16)
const baseScene = new Entity()
baseScene.addComponentOrReplace(modelResources.FREE_1.sceneModel.base_scene)
baseScene.addComponent(new Transform({
    position: centerScene
}))
engine.addEntity(baseScene)

//FETCH USER INFORMATION
const FetchuserInformation = (async () => {
    const userInfo = await getUserData()
    log(userInfo)
    userData.setUserName(userInfo.displayName)

    const publicKeyInfo = await getUserPublicKey()
    log(publicKeyInfo)
    userData.setUserEth(publicKeyInfo)

    const realm = await getCurrentRealm()
    log(realm)
    userData.setUserRealm(realm.displayName + ID)
})





const UIEVents = new EventManager()
const gameUI = new GameUI(UIEVents)

gameUI.UIObjects.serverNotif.setNotif('LOADING SCENE\nPLEASE WAIT', 30)
gameUI.UIObjects.loadingUI.showLoading()


const delayStart = new Entity()
engine.addEntity(delayStart)
delayStart.addComponent(new utils.Delay(10000, () => {
    FetchuserInformation()
        .then(() => {
            log('fetch success')

            const boardView = new BoardView()
            const gameLogic = new GameLogic(gameUI, boardView)
            const gameTutorial = new GameTutorial(boardView, gameUI)

            WSSHandler.init(wssUrl, gameUI, gameLogic)

            const gameController = new GameController(gameUI, UIEVents, boardView, gameLogic, gameTutorial)
            const playerMatching = new PlayerMatching(UIEVents)
            const resourceController = new ResourceController(baseScene, playerMatching, gameLogic)
            const uiEventReceiver = new UIEVentReceiver(gameUI, gameLogic, gameTutorial, playerMatching, UIEVents, resourceController, gameController)

            engine.addSystem(new wssControl())
        })
        .catch((err) => {
            log('fetch data failed', err)
            log('please refresh scene')
        })
}))

const camera = Camera.instance


class wssControl {
    readystate = null
    userInScene: boolean

    constructor() {
        this.userInScene= isInScene()
    }
    update(dt: number) {
        let inScene = isInScene()

        if (this.readystate !== WSSHandler.getReadyState()) {
            log('websocket state change: ', this.readystate, WSSHandler.getReadyState())
            this.readystate = WSSHandler.getReadyState()
        }

        if (!isInScene()) {
            //if user outside the scene and websocket not initiating any connection
            //terminate wss connection
            if ((WSSHandler.getReadyState() === WebSocket.OPEN || WSSHandler.getReadyState() === WebSocket.CONNECTING)
                && WSSHandler.isInit() === false) {
                WSSHandler.closeWs()
            }
        }

        if (this.userInScene === false && inScene === true) {
            log('user enter')
            if ((WSSHandler.getReadyState() !== WebSocket.OPEN || WSSHandler.getReadyState() !== WebSocket.CONNECTING)
                && WSSHandler.isInit() === false) {
                WSSHandler.connectWs(wssUrl)
            }
        }

        if (this.userInScene === true && inScene === false) {
            log('user exit')
        }
        this.userInScene = inScene
    }
}

export function isInScene() {
    if (camera.position.x > 32 || camera.position.x < 0 ||
        camera.position.z > 32 || camera.position.z < 0) {
        return false
    }
    else return true
}
