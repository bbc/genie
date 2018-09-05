/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert, expect } from "chai";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as GameSound from "../../src/core/game-sound";
import * as VisibleLayer from "../../src/core/visible-layer.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";

describe("Screen", () => {
    let screen, mockContext, signalInstance, mockTransientData;
    const sandbox = sinon.createSandbox();

    afterEach(() => sandbox.restore());

    describe("with context", () => {
        beforeEach(() => {
            sandbox.stub(GameSound, "setupScreenMusic");
            sandbox.stub(VisibleLayer, "get").returns("current-layer");
            sandbox.stub(a11y, "clearElementsFromDom");
            sandbox.stub(a11y, "clearAccessibleButtons");
            signalInstance = { add: sandbox.stub() };
            sandbox.stub(Phaser, "Signal").returns(signalInstance);
            screen = new Screen();
            sandbox.stub(screen, "onOverlayClosed");
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
            assert.deepEqual(screen.scene, Scene.Stub);
        });

        it("sets the context", () => {
            assert.deepEqual(screen._context, mockContext);
        });

        it("sets the navigation", () => {
            assert.equal(screen.navigation, "routes");
        });

        it("clears the currently stored accessible buttons", () => {
            sandbox.assert.calledOnce(a11y.clearAccessibleButtons);
        });

        it("resets the accessiblity layer DOM", () => {
            sandbox.assert.calledOnce(a11y.clearElementsFromDom);
        });

        it("creates the overlay closed signal", () => {
            assert.equal(screen.overlayClosed, signalInstance);
        });

        it("adds a listener to overlayClosed signal", () => {
            sandbox.assert.calledOnce(signalInstance.add.withArgs(screen.onOverlayClosed, screen));
        });

        it("sets transient data", () => {
            assert.equal(screen.transientData, mockTransientData);
        });

        it("sets the background music using the theme config", () => {
            const expectedThemeConfig = mockContext.config.theme.loadscreen;
            sandbox.assert.calledOnce(GameSound.setupScreenMusic);
            sandbox.assert.calledWith(GameSound.setupScreenMusic, Game.Stub, expectedThemeConfig);
        });
    });

    describe("context getter/setter", () => {
        it("gets context", () => {
            assert.deepEqual(screen.context, mockContext);
        });

        it("sets context by merging new value with current value", () => {
            const expectedContext = {
                popupScreens: ["pause"],
                config: { theme: { loadscreen: { music: "test/music" } } },
            };
            assert.deepEqual(screen.context, expectedContext);
        });
    });

    describe("getAsset method", () => {
        it("gets asset by name", () => {
            const expectedName = "some-name";
            assert.equal(screen.getAsset(expectedName), "loadscreen.some-name");
        });
    });

    describe("visibleLayer getter/setter", () => {
        it("calls visible layer with correct params", () => {
            sandbox.stub(VisibleLayer, "get").returns("current-layer");
            assert.equal(screen.visibleLayer, "current-layer");
            sandbox.assert.calledOnce(VisibleLayer.get.withArgs(screen.game, screen.context));
        });
    });

    describe("when overlayClosed signal is triggered", () => {
        beforeEach(() => {
            sandbox.stub(a11y, "clearElementsFromDom");
            sandbox.stub(a11y, "clearAccessibleButtons");
            sandbox.stub(a11y, "appendElementsToDom");
            screen = new Screen();
            screen.game = Game.Stub;
            screen.context = { popupScreens: ["how-to-play"] };
            screen.onOverlayClosed();
        });

        it("clears accessible elements from DOM", () => {
            sandbox.assert.calledOnce(a11y.clearElementsFromDom);
        });

        it("clears accessible buttons object", () => {
            sandbox.assert.calledOnce(a11y.clearAccessibleButtons.withArgs(screen));
        });

        it("removes latest popup screen from popupScreens array", () => {
            expect(screen.context.popupScreens).to.eql([]);
        });

        it("appends accessible elements to DOM", () => {
            sandbox.assert.calledOnce(a11y.appendElementsToDom.withArgs(screen));
        });
    });
});
