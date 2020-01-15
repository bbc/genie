/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { debugDraw, setupDebugKeys } from "../../../src/core/debug/debug-draw.js";

import * as debugLayoutModule from "../../../src/core/debug/layout-debug-draw.js";

describe("Layout Harness", () => {
    let mockScreen;
    let mockOnUpEvent;
    let mockGraphicsObject;

    beforeEach(() => {
        debugLayoutModule.debugLayout = jest.fn();

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

        test("Calls debugLayout when toggled on", () => {
            setupDebugKeys(mockScreen);
            const toggle = mockOnUpEvent.mock.calls[0][1];
            toggle();
            debugDraw();

            expect(debugLayoutModule.debugLayout).toHaveBeenCalledWith(mockScreen);
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
