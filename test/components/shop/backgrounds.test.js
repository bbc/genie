/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createBackground, initResizers, resizeBackground } from "../../../src/components/shop/backgrounds.js";

describe("Shop backgrounds", () => {
    afterEach(jest.clearAllMocks);

    describe("createBackground", () => {
        let mockImage;
        let mockNinePatch;
        let mockSafeArea;
        let mockScene;
        let mockConfig;

        beforeEach(() => {
            mockImage = {
                setScale: jest.fn(),
                width: 20,
                height: 10,
            };

            mockNinePatch = {
                test: "key",
            };

            mockSafeArea = {
                x: 0,
                y: 0,
                width: 200,
                height: 100,
            };

            mockScene = {
                assetPrefix: "prefix",
                add: { image: jest.fn(() => mockImage), rexNinePatch: jest.fn(() => mockNinePatch) },
                layout: { getSafeArea: jest.fn(() => mockSafeArea) },
            };
            mockConfig = {};
        });

        test("null config returns an empty object", () => {
            expect(createBackground({}, null)).toEqual({});
        });

        test("string config for image key", () => {
            mockConfig = "imageKey";
            expect(createBackground(mockScene, mockConfig)).toEqual(mockImage);
            expect(mockImage.setScale).toHaveBeenCalledWith(10, 10);
        });

        test("object config for ninepatch", () => {
            mockConfig = { columns: [0, 1, null, 3], rows: [0, 1, 2, 3], key: "testKey" };
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
        let mockNinePatch;
        let mockImage;
        let mockSafeArea;
        let mockScene;

        beforeEach(() => {
            mockNinePatch = {
                resize: jest.fn(),
            };

            mockImage = {
                setScale: jest.fn(),
                width: 20,
                height: 10,
            };

            mockSafeArea = {
                x: 0,
                y: 0,
                width: 200,
                height: 100,
            };

            mockScene = {
                layout: { getSafeArea: jest.fn(() => mockSafeArea) },
            };

            global.RexPlugins = {
                GameObjects: {
                    NinePatch: jest.fn(),
                },
            };
            initResizers();
        });

        test("Object resize (empty object for blank backgrounds)", () => {
            expect(resizeBackground(Object)).not.toThrow();
        });

        test("Image resizes correctly when using defaultSpec", () => {
            resizeBackground(Phaser.GameObjects.Image)(mockScene, mockImage);
            expect(mockImage.setScale).toHaveBeenCalledWith(10, 10);
            expect(mockImage.y).toBe(0);
        });

        test("Image resizes correctly when newSpec provided", () => {
            resizeBackground(Phaser.GameObjects.Image)(mockScene, mockImage, { yOffset: 29 });
            expect(mockImage.setScale).toHaveBeenCalledWith(10, 10);
            expect(mockImage.y).toBe(29);
        });

        test("Ninepatch resize when using defaultSpec", () => {
            resizeBackground(RexPlugins.GameObjects.NinePatch)(mockScene, mockNinePatch);
            expect(mockNinePatch.resize).toHaveBeenCalledWith(200, 100);
            expect(mockNinePatch.x).toBe(100);
            expect(mockNinePatch.y).toBe(50);
        });

        test("Ninepatch resize when newSpec provided", () => {
            resizeBackground(RexPlugins.GameObjects.NinePatch)(mockScene, mockNinePatch, { xOffset: 4 });
            expect(mockNinePatch.resize).toHaveBeenCalledWith(200, 100);
            expect(mockNinePatch.x).toBe(900);
            expect(mockNinePatch.y).toBe(50);
        });
    });
});
