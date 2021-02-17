/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const fallbackStyle = {
    fontFamily: "ReithSans",
    fontSize: "24px",
    resolution: 2,
    align: "center",
};

const textStyle = (styleDefaults, config) => {
    const defaults = styleDefaults ? styleDefaults : fallbackStyle;
    return config ? { ...defaults, ...config.styles } : defaults;
};

export const addText = (scene, x, y, text, config) => {
    const textElem = scene.add.text(x, y, text, textStyle(scene.config.styleDefaults, config));
    updateStyleOnFontLoad(textElem);
    return textElem;
};

export const updateStyleOnFontLoad = textElem => {
    if (document.fonts && !document.fonts.check(textElem.style._font)) {
        document.fonts.ready.then(() => textElem.scene && textElem.style.update());
    }
};
