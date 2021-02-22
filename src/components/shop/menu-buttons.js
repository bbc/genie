/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { addText } from "../../core/layout/text-elem.js";
import { gmi } from "../../core/gmi/gmi.js";

export const createMenuButtons = container =>
    ["Shop", "Manage"].map(button => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, container.scene);
        const callback = () => {
            container.scene.stack(button.toLowerCase());
            gmi.setStatsScreen(button === "Shop" ? "shopbuy" : "shopmanage");
        };
        return makeButton(container, config, callback);
    });

export const createConfirmButtons = (container, actionText, confirmCallback, cancelCallback) =>
    [actionText, "Cancel"].map(button => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, container.scene);
        const gelButton = makeButton(container, config, button === "Cancel" ? cancelCallback : confirmCallback);
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
    key: "menuButtonBackground",
    scene: scene.assetPrefix,
});

const makeButton = (container, config, callback) => {
    const scene = container.scene;
    const gelButton = scene.add.gelButton(0, 0, config);
    gelButton.on(Phaser.Input.Events.POINTER_UP, callback);
    setButtonOverlays(scene, gelButton, config.title);
    return accessibilify(gelButton);
};

const resizeButton = pane => (button, idx) => {
    const right = Boolean(pane.container.scene.config.menu.buttonsRight);
    const bounds = pane.container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = pane => pane.buttons?.forEach(resizeButton(pane));

const setButtonOverlays = (scene, button, title) =>
    button.overlays.set("caption", addText(scene, 0, 0, title, scene.config.menuButtons).setOrigin(0.5));
