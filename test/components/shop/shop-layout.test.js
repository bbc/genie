/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

describe("shop element scaling functions", () => {

    beforeEach(() => {

    });

    afterEach(() => jest.clearAllMocks());

    describe("getSafeArea()", () => {
        test("calls getSafeArea with no groups and no Y-mirroring", () => {
            expect(false).toBe(true);
        });
    });

    describe("getXPos()", () => {
        test("returns an X value that is just inside the horizontal bounds of the safe area", () => {
            expect(false).toBe(true);
        });
    });

    describe("getYPos()", () => {
        test("returns a Y position that is centered between the screen top and the safe area top", () => {
            expect(false).toBe(true);
        });
    });
    
    describe("getScaleFactor()", () => {
        describe("when called with fixedWidth: true", () => {
            test("returns a scale factor that will have the element fill the available vertical space", () => {
                expect(false).toBe(true);
            });
        });
        describe("when called with fixedWidth: false", () => {
            test("returns a scale factor that may constrain the element horizontally", () => {
                expect(false).toBe(true);
            });
        });
    });
});