/**
 * Scaling and positioning for shop UI elements.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { resizeGelButtons } from "./menu-buttons.js";

export const getSafeArea = layout => layout.getSafeArea({}, false);

export const getXPos = (container, safeArea, padding) => safeArea.width / 2 - container.getBounds().width / 2 - padding;

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

export const setVisible = container => isVisible => {
    container.visible = isVisible;
    const buttons = container.buttons;
    buttons.forEach(button => {
        button.visible = isVisible;
        button.input.enabled = container.visible;
        button.accessibleElement.update();
    });
};

export const resize = container => bounds => {
    const { memoisedBounds } = container;
    container.memoisedBounds = bounds;
    container.setScale(
        (bounds.width / memoisedBounds.width) * container.scaleX,
        (bounds.height / memoisedBounds.height) * container.scaleY,
    );
    const yOffset = container.getBounds().y - bounds.y;
    container.setY(container.y - yOffset);
    resizeGelButtons(container, bounds, getInnerRectBounds(bounds, container.config.menu.buttonsRight));
};

export const getHalfRectBounds = (menuBounds, isOnRight) => {
    const halfWidth = menuBounds.width / 2;
    return {
        x: isOnRight ? halfWidth / 2 : -halfWidth / 2,
        y: 0,
        width: halfWidth,
        height: menuBounds.height,
    };
};

export const getInnerRectBounds = (outerBounds, isOnRight) => {
    const innerBounds = getHalfRectBounds(outerBounds, isOnRight);
    return {
        x: isOnRight ? innerBounds.width / 2 : -innerBounds.width / 2,
        y: innerBounds.y,
        width: innerBounds.width * 0.65,
        height: innerBounds.height * 0.6,
    };
};

export const createRect = (scene, bounds, colour) =>
    scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, colour, 0.3);
