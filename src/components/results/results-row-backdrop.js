/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const getRowPositionX = (container, offsetX = 0) => container.x + offsetX;
const getRowPositionY = (container, offsetY = 0) => container.y + offsetY;

export const createRowBackdrops = (scene, containers) =>
    containers.map(
        container =>
            container.rowConfig.backdrop &&
            scene.add
                .image(
                    getRowPositionX(container, container.rowConfig.backdrop.offsetX),
                    getRowPositionY(container, container.rowConfig.backdrop.offsetY),
                    container.rowConfig.backdrop.key,
                )
                .setAlpha(container.rowConfig.backdrop.alpha === undefined ? 1 : container.rowConfig.backdrop.alpha),
    );

export const scaleRowBackdrops = (backdrops, containers) =>
    containers.forEach((container, index) => {
        if (!container.rowConfig.backdrop) {
            return;
        }
        backdrops[index].x = getRowPositionX(container, container.rowConfig.backdrop.offsetX);
        backdrops[index].y = getRowPositionY(container, container.rowConfig.backdrop.offsetY);
    });
