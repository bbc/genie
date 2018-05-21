import fp from "../../../lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as Pause from "../../../src/components/overlays/pause";
import * as signal from "../../../src/core/signal-bus.js";
import { GameAssets } from "../../../src/core/game-assets.js";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";

describe("Pause Overlay", () => {
    let mockGame;
    let mockScreen;
    let signalSpy;
    let mockGelButtons;
    let mockBackground;
    let mockOverlayLayout;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        signalSpy = sandbox.spy(signal.bus, "subscribe");
        mockBackground = { destroy: sandbox.spy() };
        mockOverlayLayout = {
            addBackground: sandbox.stub().returns(mockBackground),
            disableExistingButtons: sandbox.spy(),
            restoreDisabledButtons: sandbox.spy(),
            moveGelButtonsToTop: sandbox.spy(),
        };
        sandbox.stub(OverlayLayout, "create").returns(mockOverlayLayout);

        mockGelButtons = { destroy: sandbox.spy() };
        mockScreen = {
            layoutFactory: {
                keyLookups: { pause: { pauseBackground: "pauseBackgroundImage" } },
                addLayout: sandbox.stub().returns(mockGelButtons),
            },
            context: { popupScreens: [] },
            next: sandbox.spy(),
        };

        mockGame = {
            add: { image: sandbox.stub() },
            state: { current: "pauseScreen", states: { pauseScreen: mockScreen } },
            sound: { pauseAll: sandbox.spy(), unsetMute: sandbox.spy() },
            paused: false,
        };
        mockGame.add.image.onCall(0).returns("backgroundImage");

        GameAssets.sounds = {
            backgroundMusic: {
                mute: false,
            },
        };
        Pause.create({ game: mockGame });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("pause functionality", () => {
        it("adds pause to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["pause"]);
        });

        it("pauses the game", () => {
            assert.isTrue(mockGame.paused);
        });

        it("keeps all audio playing", () => {
            sinon.assert.calledOnce(mockGame.sound.unsetMute);
        });

        it("mutes background music", () => {
            assert.isTrue(GameAssets.sounds.backgroundMusic.mute);
        });
    });

    describe("assets", () => {
        it("creates a new overlay layout manager", () => {
            assert.isTrue(OverlayLayout.create.calledOnce);
        });

        it("adds a background image", () => {
            const actualImageCall = mockGame.add.image.getCall(0);
            const expectedImageCall = [0, 0, "pauseBackgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);
        });

        it("passes the background image to the overlay layout manager", () => {
            assert.deepEqual(mockOverlayLayout.addBackground.args[0], ["backgroundImage"]);
        });

        it("adds GEL buttons", () => {
            const actualAddLayoutCall = mockScreen.layoutFactory.addLayout.getCall(0);
            const expectedAddLayoutCall = [
                "pauseHome",
                "audioOff",
                "settings",
                "pauseReplay",
                "pausePlay",
                "howToPlay",
            ];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });
    });

    describe("signals", () => {
        it("adds signal subscriptions to all the GEL buttons", () => {
            assert.equal(signalSpy.callCount, 3);
            assert.equal(signalSpy.getCall(0).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "play");
            assert.equal(signalSpy.getCall(1).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(1).args[0].name, "replay");
            assert.equal(signalSpy.getCall(2).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(2).args[0].name, "home");
        });

        it("destroys the pause screen when the play button is clicked", () => {
            const clickPlayButton = signalSpy.getCall(0).args[0].callback;
            clickPlayButton();

            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockOverlayLayout.restoreDisabledButtons.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            assert.isFalse(GameAssets.sounds.backgroundMusic.mute);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("removes subscribed-to channel for this overlay on destroy", () => {
            const signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
            const destroy = signalSpy.getCall(0).args[0].callback;
            destroy();
            sinon.assert.calledOnce(signalBusRemoveChannel.withArgs("pause-gel-buttons"));
        });

        it("destroys the pause screen when the restart button is clicked", () => {
            signalSpy.getCall(1).args[0].callback();
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockOverlayLayout.restoreDisabledButtons.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            assert.isFalse(GameAssets.sounds.backgroundMusic.mute);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("calls the next method with params when the restart button is clicked", () => {
            signalSpy.getCall(1).args[0].callback();
            const actualNextArgs = mockScreen.next.getCall(0).args[0];
            const expectedNextArgs = { transient: { restart: true } };
            assert.deepEqual(actualNextArgs, expectedNextArgs);
        });

        it("destroys the pause screen when the home button is clicked", () => {
            signalSpy.getCall(2).args[0].callback();
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockOverlayLayout.restoreDisabledButtons.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            assert.isFalse(GameAssets.sounds.backgroundMusic.mute);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("calls the next method with params when the home button is clicked", () => {
            signalSpy.getCall(2).args[0].callback();
            const actualNextArgs = mockScreen.next.getCall(0).args[0];
            const expectedNextArgs = { transient: { home: true } };
            assert.deepEqual(actualNextArgs, expectedNextArgs);
        });
    });
});
