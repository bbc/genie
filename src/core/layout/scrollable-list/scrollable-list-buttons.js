/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { handleIfVisible } from "./scrollable-list-handlers.js";
import { eventBus } from "../../event-bus.js";
import { overlays1Wide } from "./button-overlays.js";
import { accessibilify } from "../../../core/accessibility/accessibilify.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const createGelButton = (scene, item) => {
    const id = `scroll_button_${item.id}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel,
        channel: config.eventChannel,
        group: "shop",
        id,
        key: config.assetKeys.itemBackground,
        scene: config.assetKeys.prefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    eventBus.subscribe({
        callback: () => handleIfVisible(gelButton, scene),
        channel: gelConfig.channel,
        name: id,
    });
    return fp.flow(scaleButton, makeAccessible, overlays1Wide)({ scene, gelButton, config, item });
};

const scaleButton = args => {
    const { scene, config, gelButton } = args;
    const safeArea = scene.layout.getSafeArea({}, false);
    const scaleFactor = (safeArea.width - config.space * 4) / gelButton.width;
    gelButton.setScale(scaleFactor);
    return args;
};

const makeAccessible = args => { 
    accessibilify(args.gelButton);
    return args;
};

export { createGelButton, scaleButton };
