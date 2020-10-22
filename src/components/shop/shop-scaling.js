/**
 * Scaling and positioning for shop UI elements.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const getSafeArea = layout => layout.getSafeArea({}, false);

export const getXPos = (container, safeArea, padding) => safeArea.width / 2 - container.getBounds().width / 2 - padding;

export const getYPos = (metrics, safeArea) => {
    const { verticals, verticalBorderPad } = metrics;
    const padding = (safeArea.y - verticals.top) / 2 + verticalBorderPad / 2;
    return verticals.top + padding;
};

export const getScaleFactor = args => {
    const { metrics, container, fixedWidth, safeArea } = args;
    container.setScale(1);
    const { verticals, verticalBorderPad } = metrics;
    const availableSpace = safeArea.y - verticals.top - verticalBorderPad;
    const containerBounds = container.getBounds();
    const padding = verticalBorderPad / 2;
    const scaleFactorY = (availableSpace - padding) / containerBounds.height;
    const scaleFactorX = safeArea.width / 4 / containerBounds.width;
    return fixedWidth ? scaleFactorY : Math.min(scaleFactorY, scaleFactorX);
};
