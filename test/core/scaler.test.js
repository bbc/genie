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
                parent: {
                    offsetWidth: 1400,
                    offsetHeight: 700,
                },
                refresh: jest.fn(),
            },
            canvas: {
                style: {
                    height: 600,
                },
                getBoundingClientRect: () => {
                    return { width: 300, height: 200 };
                },
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initial configuration", () => {
        it("sets the scalemode", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.scaleMode).toEqual(Phaser.ScaleManager.SHOW_ALL);
        });

        it("sets the fullScreenScaleMode", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.fullScreenScaleMode).toEqual(Phaser.ScaleManager.SHOW_ALL);
        });

        it("sets the page alignment", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.pageAlignHorizontally).toEqual(true);
            expect(mockGame.scale.pageAlignVertically).toEqual(true);
        });

        it("sets the fullScreenTarget", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.fullScreenTarget).toEqual(global.document.body);
        });
    });

    test("assigns a callback to window.onresize", () => {
        const callback = window.onresize;
        Scaler.init(600, mockGame);
        expect(window.onresize).not.toEqual(callback);
    });

    test("returns correct metrics when calculateMetrics is called", () => {
        jest.spyOn(calculateMetrics, "calculateMetrics").mockImplementation(() => jest.fn(() => "metrics"));
        Scaler.init(600, mockGame);
        const metrics = Scaler.getMetrics();
        expect(metrics).toBe("metrics");
    });
});
