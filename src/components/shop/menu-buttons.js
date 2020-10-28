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
    const containerBounds = container.getBounds();
    console.log("BEEBUG: containerBounds", containerBounds);

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
        const button = scene.add.gelButton(0, 0, buttonConfig);
        const callback = () => console.log(`BEEBUG: ${buttonConfig.title} button clicked`);
        eventBus.subscribe({
            callback,
            channel: buttonConfig.channel,
            name: buttonConfig.id,
        });
        setButtonOverlays(scene, button, buttonConfig.title, config);
        scaleAndPositionButton(button, containerBounds, idx);
        accessibilify(button);
        return button;
    });
    
    return buttons;    
};

const scaleAndPositionButton = (button, containerBounds, idx) => {
    console.log('BEEBUG: idx', idx);
    button.setPosition(0, 0);
    button.setScale(1);
};

const setButtonOverlays = (scene, button, title, config) => {
    button.overlays.set("background", scene.add.image(0, 0, `shop.${config.buttonBackgroundKey}`))
    button.overlays.set("caption", scene.add.text(0, 0, title, { ...styleDefaults }));
}
