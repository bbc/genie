/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
import * as handlers from "../../../../src/core/layout/scrollable-list/scrollable-list-handlers.js";

const mockScene = {
    input: {},
    scale: {
        displaySize: {
            height: 600,
        },
    },
};

const mockSizer = {
    innerHeight: 300,
};

const mockGelButton = {
    config: { id: "foo" },
    rexContainer: {
        parent: {
            getTopmostSizer: jest.fn().mockReturnValue(mockSizer),
        },
    },
};

console.log = jest.fn();

describe("Scrollable List handlers", () => {
    afterEach(() => jest.clearAllMocks());

    describe("handleIfVisible()", () => {

        beforeEach(() => console.log = jest.fn());
        test("calls console.log if click is inside the panel's Y bounds", () => {
            mockScene.input = { y: 300 };
            handlers.handleIfVisible(mockGelButton, mockScene);
            expect(console.log).toHaveBeenCalledWith("Clicked foo");
        });

        test("does not call console.log if click is outside the panel", () => {
            mockScene.input = { y: 0 };
            handlers.handleIfVisible(mockGelButton, mockScene);
            expect(console.log).not.toHaveBeenCalled();
        });
    });

    describe("updatePanelOnScroll", () => {
        test("calls setElementSizeAndPosition on each GEL button", () => {
            expect(false).toBe(true);
        });
    });

    describe("updatePanelOnFocus", () => {
        test("sets a lower t if the item is off the top edge", () => {
            expect(false).toBe(true);
        });
        test("sets a higher t if the item is off the bottom edge", () => {
            expect(false).toBe(true);
        });
        test("does not set t if the item is visible", () => {
            expect(false).toBe(true);
        });
    });
});
