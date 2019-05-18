/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../src/core/screen";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as GameSound from "../../src/core/game-sound";
import * as VisibleLayer from "../../src/core/visible-layer.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";

describe("Screen", () => {
    let screen, mockContext, signalInstance, mockTransientData;

    afterEach(() => jest.clearAllMocks());

    describe("with context", () => {
        beforeEach(() => {
            jest.spyOn(GameSound, "setupScreenMusic").mockImplementation(() => {});
            jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
            jest.spyOn(a11y, "clearElementsFromDom").mockImplementation(() => {});
            jest.spyOn(a11y, "clearAccessibleButtons").mockImplementation(() => {});
            jest.spyOn(a11y, "appendElementsToDom").mockImplementation(() => {});
            signalInstance = { add: jest.fn() };
            jest.spyOn(Phaser, "Signal").mockImplementation(() => signalInstance);
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
            screen.game = Game.Stub;
            screen.game.state.current = "loadscreen";
            screen.init(mockTransientData, Scene.Stub, mockContext, mockNavigation);

            delete window.__qaMode;
        });

        it("sets the scene", () => {
            expect(screen.scene).toEqual(Scene.Stub);
        });

        it("sets the context", () => {
            expect(screen._context).toEqual(mockContext);
        });

        it("sets the navigation", () => {
            expect(screen.navigation).toBe("routes");
        });

        it("clears the currently stored accessible buttons", () => {
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
        });

        it("resets the accessiblity layer DOM", () => {
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

        it("creates the overlay closed signal", () => {
            expect(screen.overlayClosed).toEqual(signalInstance);
        });

        it("adds a listener to overlayClosed signal", () => {
            expect(signalInstance.add).toHaveBeenCalledTimes(1);
            expect(signalInstance.add).toHaveBeenCalledWith(screen.onOverlayClosed, screen);
        });

        it("sets transient data", () => {
            expect(screen.transientData).toEqual(mockTransientData);
        });

        it("sets the background music using the theme config", () => {
            const expectedThemeConfig = mockContext.config.theme.loadscreen;
            expect(GameSound.setupScreenMusic).toHaveBeenCalledWith(Game.Stub, expectedThemeConfig);
        });
    });

    describe("context getter/setter", () => {
        it("gets context", () => {
            expect(screen.context).toEqual(mockContext);
        });

        it("sets context by merging new value with current value", () => {
            const expectedContext = {
                popupScreens: ["pause"],
                config: { theme: { loadscreen: { music: "test/music" } } },
            };
            expect(screen.context).toEqual(expectedContext);
        });
    });

    describe("getAsset method", () => {
        it("gets asset by name", () => {
            const expectedName = "some-name";
            expect(screen.getAsset(expectedName)).toBe("loadscreen.some-name");
        });
    });

    describe("visibleLayer getter/setter", () => {
        it("calls visible layer with correct params", () => {
            jest.spyOn(VisibleLayer, "get").mockImplementation(() => "current-layer");
            expect(screen.visibleLayer).toEqual("current-layer");
            expect(VisibleLayer.get).toHaveBeenCalledWith(screen.game, screen.context);
        });
    });

    describe("when overlayClosed signal is triggered", () => {
        beforeEach(() => {
            screen = new Screen();
            screen.game = Game.Stub;
            screen.context = { popupScreens: ["how-to-play"] };
            screen.onOverlayClosed();
        });

        it("clears accessible elements from DOM", () => {
            expect(a11y.clearElementsFromDom).toHaveBeenCalledTimes(1);
        });

        it("clears accessible buttons object", () => {
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledTimes(1);
            expect(a11y.clearAccessibleButtons).toHaveBeenCalledWith(screen);
        });

        it("removes latest popup screen from popupScreens array", () => {
            expect(screen.context.popupScreens).toEqual([]);
        });

        it("appends accessible elements to DOM", () => {
            expect(a11y.appendElementsToDom).toHaveBeenCalledTimes(1);
            expect(a11y.appendElementsToDom).toHaveBeenCalledWith(screen);
        });
    });
});
