import { assert } from "chai";
import * as sinon from "sinon";
import { startup } from "../../src/core/startup.js";
import * as Game from "../fake/game.js";
import * as Scene from "../../src/core/scene.js";
import * as LoadFonts from "../../src/core/font-loader.js";
import * as Navigation from "../../src/core/navigation.js";

describe("#startup", () => {
    const sandbox = sinon.sandbox.create();

    let PhaserGame, gmi, containerDiv;

    beforeEach(() => {
        gmi = {
            gameContainerId: "some-id",
        };
        containerDiv = sandbox.stub();
        sandbox
            .stub(document, "getElementById")
            .withArgs(gmi.gameContainerId)
            .returns(containerDiv);
        window.getGMI = sandbox.stub().returns(gmi);
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

        beforeEach(() => {
            sceneCreate = sceneCreate = sandbox.stub(Scene, "create").returns("Scene");
            loadFonts = sandbox.stub(LoadFonts, "loadFonts");
            startup();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("creates the scene", () => {
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            sinon.assert.calledWith(sceneCreate, PhaserGame());
        });

        it("calls loadFonts with the Phaser game and a callback function", () => {
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            sinon.assert.calledOnce(loadFonts.withArgs(PhaserGame(), sinon.match.func));
        });

        it("passes Navigation.create() as a callback to the laodFonts function", () => {
            const navigationCreate = sandbox.stub(Navigation, "create");
            const config = PhaserGame.getCall(0).args[0];
            config.state._onStarted();
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sinon.assert.calledOnce(navigationCreate);
        });
    });
});
