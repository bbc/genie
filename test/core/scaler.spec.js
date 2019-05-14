/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Scaler from "../../src/core/scaler";
import * as calculateMetrics from "../../src/core/layout/calculate-metrics.js";

describe("Scaler", () => {
    let mockGame;

    beforeEach(() => {
        mockGame = {
            scale: {
                setGameSize: jest.fn(),
                scaleMode: jest.fn(),
                setResizeCallback: jest.fn(),
                onSizeChange: { add: jest.fn() },
                getParentBounds: jest.fn(() => {
                    return { width: 800, height: 600 };
                }),
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    it("Should set the scalemode to SHOW_ALL on init", () => {
        Scaler.init(600, mockGame);
        expect(mockGame.scale.scaleMode).toEqual(Phaser.ScaleManager.SHOW_ALL);
    });

    it("Should assign a callback to window.onresize", () => {
        const callback = window.onresize;
        Scaler.init(600, mockGame);
        expect(window.onresize).not.toEqual(callback);
    });

    it("Should return correct metrics when calculateMetrics is called", () => {
        jest.spyOn(calculateMetrics, "calculateMetrics").mockImplementation(() => jest.fn(() => "metrics"));
        Scaler.init(600, mockGame);
        const metrics = Scaler.getMetrics();
        expect(metrics).toBe("metrics");
    });
});
