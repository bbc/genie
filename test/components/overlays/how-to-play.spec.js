import fp from "../../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as signal from "../../../src/core/signal-bus.js";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as HowToPlay from "../../../src/components/overlays/how-to-play";

describe.only("How To Play Overlay", () => {
    let howToPlayScreen;
    let mockGame;
    let mockScreen;
    let signalSpy;
    let mockGelButtons;
    let mockBackground;
    let mockOverlayLayout;

    const sandbox = sinon.sandbox.create();
    const panel1Sprite = { visible: "", destroy: sandbox.spy() };
    const panel2Sprite = { visible: "", destroy: sandbox.spy() };
    const panel3Sprite = { visible: "", destroy: sandbox.spy() };

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
                keyLookups: {
                    howToPlay: {
                        background: "backgroundImage",
                        "how-to-play-1": "how-to-play-1",
                        "how-to-play-2": "how-to-play-2",
                        "how-to-play-3": "how-to-play-3",
                    }
                },
                addLayout: sandbox.stub().returns(mockGelButtons),
                addToBackground: sandbox.spy(),
            },
            context: {
                popupScreens: [],
                config: {
                    theme: {
                        "how-to-play": {
                            panels: ["how-to-play-1", "how-to-play-2", "how-to-play-3"],
                        },
                    },
                },
            },
        };
        mockGame = {
            add: {
                image: sandbox.stub(),
                sprite: sandbox.stub(),
            },
            state: { current: "howToPlay", states: { howToPlay: mockScreen } },
        };
        mockGame.add.image.onCall(0).returns("backgroundImage");
        mockGame.add.sprite.withArgs(0, 0, "how-to-play-1").returns(panel1Sprite);
        mockGame.add.sprite.withArgs(0, 0, "how-to-play-2").returns(panel2Sprite);
        mockGame.add.sprite.withArgs(0, 0, "how-to-play-3").returns(panel3Sprite);
        howToPlayScreen = HowToPlay.create({ game: mockGame });
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
            const expectedAddLayoutCall = [
                "howToPlayBack",
                "audioOff",
                "settings",
                "howToPlayPrevious",
                "howToPlayNext",
            ];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });

        it("creates sprites for each panel", () => {
            assert.equal(mockGame.add.sprite.callCount, 3);
            assert.deepEqual(mockGame.add.sprite.getCall(0).args, [0, 0, "how-to-play-1"]);
            assert.deepEqual(mockGame.add.sprite.getCall(1).args, [0, 0, "how-to-play-2"]);
            assert.deepEqual(mockGame.add.sprite.getCall(2).args, [0, 0, "how-to-play-3"]);
        });

        it("adds each panel sprite to the background", () => {
            sinon.assert.calledWith(mockScreen.layoutFactory.addToBackground, panel1Sprite);
            sinon.assert.calledWith(mockScreen.layoutFactory.addToBackground, panel2Sprite);
            sinon.assert.calledWith(mockScreen.layoutFactory.addToBackground, panel3Sprite);
        });

        it("hides all the panel sprites except the first one", () => {
            assert.isTrue(panel1Sprite.visible);
            assert.isFalse(panel2Sprite.visible);
            assert.isFalse(panel3Sprite.visible);
        });
    });

    describe("signals", () => {
        it("adds signal subscriptions to the GEL buttons", () => {
            assert.equal(signalSpy.callCount, 3);
            assert.equal(signalSpy.getCall(0).args[0].channel, "how-to-play-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "back");
            assert.equal(signalSpy.getCall(1).args[0].channel, "how-to-play-gel-buttons");
            assert.equal(signalSpy.getCall(1).args[0].name, "previous");
            assert.equal(signalSpy.getCall(2).args[0].channel, "how-to-play-gel-buttons");
            assert.equal(signalSpy.getCall(2).args[0].name, "next");
        });

        describe("back button", () => {
            it("destroys the how to play screen", () => {
                const clickBackButton = signalSpy.getCall(0).args[0].callback;
                clickBackButton();

                assert.isTrue(mockGelButtons.destroy.calledOnce);
                assert.isTrue(mockOverlayLayout.restoreDisabledButtons.calledOnce);
                assert.isTrue(mockBackground.destroy.calledOnce);
                assert.deepEqual(mockScreen.context.popupScreens, []);
            });

            it("removes all the panels on destroy", () => {
                const destroy = signalSpy.getCall(0).args[0].callback;
                destroy();
                assert.isTrue(panel1Sprite.destroy.called);
                assert.isTrue(panel2Sprite.destroy.called);
                assert.isTrue(panel3Sprite.destroy.called);
            });

            it("removes subscribed-to channel for this overlay on destroy", () => {
                const signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
                const destroy = signalSpy.getCall(0).args[0].callback;
                destroy();
                sinon.assert.calledOnce(signalBusRemoveChannel.withArgs("how-to-play-gel-buttons"));
            });
        });

        describe("previous button", () => {
            it("switches to the last item when the first item is showing", () => {
                const previousButtonClick = signalSpy.getCall(1).args[0].callback;
                previousButtonClick();
                assert.isFalse(panel1Sprite.visible);
                assert.isFalse(panel2Sprite.visible);
                assert.isTrue(panel3Sprite.visible);
            });

            it("switches to the second item when the last item is showing", () => {
                const previousButtonClick = signalSpy.getCall(1).args[0].callback;
                previousButtonClick();
                previousButtonClick();
                assert.isFalse(panel1Sprite.visible);
                assert.isTrue(panel2Sprite.visible);
                assert.isFalse(panel3Sprite.visible);
            });

            it("switches to the first item when the second item is showing", () => {
                const previousButtonClick = signalSpy.getCall(1).args[0].callback;
                previousButtonClick();
                previousButtonClick();
                previousButtonClick();
                assert.isTrue(panel1Sprite.visible);
                assert.isFalse(panel2Sprite.visible);
                assert.isFalse(panel3Sprite.visible);
            });
        });

        describe("next button", () => {
            it("switches to the second item when the first item is showing", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                assert.isFalse(panel1Sprite.visible);
                assert.isTrue(panel2Sprite.visible);
                assert.isFalse(panel3Sprite.visible);
            });

            it("switches to the third item when the second item is showing", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                nextButtonClick();
                assert.isFalse(panel1Sprite.visible);
                assert.isFalse(panel2Sprite.visible);
                assert.isTrue(panel3Sprite.visible);
            });

            it("switches back to the first item when the third item is showing", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                nextButtonClick();
                nextButtonClick();
                assert.isTrue(panel1Sprite.visible);
                assert.isFalse(panel2Sprite.visible);
                assert.isFalse(panel3Sprite.visible);
            });
        });
    });
});
