/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const createRowBackdrops = (scene, containers) => {
    const images = containers.map(
        container =>
            container.rowConfig.backdrop &&
            scene.add
                .image(container.x, container.y, container.rowConfig.backdrop.key)
                .setAlpha(container.rowConfig.backdrop.alpha === undefined ? 1 : container.rowConfig.backdrop.alpha),
    );
    images.forEach((image, index) => {
        if (image) {
            image.displayOriginX -= containers[index].rowConfig.backdrop.offsetX || 0;
            image.displayOriginY -= containers[index].rowConfig.backdrop.offsetY || 0;
        }
    });
    return images;
};

export const scaleRowBackdrops = (backdrops, containers) =>
    containers.forEach((container, index) => {
        if (!container.rowConfig.backdrop) {
            return;
        }
        backdrops[index].x = container.x;
        backdrops[index].y = container.y;
    });
