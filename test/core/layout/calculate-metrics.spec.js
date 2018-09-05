/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { expect } from "chai";
import * as _ from "lodash";

import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";

const defaultValues = {
    width: 800,
    height: 600,
    stageHeight: 600,
};

const getMetrics = newValues => {
    const values = _.merge({}, defaultValues, newValues);
    return calculateMetrics(values.stageHeight, { width: values.width, height: values.height });
};

describe("Layout - Calculate Metrics", () => {
    it("returns basic metrics", () => {
        const metrics = getMetrics({});
        expect(metrics.width).to.equal(defaultValues.width);
        expect(metrics.height).to.equal(defaultValues.height);
        expect(metrics.scale).to.equal(1);
    });

    describe("borderPad metric", () => {
        it("sets a border padding of 2% of the longest edge", () => {
            expect(getMetrics({ width: 600, height: 600 }).borderPad).to.equal(16);
            expect(getMetrics({ width: 800, height: 600 }).borderPad).to.equal(16);
            expect(getMetrics({ width: 1000, height: 600 }).borderPad).to.equal(20);
            expect(getMetrics({ width: 1500, height: 600 }).borderPad).to.equal(28);

            expect(getMetrics({ width: 200, height: 600 }).borderPad).to.equal(16);
            expect(getMetrics({ width: 200, height: 800 }).borderPad).to.equal(16);
            expect(getMetrics({ width: 200, height: 1000 }).borderPad).to.equal(16);
        });
    });

    describe("isMobile metric", () => {
        it("reports as a mobile device if stage width is less than 770 Pixels", () => {
            expect(getMetrics({ width: 769 }).isMobile).to.equal(true);
        });

        it("reports as a tablet/desktop device if stage width is greater than or equal to 770 Pixels", () => {
            expect(getMetrics({ width: 771 }).isMobile).to.equal(false);
        });
    });

    describe("buttonPad metric", () => {
        it("is 22 if mobile device", () => {
            expect(getMetrics({ width: 500 }).buttonPad).to.equal(22);
        });

        it("is 24 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).buttonPad).to.equal(24);
        });
    });

    describe("buttonMin metric", () => {
        it("is 42 if mobile device", () => {
            expect(getMetrics({ width: 500 }).buttonMin).to.equal(42);
        });

        it("is 64 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).buttonMin).to.equal(64);
        });
    });

    describe("hitMin metric", () => {
        it("is 64 if mobile device", () => {
            expect(getMetrics({ width: 500 }).hitMin).to.equal(64);
        });

        it("is 70 if tablet/desktop device", () => {
            expect(getMetrics({ width: 800 }).hitMin).to.equal(70);
        });
    });

    describe("horizontals metric", () => {
        it("returns horizontals in relation to the width and scale", () => {
            const expectedFor600 = { left: -400, center: 0, right: 400 };
            const expectedFor800 = { left: -400, center: 0, right: 400 };
            const expectedFor1000 = { left: -250, center: 0, right: 250 };
            expect(getMetrics({ width: 600 }).horizontals).to.eql(expectedFor600);
            expect(getMetrics({ width: 800 }).horizontals).to.eql(expectedFor800);
            expect(getMetrics({ width: 1000, stageHeight: 300 }).horizontals).to.eql(expectedFor1000);
        });
    });

    describe("safeHorizontals metric", () => {
        it("returns safe horizontals in relation to the stage height", () => {
            const expectedFor600 = { left: -400, center: 0, right: 400 };
            const expectedFor768 = { left: -512, center: 0, right: 512 };
            const expectedFor1080 = { left: -720, center: 0, right: 720 };
            expect(getMetrics({ stageHeight: 600 }).safeHorizontals).to.eql(expectedFor600);
            expect(getMetrics({ stageHeight: 768 }).safeHorizontals).to.eql(expectedFor768);
            expect(getMetrics({ stageHeight: 1080 }).safeHorizontals).to.eql(expectedFor1080);
        });
    });

    describe("verticals metric", () => {
        it("returns verticals in relation to the stage height", () => {
            const expectedFor600 = { top: -300, middle: 0, bottom: 300 };
            const expectedFor800 = { top: -400, middle: 0, bottom: 400 };
            const expectedFor1000 = { top: -500, middle: 0, bottom: 500 };
            expect(getMetrics({ stageHeight: 600 }).verticals).to.eql(expectedFor600);
            expect(getMetrics({ stageHeight: 800 }).verticals).to.eql(expectedFor800);
            expect(getMetrics({ stageHeight: 1000 }).verticals).to.eql(expectedFor1000);
        });
    });
});
