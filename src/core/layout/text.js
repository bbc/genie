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

const style = (styleDefaults, config) => {
    const defaults = styleDefaults ? styleDefaults : fallbackStyle;
    return config ? { ...defaults, ...config.styles } : defaults;
};

export const addText = (scene, x, y, text, config) => {
    const element = scene.add.text(x, y, text, style(scene.config.styleDefaults, config));
    updateStyleOnFontLoad(element);
    return element;
};

export const updateStyleOnFontLoad = text => {
    if (document.fonts && !document.fonts.check(text.style._font)) {
        document.fonts.ready.then(() => text.scene && text.style.update());
    }
};
