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

const calculateOffset = config => ({
    x: baseX + (parseInt(config.xOffset) || 0),
    y: baseY + (parseInt(config.yOffset) || 0),
});

const makeElements = makerFns => conf => {
    const pos = calculateOffset(conf);
    return makerFns[conf.type](pos, conf);
};

export const createTitles = scene => {
    const image = (pos, conf) => scene.add.image(pos.x, pos.y, `${scene.scene.key}.${conf.key}`);

    const text = (pos, conf) => {
        const textStyle = { ...styleDefaults, ...fp.get("text.styles", conf) };
        const textSprite = scene.add.text(pos.x, pos.y, conf.value, textStyle);
        textSprite.defaultStyle = textStyle;
        return textSprite;
    };

    const constructElement = configs => configs.map(makeElements({ image, text }));

    //TODO image examples. Current ones are blank
    const configs = scene.theme.titles;
    const elements = configs.map(constructElement);

    const reposition = (metrics, buttons) => {
        const titleArea = getTitleSafeArea(buttons);

        configs.map((config, idx) => positionElement(elements[idx][0], calculateOffset(config[0]), titleArea, metrics));
    };
    return { reposition };
};
