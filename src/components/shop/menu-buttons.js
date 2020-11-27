/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { getInnerRectBounds, getSafeArea } from "./shop-layout.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "16px",
    resolution: 5,
};

export const createMenuButtons = scene =>
    ["Shop", "Manage"].map((button, idx) => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, scene);
        const callback = () => scene.stack(button.toLowerCase());
        const innerBounds = getInnerRectBounds(scene)
        return makeButton(scene, config, innerBounds, idx, callback);
    });

export const createConfirmButtons = (scene, callbackFn) =>
    ["Confirm", "Cancel"].map((button, idx) => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, scene);
        const callback = () => callbackFn(button);
        const innerBounds = getInnerRectBounds(scene)
        return makeButton(scene, config, innerBounds, idx, callback);
    });

const makeButton = (scene, config, bounds, idx, callback) => {
    const safeArea = getSafeArea(scene.layout);
    const offset = safeArea.height / 2 + safeArea.y;
    const { x, y } = getButtonPosition(bounds, idx, offset);
    const gelButton = scene.add.gelButton(x + CAMERA_X, y + CAMERA_Y, config);
    const event = eventBus.subscribe({
        callback,
        channel: config.channel,
        name: config.id,
    });
    scene.events.once("shutdown", event.unsubscribe);
    setButtonOverlays(scene, gelButton, config.title);
    accessibilify(gelButton);
    gelButton.setScale(getScale(bounds, gelButton));
    return gelButton;
};

const resizeButton = (bounds, inner, right, scene) => (button, idx) => {
    const safeArea = getSafeArea(scene.layout);
    const offset = safeArea.height / 2 + safeArea.y;
    const { y } = getButtonPosition(inner, idx, 0);
    button.setY(CAMERA_Y + (bounds.height / 2 + bounds.y) + y);
    button.setX(right ? inner.x + CAMERA_X : -inner.x + CAMERA_X);
    button.setScale(getScale(inner, button));
};

export const resizeGelButtons = (container, bounds) => {
    const right = container.config.menu.buttonsRight;
    const inner = getInnerRectBounds(container.scene);
    container.buttons.forEach(resizeButton(bounds, inner, right, container.scene));
};

const getButtonConfig = (button, id, scene) => {
    return {
        title: button,
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: button,
        channel: "shop",
        group: scene.scene.key,
        id,
        key: scene.config.assetKeys.buttonBackground,
        scene: "shop",
    };
};

const getButtonPosition = (containerBounds, idx, yOffset) => {
    const { x, y, height } = containerBounds;
    return {
        x,
        y: y - height / 4 + (idx * height) / 2 + yOffset,
    };
};

const assetKey = (scene, key) => `${scene.assetPrefix}.${scene.config.assetKeys[key]}`;

const getScale = (containerBounds, button) => containerBounds.width / button.width;

const setButtonOverlays = (scene, button, title) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, assetKey(scene, "buttonIcon")));
};
