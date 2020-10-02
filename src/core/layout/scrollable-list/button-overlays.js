/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

export const overlays1Wide = (scene, gelButton, item, config) => {
    setImageOverlays(scene, gelButton, item, config);
    setTextOverlays(scene, gelButton, item, config);
    return gelButton;
};

const setImageOverlays = (scene, gelButton, item, config) => {
    const { overlay } = config;
    overlay.image.forEach(image => {
        const key = image.isDynamic ? item[image.assetKey] : `${overlay.defaultPrefix}.${image.assetKey}`;
        const offset = getOffset(image.position, gelButton);
        gelButton.overlays.set(image.name, scene.add.image(offset.x, offset.y, key));
    });
};

const setTextOverlays = (scene, gelButton, item, config) => {
    const { overlay } = config;
    overlay.text.forEach(text => {
        const textValue = text.isDynamic ? item[text.value] : text.value;
        const offset = getOffset(text.position, gelButton);
        gelButton.overlays.set(text.name, scene.add.text(offset.x, offset.y, textValue, text.font));
    });
};

const getOffset = (position, gelButton) => {
    if (!position) return { x: 0, y: 0 };
    const absEdge = gelButton.width / 2;
    const edge = position.align === "left" ? -absEdge : absEdge;
    return { x: edge + position.offsetX, y: position.offsetY };
};

