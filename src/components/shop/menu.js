/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMenuButtons } from "./menu-buttons.js";
import { setVisible, resize, getHalfRectBounds, getInnerRectBounds, createRect, getSafeArea } from "./shop-layout.js";

export const createMenu = scene => {
    const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = scene.config.menu;

    const container = scene.add.container();
    container.config = scene.config;
    container.setVisible = setVisible(container);
    container.resize = resize(container);
    container.memoisedBounds = bounds; // workaround, pending CGPROD-2887

    container.add([
        createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff0000),
        createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff00ff),
        createRect(scene, getInnerRectBounds(bounds, buttonsRight), 0x0000ff),
    ]);

    container.buttons = createMenuButtons(scene, getInnerRectBounds(bounds, buttonsRight));

    container.setY(bounds.height / 2 + bounds.y);
    return container;
};
