/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const updateStyleOnFontLoad = textElem => {
    // ie11?
    if (!document.fonts.check(textElem.style._font)) {
        document.fonts.ready.then(() => textElem.style.update());
    }
};
