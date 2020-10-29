/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "24px",
    resolution: 5,
};

export const createGelButtons = (scene, container, config) => {
    console.log('BEEBUG: container.getBounds()', container.getBounds());
    const buttonConfigs = ["Shop", "Manage"].map(button => ({
        title: button,
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: button,
        channel: "shop",
        group: scene.scene.key,
        id: `${button.toLowerCase()}_menu_button`,
        key: config.buttonBackgroundKey,
        scene: "shop",
    }));

    const buttons = buttonConfigs.map((buttonConfig, idx) => {
        const bounds = container.getBounds();
        const { x, y } = positionButton(bounds, idx);
        const button = scene.add.gelButton(x, y, buttonConfig);

        const callback = () => console.log(`BEEBUG: ${buttonConfig.title} button clicked`);
        eventBus.subscribe({
            callback,
            channel: buttonConfig.channel,
            name: buttonConfig.id,
        });
        // scaleAndPositionButton(button, container.getBounds(), idx);
        setButtonOverlays(scene, button, buttonConfig.title, config);
        accessibilify(button);
        return button;
    });

    console.log('BEEBUG: buttons', buttons);
    return buttons;
};

const positionButton = (containerBounds, idx) => {
    const { x, y, height, width, centreX } = containerBounds;
    return {
        x: x + width / 2,
        // x: centreX,
        y: y + height / 4 + idx * height / 2,
    }
};

const setButtonOverlays = (scene, button, title, config) => {
    button.overlays.set("background", scene.add.image(0, 0, `shop.${config.buttonBackgroundKey}`));
    button.overlays.set("caption", scene.add.text(0, 0, title, { ...styleDefaults }).setOrigin(0.5));
};
