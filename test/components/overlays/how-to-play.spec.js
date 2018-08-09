import { assert } from "chai";
import * as sinon from "sinon";
import * as HowToPlay from "../../../src/components/overlays/how-to-play";
import * as Button from "../../fake/button.js";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("How To Play Overlay", () => {
    let mockGame;
    let mockScreen;
    let signalSpy;
    let mockTitle;
    let mockGelButtons;
    let mockBackground;
    let mockOverlayLayout;
    let mockPipsGroup;
    let mountPoint;

    const sandbox = sinon.createSandbox();
    const panel1Sprite = { visible: "", destroy: sandbox.spy(), events: { onDestroy: { add: () => {} } } };
    const panel2Sprite = { visible: "", destroy: sandbox.spy() };
    const panel3Sprite = { visible: "", destroy: sandbox.spy() };

    beforeEach(() => {
        mountPoint = document.createElement("div");
        document.body.appendChild(mountPoint);

        let nextEl = document.createElement("div");
        nextEl.id = "how-to-play__next";
        let prevEl = document.createElement("div");
        prevEl.id = "how-to-play__previous";

        mountPoint.appendChild(nextEl);
        mountPoint.appendChild(prevEl);

        signalSpy = sandbox.spy(signal.bus, "subscribe");
        mockBackground = { destroy: sandbox.spy() };
        mockOverlayLayout = {
            addBackground: sandbox.stub().returns(mockBackground),
            disableExistingButtons: sandbox.spy(),
            moveGelButtonsToTop: sandbox.spy(),
            moveToTop: sandbox.spy(),
        };
        sandbox.stub(OverlayLayout, "create").returns(mockOverlayLayout);

        mockGelButtons = {
            buttons: { howToPlayPrevious: Button.Stub(), howToPlayNext: Button.Stub() },
            destroy: sandbox.spy(),
        };

        mockTitle = { destroy: sandbox.spy() };
        mockScreen = {
            visibleLayer: "how-to-play",
            scene: {
                addLayout: sandbox.stub().returns(mockGelButtons),
                addToBackground: sandbox.stub(),
                removeLast: sandbox.stub(),
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
            overlayClosed: {
                dispatch: sandbox.stub(),
            },
        };

        mockScreen.scene.addToBackground.withArgs(mockTitle).returns(mockTitle);

        mockPipsGroup = { add: sandbox.spy(), callAll: sandbox.spy() };
        mockGame = {
            add: {
                image: sandbox.stub(),
                sprite: sandbox.stub(),
                button: sandbox.stub(),
                group: sandbox.stub().returns(mockPipsGroup),
            },
            state: { current: "howToPlay", states: { howToPlay: mockScreen } },
            canvas: {
                focus: sandbox.spy(),
                parentElement: { appendChild: () => {}, insertBefore: () => {} },
                setAttribute: () => {},
            },
        };
        mockGame.add.image.withArgs(0, 0, "howToPlay.background").returns("background");
        mockGame.add.image.withArgs(0, -230, "howToPlay.title").returns(mockTitle);
        mockGame.add.sprite.withArgs(0, 30, "howToPlay.panel1").returns(panel1Sprite);
        mockGame.add.sprite.withArgs(0, 30, "howToPlay.panel2").returns(panel2Sprite);
        mockGame.add.sprite.withArgs(0, 30, "howToPlay.panel3").returns(panel3Sprite);
    });

    afterEach(() => {
        sandbox.restore();
        mountPoint.remove();
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
            sinon.assert.calledWith(mockGame.add.image, 0, 0, "howToPlay.background");
        });

        it("creates a title and adds it to the background", () => {
            sinon.assert.calledWith(mockGame.add.image, 0, -230, "howToPlay.title");
        });

        it("adds GEL buttons", () => {
            const actualAddLayoutCall = mockScreen.scene.addLayout.getCall(0);
            const expectedAddLayoutCall = ["howToPlayBack", "audio", "settings", "howToPlayPrevious", "howToPlayNext"];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });
    });

    describe("panels", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

        it("creates sprites for each panel", () => {
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "howToPlay.panel1");
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "howToPlay.panel2");
            sinon.assert.calledWith(mockGame.add.sprite, 0, 30, "howToPlay.panel3");
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
            sinon.assert.calledWith(mockGame.add.button, -39, 240, "howToPlay.pipOn");
            sinon.assert.calledWith(mockGame.add.button, -8, 240, "howToPlay.pipOff");
            sinon.assert.calledWith(mockGame.add.button, 23, 240, "howToPlay.pipOff");
        });

        it("adds the pips group to the background", () => {
            HowToPlay.create({ game: mockGame });
            sinon.assert.calledOnce(mockScreen.scene.addToBackground.withArgs(mockPipsGroup));
        });

        it("shows the first panel when the first pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip1Callback = mockGame.add.button.getCall(0).args[3];
            pip1Callback();
            assert.isTrue(panel1Sprite.visible);
            assert.isFalse(panel2Sprite.visible);
            assert.isFalse(panel3Sprite.visible);
        });

        it("does not redraw the pips when the selected pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip1Callback = mockGame.add.button.getCall(0).args[3];
            pip1Callback();
            sinon.assert.notCalled(mockPipsGroup.callAll);
            assert.isTrue(mockGame.add.button.withArgs(-39, 240, "howToPlay.pipOn").calledOnce);
            assert.isTrue(mockGame.add.button.withArgs(-8, 240, "howToPlay.pipOff").calledOnce);
            assert.isTrue(mockGame.add.button.withArgs(23, 240, "howToPlay.pipOff").calledOnce);
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
                assert.isTrue(mockBackground.destroy.calledOnce);
                assert.isTrue(mockTitle.destroy.calledOnce);
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

            it("dispatches overlayClosed signal on screen", () => {
                const destroy = signalSpy.getCall(0).args[0].callback;
                destroy();
                sandbox.assert.calledOnce(mockScreen.overlayClosed.dispatch);
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

            it("destroys the existing pips", () => {
                const previousButtonClick = signalSpy.getCall(1).args[0].callback;
                previousButtonClick();
                sinon.assert.calledWith(mockPipsGroup.callAll, "kill");
                sinon.assert.calledWith(mockPipsGroup.callAll, "destroy");
            });

            it("creates a new pips group", () => {
                const previousButtonClick = signalSpy.getCall(1).args[0].callback;
                previousButtonClick();
                assert.isTrue(mockScreen.scene.addToBackground.withArgs(mockPipsGroup).calledTwice);
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

            it("creates a new pips group", () => {
                const nextButtonClick = signalSpy.getCall(2).args[0].callback;
                nextButtonClick();
                assert.isTrue(mockScreen.scene.addToBackground.withArgs(mockPipsGroup).calledTwice);
            });
        });
    });
});
