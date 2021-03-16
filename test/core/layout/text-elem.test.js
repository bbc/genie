/**
 * @module components/shop
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as text from "../../../src/core/layout/text.js";

describe("text element functions", () => {
    document.fonts = { ready: { then: jest.fn() }, check: jest.fn().mockReturnValue(true) };
    const mockTextElem = { style: { _font: "foo", update: jest.fn() }, scene: "foo" };

    describe("addText()", () => {
        let elemConfig = { styles: { baz: "qux" } };

        const mockScene = {
            config: { styleDefaults: { foo: "bar" } },
            add: { text: jest.fn().mockReturnValue(mockTextElem) },
        };

        beforeEach(() => text.addText(mockScene, 0, 0, "someText", elemConfig));

        test("returns a new text element", () => {
            expect(mockScene.add.text).toHaveBeenCalled();
        });
        test("merges element styles with defaults", () => {
            const expectedStyle = { foo: "bar", baz: "qux" };
            expect(mockScene.add.text.mock.calls[0][3]).toStrictEqual(expectedStyle);
        });
        test("provides a fallback style", () => {
            jest.clearAllMocks();
            mockScene.config = {};
            const fallbackStyle = {
                fontFamily: "ReithSans",
                fontSize: "24px",
                resolution: 2,
                align: "center",
            };
            text.addText(mockScene, 0, 0, "someText", undefined);
            expect(mockScene.add.text.mock.calls[0][3]).toStrictEqual(fallbackStyle);
        });
        test("checks the font with updateStyleOnFontLoad", () => {
            expect(document.fonts.check).toHaveBeenCalled();
        });
    });

    describe("updateStyleOnFontLoad()", () => {
        test("checks if the font on the text elem is ready, and does nothing if so", () => {
            text.updateStyleOnFontLoad(mockTextElem);
            expect(document.fonts.check).toHaveBeenCalled();
            expect(document.fonts.ready.then).not.toHaveBeenCalled();
        });
        test("if not ready, attaches a callback to promise resolution that updates the text style ", () => {
            const mockCheck = jest.fn().mockReturnValue(false);
            document.fonts.check = mockCheck;
            text.updateStyleOnFontLoad(mockTextElem);
            const callback = document.fonts.ready.then.mock.calls[0][0];
            callback();
            expect(mockTextElem.style.update).toHaveBeenCalled();
        });
    });
});
