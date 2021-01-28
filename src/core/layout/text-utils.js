/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const updateStyleOnFontLoad = textElem => {
    if (!document.fonts.check(textElem.style._font)) {
        // handles IE11 / when FontFace API is missing?
        document.fonts.ready.then(() => textElem.style.update());
    }
}; // setTimeout(() => titleTextSprite.style.update(true), 50);
