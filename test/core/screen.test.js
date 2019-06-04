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

describe("Screen", () => {
    let screen;
    let mockGmi;
    let mockScene;
    let mockContext;
    let signalInstance;
    let mockTransientData;

    const createScreen = () => {
        screen = new Screen();
        jest.spyOn(screen, "onOverlayClosed");
        mockTransientData = { transient: "data" };
        screen.game = createMockGame();
        screen.game.state.current = "loadscreen";
    };

    const initScreen = () => {
        const mockNavigation = {
            loadscreen: { routes: "loadscreen-routes" },
            select: { routes: "select-routes" },
        };
        screen.init(mockTransientData, mockScene, mockContext, mockNavigation);
    };

    const createAndInitScreen = () => {
        createScreen();
        initScreen();
    };

    afterEach(() => jest.clearAllMocks());

    describe("with context", () => {
        beforeEach(() => {
            mockScene = { addToBackground: jest.fn() };
            jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
            jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
            jest.spyOn(a11y, "clearElementsFromDom").mockImplementation(() => {});
            jest.spyOn(a11y, "clearAccessibleButtons").mockImplementation(() => {});
            jest.spyOn(a11y, "appendElementsToDom").mockImplementation(() => {});
            signalInstance = { add: jest.fn() };
            jest.spyOn(Phaser, "Signal").mockImplementation(() => signalInstance);
            mockGmi = { setStatsScreen: jest.fn() };
            createMockGmi(mockGmi);
            mockContext = {
                popupScreens: ["pause"],
                config: {
                    theme: {
                        loadscreen: { music: "test/music" },
                    },
                },
            };
            delete window.__qaMode;
        });

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
            expect(screen.navigation).toBe("loadscreen-routes");
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
            expect(screen.overlayClosed).toEqual(signalInstance);
        });

        test("adds a listener to overlayClosed signal", () => {
            createAndInitScreen();
            expect(signalInstance.add).toHaveBeenCalledTimes(1);
            expect(signalInstance.add).toHaveBeenCalledWith(screen.onOverlayClosed, screen);
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
                config: { theme: { loadscreen: { music: "test/music" } } },
            };
            createAndInitScreen();
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

    describe("when overlayClosed signal is triggered", () => {
        beforeEach(() => {
            screen = new Screen();
            screen.game = createMockGame();
            screen.context = { popupScreens: ["how-to-play"] };
            screen.onOverlayClosed();
        });

        test("clears accessible elements from DOM", () => {
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

        test("clears accessible buttons object", () => {
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledWith(screen);
        });

        test("removes latest popup screen from popupScreens array", () => {
            expect(screen.context.popupScreens).toEqual([]);
        });

        test("appends accessible elements to DOM", () => {
            expect(a11y.appendElementsToDom).toHaveBeenCalledTimes(1);
            expect(a11y.appendElementsToDom).toHaveBeenCalledWith(screen);
        });

        test("sets the stats screen to the current screen", () => {
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(screen.game.state.current);
        });
    });
});
