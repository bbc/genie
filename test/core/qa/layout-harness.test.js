/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTestHarnessDisplay } from "../../../src/core/qa/layout-harness.js";

describe("Layout Harness", () => {
    let mockScene;
    let mockOnUpEvent;
    let mockGraphicsObject;

    beforeEach(() => {
        jest.spyOn(global.console, "log").mockImplementation(() => {});
        global.window.__qaMode = {};
        mockOnUpEvent = jest.fn((name, callback) => callback());
        mockGraphicsObject = {
            fillRectShape: jest.fn(),
            strokeRect: jest.fn(),
            destroy: jest.fn(),
        };
        mockScene = {
            input: {
                keyboard: {
                    addKey: jest.fn(() => ({ on: mockOnUpEvent })),
                },
            },
            add: {
                graphics: jest.fn(() => mockGraphicsObject),
            },
            game: {
                canvas: { width: 800, height: 600 },
            },
        };
    });

    afterEach(() => {
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

    describe("Toggle on", () => {
        test("outputs a console log when layout harness is toggled on", () => {
            createTestHarnessDisplay(mockScene);
            expect(global.console.log).toHaveBeenCalledWith("Layout Test Harness Displayed");
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
    });
});
