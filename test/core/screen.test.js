/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Screen, overlayChannel } from "../../src/core/screen";
import * as Layout from "../../src/core/layout/layout.js";
import * as Scaler from "../../src/core/scaler.js";
import * as GameSound from "../../src/core/game-sound";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults";
import { settingsChannel } from "../../src/core/settings.js";

describe("Screen", () => {
    let screen;
    let mockData;
    let mockGmi;
    let mockSettings;
    let mockTransientData;
    let mockNavigation;

    const createScreen = (key = "screenKey") => {
        screen = new Screen();
        screen.sys = { accessibleButtons: [] };
        screen.events = { emit: jest.fn() };
        screen.scene = { key, bringToTop: jest.fn(), start: jest.fn(), run: jest.fn(), scene: { mock: "scene" } };
        screen.cameras = { main: { scrollX: 0, scrollY: 0 } };
        screen.add = { container: () => "root", existing: jest.fn() };
        screen._layout = {
            makeAccessible: jest.fn(),
            root: {},
            destroy: jest.fn(),
        };
        mockTransientData = { key: "data" };
    };

    const initScreen = () => {
        mockNavigation = {
            screenKey: { routes: { next: "nextscreen" } },
        };
        mockData = {
            navigation: mockNavigation,
            config: { theme: { loadscreen: { music: "test/music" }, screenKey: {} } },
            parentScreens: [{ key: "select", removeAll: jest.fn() }],
            transient: mockTransientData,
        };
        screen.init(mockData);
    };

    const createAndInitScreen = () => {
        createScreen();
        initScreen();
    };

    beforeEach(() => {
        jest.spyOn(eventBus, "subscribe");
        jest.spyOn(eventBus, "publish");
        jest.spyOn(eventBus, "removeChannel");
        jest.spyOn(eventBus, "removeSubscription");
        jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
        jest.spyOn(a11y, "clearElementsFromDom").mockImplementation(() => {});
        jest.spyOn(a11y, "clearAccessibleButtons").mockImplementation(() => {});
        jest.spyOn(a11y, "appendElementsToDom").mockImplementation(() => {});
        jest.spyOn(a11y, "addToAccessibleButtons").mockImplementation(() => {});

        mockSettings = { audio: true };
        mockGmi = {
            setStatsScreen: jest.fn(),
            getAllSettings: jest.fn(() => mockSettings),
        };
        createMockGmi(mockGmi);

        delete window.__qaMode;
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialisation", () => {
        test("sets the context", () => {
            createAndInitScreen();
            expect(screen.context).toEqual({
                config: mockData.config,
                theme: mockData.config.theme.screenKey,
                navigation: mockNavigation,
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

        test("defaults transientData to empty Object", () => {
            createScreen();
            delete mockData.transient;
            screen.init(mockData);
            expect(screen.context.transientData).toEqual({});
        });

        test("sets the background music using the theme config", () => {
            createAndInitScreen();
            const expectedThemeConfig = mockData.config.theme.screenKey;
            expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(screen.scene.scene, expectedThemeConfig);
        });

        test("clears the accessible buttons array", () => {
            createScreen();
            screen.sys.accessibleButtons = [{ some: "mock" }];
            initScreen();
            expect(screen.sys.accessibleButtons).toEqual([]);
        });

        test("clears the currently stored accessible buttons", () => {
            createAndInitScreen();
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
        });

        test("resets the accessibility layer DOM", () => {
            createAndInitScreen();
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

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
                theme: { screenKey: {} },
            };
            createAndInitScreen();
            screen.setConfig(expectedConfig);
            expect(screen.context.config).toBe(expectedConfig);
        });
    });

    describe("Navigation", () => {
        test("passes transientData to next screen on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(screen.scene.start).toHaveBeenCalledWith("nextscreen", mockData);
        });

        test("emits a onscreenexit event on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(screen.events.emit).toHaveBeenCalledWith("onscreenexit");
        });
    });

    describe("set Layout", () => {
        test("creates a new layout", () => {
            const mockLayout = buttons => {
                return { buttons, destroy: jest.fn(), root: {} };
            };
            Layout.create = jest.fn((screen, metrics, buttons) => mockLayout(buttons));
            Scaler.getMetrics = () => {};
            createAndInitScreen();
            const layout = screen.setLayout(["somebutton", "another"]);
            expect(screen.layout).toEqual(layout);
        });

        test("calls layout.create with correct arguments", () => {
            const expectedButtons = ["somebutton", "another"];
            Layout.create = jest.fn(() => ({ root: {} }));
            Scaler.getMetrics = () => "somemetrics";
            createAndInitScreen();
            screen.setLayout(expectedButtons);
            expect(Layout.create).toHaveBeenCalledWith(screen, "somemetrics", expectedButtons);
        });
    });

    describe("Remove All", () => {
        test("cleans up the layout and the event bus", () => {
            const mockLayout = buttons => {
                return { buttons, destroy: jest.fn() };
            };
            Layout.create = jest.fn((screen, metrics, buttons) => mockLayout(buttons));
            Scaler.getMetrics = () => {};
            createAndInitScreen();
            const layout = screen.setLayout(["somebutton", "another"]);
            screen.removeAll();
            expect(screen.layout).not.toBeDefined();
            expect(layout.destroy).toHaveBeenCalled();
            expect(eventBus.removeChannel).toHaveBeenCalledWith(buttonsChannel(screen));
        });
    });

    describe("Overlays", () => {
        test("adding an overlay, subscribes to event bus correctly", () => {
            const expectedName = "overlay";
            createAndInitScreen();
            screen.addOverlay(expectedName);
            expect(eventBus.subscribe).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: expectedName,
                callback: screen._onOverlayRemoved,
            });
        });

        test("adding an overlay, adds the scene to the list of parent screens", () => {
            createAndInitScreen();
            screen.addOverlay("overlay");
            expect(screen.context.parentScreens).toEqual([mockData.parentScreens[0], screen]);
        });

        test("adding an overlay, tells the scene manager to run it", () => {
            createAndInitScreen();
            screen.addOverlay("overlay");
            expect(screen.scene.run).toHaveBeenCalledWith("overlay", mockData);
            expect(screen.scene.bringToTop).toHaveBeenCalled();
        });

        test("adding an overlay, emits a onoverlayadded event", () => {
            createAndInitScreen();
            screen.addOverlay("overlay");
            expect(screen.events.emit).toHaveBeenCalledWith("onoverlayadded");
        });

        test("removing an overlay, publishes to and removes subscription from event bus correctly", () => {
            createAndInitScreen();
            screen.removeOverlay();
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: screen.scene.key,
                data: { overlay: expect.any(Screen) },
            });
            expect(eventBus.removeSubscription).toHaveBeenCalledWith({
                channel: overlayChannel,
                name: screen.scene.key,
            });
        });

        test("removing an overlay, removes the overlays button channel", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(eventBus.removeChannel).toHaveBeenCalledWith(buttonsChannel(mockOverlay));
        });

        test("removing an overlay, calls removeAll on the overlay and stops it", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(mockOverlay.removeAll).toHaveBeenCalled();
            expect(mockOverlay.scene.stop).toHaveBeenCalled();
        });

        test("removing an overlay, emits a onscreenexit event", () => {
            createAndInitScreen();
            screen.removeOverlay();
            expect(screen.events.emit).toHaveBeenCalledWith("onscreenexit");
        });

        test("removing an overlay, emits a onoverlayremoved event on the parent screen", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(screen.events.emit).toHaveBeenCalledWith("onoverlayremoved");
        });

        test("removing an overlay, clears accessible buttons and clears elements from DOM", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(a11y.clearAccessibleButtons).toHaveBeenCalled();
            expect(a11y.clearElementsFromDom).toHaveBeenCalled();
        });

        test("removing an overlay, makes the parent screens gel buttons accessible again", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            const mockLayout = { makeAccessible: jest.fn() };
            createAndInitScreen();
            Layout.create = () => mockLayout;
            screen.setLayout();
            jest.clearAllMocks();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(mockLayout.makeAccessible).toHaveBeenCalled();
            expect(a11y.appendElementsToDom).toHaveBeenCalledWith(screen);
        });

        test("removing an overlay, makes the parent screens game buttons accessible again", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            const mockButton = { mock: "button" };
            createAndInitScreen();
            screen.sys.accessibleButtons = [mockButton];
            jest.clearAllMocks();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(a11y.addToAccessibleButtons).toHaveBeenCalledWith(screen, mockButton);
        });

        test("removing an overlay sets stat screen back to the underlying screen", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "overlay", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved({ overlay: mockOverlay });

            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith("screenKey");
        });

        test("removing an overlay ensures the settings audio is updated", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "overlay", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved({ overlay: mockOverlay });
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
                data: mockSettings.audio,
            });
        });
    });
});
