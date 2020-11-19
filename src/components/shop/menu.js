/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMenuButtons } from "./menu-buttons.js";
import { setVisible, resize, getHalfRectBounds, getInnerRectBounds, createRect } from "./shop-layout.js";

export const createMenu = (scene, config, bounds) => {
    const { buttonsRight } = config;

    const menuContainer = scene.add.container();
    menuContainer.config = { ...config, assetKeys: scene.config.assetKeys };
    menuContainer.setVisible = setVisible(menuContainer);
    menuContainer.resize = resize(menuContainer);
    menuContainer.memoisedBounds = bounds; // workaround, pending CGPROD-2887

    menuContainer.add([
        createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff0000),
        createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff00ff),
        createRect(scene, getInnerRectBounds(bounds, buttonsRight), 0x0000ff),
    ]);
    const yOffset = bounds.height / 2 + bounds.y;
    menuContainer.buttons = createMenuButtons(
        scene,
        getInnerRectBounds(bounds, buttonsRight),
        menuContainer.config,
        yOffset,
    );

    menuContainer.setY(yOffset);
    return menuContainer;
};
