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

//wss url
//const wssUrl = 'wss://localhost'
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

const delayStart = new Entity()
engine.addEntity(delayStart)

delayStart.addComponent(new utils.Delay(5000, () => {
    FetchuserInformation()
        .then(() => {
            log('fetch success')
            const UIEVents = new EventManager()
            const gameUI = new GameUI(UIEVents)

            const boardView = new BoardView()
            const gameLogic = new GameLogic(gameUI, boardView)
            const gameTutorial = new GameTutorial(boardView, gameUI)

            WSSHandler.init(wssUrl, gameUI, gameLogic)

            const gameController = new GameController(gameUI, UIEVents, boardView, gameLogic, gameTutorial)

            const playerMatching = new PlayerMatching(UIEVents)

            const resourceController = new ResourceController(baseScene, playerMatching, gameLogic)
        
            const uiEventReceiver = new UIEVentReceiver(gameUI, gameLogic, gameTutorial, playerMatching, UIEVents, resourceController, gameController)

            gameUI.UIObjects.serverNotif.setNotif('LOADING SCENE\nPLEASE WAIT', 30)
            gameUI.UIObjects.loadingUI.showLoading()
        })
        .catch((err) => {
            log('fetch data failed', err)
            log('please refresh scene')
        })
}))

const camera = Camera.instance

/*
class wssControl {
    constructor() {
    }
    update(dt: number) {
        if (!isInScene()) {
            //if user outside the scene and websocket not initiating any connection
            if (WSSHandler.getReadyState() === WebSocket.OPEN && WSSHandler.isInit() === false) {
                WSSHandler.getSocket().close()
            }
        }
        else {
            //if user inside the scene and webscoket in closed state but not yet initiating connection
            if (WSSHandler.getReadyState() === WebSocket.CLOSED && WSSHandler.isInit() === false) {
                WSSHandler.connect(wssUrl)
            }
        }
    }
}
engine.addSystem(new wssControl())
export function isInScene() {
    if (camera.position.x > 32 || camera.position.x < 0 ||
        camera.position.z > 32 || camera.position.z < 0) {
        return false
    }
    else return true
}
*/