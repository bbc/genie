/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { updateStyleOnFontLoad } from "./layout/text-elem.js";

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "ReithSans",
    align: "center",
};

const makeElements = makerFns => conf => makerFns[conf.type]({ x: conf.xOffset, y: conf.yOffset }, conf).setOrigin(0.5);

export const createTitles = scene => {
    const image = (pos, conf) => scene.add.image(pos.x, pos.y, `${scene.assetPrefix}.${conf.key}`);

    const text = (pos, conf) => {
        const template = fp.template(conf.value);
        const text = fp.startCase(template(scene.transientData?.[scene.scene.key]));
        const textStyle = { ...styleDefaults, ...conf.styles };
        const textSprite = scene.add.text(pos.x, pos.y, text, textStyle);
        textSprite.defaultStyle = textStyle;
        updateStyleOnFontLoad(textSprite);
        return textSprite;
    };

    const configs = scene.config.titles || [];
    return configs.map(makeElements({ image, text }));
};
