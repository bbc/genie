/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Screen } from "../../src/core/screen";
import { createMockGame } from "../mock/phaser-game.js";
import * as GameSound from "../../src/core/game-sound";
import * as VisibleLayer from "../../src/core/visible-layer.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as signal from "../../src/core/signal-bus.js";

describe("Screen", () => {
    let screen;
    let mockGmi;
    let mockScene;
    let mockContext;
    let mockTransientData;
    let mockNavigation;

    const createScreen = () => {
        screen = new Screen();
        mockTransientData = { transient: "data" };
        screen.game = createMockGame();
        screen.game.state.current = "loadscreen";
    };

    const initScreen = () => {
        mockNavigation = {
            loadscreen: { routes: { testRoute: jest.fn().mockReturnValue("loadscreen-test-route") } },
            select: { routes: "select-routes" },
        };
        screen.init(mockTransientData, mockScene, mockContext, mockNavigation);
    };

    const createAndInitScreen = () => {
        createScreen();
        initScreen();
    };

    beforeEach(() => {
        jest.spyOn(signal.bus, "subscribe");
        jest.spyOn(signal.bus, "removeChannel");
        jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
        jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
        jest.spyOn(a11y, "clearElementsFromDom").mockImplementation(() => {});
        jest.spyOn(a11y, "clearAccessibleButtons").mockImplementation(() => {});
        jest.spyOn(a11y, "appendElementsToDom").mockImplementation(() => {});

        mockScene = { addToBackground: jest.fn() };
        mockGmi = { setStatsScreen: jest.fn() };
        createMockGmi(mockGmi);

        mockContext = {
            popupScreens: ["pause"],
            config: { theme: { loadscreen: { music: "test/music" } } },
        };
        delete window.__qaMode;
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialisation", () => {
        test("sets the scene", () => {
            createAndInitScreen();
            expect(screen.scene).toEqual(mockScene);
        });

        test("sets the context", () => {
            createAndInitScreen();
            expect(screen._context).toEqual(mockContext);
        });

        test("sets the navigation", () => {
            createAndInitScreen();
            expect(screen.navigation.testRoute()).toBe("loadscreen-test-route");
        });

        test("passes transientData to next screen on navigation", () => {
            createAndInitScreen();
            screen.navigation.testRoute();
            expect(mockNavigation.loadscreen.routes.testRoute).toHaveBeenCalledWith(mockTransientData);
        });

        test("defaults transientData to empty Object", () => {
            createAndInitScreen();
            delete screen.transientData;
            screen.navigation.testRoute();
            expect(mockNavigation.loadscreen.routes.testRoute).toHaveBeenCalledWith({});
        });

        test("sets the background music using the theme config", () => {
            createAndInitScreen();
            const expectedThemeConfig = mockContext.config.theme.loadscreen;
            expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(screen.game, expectedThemeConfig);
        });

        test("sets transient data", () => {
            createAndInitScreen();
            expect(screen.transientData).toEqual(mockTransientData);
        });

        test("clears the currently stored accessible buttons", () => {
            createAndInitScreen();
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
        });

        test("resets the accessiblity layer DOM", () => {
            createAndInitScreen();
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

        test("sets the stats screen to the current screen, if not on the loadscreen", () => {
            createScreen();
            screen.game.state.current = "select";
            initScreen();
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(screen.game.state.current);
        });

        test("does not set the stats screen to the current screen, if on the loadscreen", () => {
            createScreen();
            screen.game.state.current = "loadscreen";
            initScreen();
            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });

        test("creates the overlay closed signal", () => {
            createAndInitScreen();
            expect(signal.bus.subscribe).toHaveBeenCalledWith({
                channel: "overlays",
                name: "overlay-closed",
                callback: expect.any(Function),
            });
        });
    });

    describe("context getter/setter", () => {
        test("gets context", () => {
            createAndInitScreen();
            expect(screen.context).toEqual(mockContext);
        });

        test("sets context by merging new value with current value", () => {
            const expectedContext = {
                popupScreens: ["pause"],
                config: {
                    theme: { loadscreen: { music: "test/music" }, pause: { data: "some-data" } },
                },
            };
            createAndInitScreen();
            screen.context = { config: { theme: { pause: { data: "some-data" } } } };

            expect(screen.context).toEqual(expectedContext);
        });
    });

    describe("getAsset method", () => {
        test("gets asset by name", () => {
            createAndInitScreen();
            const expectedName = "some-name";
            expect(screen.getAsset(expectedName)).toBe("loadscreen.some-name");
        });
    });

    describe("visibleLayer getter/setter", () => {
        test("calls visible layer with correct params", () => {
            jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
            createAndInitScreen();
            expect(screen.visibleLayer).toEqual("current-layer");
            expect(VisibleLayer.get).toHaveBeenCalledWith(screen.game, screen.context);
        });
    });

    describe("When overlay-closed signal is fired", () => {
        beforeEach(() => {
            mockContext.popupScreens = ["how-to-play"];
            createAndInitScreen();
        });

        test("clears accessible elements from DOM", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: false } });
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(2);
        });

        test("clears accessible buttons object", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: false } });
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(2);
        });

        test("appends accessible elements to DOM", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: false } });
            expect(a11y.appendElementsToDom).toHaveBeenCalledTimes(1);
        });

        test("fires a page stat with the current screen when firePageStat is true", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: true } });
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(screen.game.state.current);
        });

        test("does not fire a page stat when firePageStat is false", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: false } });
            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });

        test("removes the overlays channel", () => {
            signal.bus.publish({ channel: "overlays", name: "overlay-closed", data: { firePageStat: false } });
            expect(signal.bus.removeChannel).toHaveBeenCalledTimes(1);
        });
    });
});
