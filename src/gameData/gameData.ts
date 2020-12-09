import { GameState, PlayerStatus, GameColor, GameMode } from "../gameTypes"
import { userData } from "./userData"

export const gameData = (function () {
    let gameData = {
        mode: GameMode.MULTIPLAYER,
        players: {
            SILVER: null,
            RED: null
        },
        times: {
            SILVER: null,
            RED: null
        },
        gameplay: {
            fen: null,
            lastMove: null,
            turn: null
        }
    }

    return {
        resetGameData() {
            gameData = {
                mode: GameMode.MULTIPLAYER,
                players: {
                    SILVER: null,
                    RED: null
                },
                times: {
                    SILVER: null,
                    RED: null
                },
                gameplay: {
                    fen: null,
                    lastMove: null,
                    turn: null
                }
            }
        },
        setPlayer(_type: GameColor, _userName: string) {
            log('set player: ', GameColor[_type], _userName)
            if (_type === GameColor.SILVER) {
                gameData.players.SILVER = _userName
            }
            else if (_type === GameColor.RED) {
                gameData.players.RED = _userName
            }
            else {
                log('error set player: ', _type, _userName)
            }

            if (gameData.players.SILVER === userData.getUserName())
                userData.setInGameStatus(PlayerStatus.SILVER)
            else if (gameData.players.RED === userData.getUserName())
                userData.setInGameStatus(PlayerStatus.RED)
            else
                userData.setInGameStatus(PlayerStatus.SPECTATOR)
        },
        getPlayer() {
            return gameData.players
        },
        setMode(_mode: GameMode) {
            gameData.mode = _mode
        },
        getMode() {
            return gameData.mode
        }

    }
})()