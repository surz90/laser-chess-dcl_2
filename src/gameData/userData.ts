import { PlayerStatus, GameTheme } from "../gameTypes"

export const userData = (function () {
    let uuID = null
    let userName = null
    let userEth = null
    let userRealm = null
    let inGameStatus: PlayerStatus = PlayerStatus.SPECTATOR
    let theme: GameTheme = GameTheme.THEME1

    return {
        resetUserData() {
            userName = null
            userEth = null
            userRealm = null
            inGameStatus = PlayerStatus.SPECTATOR
            theme = GameTheme.THEME1
        },
        setuuID(_uuid: string) {
            uuID = _uuid
        },
        setUserName(_userName: string) {
            userName = _userName
            log('user name: ', userName)
        },
        setUserEth(_userEth: string) {
            userEth = _userEth
            log('eth address: ', userEth)
        },
        setUserRealm(_userRealm) {
            userRealm = _userRealm
            log('current realm: ', userRealm)
        },
        setInGameStatus(_inGameStatus: PlayerStatus) {
            inGameStatus = _inGameStatus
        },
        setTheme(_theme: GameTheme) {
            theme = _theme
        },

        getUserName() {
            return userName
        },
        getUserEth() {
            return userEth
        },
        getUserRealm() {
            return userRealm
        },
        getInGameStatus() {
            return inGameStatus
        },
        getTheme() {
            return theme
        }
    }
})()