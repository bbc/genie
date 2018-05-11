import fp from "../../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as HowToPlay from "../../../src/components/overlays/how-to-play";
import * as signal from "../../../src/core/signal-bus.js";
import { GameAssets } from "../../../src/core/game-assets.js";
import * as OverlayLayout from "../../../src/lib/overlay-layout.js";

describe("How To Play Overlay", () => {
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
                keyLookups: { howToPlay: { background: "backgroundImage" } },
                addLayout: sandbox.stub().returns(mockGelButtons),
            },
            context: { popupScreens: [] },
        };
        mockGame = {
            add: { image: sandbox.stub() },
            state: { current: "howToPlay", states: { howToPlay: mockScreen } },
        };
        mockGame.add.image.onCall(0).returns("backgroundImage");

        HowToPlay.create({ game: mockGame });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("assets", () => {
        it("adds 'how-to-play' to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["how-to-play"]);
        });

        it("creates a new overlay layout manager", () => {
            assert.isTrue(OverlayLayout.create.calledOnce);
        });

        it("adds a background image", () => {
            const actualImageCall = mockGame.add.image.getCall(0);
            const expectedImageCall = [0, 0, "backgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);
        });

        it("passes the background image to the overlay layout manager", () => {
            assert.deepEqual(mockOverlayLayout.addBackground.args[0], ["backgroundImage"]);
        });

        it("disables existing buttons", () => {
            assert.isTrue(mockOverlayLayout.disableExistingButtons.calledOnce);
        });

        it("adds GEL buttons", () => {
            const actualAddLayoutCall = mockScreen.layoutFactory.addLayout.getCall(0);
            const expectedAddLayoutCall = ["howToPlayBack", "audioOff", "settings"];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });
    });

    describe("signals", () => {
        it("adds signal subscriptions to the GEL buttons", () => {
            assert.equal(signalSpy.callCount, 1);
            assert.equal(signalSpy.getCall(0).args[0].channel, "how-to-play-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "back");
        });

        it("destroys the how to play screen when the back button is clicked", () => {
            const clickBackButton = signalSpy.getCall(0).args[0].callback;
            clickBackButton();

            assert.isTrue(mockGelButtons.destroy.calledOnce);
            assert.isTrue(mockOverlayLayout.restoreDisabledButtons.calledOnce);
            assert.isTrue(mockBackground.destroy.calledOnce);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("removes subscribed-to channel for this overlay on destroy", () => {
            const signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
            const destroy = signalSpy.getCall(0).args[0].callback;
            destroy();
            sinon.assert.calledOnce(signalBusRemoveChannel.withArgs("how-to-play-gel-buttons"));
        });
    });
});
