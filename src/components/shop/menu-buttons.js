/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { getMetrics } from "../../core/scaler.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "24px",
    resolution: 5,
};

export const createGelButtons = (scene, container, config) => {
    const metrics = getMetrics();
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
        const button = scene.add.gelButton(0, 0, buttonConfig);
        container.add(button);
        const callback = () => console.log(`BEEBUG: ${buttonConfig.title} button clicked`);
        eventBus.subscribe({
            callback,
            channel: buttonConfig.channel,
            name: buttonConfig.id,
        });
        setButtonOverlays(scene, button, buttonConfig.title);
        accessibilify(button);
        button.setPosition(x + 700, y + 300); // hacky fix for now b/c coord problem
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

const getScale = (containerBounds, button) => {
    console.log('BEEBUG: containerBounds', containerBounds);
    const scaleFactor = containerBounds.width / button.width;
    return scaleFactor;
}

const setButtonOverlays = (scene, button, title) =>
    button.overlays.set("caption", scene.add.text(0, 0, title, { ...styleDefaults }).setOrigin(0.5));
