/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addEvents } from "../../../src/core/debug/debug.js";

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
            clear: jest.fn(),
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
            events: {
                on: jest.fn(),
                once: jest.fn(),
                off: jest.fn(),
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    /*

        export function addEvents() {
    this.events.on("create", create, this);
    this.events.on("update", update, this);

    this.events.once("shutdown", () => {
        this.events.off("create", create, this);
        this.events.off("update", update, this);
        destroy.call(this);
    });
}



     */

    describe("addEvents", () => {
        test("sets up create and update methods", () => {
            addEvents.call(mockScreen);
            expect(mockScreen.events.on).toHaveBeenCalledWith("create", expect.any(Function), mockScreen);
            expect(mockScreen.events.on).toHaveBeenCalledWith("update", expect.any(Function), mockScreen);
        });

        test("adds shutdown single use event", () => {
            addEvents.call(mockScreen);
            expect(mockScreen.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        });
    });

    describe("create event", () => {
        test("sets up key toggles", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("e");
        });
    });

    describe("shutdown event", () => {
        test("removes key events", () => {
            addEvents.call(mockScreen);
            const destroyCallback = mockScreen.events.once.mock.calls[0][1];

            destroyCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("e");
        });
    });

    describe("update method", () => {
        test("does not draw to the debug layer until enabled via keys", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];

            createCallback.call(mockScreen);
            drawCallback.call(mockScreen);

            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
        });

        test("does not draw to the debug layer when toggled on then off again", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle1 = mockOnUpEvent.mock.calls[0][1];
            toggle1();
            toggle1();

            drawCallback.call(mockScreen);
            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
        });

        test("Calls debugLayout when toggled on", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle1 = mockOnUpEvent.mock.calls[0][1];
            toggle1();

            drawCallback.call(mockScreen);

            expect(debugLayoutModule.debugLayout).toHaveBeenCalledWith(mockScreen);
        });

        test("debugs draws groups when enabled", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle2 = mockOnUpEvent.mock.calls[1][1];
            toggle2();

            drawCallback.call(mockScreen);

            expect(mockScreen.layout.debug.groups).toHaveBeenCalled();
        });

        test("debugs draws buttons when enabled", () => {
            addEvents.call(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle3 = mockOnUpEvent.mock.calls[2][1];
            toggle3();

            drawCallback.call(mockScreen);

            expect(mockScreen.layout.debug.buttons).toHaveBeenCalled();
        });
    });
});
