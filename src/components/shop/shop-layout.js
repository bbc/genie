/**
 * Scaling and positioning for shop UI elements.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const getSafeArea = layout => layout.getSafeArea({}, false);

export const getXPos = (container, safeArea) => safeArea.width / 2 - container.getBounds().width / 2;

export const getYPos = (metrics, safeArea) => {
    const { verticals, verticalBorderPad } = metrics;
    const padding = (safeArea.y - verticals.top) / 2 + verticalBorderPad / 2;
    return verticals.top + padding;
};

export const getScaleFactor = args => {
    const { metrics, container, fixedWidth, safeArea } = args;
    const oldScale = container.scale;
    const { verticals, verticalBorderPad } = metrics;
    const availableSpace = safeArea.y - verticals.top - verticalBorderPad;
    const containerBounds = container.getBounds();
    const padding = verticalBorderPad / 2;
    const scaleFactorY = ((availableSpace - padding) / containerBounds.height) * oldScale;
    const scaleFactorX = (safeArea.width / 4 / containerBounds.width) * oldScale;
    return fixedWidth ? scaleFactorY : Math.min(scaleFactorY, scaleFactorX);
};

export const getInnerRectBounds = scene => {
    const outerBounds = getSafeArea(scene.layout);
    const halfWidth = outerBounds.width / 2;
    return {
        x: halfWidth / 2,
        y: 0,
        width: halfWidth * 0.65,
        height: outerBounds.height * 0.6,
    };
};

export const createPaneBackground = (scene, bounds) => {
    const key = getPaneBackgroundKey(scene);
    if (!key) {
        const rectangle = scene.add.rectangle(0, 0, 1, 1, 0, 0);
        rectangle.setScale(bounds.width / rectangle.width, bounds.height / rectangle.height);
        return rectangle;
    } else {
        const image = scene.add.image(0, 0, key);
        image.setScale(bounds.width / image.width, bounds.height / image.height);
        return image;
    }
};

const getPaneBackgroundKey = scene => scene.config.confirm?.background;
