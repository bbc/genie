/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea } from "./shop-layout.js";

export const createMenu = (scene, metrics, config) => {
    const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = config;
    
    const menuContainer = scene.add.container();
    menuContainer.add(nonButtonRect(scene, bounds, buttonsRight));
    menuContainer.add(buttonContainer(scene, bounds, !buttonsRight));

    return menuContainer;
};

const buttonContainer = (scene, menuBounds, isOnLeft) => {
    const { x, y, width, height } = getSubContainerPostition(menuBounds, isOnLeft);
    return scene.add.rectangle(x, y, width, height, 0xff00ff, 0.3);
};

const nonButtonRect = (scene, menuBounds, isOnLeft) => {
    const { x, y, width, height } = getSubContainerPostition(menuBounds, isOnLeft);
    return scene.add.rectangle(x, y, width, height, 0xff0000, 0.3);
};

const getSubContainerPostition = (menuBounds, isOnLeft) => {
    const yOffset = menuBounds.height / 2 + menuBounds.y;
    const halfWidth = menuBounds.width / 2;
    return {
        x: isOnLeft ? -halfWidth / 2 : halfWidth / 2,
        y: yOffset,
        width: halfWidth,
        height: menuBounds.height,
    };
};
