/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";
import { addText } from "../../../core/layout/text-elem.js";

export const overlays1Wide = (gelButton, configs) => {
    configs.forEach(config => {
        const offset = getOffset(config.position, gelButton);
        addOverlay({ gelButton, config, offset });
    });
    return gelButton;
};

const setImageOverlay = ({ gelButton, config, offset }) => {
    const { scene, item } = gelButton;
    const { assetPrefix } = scene.config;
    const key = config.isDynamic ? `${item[config.assetKey]}` : `${assetPrefix}.${config.assetKey}`;
    const image = scene.add.image(offset.x, offset.y, key);
    config.size && image.setScale(config.size / image.width);
    gelButton.overlays.set(config.name, image);
};

const setTextOverlay = ({ gelButton, config, offset }) => {
    const { scene, item } = gelButton;
    const textContent = config.isDynamic ? item[config.value].toString() : config.value.toString();
    gelButton.overlays.set(config.name, addText(scene, offset.x, offset.y, textContent, config));
};

const getOffset = (position, gelButton) => {
    if (!position) return { x: 0, y: 0 };
    const edge = position.align === "left" ? -gelButton.width / 2 : gelButton.width / 2;
    return { x: edge + position.offsetX, y: position.offsetY };
};

const addOverlay = fp.cond([
    [args => args.config.type === "image", setImageOverlay],
    [args => args.config.type === "text", setTextOverlay],
]);
