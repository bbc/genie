/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import { startup } from "../../src/core/startup.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as Game from "../fake/game.js";
import * as Scene from "../../src/core/scene.js";
import * as LoadFonts from "../../src/core/font-loader.js";
import * as Navigation from "../../src/core/navigation.js";
import * as styles from "../../src/core/custom-styles.js";
import * as qaMode from "../../src/core/qa/qa-mode.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as fullscreen from "../../src/core/fullscreen.js";

import { rewire$getBrowser, restore } from "../../src/core/browser.js";

describe("Startup", () => {
    let mockGmi;
    const sandbox = sinon.createSandbox();
    let PhaserGame, containerDiv;

    beforeEach(() => {
        mockGmi = {
            gameContainerId: "some-id",
        };
        containerDiv = sandbox.stub();

        sandbox
            .stub(document, "getElementById")
            .withArgs(mockGmi.gameContainerId)
            .returns(containerDiv);

        sandbox.stub(gmiModule, "setGmi");
        sandbox.stub(gmiModule, "startStatsTracking");
        sandbox.stub(styles, "addCustomStyles");
        sandbox.replace(gmiModule, "gmi", mockGmi);
        PhaserGame = sandbox.stub(Phaser, "Game").returns(Game.Stub);
        window.getGMI = sandbox.stub().returns(mockGmi);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("instantiates the GMI with correct params", () => {
        const fakeSettings = { settings: "some settings" };
        startup(fakeSettings);
        sandbox.assert.calledOnce(gmiModule.setGmi.withArgs(fakeSettings, window));
    });

    it("injects custom styles to the game container element", () => {
        startup();
        sandbox.assert.calledOnce(styles.addCustomStyles);
    });

    it("creates a new Phaser game", () => {
        startup();
        sandbox.assert.calledWithNew(PhaserGame);
    });

    it("creates a new Phaser game with correct config", () => {
        startup();

        const expectedConfig = {
            width: 1400,
            height: 600,
            renderer: 0,
            antialias: true,
            multiTexture: true,
            parent: containerDiv,
            transparent: false,
            clearBeforeRender: false,
        };

        const actualConfig = PhaserGame.getCall(0).args[0];

        assert.equal(actualConfig.width, expectedConfig.width);
        assert.equal(actualConfig.height, expectedConfig.height);
        assert.equal(actualConfig.renderer, expectedConfig.renderer);
        assert.equal(actualConfig.antialias, expectedConfig.antialias);
        assert.equal(actualConfig.multiTexture, expectedConfig.multiTexture);
        assert.equal(actualConfig.parent, expectedConfig.parent);
        assert.equal(actualConfig.transparent, expectedConfig.transparent);
        assert.equal(actualConfig.clearBeforeRender, expectedConfig.clearBeforeRender);
    });

    it("sets transparent config flag to false when Amazon Silk Browser", () => {
        const mockSilkBrowser = { name: "Amazon Silk", isSilk: true, version: "1.1.1" };

        rewire$getBrowser(() => mockSilkBrowser);

        startup();
        const actualConfig = PhaserGame.getCall(0).args[0];
        assert.equal(actualConfig.transparent, true);

        restore();
    });

    it("sets renderer to canvas when browser returns forceCanvas", () => {
        const mockSafari9 = { name: "Safari", forceCanvas: true };

        rewire$getBrowser(() => mockSafari9);

        startup();
        const actualConfig = PhaserGame.getCall(0).args[0];
        assert.equal(actualConfig.renderer, 1);

        restore();
    });

    it("throws an error if the game container element cannot be found", () => {
        mockGmi.gameContainerId = "not-existing";
        assert.throws(startup, 'Container element "#not-existing" not found'); // eslint-disable-line quotes
    });

    describe("onStarted()", () => {
        let sceneCreate;
        let loadFonts;
        let navigationCreate;

        beforeEach(() => {
            sceneCreate = sandbox.stub(Scene, "create").returns("Scene");
            loadFonts = sandbox.stub(LoadFonts, "loadFonts");
            navigationCreate = sandbox.stub(Navigation, "create");
            sandbox.stub(qaMode, "create");
            sandbox.stub(a11y, "setup");
            sandbox.stub(fullscreen, "listenForTap");

            startup({}, "NavConfig");
            const game = PhaserGame.getCall(0).args[0];
            game.state._onStarted();
        });

        afterEach(() => {
            sandbox.restore();
            delete window.__qaMode;
        });

        it("creates the scene", () => {
            sandbox.assert.calledWith(sceneCreate, PhaserGame());
        });

        it("loads the fonts", () => {
            sandbox.assert.calledWith(loadFonts, PhaserGame(), sandbox.match.func);
        });

        it("creates the game navigation", () => {
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sandbox.assert.calledWith(navigationCreate, Game.Stub.state, sandbox.match.object, "Scene", "NavConfig");
        });

        it("creates qaMode if the qaMode url parameter is set to true", () => {
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sandbox.assert.calledOnce(qaMode.create);
        });

        it("starts the stats tracking through the GMI", () => {
            const expectedContext = {
                popupScreens: [],
                gameMuted: true,
            };
            const statsParams = gmiModule.startStatsTracking.getCall(0).args;
            assert.deepEqual(statsParams[0], Game.Stub);
            assert.deepEqual(JSON.stringify(statsParams[1]), JSON.stringify(expectedContext));
        });

        it("sets up the accessibility manager", () => {
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sandbox.assert.calledWith(a11y.setup, Game.Stub.canvas.parentElement);
        });

        it("sets up the fullscreen API", () => {
            const onComplete = loadFonts.getCall(0).args[1];
            onComplete();
            sandbox.assert.calledWith(fullscreen.listenForTap, Game.Stub.canvas.parentElement);
        });
    });
});
