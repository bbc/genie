/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "../../../../src/core/layout/scrollable-list/button-overlays.js";

const mockImage = { setScale: jest.fn(), width: 100 };
const mockScene = {
    add: {
        image: jest.fn().mockReturnValue(mockImage),
        text: jest.fn().mockReturnValue("mockText"),
    },
    config: {
        assetPrefix: "test",
    },
};

const mockGelButton = {
    overlays: {
        set: jest.fn(),
    },
    width: 200,
    scene: mockScene,
};

const mockItem = {
    name: "someItemName",
    description: "someItemDescription",
    price: 42,
    icon: "itemIcon",
};

let mockOverlay;
let mockConfig;
let mockArgs;

describe("Button overlays", () => {
    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockConfig = {
            overlay: {
                // defaultPrefix: "test",
                items: [],
            },
        };
        mockOverlay = {
            type: "image",
            name: "someImage",
            assetKey: "someImageAssetKey",
            isDynamic: false,
        };
        mockArgs = {
            gelButton: mockGelButton,
            item: mockItem,
            configs: mockConfig.overlay.items,
        };
    });

    describe("overlays1Wide", () => {
        describe("overlays", () => {
            test("sets an overlay on gelButton for every item in config.overlay.items", () => {
                mockConfig.overlay.items.push(mockOverlay, mockOverlay, mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockGelButton.overlays.set).toHaveBeenCalledTimes(3);
            });

            test("adds an image if overlay is of type image", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.someImageAssetKey");
            });

            test("scales the image overlay if a size is provided", () => {
                mockOverlay = { ...mockOverlay, size: 50 };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockImage.setScale).toHaveBeenCalledWith(0.5);
            });

            test("adds a text to the scene and the button if overlay is of type text", () => {
                mockOverlay = { ...mockOverlay, type: "text", value: "someText" };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "someText", undefined);
            });

            test("text elements pass font information from the overlay if present", () => {
                mockOverlay = { ...mockOverlay, type: "text", value: "someText", font: { foo: "bar" } };
                mockConfig.overlay.items.push(mockOverlay);
                const expectedFont = mockOverlay.font;
                overlays1Wide(mockArgs);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "someText", expectedFont);
            });
        });

        describe("dynamic and static overlays", () => {
            test("dynamic image overlays use an asset key from the item", () => {
                mockOverlay = { ...mockOverlay, isDynamic: true, assetKey: "icon" };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.itemIcon");
            });

            test("static image overlays use literal values from config with a default prefix", () => {
                mockOverlay.isDynamic = false;
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedKey = `${mockScene.config.assetPrefix}.${mockOverlay.assetKey}`;
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, expectedKey);
            });

            test("dynamic text overlays use the item value given by 'value'", () => {
                mockOverlay = { ...mockOverlay, type: "text", value: "price", isDynamic: true };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedValue = "42";
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, expectedValue, undefined);
            });

            // needs a test for static values probably
        });

        describe("offsets", () => {
            test("no offset is applied if there is no offset object", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedOffset = { x: 0, y: 0 };
                expect(mockScene.add.image).toHaveBeenCalledWith(
                    expectedOffset.x,
                    expectedOffset.y,
                    "test.someImageAssetKey",
                );
            });
            test("align left sets a negative x offset plus the offset x", () => {
                mockOverlay.position = { align: "left", offsetX: 1, offsetY: 0 };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedOffset = { x: -99, y: 0 };
                expect(mockScene.add.image).toHaveBeenCalledWith(
                    expectedOffset.x,
                    expectedOffset.y,
                    "test.someImageAssetKey",
                );
            });

            test("align right sets a positive x offset plus the offset x", () => {
                mockOverlay.position = { align: "right", offsetX: -1, offsetY: 0 };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedOffset = { x: 99, y: 0 };
                expect(mockScene.add.image).toHaveBeenCalledWith(
                    expectedOffset.x,
                    expectedOffset.y,
                    "test.someImageAssetKey",
                );
            });
            test("the y offset is applied unconditionally", () => {
                mockOverlay.position = { align: "left", offsetX: 0, offsetY: 10 };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedOffset = { x: -100, y: 10 };
                expect(mockScene.add.image).toHaveBeenCalledWith(
                    expectedOffset.x,
                    expectedOffset.y,
                    "test.someImageAssetKey",
                );
            });
        });
    });
});
