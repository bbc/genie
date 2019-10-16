/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const get = screen => {
    const parentScreens = screen.context.parentScreens;

    if (parentScreens.length > 0) {
        return parentScreens[parentScreens.length - 1].scene.key;
    } else {
        return screen.scene.key;
    }
};
