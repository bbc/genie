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

export const createMenuButtons = container =>
    ["Shop", "Manage"].map((button, idx) => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, container.scene);
        const callback = () => container.scene.stack(button.toLowerCase());
        return makeButton(container, config, idx, callback);
    });

export const createConfirmButtons = (container, callbackFn) =>
    ["Confirm", "Cancel"].map((button, idx) => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, container.scene);

        //console.log(container)
        //
        //debugger
        const callback = () => callbackFn(button);
        return makeButton(container, config, idx, callback);
    });

const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});


const makeButton = (container, config, idx, callback) => {
    const scene = container.scene;
    const innerBounds = getInnerRectBounds(scene);
    const bounds = innerBounds;//getOffsetBounds(safeArea, innerBounds);

    const gelButton = scene.add.gelButton(0, 0, config);
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

const getButtonPosition = (containerBounds, idx, yOffset) => {
    const { x, y, height } = containerBounds;
    return {
        x,
        y: y - height / 4 + (idx * height) / 2 + yOffset,
    };
};

const resizeButton = container => (button, idx) => {
    const inner = getInnerRectBounds(container.scene);
    const right = Boolean(container.scene.config.menu.buttonsRight)
    const { y } = getButtonPosition(inner, idx, 0);

    const bounds = container.getBounds()
    button.setY(CAMERA_Y + (bounds.height / 2 + bounds.y) + y);
    button.setX(right ? inner.x + CAMERA_X : -inner.x + CAMERA_X);
    button.setScale(getScale(inner, button));
};

export const resizeGelButtons = container => container.buttons.forEach(resizeButton(container));

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

const assetKey = (scene, key) => `${scene.assetPrefix}.${scene.config.assetKeys[key]}`;

const getScale = (containerBounds, button) => containerBounds.width / button.width;

const setButtonOverlays = (scene, button, title) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, assetKey(scene, "buttonIcon")));
};
