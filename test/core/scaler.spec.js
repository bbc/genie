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

    it("Should set the scalemode to SHOW_ALL on create", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.SHOW_ALL);
    });

    it("Should call the games onSizeChange add function once", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.onSizeChange.add.callCount).to.eql(1);
    });

    it("Should return correct metrics when calculateMetrics is called", () => {
        sandbox.stub(calculateMetrics, "calculateMetrics").returns(sandbox.stub().returns("metrics"));
        const scaler = Scaler.create(600, mockGame);
        const metrics = scaler.calculateMetrics();
        assert.strictEqual(metrics, "metrics");
    });
});
