/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createPaneBackground } from "../../../src/components/shop/background.js";
import * as scrollableListModule from "../../../src/components/shop/scrollable-list/scrollable-list.js";

const mockScene = { tag: "mockScene" };

describe("createPaneBackground", () => {
    beforeEach(() => {
        scrollableListModule.createBackground = {
            object: jest.fn(),
            null: jest.fn(),
            string: jest.fn(),
        };
    });

    afterEach(jest.clearAllMocks);

    test("Create background with object config", () => {
        const mockConfig = { tag: "mockConfig" };
        createPaneBackground(mockScene, mockConfig);
        expect(scrollableListModule.createBackground.object).toHaveBeenCalledWith(mockScene, mockConfig);
    });

    test("Create background with string config", () => {
        const mockConfig = "mockStringConfig";
        createPaneBackground(mockScene, mockConfig);
        expect(scrollableListModule.createBackground.string).toHaveBeenCalledWith(mockScene, mockConfig);
    });

    test("Create background with null config", () => {
        const mockConfig = null;
        createPaneBackground(mockScene, mockConfig);
        expect(scrollableListModule.createBackground.null).toHaveBeenCalledWith(mockScene, mockConfig);
    });
});
