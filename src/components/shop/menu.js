/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMenuButtons } from "./menu-buttons.js";
import {
    setVisible,
    resize,
    getInnerRectBounds,
    createRect,
    getSafeArea,
    createPaneBackground,
} from "./shop-layout.js";

export const createMenu = scene => {
    const bounds = getSafeArea(scene.layout);

    //TODO remove these decorations in favour of a container object
    const container = scene.add.container();
    container.config = scene.config;
    container.setVisible = setVisible(container);
    container.resize = resize(container);
    container.memoisedBounds = bounds;

    const contents = [
        createRect(scene, getInnerRectBounds(scene), 0x0000ff),
        createPaneBackground(scene, bounds, "menu"),
    ];

    container.add(contents);

    container.buttons = createMenuButtons(container);

    container.setY(bounds.height / 2 + bounds.y);
    return container;
};
