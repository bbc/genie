import { assert } from "chai";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";
import * as Game from "../fake/game.js";
import * as Scene from "../fake/scene.js";
import * as GameSound from "../../src/core/game-sound";
import * as VisibleLayer from "../../src/core/visible-layer.js";

describe.only("Screen", () => {
    const sandbox = sinon.sandbox.create();

    let screen;
    let mockContext;
    let mockTransientData;

    afterEach(() => sandbox.restore());

    beforeEach(() => {
        sandbox.stub(GameSound, "setupScreenMusic");
        sandbox.stub(VisibleLayer, "get").returns("current-layer");
        screen = new Screen();
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

    it("sets transient data", () => {
        assert.equal(screen.transientData, mockTransientData);
    });

    it("sets the background music using the theme config", () => {
        const expectedThemeConfig = mockContext.config.theme.loadscreen;
        sandbox.assert.calledOnce(GameSound.setupScreenMusic);
        sandbox.assert.calledWith(GameSound.setupScreenMusic, Game.Stub, expectedThemeConfig);
    });

    describe("context getter/setter", () => {
        it("gets context", () => {
            assert.deepEqual(screen.context, mockContext);
        });

        it("sets context by merging new value with current value", () => {
            screen.context = { qaMode: { active: true } };
            const expectedContext = {
                popupScreens: ["pause"],
                config: { theme: { loadscreen: { music: "test/music" } } },
                qaMode: { active: true },
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
            assert.equal(screen.visibleLayer, "current-layer");
            sandbox.assert.calledOnce(VisibleLayer.get.withArgs(Game.Stub, mockContext));
        });
    });
});
