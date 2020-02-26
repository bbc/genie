/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "ReithSans",
    align: "center",
};

const makeElements = makerFns => conf => makerFns[conf.type]({ x: conf.xOffset, y: conf.yOffset }, conf).setOrigin(0.5);

export const createTitles = scene => {
    const image = (pos, conf) => scene.add.image(pos.x, pos.y, `${scene.assetPrefix}.${conf.key}`);

    const text = (pos, conf) => {
        const textStyle = { ...styleDefaults, ...conf.styles };
        const textSprite = scene.add.text(pos.x, pos.y, conf.value, textStyle);
        textSprite.defaultStyle = textStyle;
        return textSprite;
    };

    const configs = scene.theme.titles || [];
    return configs.map(makeElements({ image, text }));
};
