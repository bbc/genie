/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "../../../../src/core/layout/scrollable-list/button-overlays.js";

const mockScene = {
    add: {
        image: jest.fn().mockReturnValue("mockImage"),
        text: jest.fn().mockReturnValue("mockText"),
    },
};

const mockGelButton = {
    overlays: {
        set: jest.fn(),
    },
    width: 200,
};

const mockItem = {
    name: "someItemName",
    description: "someItemDescription",
    price: 42,
    icon: "test.icon",
};

const mockOverlay = {
    type: "image",
    name: "someImage",
    assetKey: "someImageAssetKey",
    isDynamic: false,
};

let mockConfig;

describe("Button overlays", () => {
    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockConfig = {
            overlay: {
                defaultPrefix: "test",
                items: [],
            },
        };
    });

    describe("overlays1Wide", () => {
        describe("overlays", () => {
            test("sets an overlay on gelButton for every item in config.overlay.items", () => {
                mockConfig.overlay.items.push(mockOverlay, mockOverlay, mockOverlay);
                overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
                expect(mockGelButton.overlays.set).toHaveBeenCalledTimes(3);
            });
            
            test("adds an image if overlay is of type image", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.someImageAssetKey");
            });
            
            test("adds a text to the scene and the button if overlay is of type button", () => {
                mockOverlay.type = "text";
                mockOverlay.value = "someTextValue";
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "someTextValue", undefined);
            });
        });

        describe("dynamic and static overlays", () => {
            // test("dynamic overlays use data from the item", () => {
            //     expect(false).toBe(true);
            // });

            // test("non-dynamic overlays use static values from config", () => {
            //     expect(false).toBe(true);
            // });
        });

        describe("offsets", () => {
            // test("no offset is applied if there is no offset object", () => {
            //     expect(false).toBe(true);
            // });
            // test("align left sets a negative x offset plus the offset x", () => {
            //     expect(false).toBe(true);
            // });

            // test("align right sets a positive x offset minus the offset x", () => {
            //     expect(false).toBe(true);
            // });
            // test("the y offset is applied unconditionally", () => {
            //     expect(false).toBe(true);
            // });
        });
    });
});
