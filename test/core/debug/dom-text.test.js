/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { DomText } from "../../../src/core/debug/dom-text.js";

describe("Dom Text Debug Screen", () => {
    let domTextScreen;
    beforeEach(() => {
        domTextScreen = new DomText();

        const mockData = { config: { "debug-dom-text": {} } };

        domTextScreen.setData(mockData);
        domTextScreen.scene = { key: "debug-dom-text" };
        domTextScreen.setLayout = jest.fn();
        domTextScreen.add = {
            domText: jest.fn(),
        };
        domTextScreen.navigation = { next: jest.fn() };
    });

    afterEach(jest.clearAllMocks);

    describe("Dom Text Debug Screen Create Method", () => {
        test("Adds some DomText to demo", () => {
            domTextScreen.create();

            expect(domTextScreen.add.domText).toHaveBeenCalled();
        });
    });
});
