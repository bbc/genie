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

export const resize = pane => bounds => {
    const containerBounds = pane.container.getBounds();

    const scaleX = (bounds.width / containerBounds.width) * pane.container.scaleX;
    const scaleY = (bounds.height / containerBounds.height) * pane.container.scaleY;
    pane.container.setScale(scaleX, scaleY);

    const yOffset = pane.container.getBounds().y - bounds.y;
    pane.container.setY(pane.container.y - yOffset);
    resizeGelButtons(pane);
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

export const getInnerRectBounds = scene => {
    const outerBounds = getSafeArea(scene.layout);
    const right = scene.config.menu.buttonsRight;
    const innerBounds = getHalfRectBounds(outerBounds, right);
    return {
        x: innerBounds.width / 2,
        y: innerBounds.y,
        width: innerBounds.width * 0.65,
        height: innerBounds.height * 0.6,
    };
};

export const createRect = (scene, bounds, colour) =>
    scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, colour, 0);

export const createPaneBackground = (scene, bounds, pane) => {
    const key = getPaneBackgroundKey(scene, pane);
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

export const getPaneBackgroundKey = (scene, pane) =>
    scene.config.backgrounds?.[pane] ? `${scene.assetPrefix}.${scene.config.backgrounds[pane]}` : null;
