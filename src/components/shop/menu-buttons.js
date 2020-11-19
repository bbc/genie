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

export const createGelButtons = (scene, bounds, config, yOffset) =>
    ["Shop", "Manage"].map((button, idx) => {
        const buttonConfig = {
            title: button,
            gameButton: true,
            accessibilityEnabled: true,
            ariaLabel: button,
            channel: "shop",
            group: scene.scene.key,
            id: `${button.toLowerCase()}_menu_button`,
            key: config.assetKeys.buttonBackground,
            scene: "shop",
        };
        const { x, y } = getButtonPosition(bounds, idx, yOffset);
        const gelButton = scene.add.gelButton(x + CAMERA_X, y + CAMERA_Y, buttonConfig);
        const callback = () => scene.setVisiblePane(buttonConfig.title.toLowerCase());
        eventBus.subscribe({
            callback,
            channel: buttonConfig.channel,
            name: buttonConfig.id,
        });
        setButtonOverlays(scene, gelButton, buttonConfig.title, config);
        accessibilify(gelButton);
        gelButton.setScale(getScale(bounds, gelButton));
        return gelButton;
    });

export const resizeGelButtons = (buttons, bounds, innerBounds, buttonsRight) => {
    buttons.forEach((button, idx) => {
        const { y } = getButtonPosition(innerBounds, idx, 0);
        button.setY(CAMERA_Y + (bounds.height / 2 + bounds.y) + y);
        button.setX(buttonsRight ? innerBounds.x + CAMERA_X : -innerBounds.x + CAMERA_X);
        button.setScale(getScale(innerBounds, button));
    });
};

const getButtonPosition = (containerBounds, idx, yOffset) => {
    const { x, y, height } = containerBounds;
    return {
        x: -x,
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
