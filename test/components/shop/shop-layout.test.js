/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as shopLayout from "../../../src/components/shop/shop-layout.js";

let mockLayout;
let mockScene;
let mockContainer;
const mockSafeArea = { x: 0, y: -50, height: 450, width: 600 };
const mockPadding = 10;
const mockMetrics = {
    verticals: { top: -300 },
    verticalBorderPad: 15,
};

describe("shop element scaling functions", () => {
    beforeEach(() => {
        mockLayout = { getSafeArea: jest.fn(() => mockSafeArea) };
        mockContainer = {
            getBounds: jest.fn().mockReturnValue({ height: 450, width: 600, x: 0, y: -150 }),
            scale: 1,
            y: 0,
            visible: true,
        };
        mockScene = { layout: mockLayout, config: { menu: { buttonsRight: true } } };
    });

    afterEach(() => jest.clearAllMocks());

    describe("getSafeArea()", () => {
        test("calls getSafeArea with no groups and no Y-mirroring", () => {
            shopLayout.getSafeArea(mockLayout);
            expect(mockLayout.getSafeArea).toHaveBeenCalledWith({}, false);
        });
    });

    describe("getXPos()", () => {
        test("returns an X value inside the safe area, accounting for padding", () => {
            const xPos = shopLayout.getXPos(mockContainer, mockSafeArea, mockPadding);
            expect(mockContainer.getBounds).toHaveBeenCalled();
            expect(xPos).toBe(-10);
        });
    });

    describe("getYPos()", () => {
        test("returns a Y position that is centered between the screen top and the safe area top", () => {
            const yPos = shopLayout.getYPos(mockMetrics, mockSafeArea);
            expect(yPos).toBe(-167.5);
        });
    });

    describe("getScaleFactor()", () => {
        let args;

        beforeEach(
            () =>
                (args = {
                    metrics: mockMetrics,
                    container: mockContainer,
                    safeArea: mockSafeArea,
                }),
        );
        describe("when called with fixedWidth: true", () => {
            test("returns a scale factor that will have the element fill the available vertical space", () => {
                args.fixedWidth = true;
                const scaleFactor = shopLayout.getScaleFactor(args);
                expect(scaleFactor).toBeCloseTo(0.5, 1);
            });
        });
        describe("when called with fixedWidth: false", () => {
            test("returns a scale factor that may constrain the element horizontally", () => {
                args.fixedWidth = false;
                const scaleFactor = shopLayout.getScaleFactor(args);
                expect(scaleFactor).toBe(0.25);
            });
        });
    });

    describe("getInnerRectBounds", () => {
        test("returns a bounds object, to one side of the safe area, with nice proportions", () => {
            const result = shopLayout.getInnerRectBounds(mockScene);
            const expected = {
                x: 150,
                y: 0,
                width: 195,
                height: 270,
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("createPaneBackground()", () => {
        let mockScene;
        const mockBounds = { width: 1, height: 1 };

        beforeEach(() => {
            mockScene = {
                assetPrefix: "some",
                add: {
                    image: jest.fn().mockReturnValue({ setScale: jest.fn() }),
                    rectangle: jest.fn().mockReturnValue({ setScale: jest.fn() }),
                },
                config: {
                    backgrounds: { shop: "asset" },
                },
            };
        });

        test("if configured with an asset key, returns an image", () => {
            shopLayout.createPaneBackground(mockScene, mockBounds, "shop");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "some.asset");
        });
        test("if configured without an asset key, returns a rectangle", () => {
            mockScene.config.backgrounds = {};
            shopLayout.createPaneBackground(mockScene, mockBounds, "shop");
            expect(mockScene.add.rectangle).toHaveBeenCalled();
        });
    });
});
