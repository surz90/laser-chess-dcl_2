import { GameTheme } from "../gameTypes"
import { themeData } from "../gameData/themeData"
import { PlayerMatching } from "../playerMatching"
import { GameLogic } from "../gameLogic/gameLogic"
import modelResources from "./modelResources"

export class ResourceController {
    theme: GameTheme
    baseEntity: Entity
    playerMatching: PlayerMatching
    gameLogic: GameLogic

    constructor(_baseEntity: Entity, _playerMatching: PlayerMatching, _gameLogic: GameLogic) {
        this.theme = GameTheme.THEME1

        this.baseEntity = _baseEntity
        this.playerMatching = _playerMatching
        this.gameLogic = _gameLogic
    }
    setTheme(_theme: GameTheme) {
        if (this.theme === _theme) {
            return false
        }

        this.theme = _theme
        themeData.setCurrentTheme(_theme)

        this._changeModelResources()
        return true
    }
    getTheme() {
        return this.theme
    }

    _getModelResource() {
        if (this.theme === GameTheme.THEME1) return modelResources.FREE_1
        if (this.theme === GameTheme.THEME2) return modelResources.FREE_2
        if (this.theme === GameTheme.THEME3) return modelResources.HALLOWEEN
        if (this.theme === GameTheme.THEME4) return modelResources.POLAR

        return modelResources.FREE_1
    }

    _changeModelResources() {
        let resource: any = this._getModelResource()

        this.baseEntity.addComponentOrReplace(resource.sceneModel.base_scene)

        this.gameLogic.updateModelResource(resource)

        this.playerMatching.updateModelResource(this.theme)
    }

    /*
    update(dt: number) {

    }
    */
}