import fp from "../../../lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as signal from "../../../src/core/signal-bus.js";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as HowToPlay from "../../../src/components/overlays/how-to-play";

describe("How To Play Overlay", () => {
    let howToPlayScreen;
    let mockGame;
    let mockScreen;
    let signalSpy;
    let mockTitle;
    let mockGelButtons;
    let mockBackground;
    let mockOverlayLayout;
    let mockPipsGroup;

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
            moveButtonToTop: sandbox.spy(),
        };
        sandbox.stub(OverlayLayout, "create").returns(mockOverlayLayout);

        mockGelButtons = { buttons: { howToPlayPrevious: {}, howToPlayNext: {} }, destroy: sandbox.spy() };
        mockTitle = { destroy: sandbox.spy() };
        mockScreen = {
            scene: {
                keyLookups: {
                    howToPlay: {
                        background: "backgroundImage",
                        title: "titleImage",
                        panel1: "panel1",
                        panel2: "panel2",
                        panel3: "panel3",
                        pipOn: "pipOnImage",
                        pipOff: "pipOffImage",
                    },
                },
                addLayout: sandbox.stub().returns(mockGelButtons),
                addToBackground: sandbox.stub(),
            },
            context: {
                popupScreens: [],
                config: {
                    theme: {
                        "how-to-play": {
                            panels: ["panel1", "panel2", "panel3"],
                        },
                    },
                },
            },
        };
        mockScreen.scene.addToBackground.withArgs("titleImage").returns(mockTitle);

        mockPipsGroup = { add: sandbox.spy(), callAll: sandbox.spy() };
        mockGame = {
            add: {
                image: sandbox.stub(),
                sprite: sandbox.stub(),
                button: sandbox.stub(),
                group: sandbox.stub().returns(mockPipsGroup),
            },
            state: { current: "howToPlay", states: { howToPlay: mockScreen } },
        };
        mockGame.add.image.withArgs(0, 0, "backgroundImage").returns("backgroundImage");
        mockGame.add.image.withArgs(0, -230, "titleImage").returns("titleImage");
        mockGame.add.sprite.withArgs(0, 30, "panel1").returns(panel1Sprite);
        mockGame.add.sprite.withArgs(0, 30, "panel2").returns(panel2Sprite);
        mockGame.add.sprite.withArgs(0, 30, "panel3").returns(panel3Sprite);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("assets", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

        it("adds 'how-to-play' to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["how-to-play"]);
        });

        it("creates a new overlay layout manager", () => {
            assert.isTrue(OverlayLayout.create.calledOnce);
        });

        it("adds a background image and passes it to the overlay manager", () => {
            sinon.assert.calledWith(mockGame.add.image, 0, 0, "backgroundImage");
            sinon.assert.calledWith(mockOverlayLayout.addBackground, "backgroundImage");
        });

        it("creates a title and adds it to the background", () => {
            sinon.assert.calledWith(mockGame.add.image, 0, -230, "titleImage");
            sinon.assert.calledWith(mockScreen.scene.addToBackground, "titleImage");
        });

        it("adds GEL buttons", () => {
            const actualAddLayoutCall = mockScreen.scene.addLayout.getCall(0);
            const expectedAddLayoutCall = [
                "howToPlayBack",
                "audioOff",
                "settings",
                "howToPlayPrevious",
                "howToPlayNext",
            ];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });
    });

    describe("panels", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

        it("creates sprites for each panel", () => {
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "panel1");
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "panel2");
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "panel3");
        });

        it("adds each panel sprite to the background", () => {
            sinon.assert.calledWith(mockScreen.scene.addToBackground, panel1Sprite);
            sinon.assert.calledWith(mockScreen.scene.addToBackground, panel2Sprite);
            sinon.assert.calledWith(mockScreen.scene.addToBackground, panel3Sprite);
        });

        it("hides all the panel sprites except the first one", () => {
            assert.isTrue(panel1Sprite.visible);
            assert.isFalse(panel2Sprite.visible);
            assert.isFalse(panel3Sprite.visible);
        });
    });

    describe("pips", () => {
        it("creates pip sprites for each panel and calculates their position", () => {
            HowToPlay.create({ game: mockGame });
            sinon.assert.calledWith(mockGame.add.button, -39, 240, "pipOnImage");
            sinon.assert.calledWith(mockGame.add.button, -8, 240, "pipOffImage");
            sinon.assert.calledWith(mockGame.add.button, 23, 240, "pipOffImage");
        });

        it("adds the pips group to the background", () => {
            HowToPlay.create({ game: mockGame });
            sinon.assert.calledOnce(mockScreen.scene.addToBackground.withArgs(mockPipsGroup));
        });

        it("sets the pips to the top layer", () => {
            mockGame.add.button.withArgs(-39, 240, "pipOnImage").returns("pip1");
            mockGame.add.button.withArgs(-8, 240, "pipOffImage").returns("pip2");
            mockGame.add.button.withArgs(23, 240, "pipOffImage").returns("pip3");

            HowToPlay.create({ game: mockGame });

            sinon.assert.calledOnce(mockOverlayLayout.moveButtonToTop.withArgs("pip1"));
            sinon.assert.calledOnce(mockOverlayLayout.moveButtonToTop.withArgs("pip2"));
            sinon.assert.calledOnce(mockOverlayLayout.moveButtonToTop.withArgs("pip3"));
        });

        it("shows the first panel when the first pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip1Callback = mockGame.add.button.getCall(0).args[3];
            pip1Callback();
            assert.isTrue(panel1Sprite.visible);
            assert.isFalse(panel2Sprite.visible);
            assert.isFalse(panel3Sprite.visible);
        });

        it("shows the second panel when the second pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip2Callback = mockGame.add.button.getCall(1).args[3];
            pip2Callback();
            assert.isFalse(panel1Sprite.visible);
            assert.isTrue(panel2Sprite.visible);
            assert.isFalse(panel3Sprite.visible);
        });

        it("shows the third panel when the third pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip3Callback = mockGame.add.button.getCall(2).args[3];
            pip3Callback();
            assert.isFalse(panel1Sprite.visible);
            assert.isFalse(panel2Sprite.visible);
            assert.isTrue(panel3Sprite.visible);
        });

        it("does not redraw the pips when the selected pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip1Callback = mockGame.add.button.getCall(0).args[3];
            pip1Callback();
            sinon.assert.notCalled(mockPipsGroup.callAll);
            assert.isTrue(mockGame.add.button.withArgs(-39, 240, "pipOnImage").calledOnce);
            assert.isTrue(mockGame.add.button.withArgs(-8, 240, "pipOffImage").calledOnce);
            assert.isTrue(mockGame.add.button.withArgs(23, 240, "pipOffImage").calledOnce);
        });

        it("highlights the second pip when the second pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip2Callback = mockGame.add.button.getCall(1).args[3];
            pip2Callback();
            sinon.assert.calledWith(mockPipsGroup.callAll, "kill");
            sinon.assert.calledWith(mockPipsGroup.callAll, "destroy");
            sinon.assert.calledOnce(mockGame.add.button.withArgs(-39, 240, "pipOffImage"));
            sinon.assert.calledOnce(mockGame.add.button.withArgs(-8, 240, "pipOnImage"));
            sinon.assert.calledTwice(mockGame.add.button.withArgs(23, 240, "pipOffImage"));
        });

        it("highlights the third pip when the third pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip3Callback = mockGame.add.button.getCall(2).args[3];
            pip3Callback();
            sinon.assert.calledWith(mockPipsGroup.callAll, "kill");
            sinon.assert.calledWith(mockPipsGroup.callAll, "destroy");
            assert.isTrue(mockGame.add.button.withArgs(-39, 240, "pipOffImage").calledOnce);
            assert.isTrue(mockGame.add.button.withArgs(-8, 240, "pipOffImage").calledTwice);
            assert.isTrue(mockGame.add.button.withArgs(23, 240, "pipOnImage").calledOnce);
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

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
                assert.isTrue(mockTitle.destroy.calledOnce);
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

            it("destroys the pips group", () => {
                const destroy = signalSpy.getCall(0).args[0].callback;
                destroy();
                sinon.assert.calledWith(mockPipsGroup.callAll, "kill");
                sinon.assert.calledWith(mockPipsGroup.callAll, "destroy");
            });
        });

        describe("previous button", () => {
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

            it("destroys the existing pips", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                sinon.assert.calledWith(mockPipsGroup.callAll, "kill");
                sinon.assert.calledWith(mockPipsGroup.callAll, "destroy");
            });

            it("creates new pips buttons", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                assert.isTrue(mockGame.add.button.withArgs(-39, 240, "pipOffImage").calledOnce);
                assert.isTrue(mockGame.add.button.withArgs(-8, 240, "pipOnImage").calledOnce);
                assert.isTrue(mockGame.add.button.withArgs(23, 240, "pipOffImage").calledTwice);
            });

            it("creates a new pips group", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                assert.isTrue(mockScreen.scene.addToBackground.withArgs(mockPipsGroup).calledTwice);
            });
        });
    });
});
