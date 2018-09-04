/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const get = (gameInstance, gameContext) => {
    const popupScreens = gameContext.popupScreens;

    if (popupScreens.length > 0) {
        return popupScreens[popupScreens.length - 1];
    } else {
        return gameInstance.state.current;
    }
};
