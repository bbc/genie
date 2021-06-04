/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

import { calculateMetrics } from "../../../src/core/layout/metrics.js";

let defaultValues = {
    width: 800,
    height: 600,
    stageHeight: 600,
};

const getMetrics = newValues => {
    const values = fp.merge(defaultValues, newValues, {});
    return calculateMetrics(values.stageHeight)({ width: values.width, height: values.height });
};

describe("Layout - Calculate Metrics", () => {
    test("returns basic metrics", () => {
        const metrics = getMetrics({});
        expect(metrics.width).toBe(defaultValues.width);
        expect(metrics.height).toBe(defaultValues.height);
        expect(metrics.scale).toBe(1);
    });

    describe("borderPad metric", () => {
        test("sets a vertical border padding of 2% of the longest edge", () => {
            expect(getMetrics({ width: 600, height: 600 }).verticalBorderPad).toBe(16);
            expect(getMetrics({ width: 800, height: 600 }).verticalBorderPad).toBe(16);
            expect(getMetrics({ width: 1000, height: 600 }).verticalBorderPad).toBe(20);
            expect(getMetrics({ width: 1500, height: 600 }).verticalBorderPad).toBe(28);

            expect(getMetrics({ width: 200, height: 600 }).verticalBorderPad).toBe(16);
            expect(getMetrics({ width: 200, height: 800 }).verticalBorderPad).toBe(16);
            expect(getMetrics({ width: 200, height: 1000 }).verticalBorderPad).toBe(16);
        });

        test("sets a vertical border padding of 21 when it is a iPhone 5 (568x320)", () => {
            expect(getMetrics({ width: 568, height: 320 }).verticalBorderPad).toBe(21);
        });

        test("sets a bottom border padding of 58 when it is a iPhone 5 (568x320)", () => {
            expect(getMetrics({ width: 568, height: 320 }).bottomBorderPad).toBe(58);
        });

        test("sets a horizontal border padding of 2% of the longest edge", () => {
            expect(getMetrics({ width: 600, height: 600 }).horizontalBorderPad).toBe(16);
            expect(getMetrics({ width: 800, height: 600 }).horizontalBorderPad).toBe(16);
            expect(getMetrics({ width: 1000, height: 600 }).horizontalBorderPad).toBe(20);
            expect(getMetrics({ width: 1500, height: 600 }).horizontalBorderPad).toBe(28);

            expect(getMetrics({ width: 200, height: 600 }).horizontalBorderPad).toBe(16);
            expect(getMetrics({ width: 200, height: 800 }).horizontalBorderPad).toBe(16);
            expect(getMetrics({ width: 200, height: 1000 }).horizontalBorderPad).toBe(16);
        });
    });

    describe("isMobile metric", () => {
        test("reports as a mobile device if stage width is less than 770 Pixels", () => {
            expect(getMetrics({ width: 769 }).isMobile).toBe(true);
        });

        test("reports as a tablet/desktop device if stage width is greater than or equal to 770 Pixels", () => {
            expect(getMetrics({ width: 771 }).isMobile).toBe(false);
        });
    });

    describe("buttonPad metric", () => {
        test("is 22 if mobile device", () => {
            expect(getMetrics({ width: 500 }).buttonPad).toBe(22);
        });

        test("is 24 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).buttonPad).toBe(24);
        });
    });

    describe("buttonMin metric", () => {
        test("is 42 if mobile device", () => {
            expect(getMetrics({ width: 500 }).buttonMin).toBe(42);
        });

        test("is 64 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).buttonMin).toBe(64);
        });
    });

    describe("hitMin metric", () => {
        test("is 64 if mobile device", () => {
            expect(getMetrics({ width: 500 }).hitMin).toBe(64);
        });

        test("is 70 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).hitMin).toBe(70);
        });
    });

    describe("horizontals metric", () => {
        test("returns horizontals in relation to the width and scale", () => {
            const expectedFor600 = { left: -400, center: 0, right: 400 };
            const expectedFor800 = { left: -400, center: 0, right: 400 };
            const expectedFor1000 = { left: -250, center: 0, right: 250 };
            expect(getMetrics({ width: 600 }).horizontals).toEqual(expectedFor600);
            expect(getMetrics({ width: 800 }).horizontals).toEqual(expectedFor800);
            expect(getMetrics({ width: 1000, stageHeight: 300 }).horizontals).toEqual(expectedFor1000);
        });
    });

    describe("safeHorizontals metric", () => {
        test("returns safe horizontals in relation to the stage height", () => {
            const expectedFor600 = { left: -400, center: 0, right: 400 };
            const expectedFor768 = { left: -512, center: 0, right: 512 };
            const expectedFor1080 = { left: -720, center: 0, right: 720 };
            expect(getMetrics({ stageHeight: 600 }).safeHorizontals).toEqual(expectedFor600);
            expect(getMetrics({ stageHeight: 768 }).safeHorizontals).toEqual(expectedFor768);
            expect(getMetrics({ stageHeight: 1080 }).safeHorizontals).toEqual(expectedFor1080);
        });
    });

    describe("verticals metric", () => {
        test("returns verticals in relation to the stage height", () => {
            const expectedFor600 = { top: -300, middle: 0, bottom: 300 };
            const expectedFor800 = { top: -400, middle: 0, bottom: 400 };
            const expectedFor1000 = { top: -500, middle: 0, bottom: 500 };
            expect(getMetrics({ stageHeight: 600 }).verticals).toEqual(expectedFor600);
            expect(getMetrics({ stageHeight: 800 }).verticals).toEqual(expectedFor800);
            expect(getMetrics({ stageHeight: 1000 }).verticals).toEqual(expectedFor1000);
        });
    });

    describe("screenToCanvas method", () => {
        test("converts screen pixels to canvas pixels", () => {
            expect(getMetrics({ stageHeight: 150 }).screenToCanvas(20)).toEqual(5);
            expect(getMetrics({ stageHeight: 300 }).screenToCanvas(20)).toEqual(10);
            expect(getMetrics({ stageHeight: 600 }).screenToCanvas(20)).toEqual(20);
            expect(getMetrics({ stageHeight: 900 }).screenToCanvas(20)).toEqual(30);
        });
    });
});
