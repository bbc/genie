/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "16px",
    resolution: 5,
};

export const createMenuButtons = container =>
    ["Shop", "Manage"].map(button => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, container.scene);
        const callback = () => container.scene.stack(button.toLowerCase());
        return makeButton(container, config, callback);
    });

export const createConfirmButtons = (container, buttons, callback) =>
    buttons.map(button => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, container.scene);
        const gelButton = makeButton(container, config, callback);
        return gelButton;
    });

const getButtonConfig = (button, id, scene) => ({
    title: button,
    gameButton: true,
    accessibilityEnabled: true,
    ariaLabel: button,
    channel: "shop",
    group: scene.scene.key,
    id,
    key: scene.config.assetKeys.buttonBackground,
    scene: "shop",
});

const makeButton = (container, config, callback) => {
    const scene = container.scene;
    const gelButton = scene.add.gelButton(0, 0, config);
    gelButton.on(Phaser.Input.Events.POINTER_UP, callback);
    setButtonOverlays(scene, gelButton, config.title);
    return accessibilify(gelButton);
};

const resizeButton = container => (button, idx) => {
    const right = Boolean(container.scene.config.menu.buttonsRight);
    const bounds = container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = container => container.buttons.forEach(resizeButton(container));

const setButtonOverlays = (scene, button, title) =>
    button.overlays.set("caption", scene.add.text(0, 0, title, styleDefaults).setOrigin(0.5));
