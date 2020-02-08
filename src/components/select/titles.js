/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { positionElement } from "../../core/helpers/element-bounding.js";

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "ReithSans",
    align: "center",
};

const baseX = 0;
const baseY = -270;

const getTitleSafeArea = buttons => {
    const homeBounds = buttons["home"].getHitAreaBounds();
    const pauseBounds = buttons["pause"].getHitAreaBounds();

    return {
        top: homeBounds.top,
        bottom: homeBounds.bottom,
        left: homeBounds.right,
        right: pauseBounds.left,
    };
};

const calculateOffset = (x, y, config) => ({
    x: x + (parseInt(config.xOffset) || 0),
    y: y + (parseInt(config.yOffset) || 0),
});

const constructVisualElement = (scene, config) => {
    const imagePosition = calculateOffset(baseX, baseY, config.image);
    const textPosition = calculateOffset(baseX, baseY, config.text);

    const textStyle = {
        ...styleDefaults,
        ...fp.get("text.styles", config),
    };

    const visualElements = {
        image:
            config.image && config.image.imageId
                ? scene.add.image(imagePosition.x, imagePosition.y, `${scene.scene.key}.${config.image.imageId}`)
                : undefined,
        text:
            config.text && config.text.value
                ? scene.add.text(textPosition.x, textPosition.y, config.text.value, textStyle)
                : undefined,
    };

    if (visualElements.text) visualElements.text.defaultStyle = textStyle;

    return visualElements;
};
const isDefined = value => Boolean(value);

export const createTitles = scene => {

    const setVisualElement = config => {
    if (config && config.visible) {
        return constructVisualElement(scene, config);
    }
};

    //TODO this can remain inside the module rather than being re-assigned.
    //they are used in repositionTitles#
    //TODO - get rid of title and subtitle and make theme.titles an array
    const configs = [scene.theme.title, scene.theme.subtitle].filter(isDefined);

    const elements = configs.map(setVisualElement);

    const reposition = (metrics, buttons) => {
        const titleArea = getTitleSafeArea(buttons);

        fp.toPairs(elements, configs).map(x => {
            const element = x[0];
            const conf = x[1];

            const textPosition = calculateOffset(baseX, baseY, conf.text);

            positionElement(element.text, textPosition, titleArea, metrics);
        });
    };

    return { reposition };
};


