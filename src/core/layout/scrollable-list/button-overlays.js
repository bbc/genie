/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

export const overlays1Wide = ({ scene, gelButton, item, config }) => {
    config.overlay.items.forEach(overlay => {
        const offset = getOffset(overlay.position, gelButton);
        addOverlay({ scene, gelButton, item, config, overlay, offset });
    });
    return gelButton;
};

const setImageOverlay = ({ scene, gelButton, item, config, overlay, offset }) => {
    const key = overlay.isDynamic
        ? `${config.overlay.defaultPrefix}${item[overlay.assetKey]}`
        : `${config.overlay.defaultPrefix}${overlay.assetKey}`;
    gelButton.overlays.set(overlay.name, scene.add.image(offset.x, offset.y, key));
};

const setTextOverlay = ({ scene, gelButton, item, overlay, offset }) => {
    const textValue = overlay.isDynamic ? item[overlay.value] : overlay.value;
    gelButton.overlays.set(overlay.name, scene.add.text(offset.x, offset.y, textValue.toString(), overlay.font));
};

const getOffset = (position, gelButton) => {
    if (!position) return { x: 0, y: 0 };
    const edge = position.align === "left" ? -gelButton.width / 2 : gelButton.width / 2;
    return { x: edge + position.offsetX, y: position.offsetY };
};

const addOverlay = fp.cond([
    [args => args.overlay.type === "image", setImageOverlay],
    [args => args.overlay.type === "text", setTextOverlay],
]);
