import { expect } from "chai";
import { calculateMetrics } from "src/core/layout/calculate-metrics";

describe("Metrics", () => {
    it("Should report as mobile device if stage less than 770 Pixels", done => {
        expect(calculateMetrics(200, 200, 1, 200).isMobile).to.equal(true);

        /*
            calculateMetrics = (
                width: number,
                height: number,
                scale: number,
                stageHeight: number,
            )
         */

        done();
    });
});
