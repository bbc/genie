/**
 * @module components/shop
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as text from "../../../src/core/layout/text.js";

describe("text element functions", () => {
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
    });
});
