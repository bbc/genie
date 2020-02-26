/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Screen } from "../../src/core/screen";
import * as Layout from "../../src/core/layout/layout.js";
import * as Scaler from "../../src/core/scaler.js";
import * as GameSound from "../../src/core/game-sound";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults";
import { settingsChannel } from "../../src/core/settings.js";
import * as debugModeModule from "../../src/core/debug/debug-mode.js";
import * as debugModule from "../../src/core/debug/debug.js";

describe("Screen", () => {
    let screen;
    let mockData;
    let mockGmi;
    let mockSettings;
    let mockTransientData;
    let mockNavigation;
    let mockParentScreen;
    let mockConfig;
    const mockGfx = { test: "1234" };

    const createScreen = key => {
        screen = new Screen();
        screen.sys = { accessibleButtons: [] };
        screen.events = { emit: jest.fn(), on: jest.fn(), once: jest.fn() };
        screen.scene = { key, bringToTop: jest.fn(), start: jest.fn(), run: jest.fn(), scene: { mock: "scene" } };
        screen.cameras = { main: { scrollX: 0, scrollY: 0 } };
        screen.add = { container: () => "root", existing: jest.fn(), graphics: jest.fn(() => mockGfx) };
        screen._layout = {
            makeAccessible: jest.fn(),
            root: {},
            destroy: jest.fn(),
        };
        mockTransientData = { key: "data" };
    };

    mockConfig = { theme: { loadscreen: { music: "test/music" }, screenKey: {} } };

    const initScreen = () => {
        mockNavigation = {
            screenKey: { routes: { next: "nextscreen" } },
            boot: { routes: { next: "loader" } },
            loader: { routes: { next: "home" } },
        };
        mockParentScreen = {
            key: "select",
            removeAll: jest.fn(),
            _onOverlayRemoved: jest.fn(),
            scene: { stop: jest.fn() },
        };
        mockData = {
            navigation: mockNavigation,
            config: mockConfig,
            parentScreens: [mockParentScreen],
            transient: mockTransientData,
        };
        screen.init(mockData);
    };

    const createAndInitScreen = (key = "screenKey") => {
        createScreen(key);
        initScreen();
    };

    beforeEach(() => {
        jest.spyOn(eventBus, "subscribe");
        jest.spyOn(eventBus, "publish");
        jest.spyOn(eventBus, "removeChannel");
        jest.spyOn(eventBus, "removeSubscription");
        jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
        jest.spyOn(a11y, "reset").mockImplementation(() => {});
        jest.spyOn(a11y, "destroy").mockImplementation(() => {});
        jest.spyOn(a11y, "addButton").mockImplementation(() => {});

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
            screen.scene.key = "screenKey";
            screen.init(mockData);
            expect(screen.context.transientData).toEqual({});
        });

        test("sets the background music using the theme config", () => {
            createAndInitScreen();
            const expectedThemeConfig = mockData.config.theme.screenKey;
            expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(screen.scene.scene, expectedThemeConfig);
        });

        test("clears the accessible buttons array", () => {
            createScreen("screenKey");
            screen.sys.accessibleButtons = [{ some: "mock" }];
            initScreen();
            expect(screen.sys.accessibleButtons).toEqual([]);
        });

        test("resets the accessibility layer DOM", () => {
            createAndInitScreen();
            expect(a11y.destroy).toHaveBeenCalledTimes(1);
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

        test("brings the screen to the top on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(screen.scene.bringToTop).toHaveBeenCalled();
        });

        test("calls removeAll on the screen on navigation", () => {
            createAndInitScreen();
            screen.removeAll = jest.fn();
            screen.navigation.next();
            expect(screen.removeAll).toHaveBeenCalled();
        });

        test("calls removeAll on parent screens on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(mockParentScreen.removeAll).toHaveBeenCalled();
        });

        test("stops the parent screens scenes on navigation", () => {
            createAndInitScreen();
            screen.navigation.next();
            expect(mockParentScreen.scene.stop).toHaveBeenCalled();
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
            const expectedAccessibleButtons = ["somebutton"];
            Layout.create = jest.fn(() => ({ root: {} }));
            Scaler.getMetrics = () => "somemetrics";
            createAndInitScreen();
            screen.setLayout(expectedButtons, expectedAccessibleButtons);
            expect(Layout.create).toHaveBeenCalledWith(
                screen,
                "somemetrics",
                expectedButtons,
                expectedAccessibleButtons,
            );
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

        test("removing an overlay, calls onOverlayRemoved on the parent screen", () => {
            createAndInitScreen();
            screen.removeOverlay();
            expect(mockParentScreen._onOverlayRemoved).toHaveBeenCalledWith(screen);
        });

        test("removing an overlay, calls removeAll on the overlay and stops it", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            screen._onOverlayRemoved(mockOverlay);
            expect(mockOverlay.removeAll).toHaveBeenCalled();
            expect(mockOverlay.scene.stop).toHaveBeenCalled();
        });

        test("removing an overlay, clears accessible buttons and clears elements from DOM", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved(mockOverlay);
            expect(a11y.destroy).toHaveBeenCalled();
        });

        test("removing an overlay, makes the parent screens gel buttons accessible again", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            const mockLayout = { makeAccessible: jest.fn() };
            Scaler.getMetrics = () => {};
            createAndInitScreen();
            Layout.create = () => mockLayout;
            screen.setLayout();
            jest.clearAllMocks();
            screen._onOverlayRemoved(mockOverlay);
            expect(mockLayout.makeAccessible).toHaveBeenCalled();
            expect(a11y.reset).toHaveBeenCalled();
        });

        test("removing an overlay, makes the parent screens game buttons accessible again", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "select", stop: jest.fn() } };
            const mockButton = { mock: "button" };
            createAndInitScreen();
            screen.sys.accessibleButtons = [mockButton];
            jest.clearAllMocks();
            screen._onOverlayRemoved(mockOverlay);
            expect(a11y.addButton).toHaveBeenCalledWith(mockButton);
        });

        test("removing an overlay sets stat screen back to the underlying screen", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "overlay", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved(mockOverlay);

            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith("screenKey");
        });

        test("removing an overlay ensures the settings audio is updated", () => {
            const mockOverlay = { removeAll: jest.fn(), scene: { key: "overlay", stop: jest.fn() } };
            createAndInitScreen();
            jest.clearAllMocks();
            screen._onOverlayRemoved(mockOverlay);
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
                data: mockSettings.audio,
            });
        });

        test("sets the stats screen if the screen is not an overlay", () => {
            createScreen("screenKey");
            mockData.config.theme["screenKey"] = { isOverlay: false };
            screen.init(mockData);

            expect(mockGmi.setStatsScreen).toHaveBeenCalled();
        });

        test("does not set the stats screen if the screen is an overlay", () => {
            createScreen("screenKey");
            mockData.config.theme["screenKey"] = { isOverlay: true };
            screen.init(mockData);

            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });
    });

    describe("data handling", () => {
        test("setData method updates _data property", () => {
            createAndInitScreen();
            const testData = { test: "data" };

            screen.setData(testData);

            expect(screen._data).toEqual(testData);
        });

        test("transientData getter returns transient part of _data property", () => {
            createAndInitScreen();
            const testTransientData = "testTransient";
            const testData = { test: "data", transient: testTransientData };
            screen.setData(testData);

            expect(screen.transientData).toEqual(testTransientData);
        });
    });

    describe("assetPrefix", () => {
        test("returns scene key if 'assetPrefix' is not set in theme", () => {
            createAndInitScreen();

            expect(screen.assetPrefix).toBe("screenKey");
        });

        test("returns assetPrefix if set in theme", () => {
            mockConfig.theme.screenKey.assetPrefix = "themePrefix";
            createAndInitScreen();

            expect(screen.assetPrefix).toBe("themePrefix");
        });
    });

    describe("Debug", () => {
        test("Does not setup debug events if debugMode is unset", () => {
            jest.spyOn(debugModule, "addEvents");
            debugModeModule.debugMode = jest.fn().mockImplementation(() => false);
            createAndInitScreen();

            expect(debugModule.addEvents).not.toHaveBeenCalled();
        });

        test("Does not setup debug events if scene is loader", () => {
            jest.spyOn(debugModule, "addEvents");
            debugModeModule.debugMode = jest.fn().mockImplementation(() => true);
            createAndInitScreen("loader");

            expect(debugModule.addEvents).not.toHaveBeenCalled();
        });

        test("Does not setup debug events if scene is boot", () => {
            jest.spyOn(debugModule, "addEvents");
            debugModeModule.debugMode = jest.fn().mockImplementation(() => true);
            createAndInitScreen("boot");

            expect(debugModule.addEvents).not.toHaveBeenCalled();
        });

        test("Sets up debug events when debugMode on scene is not loader or boot", () => {
            jest.spyOn(debugModule, "addEvents");
            debugModeModule.debugMode = jest.fn().mockImplementation(() => true);
            createAndInitScreen();

            expect(debugModule.addEvents).toHaveBeenCalled();
        });
    });
});
