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

let mockOverlay;
let mockConfig;
let mockArgs;

describe("Button overlays", () => {
    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockConfig = {
            overlay: {
                defaultPrefix: "test",
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
            scene: mockScene,
            gelButton: mockGelButton,
            item: mockItem,
            config: mockConfig,
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

            test("adds a text to the scene and the button if overlay is of type button", () => {
                mockOverlay.type = "text";
                mockOverlay.value = "someTextValue";
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "someTextValue", undefined);
            });

            test("text elements pass font information from the overlay if present", () => {
                (mockOverlay.type = "text"), (mockOverlay.value = "someTextValue");
                mockOverlay.font = { foo: "bar" };
                mockConfig.overlay.items.push(mockOverlay);
                const expectedFont = mockOverlay.font;
                overlays1Wide(mockArgs);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "someTextValue", expectedFont);
            });
        });

        describe("dynamic and static overlays", () => {
            test("dynamic image overlays use an asset key from the item", () => {
                mockOverlay.isDynamic = true;
                mockOverlay.assetKey = "icon";
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, mockItem.icon);
            });

            test("static image overlays use literal values from config with a default prefix", () => {
                mockOverlay.isDynamic = false;
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedKey = `${mockConfig.overlay.defaultPrefix}.${mockOverlay.assetKey}`;
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, expectedKey);
            });

            test("dynamic text overlays use the item value given by 'value'", () => {
                mockOverlay.isDynamic = true;
                mockOverlay.type = "text";
                mockOverlay.value = "price";
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockArgs);
                const expectedValue = "42";
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, expectedValue, undefined);
            });

            test("non-dynamic text overlays use the literal string value from overlay", () => {
                mockOverlay.isDynamic = false;
                mockOverlay.type = "text";
                mockOverlay.value = "someTextValue";
                mockConfig.overlay.items.push(mockOverlay);
                const expectedKey = mockOverlay.value;
                overlays1Wide(mockArgs);
                expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, expectedKey, undefined);
            });
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
