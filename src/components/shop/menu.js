/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMenuButtons, resizeGelButtons } from "./menu-buttons.js";
import { getInnerRectBounds, getSafeArea, createPaneBackground } from "./shop-layout.js";

export const createMenu = scene => {
    const menu = { config: scene.config, container: scene.add.container() };

    populateMenu(scene, menu);

    menu.setVisible = setVisible(menu);
    menu.resize = resizeMenu(scene, menu);

    return menu;
};

const populateMenu = (scene, menu) => {
    const bounds = getSafeArea(scene.layout);

    const innerBounds = getInnerRectBounds(scene);

    const contents = [
        scene.add.rectangle(innerBounds.x, innerBounds.y, innerBounds.width, innerBounds.height, 0x000000, 0),
        createPaneBackground(scene, bounds, "menu"),
    ];
    menu.container.add(contents);
    menu.container.setY(bounds.height / 2 + bounds.y);

    menu.buttons = createMenuButtons(scene);
    menu.container.add(menu.buttons)
    resizeGelButtons(menu);
};

const resizeMenu = (scene, menu) => () => {
    const isVisible = menu.container.visible;
    menu.buttons.forEach(button => {
        button.removeAll(true);
        button.destroy();
    });
    menu.container.removeAll(true);
    menu.container.destroy();
    menu.container = scene.add.container();
    populateMenu(scene, menu);
    menu.setVisible(isVisible);
};

const setVisible = menu => isVisible => {
    menu.container.visible = isVisible;
    const buttons = menu.buttons;
    buttons.forEach(button => {
        button.visible = isVisible;
        button.input.enabled = isVisible;
        button.accessibleElement.update();
    });
};
