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

            screen = new Screen();
            jest.spyOn(screen, "onOverlayClosed");
            mockContext = {
                popupScreens: ["pause"],
                config: {
                    theme: {
                        loadscreen: { music: "test/music" },
                    },
                },
            };
            mockTransientData = { transient: "data" };
            const mockNavigation = {
                loadscreen: { routes: "routes" },
            };
            screen.game = createMockGame();
            screen.game.state.current = "loadscreen";
            screen.init(mockTransientData, mockScene, mockContext, mockNavigation);

            delete window.__qaMode;
        });

        test("sets the scene", () => {
            expect(screen.scene).toEqual(mockScene);
        });

        test("sets the context", () => {
            expect(screen._context).toEqual(mockContext);
        });

        test("sets the navigation", () => {
            expect(screen.navigation).toBe("routes");
        });

        test("sets the background music using the theme config", () => {
            const expectedThemeConfig = mockContext.config.theme.loadscreen;
            expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(screen.game, expectedThemeConfig);
        });

        test("sets transient data", () => {
            expect(screen.transientData).toEqual(mockTransientData);
        });

        test("clears the currently stored accessible buttons", () => {
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
        });

        test("resets the accessiblity layer DOM", () => {
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

        test("sets the stats screen to the current screen", () => {
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(screen.game.state.current);
        });

        test("creates the overlay closed signal", () => {
            expect(screen.overlayClosed).toEqual(signalInstance);
        });

        test("adds a listener to overlayClosed signal", () => {
            expect(signalInstance.add).toHaveBeenCalledTimes(1);
            expect(signalInstance.add).toHaveBeenCalledWith(screen.onOverlayClosed, screen);
        });
    });

    describe("context getter/setter", () => {
        test("gets context", () => {
            expect(screen.context).toEqual(mockContext);
        });

        test("sets context by merging new value with current value", () => {
            const expectedContext = {
                popupScreens: ["pause"],
                config: { theme: { loadscreen: { music: "test/music" } } },
            };
            expect(screen.context).toEqual(expectedContext);
        });
    });

    describe("getAsset method", () => {
        test("gets asset by name", () => {
            const expectedName = "some-name";
            expect(screen.getAsset(expectedName)).toBe("loadscreen.some-name");
        });
    });

    describe("visibleLayer getter/setter", () => {
        test("calls visible layer with correct params", () => {
            jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
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
