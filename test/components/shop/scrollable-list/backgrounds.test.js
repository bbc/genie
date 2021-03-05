/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createBackground, resizeBackground } from "../../../../src/components/shop/scrollable-list/backgrounds.js";

describe("createBackground", () => {
    test("null config returns an empty object", () => {
        expect(createBackground({}, null)).toEqual({});
    });

    test("string config for image key", () => {
        const mockImage = {
            setScale: jest.fn(),
            width: 20,
            height: 10,
        };

        const mockSafeArea = {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
        };
        const mockScene = {
            add: { image: jest.fn(() => mockImage) },
            layout: { getSafeArea: jest.fn(() => mockSafeArea) },
        };
        const mockConfig = "imageKey";

        expect(createBackground(mockScene, mockConfig)).toEqual(mockImage);
        expect(mockImage.setScale).toHaveBeenCalledWith(10, 10);
    });

    test("object config for ninepatch", () => {
        const mockNinePatch = {
            test: "key",
        };

        const mockSafeArea = {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
        };

        const mockScene = {
            assetPrefix: "prefix",
            add: { rexNinePatch: jest.fn(() => mockNinePatch) },
            layout: { getSafeArea: jest.fn(() => mockSafeArea) },
        };
        const mockConfig = { columns: [0, 1, null, 3], rows: [0, 1, 2, 3], key: "testKey" };

        expect(createBackground(mockScene, mockConfig)).toEqual(mockNinePatch);

        expect(mockScene.add.rexNinePatch).toHaveBeenCalledWith({
            columns: [0, 1, undefined, 3],
            height: 100,
            key: "prefix.testKey",
            rows: [0, 1, 2, 3],
            width: 200,
            x: 100,
            y: 50,
        });
    });
});

describe("resizeBackground", () => {
    beforeEach(() => {});

    afterEach(jest.clearAllMocks);

    test("Object resize (empty object for blank backgrounds)", () => {
        expect(resizeBackground.Object).not.toThrow();
    });

    test("Image resize", () => {
        const mockImage = {
            setScale: jest.fn(),
            width: 20,
            height: 10,
        };

        const mockSafeArea = {
            x: 0,
            y: 0,
            width: 200,
            height: 100,
        };

        const mockScene = {
            layout: { getSafeArea: jest.fn(() => mockSafeArea) },
        };

        resizeBackground.Image(mockScene, mockImage);
        expect(mockImage.setScale).toHaveBeenCalledWith(10, 10);
    });

    test("Ninepatch resize", () => {
        const mockNinePatch = {
            resize: jest.fn(),
        };

        const mockSafeArea = {
            x: 0,
            y: 100,
            width: 200,
            height: 100,
        };

        const mockScene = {
            layout: { getSafeArea: jest.fn(() => mockSafeArea) },
        };

        resizeBackground.NinePatch(mockScene, mockNinePatch);
        expect(mockNinePatch.resize).toHaveBeenCalledWith(200, 100);
        expect(mockNinePatch.x).toBe(100);
        expect(mockNinePatch.y).toBe(150);
    });
});
