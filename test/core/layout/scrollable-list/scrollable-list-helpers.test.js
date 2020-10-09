/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
import * as helpers from "../../../../src/core/layout/scrollable-list/scrollable-list-helpers.js";

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

describe("Scrollable List helpers", () => {
    afterEach(() => jest.clearAllMocks());

    describe("handleIfVisible()", () => {
        test("calls console.log if click is inside the panel's Y bounds", () => {
            mockScene.input = { y: 300 };
            helpers.handleIfVisible(mockGelButton, mockScene);
            expect(console.log).toHaveBeenCalledWith("Clicked foo");
        });

        test("does not call console.log if click is outside the panel", () => {
            mockScene.input = { y: 0 };
            helpers.handleIfVisible(mockGelButton, mockScene);
            expect(console.log).not.toHaveBeenCalled();
        });
    });
    describe("assetKey()", () => {
        test("concatenates the asset prefix with the asset key", () => {
            const assetKeys = { prefix: "foo" };
            const concatenatedKey = helpers.assetKey("bar", assetKeys);
            expect(concatenatedKey).toEqual("foo.bar");
        });
    });
});
