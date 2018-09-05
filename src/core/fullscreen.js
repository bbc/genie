/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const listenForTap = (rootElement, game) => {
    const onTouchEnd = () => {
        rootElement.removeEventListener("touchend", onTouchEnd);
        game.scale.startFullScreen();
    };

    rootElement.addEventListener("touchend", onTouchEnd);
};
