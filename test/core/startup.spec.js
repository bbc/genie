import { assert } from "chai";
import * as sinon from "sinon";
import { startup } from "../../src/core/startup.js";
import * as gmiModule from "../../src/core/gmi.js";
import * as Game from "../fake/game.js";
import * as Scene from "../../src/core/scene.js";
import * as LoadFonts from "../../src/core/font-loader.js";
import * as Navigation from "../../src/core/navigation.js";

describe("#startup", () => {
    const sandbox = sinon.createSandbox();

    let PhaserGame, containerDiv;

    beforeEach(() => {
        const mockGmi = {
            gameContainerId: "some-id",
        };
        containerDiv = sandbox.stub();

        sandbox
            .stub(document, "getElementById")
            .withArgs(mockGmi.gameContainerId)
            .returns(containerDiv);

        sandbox.replace(gmiModule, "gmi", mockGmi);
        PhaserGame = sandbox.stub(Phaser, "Game").returns(Game.Stub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("creates a new Phaser game", () => {
        startup();
        sinon.assert.calledWithNew(PhaserGame);
    });

    it("creates a new Phaser game with correct config", () => {
        startup();

        const expectedConfig = {
            width: 1400,
            height: 600,
            renderer: 0,
            antialias: true,
            multiTexture: false,
            parent: containerDiv,
            transparent: true,
        };

        const actualConfig = PhaserGame.getCall(0).args[0];

        assert.equal(actualConfig.width, expectedConfig.width);
        assert.equal(actualConfig.height, expectedConfig.height);
        assert.equal(actualConfig.renderer, expectedConfig.renderer);
        assert.equal(actualConfig.antialias, expectedConfig.antialias);
        assert.equal(actualConfig.multiTexture, expectedConfig.multiTexture);
        assert.equal(actualConfig.parent, expectedConfig.parent);
        assert.equal(actualConfig.transparent, expectedConfig.transparent);
    });

    describe("onStarted()", () => {
        let sceneCreate;
        let loadFonts;
        let navigationCreate;

        beforeEach(() => {
            sceneCreate = sandbox.stub(Scene, "create").returns("Scene");
            loadFonts = sandbox.stub(LoadFonts, "loadFonts");
            navigationCreate = sandbox.stub(Navigation, "create");
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("creates the scene", () => {
            startup();
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            sinon.assert.calledWith(sceneCreate, PhaserGame());
        });

        it("loads the fonts", () => {
            startup();
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            sinon.assert.calledWith(loadFonts, PhaserGame(), sinon.match.func);
        });

        it("creates the game navigation", () => {
            const navigationConfig = "NavConfig";
            startup({}, navigationConfig);
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sinon.assert.calledWith(
                navigationCreate,
                sinon.match.object,
                sinon.match.object,
                "Scene",
                navigationConfig,
            );
        });
    });
});
