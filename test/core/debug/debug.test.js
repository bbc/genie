/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addEvents } from "../../../src/core/debug/debug.js";

import * as debugLayoutModule from "../../../src/core/debug/layout-debug-draw.js";
import * as Scaler from "../../../src/core/scaler.js";

describe("Debug system", () => {
    let mockScreen;
    let mockOnUpEvent;
    let mockGraphicsObject;
    let mockContainer;

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

        const mockTileSprite = {
            setPosition: jest.fn(),
            setSize: jest.fn(),
            setTileScale: jest.fn(),
        };

        mockContainer = {
            scene: {
                add: { tileSprite: jest.fn(() => mockTileSprite) },
                game: { scale: { parent: {} }, canvas: { height: 10, width: 10 } },
            },
            add: jest.fn(),
        };

        const mockMetrics = { scale: 1 };
        Scaler.getMetrics = jest.fn(() => mockMetrics);

        mockScreen = {
            context: {
                theme: { debugLabels: [] },
            },
            cache: {
                json: {
                    get: jest.fn(),
                },
            },
            input: {
                keyboard: {
                    addKey: jest.fn(() => ({ on: mockOnUpEvent })),
                    removeKey: jest.fn(),
                },
            },
            debugGraphics: mockGraphicsObject,
            add: {
                graphics: jest.fn(() => mockGraphicsObject),
                container: jest.fn(() => mockContainer),
                text: jest.fn(() => ({ setOrigin: jest.fn() })),
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
            navigation: {},
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("addEvents", () => {
        test("sets up create and update methods", () => {
            addEvents(mockScreen);
            expect(mockScreen.events.on).toHaveBeenCalledWith("create", expect.any(Function), mockScreen);
            expect(mockScreen.events.on).toHaveBeenCalledWith("update", expect.any(Function), mockScreen);
        });

        test("adds shutdown single use event", () => {
            addEvents(mockScreen);
            expect(mockScreen.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        });
    });

    describe("create event", () => {
        test("sets up key toggles", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("e");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("r");
        });

        test("sets up example key if debug mode", () => {
            mockScreen.navigation.debug = () => {};
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("t");
        });

        test("Adds no group/button toggles when no layout set (game screens during early dev)", () => {
            delete mockScreen.layout;
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.addKey).not.toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.addKey).not.toHaveBeenCalledWith("e");
            expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("r");
        });

        test("adds text labels if present in theme", () => {
            mockScreen.context.theme.debugLabels = [{ x: -390, y: 100, text: "test-description" }];
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.add.text).toHaveBeenCalledWith(-390, 100, "test-description", expect.any(Object));
        });

        test("adds no label if no config path found", () => {
            delete mockScreen.context.theme.debugLabels;
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.add.text).not.toHaveBeenCalled();
        });

        test("adds path label if config path found", () => {
            delete mockScreen.context.theme.debugLabels;
            mockScreen.scene = { key: "testKey" };

            mockScreen.cache.json.get.mockReturnValue({ config: { files: [{ key: "testKey", url: "testUrl" }] } });

            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.add.text).toHaveBeenCalledWith(
                -400,
                -300,
                "config: debug/examples/testUrl",
                expect.any(Object),
            );
        });

        test("sets label position defaults of 0 0 if not in theme", () => {
            mockScreen.context.theme.debugLabels = [{ text: "test-description" }];
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];

            createCallback.call(mockScreen);

            expect(mockScreen.add.text).toHaveBeenCalledWith(0, 0, "test-description", expect.any(Object));
        });
    });

    describe("CSS toggle", () => {
        test("toggles debug class on body", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            createCallback.call(mockScreen);

            const toggleCSS = mockOnUpEvent.mock.calls[3][1];
            global.document.body.classList.toggle = jest.fn();

            toggleCSS();

            expect(document.body.classList.toggle).toHaveBeenCalledWith("debug");
        });
    });

    describe("shutdown event", () => {
        test("removes key events", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const destroyCallback = mockScreen.events.once.mock.calls[0][1];

            createCallback.call(mockScreen);
            destroyCallback.call(mockScreen);

            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("q");
            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("w");
            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("e");
            expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith("r");
        });
    });

    describe("update method", () => {
        test("does not draw to the debug layer until enabled via keys", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];

            createCallback.call(mockScreen);
            drawCallback.call(mockScreen);

            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
        });

        test("does not draw to the debug layer when toggled on then off again", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle1 = mockOnUpEvent.mock.calls[1][1];
            toggle1();
            toggle1();

            drawCallback.call(mockScreen);
            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
        });

        test("does not draw to the debug layer when this.debug does not exist (update called before create)", () => {
            addEvents(mockScreen);
            const drawCallback = mockScreen.events.on.mock.calls[1][1];

            drawCallback.call(mockScreen);
            expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
            expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
        });

        test("sets debug container to visible when toggled on", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            createCallback.call(mockScreen);

            const toggle1 = mockOnUpEvent.mock.calls[0][1];
            toggle1();

            expect(mockContainer.visible).toBe(true);
        });

        test("debugs draws groups when enabled", () => {
            addEvents(mockScreen);
            const createCallback = mockScreen.events.on.mock.calls[0][1];
            const drawCallback = mockScreen.events.on.mock.calls[1][1];
            createCallback.call(mockScreen);

            const toggle2 = mockOnUpEvent.mock.calls[1][1];
            toggle2();

            drawCallback.call(mockScreen);

            expect(mockScreen.layout.debug.groups).toHaveBeenCalled();
        });

        test("debugs draws buttons when enabled", () => {
            addEvents(mockScreen);
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
