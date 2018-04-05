import fp from "../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as Pause from "../../src/components/pause";
import * as signal from "../../src/core/signal-bus.js";

describe("Pause Overlay", () => {
    let pauseScreen;
    let mockGame;
    let mockScreen;
    let mockGelButtons;
    let mockLayoutDestroy;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockGelButtons = {
            buttons: {
                home: { input: { priorityID: 0 } },
                audioOff: { input: { priorityID: 0 } },
                settings: { input: { priorityID: 0 } },
                play: { input: { priorityID: 0 } },
                restart: { input: { priorityID: 0 } },
                howToPlay: { input: { priorityID: 0 } },
            },
            destroy: sandbox.spy(),
        };

        mockLayoutDestroy = { destroy: sandbox.spy() };

        mockGame = {
            add: { image: sandbox.stub() },
            state: { current: "pauseScreen" },
            sound: { pauseAll: sandbox.spy(), resumeAll: sandbox.spy() },
            paused: false,
        };
        mockGame.add.image.onCall(0).returns("backgroundImage");

        mockScreen = {
            layoutFactory: {
                keyLookups: { pause: { pauseBackground: "pauseBackgroundImage" } },
                addToBackground: sandbox.stub().returns(mockLayoutDestroy),
                addLayout: sandbox.stub().returns(mockGelButtons),
            },
            context: { popupScreens: [] },
            next: sandbox.spy(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("pause functionality", () => {
        beforeEach(() => {
            Pause.create(mockGame, mockScreen);
        });

        it("pauses the sound", () => {
            const pauseSpy = mockGame.sound.pauseAll;
            assert.isTrue(pauseSpy.called);
        });

        it("adds pause to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["pause"]);
        });

        it("pauses the game", () => {
            assert.isTrue(mockGame.paused);
        });
    });

    describe("assets", () => {
        it("adds a background image", () => {
            Pause.create(mockGame, mockScreen);

            const actualImageCall = mockGame.add.image.getCall(0);
            const expectedImageCall = [0, 0, "pauseBackgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = mockScreen.layoutFactory.addToBackground.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["backgroundImage"]);
        });

        it("adds GEL buttons", () => {
            Pause.create(mockGame, mockScreen);
            const actualAddLayoutCall = mockScreen.layoutFactory.addLayout.getCall(0);
            const expectedAddLayoutCall = ["home", "audioOff", "settings", "play", "restart", "howToPlay"];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });

        it("adds a priority ID to each GEL button", () => {
            Pause.create(mockGame, mockScreen);
            fp.forOwn(gelButton => {
                assert.equal(gelButton.input.priorityID, 1000);
            }, mockGelButtons.buttons);
        });

        it("ups the priority ID on each GEL button if there are more popup screens", () => {
            mockScreen.context.popupScreens.push("howToPlay");
            Pause.create(mockGame, mockScreen);
            fp.forOwn(gelButton => {
                assert.equal(gelButton.input.priorityID, 1001);
            }, mockGelButtons.buttons);
        });
    });

    describe("signals", () => {
        let signalSpy;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "subscribe");
            Pause.create(mockGame, mockScreen);
        });

        it("adds signal subscriptions to all the GEL buttons", () => {
            assert.equal(signalSpy.callCount, 3);
            assert.equal(signalSpy.getCall(0).args[0].name, "GEL-play");
            assert.equal(signalSpy.getCall(1).args[0].name, "GEL-restart");
            assert.equal(signalSpy.getCall(2).args[0].name, "GEL-home");
        });

        it("destroys the pause screen when the play button is clicked", () => {
            signalSpy.getCall(0).args[0].callback();
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("destroys the pause screen when the restart button is clicked", () => {
            signalSpy.getCall(1).args[0].callback();
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
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
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
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
