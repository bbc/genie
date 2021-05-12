/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";
import { addText } from "../../../core/layout/text.js";

const originX = {
    left: 0,
    center: 0.5,
    right: 1,
};

const originY = {
    top: 0,
    center: 0.5,
    bottom: 1,
};

const getAlignX = (gelButton, alignment) =>
    ({
        left: -gelButton.width / 2,
        center: 0,
        right: gelButton.width / 2,
    }[alignment]);

const getAlignY = (gelButton, alignment) =>
    ({
        top: -gelButton.height / 2,
        center: 0,
        bottom: gelButton.height / 2,
    }[alignment]);

const imageOverlay = ({ gelButton, config, offset }) => {
    const { scene, item } = gelButton;
    const { config: sceneConfig } = scene;
    const image = scene.add
        .image(offset.x, offset.y, fp.template(config.assetKey)(item))
        .setOrigin(originX[config.position.alignX], originY[config.position.alignY]);
    const properties =
        config.inheritProperties && item.state && sceneConfig.states[item.state]
            ? sceneConfig.states[item.state].properties
            : {};
    Object.assign(image, properties);
    config.size && image.setScale(config.size / image.width);
    gelButton.overlays.set(config.name, image);
};

const textOverlay = ({ gelButton, config, offset }) => {
    const { scene, item } = gelButton;
    const template = fp.template(config.value.toString());
    gelButton.overlays.set(
        config.name,
        addText(scene, offset.x, offset.y, template(item), config).setOrigin(
            originX[config.position.alignX],
            originY[config.position.alignY],
        ),
    );
};

const getOffset = (position, gelButton) => {
    const x = getAlignX(gelButton, position.alignX);
    const y = getAlignY(gelButton, position.alignY);
    return { x: x + position.offsetX, y: y + position.offsetY };
};

const overlays = {
    image: imageOverlay,
    text: textOverlay,
};

const getPosition = config => ({
    alignX: config.position?.alignX ?? "center",
    alignY: config.position?.alignY ?? "center",
    offsetX: config.position?.offsetX ?? 0,
    offsetY: config.position?.offsetY ?? 0,
});

export const overlays1Wide = (gelButton, configs) => {
    configs.forEach(config => {
        config.position = getPosition(config);
        const offset = getOffset(config.position, gelButton);
        overlays[config.type]({ gelButton, config, offset });
    });
    return gelButton;
};
