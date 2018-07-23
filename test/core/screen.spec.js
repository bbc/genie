import { expect } from "chai";
import { Screen } from "../../src/core/screen";
import * as GameSound from "../../src/core/game-sound";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as sinon from "sinon";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";

describe("Screen", () => {
    let screen;
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    describe("with context", () => {
        let mockContext, signalInstance;

        beforeEach(() => {
            sandbox.stub(GameSound, "setupScreenMusic");
            sandbox.stub(a11y, "clearAccessibleButtons");
            signalInstance = { add: sandbox.stub() };
            sandbox.stub(Phaser, "Signal").returns(signalInstance);
            screen = new Screen();
            sandbox.stub(screen, "onOverlayOpen");
            sandbox.stub(screen, "onOverlayClosed");
            mockContext = {
                popupScreens: ["pause"],
                config: {
                    theme: {},
                },
            };
            const mockNavigation = { loadscreen: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "loadscreen";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("has a getter", () => {
            expect(screen.context).to.eql(mockContext);
        });

        it("has a setter that merges new value with current value", () => {
            screen.context = { qaMode: { active: true } };

            const expectedContext = {
                popupScreens: ["pause"],
                qaMode: { active: true },
                config: {
                    theme: {},
                },
            };

            expect(screen.context).to.eql(expectedContext);
        });

        it("clears accessible buttons", () => {
            sandbox.assert.calledOnce(a11y.clearAccessibleButtons);
        });

        it("creates overlay open and close signals", () => {
            sandbox.assert.calledTwice(Phaser.Signal);
        });

        it("adds a listener to overlayOpen signal", () => {
            sandbox.assert.calledOnce(signalInstance.add.withArgs(screen.onOverlayOpen, screen));
        });

        it("adds a listener to overlayClosed signal", () => {
            sandbox.assert.calledOnce(signalInstance.add.withArgs(screen.onOverlayClosed, screen));
        });
    });

    describe("with no overlays", () => {
        beforeEach(() => {
            sandbox.stub(GameSound, "setupScreenMusic");
            screen = new Screen();
            const mockContext = {
                popupScreens: [],
                config: {
                    theme: {},
                },
            };
            const mockNavigation = { loadscreen: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "loadscreen";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the screen name as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("loadscreen");
        });
    });

    describe("with one overlay", () => {
        beforeEach(() => {
            sandbox.stub(GameSound, "setupScreenMusic");
            screen = new Screen();
            const mockContext = {
                popupScreens: ["pause"],
                config: {
                    theme: {},
                },
            };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the overlay name as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("pause");
        });
    });

    describe("with two overlays", () => {
        beforeEach(() => {
            sandbox.stub(GameSound, "setupScreenMusic");
            screen = new Screen();
            const mockContext = {
                popupScreens: ["pause", "howToPlay"],
                config: {
                    theme: {},
                },
            };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the top overlay name (last in the array) as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("howToPlay");
        });
    });

    describe("with music", () => {
        let setupScreenMusicStub;
        let themeScreenConfigMock;

        beforeEach(() => {
            setupScreenMusicStub = sandbox.stub(GameSound, "setupScreenMusic");
            screen = new Screen();
            themeScreenConfigMock = {
                music: "test/music",
            };
            const mockContext = {
                config: {
                    theme: {
                        game: themeScreenConfigMock,
                    },
                },
            };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("sets the background music using the theme config", () => {
            sinon.assert.calledOnce(setupScreenMusicStub);
            sinon.assert.calledWith(setupScreenMusicStub, screen.game, themeScreenConfigMock);
        });
    });

    describe("when overlayOpen signal is triggered", () => {
        beforeEach(() => {
            sandbox.stub(a11y, "resetElementsInDom");
            screen = new Screen();
            screen.onOverlayOpen();
        });

        it("resets accessible elements in DOM", () => {
            sandbox.assert.calledOnce(a11y.resetElementsInDom.withArgs(screen));
        });
    });

    describe("when overlayClosed signal is triggered", () => {
        beforeEach(() => {
            sandbox.stub(a11y, "clearElementsFromDom");
            sandbox.stub(a11y, "clearAccessibleButtons");
            sandbox.stub(a11y, "appendElementsToDom");
            screen = new Screen();
            screen.game = Game.Stub;
            screen.game.canvas.focus = sandbox.stub();
            screen.context = { popupScreens: ["how-to-play"] };
            screen.onOverlayClosed();
        });

        it("focuses on game canvas", () => {
            sandbox.assert.calledOnce(screen.game.canvas.focus);
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
