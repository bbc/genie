/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { overlays1Wide } from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import * as text from "../../../../src/core/layout/text.js";

jest.mock("../../../../src/core/layout/text.js");

let mockScene;
let mockGelButton;
let mockItem;
let mockImage;
let mockText;
let mockOverlay;
let mockConfig;

describe("Button overlays", () => {
	afterEach(() => jest.clearAllMocks());

	beforeEach(() => {
		mockText = { setOrigin: jest.fn() };
		text.addText.mockImplementation(() => mockText);
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
		mockImage = { setScale: jest.fn(), width: 100, setOrigin: jest.fn(() => mockImage) };
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
			height: 100,
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

		describe("setOrigin", () => {
			test("sets originX to 0 when alignX is left", () => {
				mockOverlay.position = { alignX: "left" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(0, 0.5);
			});

			test("sets originX to 0.5 when alignX is center", () => {
				mockOverlay.position = { alignX: "center" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
			});

			test("sets originX to 1 when alignX is right", () => {
				mockOverlay.position = { alignX: "right" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(1, 0.5);
			});

			test("sets originY to 0 when alignY is top", () => {
				mockOverlay.position = { alignY: "top" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(0.5, 0);
			});

			test("sets originY to 0.5 when alignY is center", () => {
				mockOverlay.position = { alignY: "center" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
			});

			test("sets originY to 1 when alignY is bottom", () => {
				mockOverlay.position = { alignY: "bottom" };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockImage.setOrigin).toHaveBeenCalledWith(0.5, 1);
			});

			test("also sets origin on text overlays", () => {
				mockOverlay = {
					...mockOverlay,
					type: "text",
					value: "someText",
					position: { alignX: "right", alignY: "top" },
				};
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				expect(mockText.setOrigin).toHaveBeenCalledWith(1, 0);
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
			test("alignX left sets a negative x offset plus the offsetX", () => {
				mockOverlay.position = { alignX: "left", offsetX: 1, offsetY: 0 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: -99, y: 0 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});

			test("alignX right sets a positive x offset plus the offsetX", () => {
				mockOverlay.position = { alignX: "right", offsetX: -1, offsetY: 0 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: 99, y: 0 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});

			test("alignX center sets the offset to offsetX", () => {
				mockOverlay.position = { alignX: "center", offsetX: -1, offsetY: 0 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: -1, y: 0 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});

			test("alignY center sets the offset to offsetY", () => {
				mockOverlay.position = { alignY: "center", offsetX: 0, offsetY: 10 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: 0, y: 10 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});

			test("alignY top sets a negative y offset plus offsetY", () => {
				mockOverlay.position = { alignY: "top", offsetX: 0, offsetY: 10 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: 0, y: -40 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});

			test("alignY bottom sets a positive y offset plus offsetY", () => {
				mockOverlay.position = { alignY: "bottom", offsetX: 0, offsetY: 10 };
				mockConfig.overlay.items.push(mockOverlay);
				overlays1Wide(mockGelButton, mockConfig.overlay.items);
				const expectedOffset = { x: 0, y: 60 };
				expect(mockScene.add.image).toHaveBeenCalledWith(
					expectedOffset.x,
					expectedOffset.y,
					"test.someImageAssetKey",
				);
			});
		});
	});
});
