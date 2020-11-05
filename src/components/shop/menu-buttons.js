/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../core/layout/metrics.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "16px",
    resolution: 5,
};

export const createGelButtons = (scene, bounds, config, yOffset) => {
    return ["Shop", "Manage"].map((button, idx) => {
        const buttonConfig = {
            title: button,
            gameButton: true,
            accessibilityEnabled: true,
            ariaLabel: button,
            channel: "shop",
            group: scene.scene.key,
            id: `${button.toLowerCase()}_menu_button`,
            key: `${config.buttonBackgroundKey}`,
            scene: "shop",
        };
        const { x, y } = getButtonPosition(bounds, idx, yOffset);
        const gelButton = scene.add.gelButton(x + CANVAS_WIDTH / 2, y + CANVAS_HEIGHT / 2, buttonConfig);
        const callback = () => scene.setVisible(buttonConfig.title.toLowerCase());
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
};

export const resizeGelButtons = (buttons, bounds, innerBounds, buttonsRight) => {
    buttons.forEach((button, idx) => {
        const { y } = getButtonPosition(innerBounds, idx, 0);
        button.setY(CANVAS_HEIGHT / 2 + (bounds.height / 2 + bounds.y) + y);
        button.setX(buttonsRight ? innerBounds.x + CANVAS_WIDTH / 2 : -innerBounds.x + CANVAS_WIDTH / 2);
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

const getScale = (containerBounds, button) => containerBounds.width / button.width;

const setButtonOverlays = (scene, button, title, config) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, `shop.${config.buttonIconKey}`));
};
