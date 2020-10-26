/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as shopLayout from "../../../src/components/shop/shop-layout.js";

let mockLayout;
let mockContainer;
const mockSafeArea = { y: -150, width: 600 };
const mockPadding = 10;
const mockMetrics = {
    verticals: { top: -300 },
    verticalBorderPad: 15,
};

describe("shop element scaling functions", () => {
    beforeEach(() => {
        mockLayout = { getSafeArea: jest.fn() };
        mockContainer = {
            getBounds: jest.fn().mockReturnValue({ height: 100, width: 300 }),
            scale: 1,
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("getSafeArea()", () => {
        test("calls getSafeArea with no groups and no Y-mirroring", () => {
            shopLayout.getSafeArea(mockLayout);
            expect(mockLayout.getSafeArea).toHaveBeenCalledWith({}, false);
        });
    });

    describe("getXPos()", () => {
        test("returns an X value that is just inside the horizontal bounds of the safe area", () => {
            const xPos = shopLayout.getXPos(mockContainer, mockSafeArea, mockPadding);
            expect(mockContainer.getBounds).toHaveBeenCalled();
            expect(xPos).toBe(140);
        });
    });

    describe("getYPos()", () => {
        test("returns a Y position that is centered between the screen top and the safe area top", () => {
            const yPos = shopLayout.getYPos(mockMetrics, mockSafeArea);
            expect(yPos).toBe(-217.5);
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
                expect(scaleFactor).toBe(1.275);
            });
        });
        describe("when called with fixedWidth: false", () => {
            test("returns a scale factor that may constrain the element horizontally", () => {
                args.fixedWidth = false;
                const scaleFactor = shopLayout.getScaleFactor(args);
                expect(scaleFactor).toBe(0.5);
            });
        });
    });
});
