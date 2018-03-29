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
    let gameImageSpy;
    let gameButtonSpy;
    let gameSpriteSpy;
    let addLayoutSpy;

    const sandbox = sinon.sandbox.create();
    const dangerMouseSprite = { visible: "" };
    const dangerMouseNameSprite = { visible: "" };
    const barneySprite = { visible: "" };
    const barneyNameSprite = { visible: "" };
    const jamillahSprite = { visible: "" };
    const jamillahNameSprite = { visible: "" };
    const CENTER_X = 0;
    const CHAR_Y_POSITION = -30;
    const CHAR_TEXT_Y_POSITION = 170;

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        gameImageSpy = sandbox.stub().returns("sprite");
        gameImageSpy.onCall(0).returns("background");
        gameButtonSpy = sandbox.spy();
        gameSpriteSpy = sandbox.stub();
        gameSpriteSpy.withArgs(CENTER_X, CHAR_Y_POSITION, "dangermouse").returns(dangerMouseSprite);
        gameSpriteSpy.withArgs(CENTER_X, CHAR_TEXT_Y_POSITION, "dangermouseName").returns(dangerMouseNameSprite);
        gameSpriteSpy.withArgs(CENTER_X, CHAR_Y_POSITION, "barney").returns(barneySprite);
        gameSpriteSpy.withArgs(CENTER_X, CHAR_TEXT_Y_POSITION, "barneyName").returns(barneyNameSprite);
        gameSpriteSpy.withArgs(CENTER_X, CHAR_Y_POSITION, "jamillah").returns(jamillahSprite);
        gameSpriteSpy.withArgs(CENTER_X, CHAR_TEXT_Y_POSITION, "jamillahName").returns(jamillahNameSprite);
        addLayoutSpy = sandbox.spy();

        mockGame = {
            add: {
                image: gameImageSpy,
                button: gameButtonSpy,
                sprite: gameSpriteSpy,
            },
            state: { current: "characterSelect" },
        };

        mockContext = {
            config: {
                theme: {
                    characterSelect: {
                        choices: [
                            { main: "dangermouse", name: "dangermouseName" },
                            { main: "barney", name: "barneyName" },
                            { main: "jamillah", name: "jamillahName" },
                        ],
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
                    background: "backgroundImage",
                    dangermouse: "dangermouse",
                    dangermouseName: "dangermouseName",
                    barney: "barney",
                    barneyName: "barneyName",
                    jamillah: "jamillah",
                    jamillahName: "jamillahName",
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
            const actualImageCall = gameImageSpy.getCall(0);
            const expectedImageCall = [0, 0, "backgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["background"]);
        });

        it("adds GEL buttons to layout", () => {
            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["exit", "audioOff", "pause", "previous", "next", "continue"];
            assert.deepEqual(actualButtons, expectedButtons);
        });

        it("creates a layout harness with correct params", () => {
            const actualParams = layoutHarnessSpy.getCall(0).args;
            const expectedParams = [mockGame, mockContext, selectScreen.layoutFactory];
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            assert.deepEqual(actualParams, expectedParams);
        });

        it("creates sprites for each choice", () => {
            assert(gameSpriteSpy.callCount === 6, "game sprites should be added 6 times");
            assert.deepEqual(gameSpriteSpy.getCall(0).args, [0, -30, "dangermouse"]);
            assert.deepEqual(gameSpriteSpy.getCall(1).args, [0, 170, "dangermouseName"]);
            assert.deepEqual(gameSpriteSpy.getCall(2).args, [0, -30, "barney"]);
            assert.deepEqual(gameSpriteSpy.getCall(3).args, [0, 170, "barneyName"]);
            assert.deepEqual(gameSpriteSpy.getCall(4).args, [0, -30, "jamillah"]);
            assert.deepEqual(gameSpriteSpy.getCall(5).args, [0, 170, "jamillahName"]);
        });

        it("adds each sprite to the background", () => {
            assert.deepEqual(addToBackgroundSpy.getCall(1).args, [dangerMouseSprite]);
            assert.deepEqual(addToBackgroundSpy.getCall(2).args, [dangerMouseNameSprite]);
            assert.deepEqual(addToBackgroundSpy.getCall(3).args, [barneySprite]);
            assert.deepEqual(addToBackgroundSpy.getCall(4).args, [barneyNameSprite]);
            assert.deepEqual(addToBackgroundSpy.getCall(5).args, [jamillahSprite]);
            assert.deepEqual(addToBackgroundSpy.getCall(6).args, [jamillahNameSprite]);
        });

        it("adds the choices", () => {
            const expectedChoices = [
                { main: dangerMouseSprite, name: dangerMouseNameSprite },
                { main: barneySprite, name: barneyNameSprite },
                { main: jamillahSprite, name: jamillahNameSprite },
            ];
            assert.deepEqual(selectScreen.choice, expectedChoices);
        });
    });

    describe("signals", () => {
        let signalSpy;
        let nextSpy;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "subscribe");
            selectScreen.create();
            selectScreen.next = sandbox.spy();
        });

        it("adds signal subscriptions to all the buttons", () => {
            assert(signalSpy.callCount === 4, "signals should be subscribed 4 times");
            assert.deepEqual(signalSpy.getCall(0).args[0].name, "GEL-exit");
            assert.deepEqual(signalSpy.getCall(1).args[0].name, "GEL-previous");
            assert.deepEqual(signalSpy.getCall(2).args[0].name, "GEL-next");
            assert.deepEqual(signalSpy.getCall(3).args[0].name, "GEL-continue");
        });

        it("adds a callback for the exit button", () => {
            signalSpy.getCall(0).args[0].callback();
            assert.deepEqual(selectScreen.next.getCall(0).args[0], { transient: { home: true } });
        });

        it("adds a callback for the continue button", () => {
            const expectedCurrentIndex = 1;
            const expectedNextObjext = { transient: { characterSelect: expectedCurrentIndex } };
            selectScreen.currentIndex = expectedCurrentIndex;
            signalSpy.getCall(3).args[0].callback();
            assert.deepEqual(selectScreen.next.getCall(0).args[0], expectedNextObjext);
        });

        describe("previous button", () => {
            it("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 1;
                signalSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 3, "previous button should move to the last item");
            });

            it("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSpy.getCall(1).args[0].callback();
                assert(selectScreen.currentIndex === 1, "previous button should move to the previous item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signalSpy.getCall(1).args[0].callback();

                assert(selectScreen.choice[0].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[0].name.visible === false, "choice should be hidden");
                assert(selectScreen.choice[1].main.visible === true, "choice should be showing");
                assert(selectScreen.choice[1].name.visible === true, "choice should be showing");
                assert(selectScreen.choice[2].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[2].name.visible === false, "choice should be hidden");
            });
        });

        describe("next button", () => {
            it("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signalSpy.getCall(2).args[0].callback();
                assert(selectScreen.currentIndex === 1, "next button should move to the first item");
            });

            it("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signalSpy.getCall(2).args[0].callback();
                assert(selectScreen.currentIndex === 3, "next button should move to the next item");
            });

            it("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signalSpy.getCall(2).args[0].callback();
                assert(selectScreen.choice[0].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[0].name.visible === false, "choice should be hidden");
                assert(selectScreen.choice[1].main.visible === true, "choice should be showing");
                assert(selectScreen.choice[1].name.visible === true, "choice should be showing");
                assert(selectScreen.choice[2].main.visible === false, "choice should be hidden");
                assert(selectScreen.choice[2].name.visible === false, "choice should be hidden");
            });
        });
    });
});
