/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GelText } from "../../../src/core/debug/gel-text.js";

describe("", () => {
    let GelTextScreen;
    beforeEach(() => {
        GelTextScreen = new GelText();

        const mockData = { config: { "debug-gel-text": {} } };

        GelTextScreen.setData(mockData);
        GelTextScreen.scene = { key: "debug-gel-text" };
        GelTextScreen.setLayout = jest.fn();
        GelTextScreen.add = {
            gelText: jest.fn(),
        };
        GelTextScreen.navigation = { next: jest.fn() };
    });

    afterEach(jest.clearAllMocks);

    describe("Gel Text Debug Screen Create Method", () => {
        test("Adds some GelText to demo", () => {
            GelTextScreen.create();

            expect(GelTextScreen.add.gelText).toHaveBeenCalled();
        });
    });
});
