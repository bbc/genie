/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea } from "./shop-layout.js";
import { createGelButtons } from "./menu-buttons.js";

export const createMenu = (scene, config, containers, backButton) => {
    const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = config;
    const callbackMemo = backButton.onPointerUp;
    const menuContainer = scene.add.container();
    menuContainer.toggleVisible = toggleVisible(menuContainer);
    menuContainer.add(createNonButtonRect(scene, bounds, buttonsRight));
    menuContainer.add(createButtonContainer(scene, bounds, !buttonsRight, config, {...containers, menu: menuContainer}));

    return menuContainer;
};

const createButtonContainer = (scene, menuBounds, isOnLeft, config, menus) => {
    const { x, y, width, height } = getSubContainerPosition(menuBounds, isOnLeft);
    const buttonContainer = scene.add.container();
    buttonContainer.add(scene.add.rectangle(x, y, width, height, 0xff00ff, 0.3));
    buttonContainer.add(createInnerContainer(scene, buttonContainer, config, menus));
    return buttonContainer;
};

const createInnerContainer = (scene, outerContainer, config, menus) => {
    const innerContainer = scene.add.container();
    const outerBounds = outerContainer.getBounds();
    const bounds = {
        x: outerBounds.x + outerBounds.width / 2,
        y: outerBounds.y + outerBounds.height / 2,
        width: outerBounds.width * 0.65,
        height: outerBounds.height * 0.6,
    };
    innerContainer.add(scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0x0000ff, 0.3));
    const gelButtons = createGelButtons(scene, innerContainer, config, menus);
    innerContainer.add(gelButtons);
    return innerContainer;
};

const createNonButtonRect = (scene, menuBounds, isOnLeft) => {
    const { x, y, width, height } = getSubContainerPosition(menuBounds, isOnLeft);
    return scene.add.rectangle(x, y, width, height, 0xff0000, 0.3);
};

const getSubContainerPosition = (menuBounds, isOnLeft) => {
    const yOffset = menuBounds.height / 2 + menuBounds.y;
    const halfWidth = menuBounds.width / 2;
    return {
        x: isOnLeft ? -halfWidth / 2 : halfWidth / 2,
        y: yOffset,
        width: halfWidth,
        height: menuBounds.height,
    };
};

const toggleVisible = container => () => container.visible = !container.visible; 
