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
    const dangerMouseSprite = { visible: "" };
    const barneySprite = { visible: "" };
    const jamillahSprite = { visible: "" };
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
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "dangermouse").returns(dangerMouseSprite);
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "barney").returns(barneySprite);
        gameSpriteStub.withArgs(CENTER_X, CHAR_Y_POSITION, "jamillah").returns(jamillahSprite);
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
                        choices: [{ main: "dangermouse" }, { main: "barney" }, { main: "jamillah" }],
                    },
                },
            },
            qaMode: { active: false },
        };

        selectScreen = new Select();
        selectScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
            keyLookups: {
                characterSelect: {
                    title: "titleImage",
                    background: "backgroundImage",
                    dangermouse: "dangermouse",
                    barney: "barney",
                    jamillah: "jamillah",
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
            const expectedLookups = selectScreen.layoutFactory.keyLookups.characterSelect;
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
            sinon.assert.calledWith(layoutHarnessSpy, mockGame, mockContext, selectScreen.layoutFactory);
        });

        it("creates sprites for each choice", () => {
            assert(gameSpriteStub.callCount === 3, "game sprites should be added 3 times");
            assert.deepEqual(gameSpriteStub.getCall(0).args, [0, 0, "dangermouse"]);
            assert.deepEqual(gameSpriteStub.getCall(1).args, [0, 0, "barney"]);
            assert.deepEqual(gameSpriteStub.getCall(2).args, [0, 0, "jamillah"]);
        });

        it("adds each sprite to the background", () => {
            sinon.assert.calledWith(addToBackgroundSpy, dangerMouseSprite);
            sinon.assert.calledWith(addToBackgroundSpy, barneySprite);
            sinon.assert.calledWith(addToBackgroundSpy, jamillahSprite);
        });

        it("adds the choices", () => {
            const expectedChoices = [{ main: dangerMouseSprite }, { main: barneySprite }, { main: jamillahSprite }];
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
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].channel, "gel-buttons");
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "exit");
            assert.deepEqual(signalSubscribeSpy.getCall(1).args[0].channel, "gel-buttons");
            assert.deepEqual(signalSubscribeSpy.getCall(1).args[0].name, "previous");
            assert.deepEqual(signalSubscribeSpy.getCall(2).args[0].channel, "gel-buttons");
            assert.deepEqual(signalSubscribeSpy.getCall(2).args[0].name, "next");
            assert.deepEqual(signalSubscribeSpy.getCall(3).args[0].channel, "gel-buttons");
            assert.deepEqual(signalSubscribeSpy.getCall(3).args[0].name, "continue");
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
