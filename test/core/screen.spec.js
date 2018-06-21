import { expect } from "chai";
import { Screen } from "../../src/core/screen";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";

describe("Screen", () => {
    let screen;

    describe("with context", () => {
        let mockContext;

        beforeEach(() => {
            screen = new Screen();
            mockContext = { popupScreens: ["pause"] };
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
            };

            expect(screen.context).to.eql(expectedContext);
        });
    });

    describe("with no overlays", () => {
        beforeEach(() => {
            screen = new Screen();
            const mockContext = { popupScreens: [] };
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
            const mockContext = { popupScreens: ["pause"] };
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
            const mockContext = { popupScreens: ["pause", "howToPlay"] };
            const mockNavigation = { game: {} };
            screen.game = Game.Stub;
            screen.game.state.current = "game";
            screen.init({}, Scene.Stub, mockContext, mockNavigation);
        });

        it("returns the top overlay name (last in the array) as the visible layer", () => {
            expect(screen.visibleLayer).to.eql("howToPlay");
        });
    });
});
