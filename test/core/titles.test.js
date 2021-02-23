/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createTitles } from "../../src/core/titles.js";
import * as text from "../../src/core/layout/text-elem.js";

describe("Select Screen - Titles", () => {
    let mockScene;
    let mockImage;
    let mockText;

    beforeEach(() => {
        mockImage = { setOrigin: jest.fn() };
        mockText = { setOrigin: jest.fn() };
        mockScene = {
            scene: { key: "character-select" },
            add: { image: jest.fn(() => mockImage), text: jest.fn(() => mockText) },
            assetPrefix: "character-select",
            config: {
                titles: [
                    { type: "image", key: "title", xOffset: 0, yOffset: -250 },
                    { type: "text", value: "Select Your Character", xOffset: 0, yOffset: -260 },
                    { type: "text", value: "Sub-Title", xOffset: 0, yOffset: -233 },
                ],
            },
        };
        text.updateStyleOnFontLoad = jest.fn();
    });

    afterEach(jest.clearAllMocks);

    test("Adds an image for each each image present in the titles", () => {
        const expectedParams = mockScene.config.titles[0];
        createTitles(mockScene);
        expect(mockScene.add.image).toHaveBeenCalledWith(
            expectedParams.xOffset,
            expectedParams.yOffset,
            "character-select.title",
        );
    });

    test("Adds text with default styling for each each text element present in the titles", () => {
        const expectedStyles = {
            fontSize: "24px",
            fontFamily: "ReithSans",
            align: "center",
        };
        const titles = mockScene.config.titles;
        createTitles(mockScene);
        expect(mockScene.add.text).toHaveBeenCalledWith(
            titles[1].xOffset,
            titles[1].yOffset,
            titles[1].value,
            expectedStyles,
        );
        expect(mockScene.add.text).toHaveBeenCalledWith(
            titles[2].xOffset,
            titles[2].yOffset,
            titles[2].value,
            expectedStyles,
        );
    });

    test("Adds text with custom styling when provided", () => {
        const expectedStyles = {
            fontSize: "18px",
            fontFamily: "Arial",
            align: "left",
        };
        const titles = mockScene.config.titles;
        titles[1].styles = expectedStyles;

        createTitles(mockScene);
        expect(mockScene.add.text).toHaveBeenCalledWith(
            titles[1].xOffset,
            titles[1].yOffset,
            titles[1].value,
            expectedStyles,
        );
    });

    test("returns an empty array when no titles are provided", () => {
        delete mockScene.config.titles;
        expect(createTitles(mockScene)).toEqual([]);
    });
});
