/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import * as LoadBar from "../../src/components/loadbar";

describe("Load Bar", () => {
    const sandbox = sinon.createSandbox();

    const mockGame = {
        add: { image: () => mockBarFill },
    };
    const barBackgroundKey = "";
    const barFillKey = "";

    const mockBarFill = {
        width: 100,
        anchor: { add: () => {} },
    };

    beforeEach(() => {
        mockBarFill.crop = sinon.spy();
    });
    afterEach(() => {
        sandbox.restore();
    });

    describe("createLoadBar", () => {
        it("sets crop size when fillPercent is updated", () => {
            const progress = 50;
            const loadBar = LoadBar.createLoadBar(mockGame, barBackgroundKey, barFillKey);

            loadBar.fillPercent = progress;
            const cropRect = mockBarFill.crop.getCall(0).args[0];
            assert.equal(cropRect.width, progress);
        });
    });
});
