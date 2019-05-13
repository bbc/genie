/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert, expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "../../src/core/scaler";
import * as calculateMetrics from "../../src/core/layout/calculate-metrics.js";

describe("Scaler", () => {
    const sandbox = sinon.createSandbox();
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

    describe("Initial configuration", () => {
        it("sets the scalemode", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.SHOW_ALL);
        });

        it("sets the fullScreenScaleMode", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.fullScreenScaleMode).to.eql(Phaser.ScaleManager.SHOW_ALL);
        });

        it("sets the page alignment", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.pageAlignHorizontally).to.eql(true);
            expect(mockGame.scale.pageAlignVertically).to.eql(true);
        });

        it("sets the fullScreenTarget", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.fullScreenTarget).to.eql(document.body);
        });
    });

    it("assigns a callback to window.onresize", () => {
        const callback = window.onresize;
        Scaler.init(600, mockGame);
        assert.notEqual(window.onresize, callback);
    });

    it("returns correct metrics when calculateMetrics is called", () => {
        sandbox.stub(calculateMetrics, "calculateMetrics").returns(sandbox.stub().returns("metrics"));
        Scaler.init(600, mockGame);
        const metrics = Scaler.getMetrics();
        assert.strictEqual(metrics, "metrics");
    });
});
