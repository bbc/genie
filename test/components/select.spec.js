import { assert } from "chai";
import * as sinon from "sinon";

import { Select } from "../../src/components/select";
import * as signal from "../../src/core/signal-bus.js";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";

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

    const sandbox = sinon.sandbox.create();
    const characterOneSprite = { visible: "" };
    const characterTwoSprite = { visible: "" };
    const characterThreeSprite = { visible: "" };
    const CENTER_X = 0;
    const CHAR_Y_POSITION = 0;
    const CHAR_TEXT_Y_POSITION = 170;

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        gameImageStub = sandbox.stub().returns("sprite");
        gameImageStub.onCall(0).returns("background");
        gameImageStub.onCall(1).returns("title");
        gameButtonSpy = sandbox.spy();
        gameSpriteStub = sandbox.stub();
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "character1").returns(characterOneSprite);
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "character2").returns(characterTwoSprite);
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "character3").returns(characterThreeSprite);
        addLayoutSpy = sandbox.spy();

        mockGame = {
            add: {
                image: gameImageStub,
                button: gameButtonSpy,
                sprite: gameSpriteStub,
            },
            state: { current: "characterSelect" },
        };

        mockContext = {
            config: {
                theme: {
                    characterSelect: {
                        choices: [{ main: "character1" }, { main: "character2" }, { main: "character3" }],
                    },
                },
            },
            qaMode: { active: false },
        };

        selectScreen = new Select();
        selectScreen.scene = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
            keyLookups: {
                characterSelect: {
                    title: "titleImage",
                    background: "backgroundImage",
                    character1: "character1",
                    character2: "character2",
                    character3: "character3",
                },
            },
        };
        selectScreen.game = mockGame;
        selectScreen.context = mockContext;
        selectScreen.preload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("adds current game state to the layout key lookups", () => {
            const expectedLookups = selectScreen.scene.keyLookups.characterSelect;
            assert.deepEqual(selectScreen.keyLookup, expectedLookups);
        });
    });

    describe("create method", () => {
        beforeEach(() => selectScreen.create());

        it("adds a background image", () => {
            sinon.assert.calledWith(gameImageStub, 0, 0, "backgroundImage");
            sinon.assert.calledWith(addToBackgroundSpy, "background");
        });

        it("adds a title image", () => {
            sinon.assert.calledWith(gameImageStub, 0, -150, "titleImage");
            sinon.assert.calledWith(addToBackgroundSpy, "title");
        });

        it("adds GEL buttons to layout", () => {
            sinon.assert.calledWith(addLayoutSpy, ["home", "audioOff", "pause", "previous", "next", "continue"]);
        });

        it("creates a layout harness with correct params", () => {
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            sinon.assert.calledWith(layoutHarnessSpy, mockGame, mockContext, selectScreen.scene);
        });

        it("creates sprites for each choice", () => {
            assert(gameSpriteStub.callCount === 3, "game sprites should be added 3 times");
            assert.deepEqual(gameSpriteStub.getCall(0).args, [0, 0, "character1"]);
            assert.deepEqual(gameSpriteStub.getCall(1).args, [0, 0, "character2"]);
            assert.deepEqual(gameSpriteStub.getCall(2).args, [0, 0, "character3"]);
        });

        it("adds each sprite to the background", () => {
            sinon.assert.calledWith(addToBackgroundSpy, characterOneSprite);
            sinon.assert.calledWith(addToBackgroundSpy, characterTwoSprite);
            sinon.assert.calledWith(addToBackgroundSpy, characterThreeSprite);
        });

        it("adds the choices", () => {
            const expectedChoices = [
                { main: characterOneSprite },
                { main: characterTwoSprite },
                { main: characterThreeSprite },
            ];
            assert.deepEqual(selectScreen.choice, expectedChoices);
        });
    });

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            selectScreen.create();
            selectScreen.next = sandbox.spy();
        });

        it("adds signal subscriptions to all the buttons", () => {
            assert(signalSubscribeSpy.callCount === 4, "signals should be subscribed 4 times");
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: "gel-buttons",
                name: "exit",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: "gel-buttons",
                name: "previous",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: "gel-buttons",
                name: "next",
                callback: sinon.match.func,
            });
            sinon.assert.calledWith(signalSubscribeSpy, {
                channel: "gel-buttons",
                name: "continue",
                callback: sinon.match.func,
            });
        });

        it("adds a callback for the exit button", () => {
            signalSubscribeSpy.getCall(0).args[0].callback();
            assert.deepEqual(selectScreen.next.getCall(0).args[0], { transient: { home: true } });
        });

        it("adds a callback for the continue button", () => {
            const expectedCurrentIndex = 1;
            const expectedNextObjext = { transient: { characterSelect: expectedCurrentIndex } };
            selectScreen.currentIndex = expectedCurrentIndex;
            signalSubscribeSpy.getCall(3).args[0].callback();
            assert.deepEqual(selectScreen.next.getCall(0).args[0], expectedNextObjext);
        });

        describe("previous button", () => {
            it("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 3, "previous button should move to the last item");
            });

            it("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 1, "previous button should move to the previous item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(1).args[0].callback();

                assert(selectScreen.choice[0].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[1].main.visible === true, "choice should be showing");
                assert(selectScreen.choice[2].main.visible === false, "choice should be hidden");
            });
        });

        describe("next button", () => {
            it("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signalSubscribeSpy.getCall(2).args[0].callback();
                assert(selectScreen.currentIndex === 1, "next button should move to the first item");
            });

            it("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSubscribeSpy.getCall(2).args[0].callback();
                assert(selectScreen.currentIndex === 3, "next button should move to the next item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signalSubscribeSpy.getCall(2).args[0].callback();
                assert(selectScreen.choice[0].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[1].main.visible === true, "choice should be showing");
                assert(selectScreen.choice[2].main.visible === false, "choice should be hidden");
            });
        });
    });
});
