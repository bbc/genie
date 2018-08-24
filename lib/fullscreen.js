export const listenForTap = (isFullWindow, rootElement, game) => {
    const onTouchEnd = () => {
        rootElement.removeEventListener("touchend", onTouchEnd);
        game.scale.startFullScreen();
    };

    if (isFullWindow) {
        rootElement.addEventListener("touchend", onTouchEnd);
    }
};
