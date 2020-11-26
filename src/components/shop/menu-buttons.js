/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "16px",
    resolution: 5,
};

export const createMenuButtons = (scene, bounds, config, yOffset) =>
    ["Shop", "Manage"].map((button, idx) => {
        const buttonConfig = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, scene, config);
        const callback = () => scene.stack(button.toLowerCase());
        return makeButton(scene, config, buttonConfig, bounds, idx, yOffset, callback);
    });

export const createConfirmButtons = (scene, bounds, config, yOffset, callbackFn) =>
    ["Confirm", "Cancel"].map((button, idx) => {
        const buttonConfig = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, scene, config);
        const callback = () => callbackFn(button);
        return makeButton(scene, config, buttonConfig, bounds, idx, yOffset, callback);
    });

const makeButton = (scene, config, buttonConfig, bounds, idx, offset, callback) => {
    const { x, y } = getButtonPosition(bounds, idx, offset);
    const gelButton = scene.add.gelButton(x + CAMERA_X, y + CAMERA_Y, buttonConfig);
    eventBus.subscribe({
        callback,
        channel: buttonConfig.channel,
        name: buttonConfig.id,
    });
    setButtonOverlays(scene, gelButton, buttonConfig.title, config);
    accessibilify(gelButton);
    gelButton.setScale(getScale(bounds, gelButton));
    return gelButton;
};

const resizeButton = (bounds, inner, right) => (button, idx) => {
    const { y } = getButtonPosition(inner, idx, 0);
    button.setY(CAMERA_Y + (bounds.height / 2 + bounds.y) + y);
    button.setX(right ? -inner.x + CAMERA_X : inner.x + CAMERA_X);
    button.setScale(getScale(inner, button));
};

export const resizeGelButtons = (buttons, bounds, inner, right) => buttons.forEach(resizeButton(bounds, inner, right));

const getButtonConfig = (button, id, scene, config) => ({
    title: button,
    gameButton: true,
    accessibilityEnabled: true,
    ariaLabel: button,
    channel: "shop",
    group: scene.scene.key,
    id,
    key: config.assetKeys.buttonBackground,
    scene: "shop",
});

const getButtonPosition = (containerBounds, idx, yOffset) => {
    const { x, y, height } = containerBounds;
    return {
        x,
        y: y - height / 4 + (idx * height) / 2 + yOffset,
    };
};

const assetKey = (scene, key, config) => `${scene.assetPrefix}.${config.assetKeys[key]}`;

const getScale = (containerBounds, button) => containerBounds.width / button.width;

const setButtonOverlays = (scene, button, title, config) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, assetKey(scene, "buttonIcon", config)));
};
