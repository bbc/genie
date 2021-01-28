/**
 * @module components/shop
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as textUtils from "../../../src/core/layout/text-utils.js";

describe("updateStyleOnFontLoad", () => {
    const mockTextElem = { style: { _font: "foo", update: jest.fn() } };
    document.fonts = { ready: { then: jest.fn() } };

    test("checks if the font on the text elem is ready, and does nothing if so", () => {
        const mockCheck = jest.fn().mockReturnValue(true);
        document.fonts.check = mockCheck;
        textUtils.updateStyleOnFontLoad(mockTextElem);
        expect(mockCheck).toHaveBeenCalled();
        expect(document.fonts.ready.then).not.toHaveBeenCalled();
    });
    test("if not ready, attaches a callback to promise resolution that updates the text style ", () => {
        const mockCheck = jest.fn().mockReturnValue(false);
        document.fonts.check = mockCheck;
        textUtils.updateStyleOnFontLoad(mockTextElem);
        const callback = document.fonts.ready.then.mock.calls[0][0];
        callback();
        expect(mockTextElem.style.update).toHaveBeenCalled();
    });
});
