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
    const menu = { config: scene.config, container: scene.add.container() };

    const bounds = getSafeArea(scene.layout);
    const contents = [
        createRect(scene, getInnerRectBounds(scene), 0x0000ff),
        createPaneBackground(scene, bounds, "menu"),
    ];
    menu.container.add(contents);
    menu.container.setY(bounds.height / 2 + bounds.y);

    menu.buttons = createMenuButtons(menu.container);
    menu.setVisible = setVisible(menu);
    menu.resize = resize(menu);

    return menu;
};
