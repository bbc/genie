/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Screen, overlayChannel } from "../../src/core/screen";
import * as Layout from "../../src/core/layout/layout.js";
import * as Scaler from "../../src/core/scaler.js";
// import * as GameSound from "../../src/core/game-sound";
// import * as VisibleLayer from "../../src/core/visible-layer.js";
// import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults";

describe("Screen", () => {
    let screen;
    let mockData;
    let mockGmi;
    let mockTransientData;
    let mockNavigation;

    const createScreen = (key = "screenKey") => {
        screen = new Screen();
        screen.scene = { key, bringToTop: jest.fn(), start: jest.fn(), run: jest.fn() };
        screen.cameras = { main: { scrollX: 0, scrollY: 0 } };
        screen.add = { container: () => "root" };
        mockTransientData = { key: "data" };
    };

    const initScreen = () => {
        mockNavigation = {
            screenKey: { routes: { next: "nextscreen" } },
        };
        mockData = {
            navigation: mockNavigation,
            config: { theme: { loadscreen: { music: "test/music" } } },
            parentScreens: { select: { removeAll: jest.fn() } },
            transient: mockTransientData,
        };
        screen.init(mockData);
    };

    const createAndInitScreen = () => {
        createScreen();
        initScreen();
    };

    beforeEach(() => {
        jest.spyOn(signal.bus, "subscribe");
        jest.spyOn(signal.bus, "publish");
        jest.spyOn(signal.bus, "removeChannel");
        jest.spyOn(signal.bus, "removeSubscription");
        // jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
        // jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
        // jest.spyOn(a11y, "clearElementsFromDom").mockImplementation(() => {});
        // jest.spyOn(a11y, "clearAccessibleButtons").mockImplementation(() => {});
        // jest.spyOn(a11y, "appendElementsToDom").mockImplementation(() => {});

        mockGmi = { setStatsScreen: jest.fn() };
        createMockGmi(mockGmi);

        delete window.__qaMode;
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialisation", () => {
        test("sets the context", () => {
            createAndInitScreen();
            expect(screen.context).toEqual({
                config: mockData.config,
                parentScreens: mockData.parentScreens,
                transientData: mockTransientData,
            });
        });

        test("sets the navigation", () => {
            createAndInitScreen();
            expect(screen.navigation).toEqual({ next: expect.any(Function) });
        });

        test("sets the navigation when on the boot screen", () => {
            createScreen("boot");
            initScreen();
            expect(screen.navigation).toEqual({ next: expect.any(Function) });
        });

        test("passes transientData to next screen on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(screen.scene.start).toHaveBeenCalledWith("nextscreen", mockData);
        });

        test("defaults transientData to empty Object", () => {
            createScreen();
            delete mockData.transient;
            screen.init(mockData);
            expect(screen.context.transientData).toEqual({});
        });

        // test("sets the background music using the theme config", () => {
        //     createAndInitScreen();
        //     const expectedThemeConfig = mockContext.config.theme.loadscreen;
        //     expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(screen.game, expectedThemeConfig);
        // });

        // test("clears the currently stored accessible buttons", () => {
        //     createAndInitScreen();
        //     expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
        // });

        // test("resets the accessiblity layer DOM", () => {
        //     createAndInitScreen();
        //     expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        // });

        test("sets the stats screen to the current screen, if not on the loadscreen", () => {
            createAndInitScreen();
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(screen.scene.key);
        });

        test("does not set the stats screen to the current screen, if on the loadscreen", () => {
            createScreen("loader");
            mockData.navigation = {
                loader: { routes: { next: "nextscreen" } },
            };
            screen.init(mockData);
            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });

        test("does not set the stats screen to the current screen, if on the boot screen", () => {
            createScreen("boot");
            mockData.navigation = {
                boot: { routes: { next: "nextscreen" } },
            };
            screen.init(mockData);
            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });
    });

    describe("getter/setters", () => {
        test("sets transient data by merging new value with current value", () => {
            const expectedTransientData = {
                key: "data",
                more: "data",
            };
            createAndInitScreen();
            screen.transientData = { more: "data" };
            expect(screen.context.transientData).toEqual(expectedTransientData);
        });

        test("sets theme config by replacing the original config", () => {
            const expectedConfig = {
                key: "data",
                more: "data",
            };
            createAndInitScreen();
            screen.setConfig(expectedConfig);
            expect(screen.context.config).toBe(expectedConfig);
        });
    });

    describe("Add Layout", () => {
        test("adds a new layout to the array", () => {
            const mockLayout = buttons => {
                return { buttons, destroy: jest.fn() };
            };
            Layout.create = jest.fn((screen, metrics, buttons) => mockLayout(buttons));
            Scaler.getMetrics = () => {};
            createAndInitScreen();
            const layout = screen.addLayout(["somebutton", "another"]);
            expect(screen.layouts).toEqual([layout]);
        });

        test("calls layout.create with correct arguments", () => {
            const expectedButtons = ["somebutton", "another"];
            Layout.create = jest.fn();
            Scaler.getMetrics = () => "somemetrics";
            createAndInitScreen();
            screen.addLayout(expectedButtons);
            expect(Layout.create).toHaveBeenCalledWith(screen, "somemetrics", expectedButtons, "root");
        });
    });

    describe("Overlays", () => {
        test("adding an overlay, subscribes to signal bus correctly", () => {
            const expectedName = "overlay";
            createAndInitScreen();
            screen.addOverlay(expectedName);
            expect(signal.bus.subscribe).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: expectedName,
                callback: screen._removeOverlay,
            });
        });

        test("adding an overlay, adds the scene to the list of parent screens", () => {
            createAndInitScreen();
            screen.addOverlay("overlay");
            expect(screen.context.parentScreens).toEqual({ screenKey: screen, ...mockData.parentScreens });
        });

        test("adding an overlay, tells the scene manager to run it", () => {
            createAndInitScreen();
            screen.addOverlay("overlay");
            expect(screen.scene.run).toHaveBeenCalledWith("overlay", mockData);
            expect(screen.scene.bringToTop).toHaveBeenCalled();
        });

        test("removing an overlay, publishes to and removes subscription from signal bus correctly", () => {
            createAndInitScreen();
            screen.removeOverlay("select");
            expect(signal.bus.publish).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: screen.scene.key,
                data: { overlay: expect.any(Screen) },
            });
            expect(signal.bus.removeSubscription).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: screen.scene.key,
            });
        });

        test("removing an overlay, removes the overlays button channel", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._removeOverlay({ overlay: mockOverlay });
            expect(signal.bus.removeChannel).toHaveBeenCalledWith(`${buttonsChannel}-select`);
        });

        test("removing an overlay, calls removeAll on the overlay and stops it", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._removeOverlay({ overlay: mockOverlay });
            expect(mockOverlay.removeAll).toHaveBeenCalled();
            expect(mockOverlay.scene.stop).toHaveBeenCalled();
        });
    });
});
