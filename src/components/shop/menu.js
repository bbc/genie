/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getSafeArea } from "./shop-layout.js";
import { createGelButtons, resizeGelButtons } from "./menu-buttons.js";
import { GelButton } from "../../core/layout/gel-button.js";

export const createMenu = (scene, config) => {
    const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = config;

    const menuContainer = scene.add.container();
    menuContainer.config = config;
    menuContainer.setVisible = setVisible(menuContainer);
    menuContainer.resize = resize(menuContainer);
    menuContainer.memoisedBounds = bounds; // gel button offset bug means we can't rely on getBounds() for now

    menuContainer.add(createRect(scene, bounds, buttonsRight));
    menuContainer.add(createButtonRect(scene, bounds, !buttonsRight));
    menuContainer.add(createInnerRect(scene, bounds, buttonsRight));
    const yOffset = bounds.height / 2 + bounds.y;
    menuContainer.buttons = createGelButtons(scene, getInnerRectBounds(bounds, buttonsRight), config, yOffset);

    menuContainer.setY(yOffset);
    return menuContainer;
};

const createButtonRect = (scene, menuBounds, isOnLeft) => {
    const { x, y, width, height } = getHalfRectBounds(menuBounds, isOnLeft);
    return scene.add.rectangle(x, y, width, height, 0xff00ff, 0.3);
};

const createInnerRect = (scene, outerBounds, buttonsRight) => {
    const isOnLeft = !buttonsRight;
    const bounds = getInnerRectBounds(outerBounds, isOnLeft);
    return scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0x0000ff, 0.3);
};

const getInnerRectBounds = (outerBounds, isOnLeft) => {
    const innerBounds = getHalfRectBounds(outerBounds, isOnLeft);
    return {
        x: isOnLeft? -innerBounds.width / 2 : innerBounds.width / 2,
        y: innerBounds.y,
        width: innerBounds.width * 0.65,
        height: innerBounds.height * 0.6,
    };
};

const createRect = (scene, menuBounds, isOnLeft) => {
    const { x, y, width, height } = getHalfRectBounds(menuBounds, isOnLeft);
    return scene.add.rectangle(x, y, width, height, 0xff0000, 0.3);
};

const getHalfRectBounds = (menuBounds, isOnLeft) => {
    const halfWidth = menuBounds.width / 2;
    return {
        x: isOnLeft ? -halfWidth / 2 : halfWidth / 2,
        y: 0,
        width: halfWidth,
        height: menuBounds.height,
    };
};

const setVisible = container => isVisible => {
    container.visible = isVisible;
    const buttons = getGelButtons(container);
    buttons.forEach(button => {
        button.visible = isVisible;
        button.input.enabled = container.visible;
        button.accessibleElement.update();
    });
};

const getGelButtons = container => container.buttons;

const resize = container => bounds => {
    const { memoisedBounds } = container;
    container.memoisedBounds = bounds;
    container.setScale(
        (bounds.width / memoisedBounds.width) * container.scaleX,
        (bounds.height / memoisedBounds.height) * container.scaleY,
    );
    const yOffset = container.getBounds().y - bounds.y;
    container.setY(container.y - yOffset);
    resizeGelButtons(container.buttons, bounds, getInnerRectBounds(bounds, false), container.config.buttonsRight);
};
