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
        const gelButton = makeButton(scene, config, buttonConfig, bounds, idx, yOffset, callback);
        if (button === "Confirm") gelButton.setLegal = setLegal(gelButton);
        return gelButton;
    });

const setLegal = button => isLegal => {
    const clearTintAndAlpha = btn => Object.assign(btn, { alpha: 1, tint: 0xffffff });
    const setTintAndAlpha = btn => Object.assign(btn, { alpha: 0.25, tint: 0xff0000 });
    isLegal ? clearTintAndAlpha(button) : setTintAndAlpha(button);
};

const makeButton = (scene, config, buttonConfig, bounds, idx, offset, callback) => {
    const { x, y } = getButtonPosition(bounds, idx, offset);
    const gelButton = scene.add.gelButton(x + CAMERA_X, y + CAMERA_Y, buttonConfig);
    const event = eventBus.subscribe({
        callback,
        channel: buttonConfig.channel,
        name: buttonConfig.id,
    });
    scene.events.once("shutdown", event.unsubscribe);
    setButtonOverlays(scene, gelButton, buttonConfig.title, config);
    accessibilify(gelButton);
    gelButton.setScale(getScale(bounds, gelButton));
    return gelButton;
};

export const resizeGelButtons = (buttons, bounds, innerBounds, buttonsRight) => {
    buttons.forEach((button, idx) => {
        const { y } = getButtonPosition(innerBounds, idx, 0);
        button.setY(CAMERA_Y + (bounds.height / 2 + bounds.y) + y);
        button.setX(buttonsRight ? innerBounds.x + CAMERA_X : -innerBounds.x + CAMERA_X);
        button.setScale(getScale(innerBounds, button));
    });
};

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
