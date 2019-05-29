/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as FontLoader from "../../src/core/font-loader.js";

describe("Font Loader", () => {
    let mockGame;
    let callback;

    beforeEach(() => {
        callback = jest.fn();
        mockGame = { add: { text: jest.fn() } };
        global.WebFont = { load: jest.fn() };
        FontLoader.loadFonts(mockGame, callback);
    });

    afterEach(() => jest.clearAllMocks());

    describe("Active fonts", () => {
        beforeEach(() => {
            const loadActiveFonts = global.WebFont.load.mock.calls[0][0].active;
            loadActiveFonts();
        });

        test("loads the Reith Sans font", () => {
            expect(mockGame.add.text).toHaveBeenCalledWith(-10000, -10000, ".", { font: "1px ReithSans" });
        });

        test("loads the bold Reith Sans font", () => {
            expect(mockGame.add.text).toHaveBeenCalledWith(-10000, -10000, ".", { font: "bold 1px ReithSans" });
        });

        test("loads the italic Reith Sans font", () => {
            expect(mockGame.add.text).toHaveBeenCalledWith(-10000, -10000, ".", { font: "italic 1px ReithSans" });
        });

        test("loads the bold italic Reith Sans font", () => {
            expect(mockGame.add.text).toHaveBeenCalledWith(-10000, -10000, ".", { font: "italic bold 1px ReithSans" });
        });

        test("calls the provided callback", () => {
            expect(callback).toHaveBeenCalled();
        });
    });

    describe("Inactive fonts", () => {
        beforeEach(() => {
            const loadInactiveFonts = global.WebFont.load.mock.calls[0][0].inactive;
            loadInactiveFonts();
        });

        test("calls the provided callback", () => {
            expect(callback).toHaveBeenCalled();
        });
    });

    describe("Custom fonts", () => {
        test("are set correctly", () => {
            const customFonts = global.WebFont.load.mock.calls[0][0].custom;
            expect(customFonts.families).toEqual(["ReithSans"]);
            expect(customFonts.urls).toEqual(["https://gel.files.bbci.co.uk/r2.302/bbc-reith.css"]);
        });
    });
});
