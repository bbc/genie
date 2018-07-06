import { expect } from "chai";
import { Screen } from "../../src/core/screen";
import * as GameSound from "../../src/core/game-sound";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as sinon from "sinon";

describe("Screen", () => {
    let screen;
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    describe("with context", () => {
        let mockContext;

        beforeEach(() => {
            sandbox.stub(GameSound, "setBackgroundMusic");
            screen = new Screen();
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
    });

    describe("with no overlays", () => {
        beforeEach(() => {
            sandbox.stub(GameSound, "setBackgroundMusic");
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
            sandbox.stub(GameSound, "setBackgroundMusic");
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
            sandbox.stub(GameSound, "setBackgroundMusic");
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
        let setBackgroundMusicStub;

        beforeEach(() => {
            setBackgroundMusicStub = sandbox.stub(GameSound, "setBackgroundMusic");
            screen = new Screen();
            const mockContext = {
                config: {
                    theme: {
                        game: {
                            music: "test/music",
                        },
                    },
                },
            };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("sets the background music to what has been defined in the theme config", () => {
            sinon.assert.calledOnce(setBackgroundMusicStub);
            sinon.assert.calledWith(setBackgroundMusicStub, screen.game, "test/music");
        });
    });

    describe("with no music", () => {
        let setBackgroundMusicStub;

        beforeEach(() => {
            setBackgroundMusicStub = sandbox.stub(GameSound, "setBackgroundMusic");
            screen = new Screen();
            const mockContext = {
                config: {
                    theme: {
                        game: {},
                    },
                },
            };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("does not try to set the background music", () => {
            sinon.assert.notCalled(setBackgroundMusicStub);
        });
    });
});
