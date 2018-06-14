import { assert, expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "../../src/core/scaler";
import * as calculateMetrics from "../../src/core/layout/calculate-metrics.js";

describe("Scaler", () => {
    const sandbox = sinon.sandbox.create();
    let mockGame;

    beforeEach(() => {
        mockGame = {
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                setResizeCallback: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(() => {
                    return { width: 800, height: 600 };
                }),
            },
        };
    });

    afterEach(() => sandbox.restore());

    it("Should set the scalemode to SHOW_ALL on init", () => {
        Scaler.init(600, mockGame);
        expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.SHOW_ALL);
    });

    it("Should assign a callback to window.onresize", () => {
        const callback = window.onresize;
        Scaler.init(600, mockGame);
        assert.notEqual(window.onresize, callback);
    });

    it("Should return correct metrics when calculateMetrics is called", () => {
        sandbox.stub(calculateMetrics, "calculateMetrics").returns(sandbox.stub().returns("metrics"));
        Scaler.init(600, mockGame);
        const metrics = Scaler.getMetrics();
        assert.strictEqual(metrics, "metrics");
    });
});
