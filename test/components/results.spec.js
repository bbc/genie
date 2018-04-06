import { assert } from "chai";
import * as sinon from "sinon";

import { Results } from "../../src/components/results";
import * as Pause from "../../src/components/pause";
import * as signal from "../../src/core/signal-bus.js";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";

describe("Results Screen", () => {
    let resultsScreen;
    let layoutHarnessSpy;
    let mockGame;
    let mockContext;
    let addToBackgroundSpy;
    let addLayoutSpy;
    let gameImageStub;
    let gameButtonSpy;
    let gameTextStub;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        addLayoutSpy = sandbox.spy();
        gameImageStub = sandbox.stub();
        gameImageStub.onCall(0).returns("background");
        gameButtonSpy = sandbox.spy();
        gameTextStub = sandbox.stub();

        mockGame = {
            add: {
                image: gameImageStub,
                button: gameButtonSpy,
                text: gameTextStub,
            },
            state: {
                current: "resultsScreen",
            },
        };

        mockContext = {
            config: {
                theme: {
                    resultsScreen: {
                        titleText: {
                            content: "Results",
                            style: { font: "bold 42px Arial" },
                        },
                        resultText: {
                            style: { font: "36px Arial" },
                        },
                    },
                },
            },
            qaMode: { active: false },
            inState: {
                transient: {
                    resultsData: 22,
                },
            },
        };

        resultsScreen = new Results();
        resultsScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
            keyLookups: {
                resultsScreen: {
                    background: "backgroundImage",
                },
            },
        };
        resultsScreen.game = mockGame;
        resultsScreen.context = mockContext;
        resultsScreen.preload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("adds current game state to the layout key lookups", () => {
            const expectedKeylookups = resultsScreen.layoutFactory.keyLookups.resultsScreen;
            assert.deepEqual(resultsScreen.keyLookup, expectedKeylookups);
        });

        it("adds a key lookup to the current screen", () => {
            assert.exists(resultsScreen.keyLookup);
        });
    });

    describe("create method", () => {
        beforeEach(() => resultsScreen.create());

        it("adds a background image", () => {
            const actualImageCall = gameImageStub.getCall(0);
            const expectedImageCall = [0, 0, "backgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["background"]);
        });

        it("creates a title", () => {
            const actualTextCall = gameTextStub.getCall(0);
            const expectedTextCall = [0, -150, "Results", { font: "bold 42px Arial" }];
            assert.deepEqual(
                actualTextCall.args,
                expectedTextCall,
                "game.add.text should have been called with arguments " + expectedTextCall,
            );
        });

        it("loads the game results", () => {
            const actualTextCall = gameTextStub.getCall(1);
            const expectedResultsData = 22;
            const expectedTextCall = [0, -50, expectedResultsData, { font: "36px Arial" }];
            assert.deepEqual(
                actualTextCall.args,
                expectedTextCall,
                "game.add.text should have been called with " + expectedTextCall,
            );
        });

        it("adds GEL buttons to layout", () => {
            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["pause", "restart", "continue"];
            assert.deepEqual(actualButtons, expectedButtons);
        });

        it("creates a layout harness with correct params", () => {
            const actualParams = layoutHarnessSpy.getCall(0).args;
            const expectedParams = [mockGame, mockContext, resultsScreen.layoutFactory];
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            assert.deepEqual(actualParams, expectedParams);
        });
    });

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            resultsScreen.create();
            resultsScreen.next = sandbox.spy();
        });

        it("adds a signal subscription to the continue button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "GEL-continue");
        });

        it("adds a callback for the continue button", () => {
            signalSubscribeSpy.getCall(0).args[0].callback();
            assert(resultsScreen.next.callCount === 1, "next function should have been called once");
        });

        it("adds a signal subscription to the restart button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(1).args[0].name, "GEL-restart");
        });

        it("adds a callback for the restart button", () => {
            signalSubscribeSpy.getCall(1).args[0].callback();
            assert(resultsScreen.next.callCount === 1, "next function should have been called once");
            sinon.assert.calledWith(resultsScreen.next, { transient: { game: true } });
        });

        it("adds a signal subscription to the pause button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(2).args[0].name, "GEL-pause");
        });

        it("adds a callback for the pause button", () => {
            const pauseCreateStub = sandbox.stub(Pause, "create");
            signalSubscribeSpy.getCall(2).args[0].callback();
            assert(pauseCreateStub.callCount === 1, "Pause.create function should have been called once");
            sinon.assert.calledWith(pauseCreateStub, mockGame, resultsScreen);
        });
    });
});
