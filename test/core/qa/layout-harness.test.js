/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTestHarnessDisplay } from "../../../src/core/qa/layout-harness.js";
import { onScaleChange } from "../../../src/core/scaler.js";

describe("Layout Harness", () => {
    let mockScene;
    let mockOnUpEvent;
    let mockGraphicsObject;
    let mockQaKeySignal;
    let mockSignal;
    let onResizeFunction;

    beforeEach(() => {
        mockQaKeySignal = { destroy: jest.fn() };
        mockSignal = { unsubscribe: jest.fn() };
        onScaleChange.add = jest.fn(resizeFunc => {
            onResizeFunction = resizeFunc;
            return mockSignal;
        });
        jest.spyOn(global.console, "log").mockImplementation(() => {});
        global.window.__qaMode = {};
        mockOnUpEvent = jest.fn((name, callback) => {
            callback();
            return mockQaKeySignal;
        });
        mockGraphicsObject = {
            fillRectShape: jest.fn(),
            strokeRect: jest.fn(),
            destroy: jest.fn(),
        };
        mockScene = {
            input: {
                keyboard: {
                    addKey: jest.fn(() => ({ on: mockOnUpEvent })),
                    removeKey: jest.fn(),
                },
            },
            add: {
                graphics: jest.fn(() => mockGraphicsObject),
            },
            game: {
                canvas: { width: 800, height: 600 },
                scale: { parent: { offsetWidth: 800, offsetHeight: 600 } },
            },
            events: { on: jest.fn(), once: jest.fn(), removeListener: jest.fn() },
        };
    });

    afterEach(() => {
        onResizeFunction = undefined;
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("listens to when the 'q' key is pressed if QA mode is on", () => {
        createTestHarnessDisplay(mockScene);
        expect(mockScene.input.keyboard.addKey).toHaveBeenCalledWith("q");
    });

    test("does not listen to when the 'q' key is pressed if QA mode is off", () => {
        delete global.window.__qaMode;
        createTestHarnessDisplay(mockScene);
        expect(mockScene.input.keyboard.addKey).not.toHaveBeenCalledWith("q");
    });

    test("removes the 'q' key event listener when the screen is destroyed", () => {
        mockScene.events.on.mockImplementation((name, callback) => callback());
        createTestHarnessDisplay(mockScene);
        expect(mockQaKeySignal.destroy).toHaveBeenCalled();
    });

    test("listens to overlay and screen navigation events when QA mode is on", () => {
        createTestHarnessDisplay(mockScene);
        expect(mockScene.events.on).toHaveBeenCalledWith("onoverlayadded", expect.any(Function));
        expect(mockScene.events.on).toHaveBeenCalledWith("onoverlayremoved", expect.any(Function));
        expect(mockScene.events.once).toHaveBeenCalledWith("onscreenexit", expect.any(Function));
    });

    test("stops listening to all events when the screen is destroyed", () => {
        mockScene.events.once = jest.fn((name, callback) => callback());
        createTestHarnessDisplay(mockScene);
        expect(mockSignal.unsubscribe).toHaveBeenCalled();
        expect(mockQaKeySignal.destroy).toHaveBeenCalled();
        expect(mockScene.events.removeListener).toHaveBeenCalledWith("onoverlayadded", expect.any(Function));
        expect(mockScene.events.removeListener).toHaveBeenCalledWith("onoverlayremoved", expect.any(Function));
    });

    describe("Toggle on", () => {
        test("outputs a console log when layout harness is toggled on", () => {
            createTestHarnessDisplay(mockScene);
            expect(global.console.log).toHaveBeenCalledWith("Layout Test Harness Displayed");
        });

        test("adds a callback to the onScaleChange event", () => {
            createTestHarnessDisplay(mockScene);
            expect(onScaleChange.add).toHaveBeenCalled();
        });

        test("draws a rectangle to represent the game area when layout harness is on", () => {
            jest.spyOn(Phaser.Geom, "Rectangle");
            createTestHarnessDisplay(mockScene);
            expect(mockScene.add.graphics).toHaveBeenCalledWith({
                fillStyle: { color: 0x32cd32, alpha: 0.5 },
                add: true,
            });
            expect(Phaser.Geom.Rectangle).toHaveBeenCalledWith(-400, -300, 800, 600);
            expect(mockGraphicsObject.fillRectShape).toHaveBeenCalledWith({
                height: 600,
                type: 5,
                width: 800,
                x: -400,
                y: -300,
            });
        });

        test("draws a box to represent the outer GEL padding when layout harness is toggled on", () => {
            createTestHarnessDisplay(mockScene);
            expect(mockScene.add.graphics).toHaveBeenCalledWith({
                lineStyle: {
                    width: 16,
                    color: 0xffff00,
                    alpha: 0.5,
                },
            });
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-392, -292, 784, 584);
        });

        test("draws a box to represent the outer GEL padding when layout harness is toggled on and aspect ratio is above 4:3", () => {
            mockScene.game.scale.parent = { offsetWidth: 1600, offsetHeight: 800 };
            createTestHarnessDisplay(mockScene);
            expect(mockScene.add.graphics).toHaveBeenCalledWith({
                lineStyle: {
                    width: 24,
                    color: 0xffff00,
                    alpha: 0.5,
                },
            });
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-588, -288, 1176, 576);
        });
    });

    describe("Toggle off", () => {
        test("outputs a console log when layout harness is toggled off", () => {
            createTestHarnessDisplay(mockScene);
            mockOnUpEvent.mock.calls[0][1]();
            expect(global.console.log).toHaveBeenCalledWith("Layout Test Harness Hidden");
        });

        test("destroys all the graphics when toggled off", () => {
            createTestHarnessDisplay(mockScene);
            mockOnUpEvent.mock.calls[0][1]();
            expect(mockGraphicsObject.destroy).toHaveBeenCalledTimes(2);
        });

        test("unsubscribes from the signal bus", () => {
            createTestHarnessDisplay(mockScene);
            mockOnUpEvent.mock.calls[0][1]();
            expect(mockSignal.unsubscribe).toHaveBeenCalled();
        });
        test("does not destroy when there is no layout active", () => {
            mockScene.events.once = jest.fn((name, callback) => callback());
            mockScene.input.keyboard.addKey = () => {
                return {
                    on: () => {
                        return { destroy: jest.fn() };
                    },
                };
            };
            createTestHarnessDisplay(mockScene);
            expect(mockGraphicsObject.destroy).not.toHaveBeenCalled();
        });
    });

    describe("On Resize", () => {
        test("destroys and recreates graphics with new measurements", () => {
            createTestHarnessDisplay(mockScene);
            jest.clearAllMocks();
            onResizeFunction();
            expect(mockGraphicsObject.destroy).toHaveBeenCalledTimes(2);
            expect(mockScene.add.graphics).toHaveBeenCalledTimes(2);
            expect(onScaleChange.add).toHaveBeenCalled();
            expect(mockSignal.unsubscribe).toHaveBeenCalled();
        });
    });
});
