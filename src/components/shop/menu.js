/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea } from "./shop-layout.js";
import { createGelButtons } from "./menu-buttons.js";
import { GelButton } from "../../core/layout/gel-button.js";
import fp from "../../../lib/lodash/fp/fp.js";

export const createMenu = (scene, config) => {
    const bounds = getSafeArea(scene.layout);
    const { buttonsRight } = config;
    const menuContainer = scene.add.container();
    menuContainer.setVisible = setVisible(menuContainer);
    menuContainer.getScaleFactor = getScaleFactor(menuContainer);
    menuContainer.memoisedBounds = bounds;
    menuContainer.add(createNonButtonRect(scene, bounds, buttonsRight));
    menuContainer.add(createButtonContainer(scene, bounds, !buttonsRight, config));

    return menuContainer;
};

const createButtonContainer = (scene, menuBounds, isOnLeft, config) => {
    const { x, y, width, height } = getSubContainerPosition(menuBounds, isOnLeft);
    const buttonContainer = scene.add.container();
    buttonContainer.add(scene.add.rectangle(x, y, width, height, 0xff00ff, 0.3));
    buttonContainer.add(createInnerContainer(scene, buttonContainer, config));
    return buttonContainer;
};

const createInnerContainer = (scene, outerContainer, config) => {
    const innerContainer = scene.add.container();
    const outerBounds = outerContainer.getBounds();
    const bounds = {
        x: outerBounds.x + outerBounds.width / 2,
        y: outerBounds.y + outerBounds.height / 2,
        width: outerBounds.width * 0.65,
        height: outerBounds.height * 0.6,
    };
    innerContainer.add(scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0x0000ff, 0.3));
    const gelButtons = createGelButtons(scene, innerContainer, config);
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

// const toggleVisible = container => () => {
//     setVisible(container, !container.visible);
// };

const setVisible = container => isVisible => {
    container.visible = isVisible;
    const buttons = getGelButtons(container);
    buttons.forEach(button => {
        button.input.enabled = container.visible;
        button.accessibleElement.update();
    });
};

const getGelButtons = container => {
    const buttons = [];
    if (container.list.length === 0) return buttons;
    container.list.forEach(child => {
        fp.cond([
            [c => c.constructor.name === GelButton.name, c => buttons.push(c)],
            [c => c.constructor.name === Phaser.GameObjects.Container.name, c => buttons.push(...getGelButtons(c))],
        ])(child);
    });
    return buttons;
};

const getScaleFactor = container => bounds => {
    const { memoisedBounds } = container;
    container.memoisedBounds = bounds;
    return [bounds.width / memoisedBounds.width, bounds.height / memoisedBounds.height];
    // needs to reposition the buttons
};
