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

export const createGelButtons = (scene, container, config) => {

    const buttonConfigs = ["Shop", "Manage"].map(button => ({
        title: button,
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: button,
        channel: "shop",
        group: scene.scene.key + "_menu",
        id: `${button.toLowerCase()}_menu_button`,
        key: `${config.buttonBackgroundKey}`,
        scene: "shop",
    }));

    const bounds = container.getBounds();

    const buttons = buttonConfigs.map((buttonConfig, idx) => {
        const { x, y } = getPosition(bounds, idx);
        const button = scene.add.gelButton(x + CANVAS_WIDTH / 2, y + CANVAS_HEIGHT / 2, buttonConfig);

        const callback = () => scene.setVisible(buttonConfig.title.toLowerCase());
        eventBus.subscribe({
            callback,
            channel: buttonConfig.channel,
            name: buttonConfig.id,
        });

        setButtonOverlays(scene, button, buttonConfig.title, config);
        accessibilify(button);

        button.setScale(getScale(bounds, button));

        return button;
    });

    return buttons;
};

const getPosition = (containerBounds, idx) => {
    const { x, y, height, width } = containerBounds;
    return {
        x: x + width / 2,
        y: y + height / 4 + (idx * height) / 2,
    };
};

const getScale = (containerBounds, button) => containerBounds.width / button.width;

const setButtonOverlays = (scene, button, title, config) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, `shop.${config.buttonIconKey}`));
};
