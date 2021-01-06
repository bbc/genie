/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

export const overlays1Wide = (gelButton, configs) => {
    configs.forEach(overlay => {
        const offset = getOffset(overlay.position, gelButton);
        addOverlay({ gelButton, overlay, offset });
    });
    return gelButton;
};

const setImageOverlay = ({ gelButton, overlay, offset }) => {
    const { scene, item } = gelButton;
    const { assetPrefix } = scene.config;
    const key = overlay.isDynamic ? `${item[overlay.assetKey]}` : `${assetPrefix}.${overlay.assetKey}`;
    const image = scene.add.image(offset.x, offset.y, key);
    overlay.size && image.setScale(overlay.size / image.width);
    gelButton.overlays.set(overlay.name, image);
};

const setTextOverlay = ({ gelButton, overlay, offset }) => {
    const { scene, item } = gelButton;
    const textContent = overlay.isDynamic ? item[overlay.value].toString() : overlay.value.toString();
    gelButton.overlays.set(overlay.name, scene.add.text(offset.x, offset.y, textContent, overlay.font));
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
