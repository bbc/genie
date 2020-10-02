/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import fp from "../../../../lib/lodash/fp/fp.js"

export const overlays1Wide = (scene, gelButton, item, config) => {
    const { overlay } = config;
    overlay.items.forEach(over => addOverlay({ scene, gelButton, item, config, over })); 
    return gelButton;
};

const setImageOverlay = ({ scene, gelButton, item, config, over }) => {
    const key = over.isDynamic ? item[over.assetKey] : `${config.overlay.defaultPrefix}.${over.assetKey}`;
    const offset = getOffset(over.position, gelButton);
    gelButton.overlays.set(over.name, scene.add.image(offset.x, offset.y, key));
};

const setTextOverlay = ({ scene, gelButton, item, over }) => {
    const textValue = over.isDynamic ? item[over.value] : over.value;
    const offset = getOffset(over.position, gelButton);
    gelButton.overlays.set(over.name, scene.add.text(offset.x, offset.y, textValue, over.font));
};

const getOffset = (position, gelButton) => {
    if (!position) return { x: 0, y: 0 };
    const absEdge = gelButton.width / 2;
    const edge = position.align === "left" ? -absEdge : absEdge;
    return { x: edge + position.offsetX, y: position.offsetY };
};

const isImage = args => args.over.type === "image";
const isText = args => args.over.type === "text";

const addOverlay = fp.cond([
    [isImage, setImageOverlay],
    [isText, setTextOverlay]
]);
