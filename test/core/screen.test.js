/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Screen } from "../../src/core/screen";
// import * as GameSound from "../../src/core/game-sound";
// import * as VisibleLayer from "../../src/core/visible-layer.js";
// import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as signal from "../../src/core/signal-bus.js";

describe("Screen", () => {
    let screen;
    let mockData;
    let mockGmi;
    let mockTransientData;
    let mockNavigation;

    const createScreen = (key = "screenKey") => {
        screen = new Screen();
        screen.scene = { key, bringToTop: jest.fn(), start: jest.fn() };
        screen.cameras = { main: { scrollX: 0, scrollY: 0 } };
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
        jest.spyOn(signal.bus, "removeChannel");
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
    });
});
