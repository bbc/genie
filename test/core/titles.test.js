/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createTitles } from "../../src/core/titles.js";
import * as text from "../../src/core/layout/text-elem.js";

describe("Titles", () => {
    let mockScene;
    let mockImage;
    let mockText;

    beforeEach(() => {
        mockImage = { setOrigin: jest.fn() };
        mockText = { setOrigin: jest.fn() };
        mockScene = {
            scene: { key: "character-select" },
            add: { image: jest.fn(() => mockImage), text: jest.fn(() => mockText) },
            config: {
                title: {},
                subtitle: {},
            },
        };
        text.updateStyleOnFontLoad = jest.fn();
    });

    afterEach(jest.clearAllMocks);

    test("", () => {
        //
    });
});
