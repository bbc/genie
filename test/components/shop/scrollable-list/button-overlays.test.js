/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import * as text from "../../../../src/core/layout/text.js";

jest.mock("../../../../src/core/layout/text.js");

let mockScene;
let mockGelButton;
let mockItem;
let mockImage;
let mockOverlay;
let mockConfig;

text.addText = jest.fn(() => "mockText");

describe("Button overlays", () => {
    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockConfig = {
            overlay: {
                items: [],
            },
        };
        mockOverlay = {
            type: "image",
            name: "someImage",
            assetKey: "test.someImageAssetKey",
            inheritProperties: true,
        };
        mockImage = { setScale: jest.fn(), width: 100 };
        mockScene = {
            add: {
                image: jest.fn(() => mockImage),
            },
            config: {
                assetPrefix: "test",
                states: { locked: { properties: { foo: "bar" } } },
            },
        };
        mockItem = {
            name: "someItemName",
            description: "someItemDescription",
            price: 42,
            icon: "test.itemIcon",
            state: "locked",
        };
        mockGelButton = {
            overlays: {
                set: jest.fn(),
            },
            width: 200,
            scene: mockScene,
            item: mockItem,
        };
    });

    describe("overlays1Wide", () => {
        describe("overlays", () => {
            test("sets an overlay on gelButton for every item in config.overlay.items", () => {
                mockConfig.overlay.items.push(mockOverlay, mockOverlay, mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(mockGelButton.overlays.set).toHaveBeenCalledTimes(3);
            });

            test("adds an image if overlay is of type image", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.someImageAssetKey");
            });

            test("scales the image overlay if a size is provided", () => {
                mockOverlay = { ...mockOverlay, size: 50 };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(mockImage.setScale).toHaveBeenCalledWith(0.5);
            });

            test("merges in state properties if inheritProperties is set on the overlay config", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(mockImage.foo).toBe("bar");
            });

            test("otherwise, does not merge state properties", () => {
                const mockOverlayWithoutStateProperties = { ...mockOverlay, inheritProperties: false };
                mockConfig.overlay.items.push(mockOverlayWithoutStateProperties);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(mockImage.foo).not.toBeTruthy();
            });

            test("adds a text to the scene and the button if overlay is of type text", () => {
                mockOverlay = { ...mockOverlay, type: "text", value: "someText" };
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
                expect(text.addText.mock.calls[0][3]).toBe("someText");
            });
        });

        describe("offsets", () => {
            test("no offset is applied if there is no offset object", () => {
                mockConfig.overlay.items.push(mockOverlay);
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
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
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
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
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
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
                overlays1Wide(mockGelButton, mockConfig.overlay.items);
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
