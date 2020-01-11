/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { debugDraw, setupDebugKeys } from "../../../src/core/debug/layout-debug-draw.js";

describe("Layout Harness", () => {
    let mockScreen;
    let mockOnUpEvent;
    let mockGraphicsObject;

    beforeEach(() => {
        mockOnUpEvent = jest.fn();
        mockGraphicsObject = {
            fillRectShape: jest.fn(),
            strokeRect: jest.fn(),
            destroy: jest.fn(),
            fillStyle: jest.fn(),
            lineStyle: jest.fn(),
        };
        mockScreen = {
            input: {
                keyboard: {
                    addKey: jest.fn(() => ({ on: mockOnUpEvent })),
                    removeKey: jest.fn(),
                },
            },
            debugGraphics: mockGraphicsObject,
            add: {
                graphics: jest.fn(() => mockGraphicsObject),
            },
            game: {
                canvas: { width: 800, height: 600 },
                scale: { parent: { offsetWidth: 800, offsetHeight: 600 } },
            },
            layout: {
                debug: {
                    groups: jest.fn(),
                    buttons: jest.fn(),
                },
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("setupDebugKeys", () => {
        test("sets up key toggles", () => {
            setupDebugKeys(mockScreen);
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("e");
        });
    });

    describe("debugDraw", () => {
        test("does not draw to the debug layer until enabled via keys", () => {
            debugDraw();

            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
        });

        test("does not draw to the debug layer when toggled on then off again", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[0][1];
            toggle();
            toggle();
            debugDraw();
            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
        });

        test("draws a box to represent the game area when toggled on", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[0][1];
            toggle();
            debugDraw();

            expect(mockGraphicsObject.fillStyle).toHaveBeenCalledWith(0x32cd32, 0.5);

            expect(mockGraphicsObject.fillRectShape).toHaveBeenCalledWith({
                height: 600,
                type: 5,
                width: 800,
                x: -400,
                y: -300,
            });
        });

        test("draws a box to represent the outer GEL padding when toggled on", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[0][1];
            toggle();
            debugDraw();

            expect(mockGraphicsObject.lineStyle).toHaveBeenCalledWith(16, 0xffff00, 0.5);
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-392, -292, 784, 584);
        });

        test("draws a box to represent the outer GEL padding when toggled on and aspect ratio is above 4:3", () => {
            mockScreen.game.scale.parent = { offsetWidth: 1600, offsetHeight: 800 };
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[0][1];
            toggle();
            debugDraw();

            expect(mockGraphicsObject.lineStyle).toHaveBeenCalledWith(24, 0xffff00, 0.5);
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-588, -288, 1176, 576);
        });

        test("debugs draws groups when enabled", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[1][1];
            toggle();
            debugDraw();

            expect(mockScreen.layout.debug.groups).toHaveBeenCalled();
        });

        test("debugs draws buttons when enabled", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[2][1];
            toggle();
            debugDraw();

            expect(mockScreen.layout.debug.buttons).toHaveBeenCalled();
        });
    });
});
