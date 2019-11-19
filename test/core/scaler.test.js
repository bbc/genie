/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Scaler from "../../src/core/scaler";
import * as calculateMetrics from "../../src/core/layout/calculate-metrics.js";
import * as event from "../../src/core/event-bus.js";

describe("Scaler", () => {
    let mockGame;

    beforeEach(() => {
        event.bus.subscribe = jest.fn();
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
        test("sets the canvas height correctly when under 4by3", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.canvas.style.height).toEqual(`${mockGame.scale.parent.offsetHeight}px`);
        });

        test("sets the canvas height correctly when over 4by3", () => {
            const expectedHeight = mockGame.scale.parent.offsetWidth * (3 / 4);
            mockGame.scale.parent.offsetHeight = 10000;
            Scaler.init(600, mockGame);
            expect(mockGame.canvas.style.height).toEqual(`${expectedHeight}px`);
        });

        test("sets margin left and margin top on the game canvas", () => {
            const expectedMarginLeft =
                (mockGame.scale.parent.offsetWidth - mockGame.canvas.getBoundingClientRect().width) / 2;
            const expectedMarginTop =
                (mockGame.scale.parent.offsetHeight - mockGame.canvas.getBoundingClientRect().height) / 2;
            Scaler.init(600, mockGame);
            expect(mockGame.canvas.style.marginLeft).toBe(`${expectedMarginLeft}px`);
            expect(mockGame.canvas.style.marginTop).toBe(`${expectedMarginTop}px`);
        });

        test("calls game canvas refresh", () => {
            Scaler.init(600, mockGame);
            expect(mockGame.scale.refresh).toHaveBeenCalled();
        });
    });

    test("assigns a callback to window.onresize", () => {
        window.onresize = undefined;
        Scaler.init(600, mockGame);
        expect(window.onresize).toEqual(expect.any(Function));
    });

    test("returns correct metrics when calculateMetrics is called", () => {
        jest.spyOn(calculateMetrics, "calculateMetrics").mockImplementation(() => jest.fn(() => "metrics"));
        Scaler.init(600, mockGame);
        const metrics = Scaler.getMetrics();
        expect(metrics).toBe("metrics");
    });

    test("adding a callback to the onScaleChange event, subscribes it to the event bus", () => {
        const mockCallback = jest.fn();
        const expectedParams = {
            channel: "scaler",
            name: "sizeChange",
            callback: mockCallback,
        };
        Scaler.onScaleChange.add(mockCallback);
        Scaler.init(600, mockGame);
        expect(event.bus.subscribe).toHaveBeenCalledWith(expectedParams);
    });
});
