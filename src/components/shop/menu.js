/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getSafeArea } from "./shop-layout.js";
import { createGelButtons, resizeGelButtons } from "./menu-buttons.js";

export const createMenu = (scene, config, bounds) => {
    // const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = config;

    const menuContainer = scene.add.container();
    menuContainer.config = { ...config, assetKeys: scene.config.assetKeys };
    menuContainer.setVisible = setVisible(menuContainer);
    menuContainer.resize = resize(menuContainer);
    menuContainer.memoisedBounds = bounds; // workaround, pending CGPROD-2887

    menuContainer.add([
        createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff0000),
        createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff00ff),
        createRect(scene, getInnerRectBounds(bounds, !buttonsRight), 0x0000ff),
    ]);
    const yOffset = bounds.height / 2 + bounds.y;
    menuContainer.buttons = createGelButtons(
        scene,
        getInnerRectBounds(bounds, buttonsRight),
        menuContainer.config,
        yOffset,
    );

    menuContainer.setY(yOffset);
    return menuContainer;
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

const getInnerRectBounds = (outerBounds, isOnLeft) => {
    const innerBounds = getHalfRectBounds(outerBounds, isOnLeft);
    return {
        x: isOnLeft ? -innerBounds.width / 2 : innerBounds.width / 2,
        y: innerBounds.y,
        width: innerBounds.width * 0.65,
        height: innerBounds.height * 0.6,
    };
};

const createRect = (scene, bounds, colour) =>
    scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, colour, 0.3);

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
