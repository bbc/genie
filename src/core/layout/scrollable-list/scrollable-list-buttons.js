/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { handleClickIfVisible } from "./scrollable-list-handlers.js";
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
        group: scene.scene.key,
        id,
        key: config.assetKeys.itemBackground,
        scene: config.assetKeys.prefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    const callback = fp.identity; // placeholder

    eventBus.subscribe({
        callback: handleClickIfVisible(gelButton, scene, callback),
        channel: gelConfig.channel,
        name: id,
    });

    scaleButton(gelButton, scene.layout, config.listPadding.x);
    makeAccessible(gelButton);
    return overlays1Wide({ scene, gelButton, item, config });
};

const scaleButton = (gelButton, layout, space) => {
    const safeArea = layout.getSafeArea({}, false);
    const scaleFactor = (safeArea.width - space * 4) / gelButton.width;
    gelButton.setScale(scaleFactor);
};

const makeAccessible = gelButton => accessibilify(gelButton);

export { createGelButton, scaleButton };
