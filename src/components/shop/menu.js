/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea } from "./shop-layout.js";

export const createMenu = (scene, metrics, config) => {

    const menuContainer = scene.add.container();

    const bounds = getSafeArea(scene.layout);

    const yOffset = bounds.height / 2 + bounds.y;
    const halfWidth = bounds.width / 2;
    
    menuContainer.add(scene.add.rectangle(-halfWidth / 2, yOffset, halfWidth, bounds.height, 0xff0000, 0.3))
    menuContainer.add(scene.add.rectangle(halfWidth / 2, yOffset, halfWidth, bounds.height, 0xff00ff, 0.3))
    
    return menuContainer;
};
