/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { positionElement } from "../../core/helpers/element-bounding.js";
import { getMetrics } from "../../core/scaler.js";

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
        const textStyle = { ...styleDefaults, ...conf.styles };
        const textSprite = scene.add.text(pos.x, pos.y, conf.value, textStyle);
        textSprite.defaultStyle = textStyle;
        return textSprite;
    };

    //TODO image examples. Current ones are blank
    const configs = scene.theme.titles || [];
    const elements = configs.map(makeElements({ image, text }));

    const reposition = buttons => {
        const titleArea = getTitleSafeArea(buttons);
        const metrics = getMetrics();

        configs.map((config, idx) => positionElement(elements[idx], calculateOffset(config), titleArea, metrics));
    };
    return { reposition };
};
