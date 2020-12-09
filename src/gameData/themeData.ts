import { GameState, PlayerStatus, GameColor, GameTheme } from "../gameTypes"
import { userData } from "./userData"
import modelResources from "../resources/modelResources"

//WILL MOVE TO WSS LATER

export const themeData = (function () {
    let currentTheme = GameTheme.THEME1
    let availableTheme = [GameTheme.THEME1, GameTheme.THEME2, GameTheme.THEME3, GameTheme.THEME4]
    let themeList = {
        THEME1: {
            name: GameTheme.THEME1,
            priceMatic: 0,
            priceEth: 0,
            resources: {
                model: modelResources.FREE_1
            },
            animationSpeed: {
                cele: 2,
                block: 2,
                shoot: 3,
                reflect: 5,
                die: 2
            },
            laserHeight: 0.6
        },
        THEME2: {
            name: GameTheme.THEME2,
            priceMatic: 0,
            priceEth: 0,
            resources: {
                model: modelResources.FREE_2
            },
            animationSpeed: {
                cele: 2,
                block: 2,
                shoot: 3,
                reflect: 5,
                die: 2
            },
            laserHeight: 1.3
        },
        THEME3: {
            name: GameTheme.THEME3,
            priceMatic: 20,
            priceEth: 40,
            resources: {
                model: modelResources.HALLOWEEN
            },
            animationSpeed: {
                cele: 2,
                block: 2,
                shoot: 3,
                reflect: 3,
                die: 2
            },
            laserHeight: 1.46
        },
        THEME4: {
            name: GameTheme.THEME4,
            priceMatic: 25,
            priceEth: 50,
            resources: {
                model: modelResources.POLAR
            },
            animationSpeed: {
                cele: 2,
                block: 2,
                shoot: 3.5,
                reflect: 2,
                die: 3
            },
            laserHeight: 1.61
        }
    }

    return {
        addAvailableTheme(_theme) {
            if(availableTheme.indexOf(_theme) === -1)
                availableTheme.push(_theme)
        },
        setCurrentTheme(_theme) {
            currentTheme = _theme
        },
        getCurrentTheme() {
            return currentTheme
        },
        getCurrentThemeData() {
            if (currentTheme === GameTheme.THEME1) return themeList.THEME1
            else if (currentTheme === GameTheme.THEME2) return themeList.THEME2
            else if (currentTheme === GameTheme.THEME3) return themeList.THEME3
            else if (currentTheme === GameTheme.THEME4) return themeList.THEME4

            else return themeList.THEME1
        },
        getAvailableTheme() {
            return availableTheme
        },
        getThemeList() {
            return themeList
        },
    }
})()