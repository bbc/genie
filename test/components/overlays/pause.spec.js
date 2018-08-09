import { assert } from "chai";
import * as sinon from "sinon";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as Pause from "../../../src/components/overlays/pause";
import * as GameSound from "../../../src/core/game-sound";
import * as signal from "../../../src/core/signal-bus.js";

describe("Pause Overlay", () => {
    let mockGame;
    let mockScreen;
    let signalSpy;
    let mockGelButtons;
    let mockLayoutDestroy;
    let mockBackground;
    let mockOverlayLayout;

    const sandbox = sinon.createSandbox();
    const pauseCreate = Pause.create(false);

    beforeEach(() => {
        signalSpy = sandbox.spy(signal.bus, "subscribe");
        mockBackground = { destroy: sandbox.spy() };
        mockOverlayLayout = {
            addBackground: sandbox.stub().returns(mockBackground),
            disableExistingButtons: sandbox.spy(),
            moveGelButtonsToTop: sandbox.spy(),
        };
        sandbox.stub(OverlayLayout, "create").returns(mockOverlayLayout);

        mockGelButtons = { destroy: sandbox.spy() };
        sandbox.stub(document, "getElementById").returns({ focus: () => {} });
        mockScreen = {
            scene: {
                addToBackground: sandbox.stub().returns(mockLayoutDestroy),
                addLayout: sandbox.stub().returns(mockGelButtons),
                removeLast: sandbox.stub(),
            },
            context: { popupScreens: [] },
            next: sandbox.spy(),
            navigation: {
                restart: sandbox.stub(),
                home: sandbox.stub(),
            },
            overlayClosed: {
                dispatch: sandbox.stub(),
            },
        };

        mockGame = {
            add: { image: sandbox.stub() },
            state: { current: "pauseScreen", states: { pauseScreen: mockScreen } },
            sound: { pauseAll: sandbox.spy() },
            paused: false,
            canvas: { focus: sandbox.spy() },
        };
        mockGame.add.image.onCall(0).returns("backgroundImage");

        GameSound.Assets.backgroundMusic = {
            pause: sandbox.spy(),
            resume: sandbox.spy(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("pause functionality", () => {
        beforeEach(() => {
            pauseCreate({ game: mockGame });
        });

        it("adds pause to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["pause"]);
        });

        it("pauses the game", () => {
            assert.isTrue(mockGame.paused);
        });

        it("pauses background music", () => {
            sinon.assert.calledOnce(GameSound.Assets.backgroundMusic.pause);
        });
    });

    describe("assets", () => {
        it("creates a new overlay layout manager", () => {
            pauseCreate({ game: mockGame });
            assert.isTrue(OverlayLayout.create.calledOnce);
        });

        it("adds a background image", () => {
            pauseCreate({ game: mockGame });
            const actualImageCall = mockGame.add.image.getCall(0);
            const expectedImageCall = [0, 0, "pause.pauseBackground"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);
        });

        it("passes the background image to the overlay layout manager", () => {
            pauseCreate({ game: mockGame });
            assert.deepEqual(mockOverlayLayout.addBackground.args[0], ["backgroundImage"]);
        });

        it("adds GEL buttons", () => {
            pauseCreate({ game: mockGame });
            const actualAddLayoutCall = mockScreen.scene.addLayout.getCall(0);
            const expectedAddLayoutCall = ["pauseReplay", "pauseHome", "audio", "settings", "pausePlay", "howToPlay"];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });

        it("adds GEL buttons without a replay button if requested", () => {
            Pause.create(true, { game: mockGame });
            const actualAddLayoutCall = mockScreen.scene.addLayout.getCall(0);
            const expectedAddLayoutCall = ["pauseHome", "audio", "settings", "pausePlay", "howToPlay"];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });
    });

    describe("signals", () => {
        it("adds custom signal subscriptions to certain GEL buttons", () => {
            pauseCreate({ game: mockGame });
            assert.equal(signalSpy.callCount, 3);
            assert.equal(signalSpy.getCall(0).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "play");
            assert.equal(signalSpy.getCall(1).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(1).args[0].name, "home");
            assert.equal(signalSpy.getCall(2).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(2).args[0].name, "replay");
        });

        it("adds custom signal subscriptions to certain GEL buttons, when the replay button is not present", () => {
            Pause.create(true, { game: mockGame });
            assert.equal(signalSpy.callCount, 2);
            assert.equal(signalSpy.getCall(0).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "play");
            assert.equal(signalSpy.getCall(1).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(1).args[0].name, "home");
        });

        it("destroys the pause screen when the play button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickPlayButton = signalSpy.getCall(0).args[0].callback;
            clickPlayButton();

            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            sinon.assert.calledOnce(GameSound.Assets.backgroundMusic.resume);
        });

        it("removes subscribed-to channel for this overlay on destroy", () => {
            const signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
            pauseCreate({ game: mockGame });
            const destroy = signalSpy.getCall(0).args[0].callback;
            destroy();
            sinon.assert.calledOnce(signalBusRemoveChannel.withArgs("pause-gel-buttons"));
        });

        it("destroys the pause screen when the replay button is clicked", () => {
            pauseCreate({ game: mockGame });
            const cickReplayButton = signalSpy.getCall(2).args[0].callback;
            cickReplayButton();
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            sinon.assert.calledOnce(GameSound.Assets.backgroundMusic.resume);
        });

        it("restarts the game when the replay button is clicked", () => {
            mockScreen.transientData = {
                characterSelected: 1,
            };
            pauseCreate({ game: mockGame });
            const cickReplayButton = signalSpy.getCall(2).args[0].callback;
            cickReplayButton();
            const actualRestartArgs = mockScreen.navigation.restart.getCall(0).args[0];
            const expectedRestartArgs = { characterSelected: 1 };
            assert.deepEqual(actualRestartArgs, expectedRestartArgs);
        });

        it("destroys the pause screen when the home button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickHomeButton = signalSpy.getCall(1).args[0].callback;
            clickHomeButton();
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            sinon.assert.calledOnce(GameSound.Assets.backgroundMusic.resume);
        });

        it("navigates home when the home button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickHomeButton = signalSpy.getCall(1).args[0].callback;
            clickHomeButton();
            sinon.assert.calledOnce(mockScreen.navigation.home);
        });

        it("dispatches overlayClosed signal on screen when destroyed", () => {
            pauseCreate({ game: mockGame });
            const destroy = signalSpy.getCall(0).args[0].callback;
            destroy();
            sandbox.assert.calledOnce(mockScreen.overlayClosed.dispatch);
        });
    });
});
