import { expect } from "chai";
import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";

const getMetricsByWidth = (width: number) => calculateMetrics(width, 200, 1, 200);

describe("CalculateMetrics", () => {
    it("Should report as mobile device if stage width is less than 770 Pixels", () => {
        expect(getMetricsByWidth(769).isMobile).to.equal(true);
    });

    it("Should report as tablet/desktop device if stage width is greater than or equal to 770 Pixels", () => {
        expect(getMetricsByWidth(771).isMobile).to.equal(false);
    });

    it("Should set button padding to 22 if mobile device", () => {
        expect(getMetricsByWidth(500).buttonPad).to.equal(22);
    });

    it("Should set button padding to 24 if tablet/desktop device", () => {
        expect(getMetricsByWidth(800).buttonPad).to.equal(24);
    });

    it("Should set a minimum button size of 43 if mobile device", () => {
        expect(getMetricsByWidth(500).buttonMin).to.equal(42);
    });

    it("Should set a minimum button size of 64 if tablet/desktop device", () => {
        expect(getMetricsByWidth(800).buttonMin).to.equal(64);
    });

    it("Should minimum button hit size of 64 if mobile device", () => {
        expect(getMetricsByWidth(500).hitMin).to.equal(64);
    });

    it("Should minimum button hit size of 70 if tablet/desktop device", () => {
        expect(getMetricsByWidth(800).hitMin).to.equal(70);
    });

    it("Should set a border padding of 2% the longest edge", () => {
        expect(getMetricsByWidth(600).borderPad).to.equal(12);
        expect(getMetricsByWidth(800).borderPad).to.equal(16);
        expect(getMetricsByWidth(1000).borderPad).to.equal(20);

        expect(calculateMetrics(200, 200, 1, 600).borderPad).to.equal(12);
        expect(calculateMetrics(200, 200, 1, 800).borderPad).to.equal(16);
        expect(calculateMetrics(200, 200, 1, 1000).borderPad).to.equal(20);
    });
});
