/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { onClick } from "./scrollable-list-helpers.js";
import { eventBus } from "../../event-bus.js";
import { overlays1Wide } from "./button-overlays.js";
import fp from "../../../../lib/lodash/fp/fp.js";

export const createGelButton = (scene, item) => {
    const id = `shop_id_${item.id}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel,
        channel: config.eventChannel,
        group: "middleCenter",
        id,
        key: config.assetKeys.itemBackground,
        scene: config.assetKeys.prefix,
        inScrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    eventBus.subscribe({
        callback: () => onClick(gelButton),
        channel: gelConfig.channel,
        name: id,
    });

    return fp.flow(scaleButton, overlays1Wide)({ scene, gelButton, config, item });
};

export const scaleButton = args => {
    const { scene, config, gelButton } = args;
    const safeArea = scene.layout.getSafeArea();
    const scaleFactor = (safeArea.width - config.space * 2) / gelButton.width;
    gelButton.setScale(scaleFactor);
    return args;
};
