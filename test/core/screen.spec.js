import { expect } from "chai";
import { Screen } from "../../src/core/screen";
import * as GameSound from "../../src/core/game-sound";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as sinon from "sinon";

describe("Screen", () => {
    let screen;
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(GameSound, "setBackgroundMusic");
    });

    describe("with context", () => {
        let mockContext;

        beforeEach(() => {
            screen = new Screen();
            mockContext = {
                popupScreens: ["pause"],
                config: {
                    theme: {
                        loadscreen: {
                            music: "test/music",
                        },
                    },
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
                    theme: {
                        loadscreen: {
                            music: "test/music",
                        },
                    },
                },
            };

            expect(screen.context).to.eql(expectedContext);
        });
    });

    describe("with no overlays", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = {
                popupScreens: [],
                config: {
                    theme: {
                        loadscreen: {
                            music: "test/music",
                        },
                    },
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
            screen = new Screen();
            const mockContext = {
                popupScreens: ["pause"],
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

        it("returns the overlay name as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("pause");
        });
    });

    describe("with two overlays", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = {
                popupScreens: ["pause", "howToPlay"],
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

        it("returns the top overlay name (last in the array) as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("howToPlay");
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
