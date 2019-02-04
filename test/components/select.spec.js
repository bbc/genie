/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import { Select } from "../../src/components/select";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";
import * as accessibleCarouselElements from "../../src/core/accessibility/accessible-carousel-elements.js";

describe("Select Screen", () => {
    let selectScreen;
    let layoutHarnessSpy;
    let mockGame;
    let mockContext;
    let addToBackgroundSpy;
    let gameImageStub;
    let gameButtonSpy;
    let gameSpriteStub;
    let addLayoutSpy;
    let navigationNext;
    let navigationHome;

    const sandbox = sinon.createSandbox();
    const characterOneSprite = { visible: "" };
    const characterTwoSprite = { visible: "" };
    const characterThreeSprite = { visible: "" };

    beforeEach(() => {
        sandbox
            .stub(accessibleCarouselElements, "create")
            .returns([document.createElement("div"), document.createElement("div"), document.createElement("div")]);
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        gameImageStub = sandbox.stub().returns("sprite");
        gameImageStub.onCall(0).returns("background");
        gameImageStub.onCall(1).returns("title");
        gameButtonSpy = sandbox.spy();
        gameSpriteStub = sandbox.stub();
        gameSpriteStub.withArgs(0, 0, "characterSelect.character1").returns(characterOneSprite);
        gameSpriteStub.withArgs(0, 0, "characterSelect.character2").returns(characterTwoSprite);
        gameSpriteStub.withArgs(0, 0, "characterSelect.character3").returns(characterThreeSprite);
        addLayoutSpy = sandbox.spy();
        navigationNext = sandbox.spy();
        navigationHome = sandbox.spy();

        mockGame = {
            add: {
                image: gameImageStub,
                button: gameButtonSpy,
                sprite: gameSpriteStub,
            },
            state: { current: "characterSelect" },
            canvas: { parentElement: {} },
        };

        mockContext = {
            config: {
                theme: {
                    characterSelect: {
                        choices: [{ asset: "character1" }, { asset: "character2" }, { asset: "character3" }],
                    },
                    game: {},
                },
            },
            qaMode: { active: false },
            popupScreens: [],
        };

        selectScreen = new Select();
        selectScreen.scene = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
        };

        selectScreen.game = mockGame;
        selectScreen.context = mockContext;
        selectScreen.preload();
        selectScreen.navigation = {
            next: navigationNext,
            home: navigationHome,
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("create method", () => {
        beforeEach(() => selectScreen.create());

        it("adds a background image", () => {
            sinon.assert.calledWith(gameImageStub, 0, 0, "characterSelect.background");
            sinon.assert.calledWith(addToBackgroundSpy, "background");
        });

        it("adds a title image", () => {
            sinon.assert.calledWith(gameImageStub, 0, -150, "characterSelect.title");
            sinon.assert.calledWith(addToBackgroundSpy, "title");
        });

        it("adds GEL buttons to layout", () => {
            sinon.assert.calledWith(addLayoutSpy, ["home", "audio", "pauseNoReplay", "previous", "next", "continue"]);
        });

        it("creates a layout harness with correct params", () => {
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            sinon.assert.calledWith(layoutHarnessSpy, mockGame, mockContext, selectScreen.scene);
        });

        it("creates sprites for each choice", () => {
            assert(gameSpriteStub.callCount === 3, "game sprites should be added 3 times");
            assert.deepEqual(gameSpriteStub.getCall(0).args, [0, 0, "characterSelect.character1"]);
            assert.deepEqual(gameSpriteStub.getCall(1).args, [0, 0, "characterSelect.character2"]);
            assert.deepEqual(gameSpriteStub.getCall(2).args, [0, 0, "characterSelect.character3"]);
        });

        it("adds each sprite to the background", () => {
            sinon.assert.calledWith(addToBackgroundSpy, characterOneSprite);
            sinon.assert.calledWith(addToBackgroundSpy, characterTwoSprite);
            sinon.assert.calledWith(addToBackgroundSpy, characterThreeSprite);
        });

        it("adds the choices", () => {
            const expectedChoices = [characterOneSprite, characterTwoSprite, characterThreeSprite];
            assert.deepEqual(selectScreen.choiceSprites, expectedChoices);
        });

        it("creates an accessible carousel for the choices", () => {
            const actualParams = accessibleCarouselElements.create.getCall(0).args;
            sinon.assert.calledOnce(accessibleCarouselElements.create);

            assert.deepEqual(actualParams, [
                "characterSelect",
                selectScreen.choiceSprites,
                mockGame.canvas.parentElement,
                mockContext.config.theme.characterSelect.choices,
            ]);
        });
    });

    /*
    // TODO the following line should be added back once the overlap issue is resolved NT:04:02:19
    describe("achievements button", () => {
        it("adds the achievement button when theme flag is set", () => {
            selectScreen.context.config.theme.game.achievements = true;
            selectScreen.create();

            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["home", "audio", "pauseNoReplay", "previous", "next", "continue", "achievements"];
            assert.deepEqual(actualButtons, expectedButtons);
        });
    });
    */

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            selectScreen.create();
        });

        it("adds signal subscriptions to all the buttons", () => {
            assert(signalSubscribeSpy.callCount === 5, "signals should be subscribed 5 times");
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: buttonsChannel,
                name: "previous",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: buttonsChannel,
                name: "next",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: buttonsChannel,
                name: "continue",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: buttonsChannel,
                name: "pause",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: buttonsChannel,
                name: "play",
                callback: sinon.match.func,
            });
        });

        it("moves to the next game screen when the continue button is pressed", () => {
            selectScreen.currentIndex = 1;
            signalSubscribeSpy.getCall(2).args[0].callback();
            sinon.assert.calledOnce(selectScreen.navigation.next.withArgs({ characterSelected: 1 }));
        });

        it("hides all the accessible elements when the pause button is pressed", () => {
            selectScreen.currentIndex = 1;
            signalSubscribeSpy.getCall(3).args[0].callback();

            assert.equal(selectScreen.accessibleElements.length, 3);
            assert.equal(selectScreen.accessibleElements[0].getAttribute("aria-hidden"), "true");
            assert.equal(selectScreen.accessibleElements[1].getAttribute("aria-hidden"), "true");
            assert.equal(selectScreen.accessibleElements[2].getAttribute("aria-hidden"), "true");
        });

        it("shows the current accessible element when the game is unpaused (by pressing play)", () => {
            selectScreen.currentIndex = 3;
            signalSubscribeSpy.getCall(3).args[0].callback(); //pauses
            signalSubscribeSpy.getCall(4).args[0].callback(); //unpauses

            assert.equal(selectScreen.accessibleElements[0].getAttribute("aria-hidden"), "true");
            assert.equal(selectScreen.accessibleElements[1].getAttribute("aria-hidden"), "true");
            assert.equal(selectScreen.accessibleElements[2].getAttribute("aria-hidden"), "false");
        });

        describe("previous button", () => {
            it("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(0).args[0].callback();
                assert(selectScreen.currentIndex === 3, "previous button should move to the last item");
            });

            it("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSubscribeSpy.getCall(0).args[0].callback();
                assert(selectScreen.currentIndex === 1, "previous button should move to the previous item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(0).args[0].callback();

                assert(selectScreen.choiceSprites[0].visible === false, "choice should be hidden");
                assert(selectScreen.choiceSprites[1].visible === true, "choice should be showing");
                assert(selectScreen.choiceSprites[2].visible === false, "choice should be hidden");
            });

            it("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(0).args[0].callback();

                assert.equal(selectScreen.accessibleElements[0].getAttribute("aria-hidden"), "true");
                assert.equal(selectScreen.accessibleElements[1].getAttribute("aria-hidden"), "false");
                assert.equal(selectScreen.accessibleElements[2].getAttribute("aria-hidden"), "true");
            });

            it("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(0).args[0].callback();

                assert.equal(selectScreen.accessibleElements[0].style.display, "none");
                assert.equal(selectScreen.accessibleElements[1].style.display, "block");
                assert.equal(selectScreen.accessibleElements[2].style.display, "none");
            });
        });

        describe("next button", () => {
            it("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 1, "next button should move to the first item");
            });

            it("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 3, "next button should move to the next item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(selectScreen.choiceSprites[0].visible === false, "choice should be hidden");
                assert(selectScreen.choiceSprites[1].visible === true, "choice should be showing");
                assert(selectScreen.choiceSprites[2].visible === false, "choice should be hidden");
            });

            it("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(1).args[0].callback();

                assert.equal(selectScreen.accessibleElements[0].getAttribute("aria-hidden"), "true");
                assert.equal(selectScreen.accessibleElements[1].getAttribute("aria-hidden"), "false");
                assert.equal(selectScreen.accessibleElements[2].getAttribute("aria-hidden"), "true");
            });

            it("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(1).args[0].callback();

                assert.equal(selectScreen.accessibleElements[0].style.display, "none");
                assert.equal(selectScreen.accessibleElements[1].style.display, "block");
                assert.equal(selectScreen.accessibleElements[2].style.display, "none");
            });
        });
    });
});
