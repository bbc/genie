import { assert } from "chai";
import * as sinon from "sinon";

import { Results } from "../../src/components/results";
import * as Pause from "../../src/components/overlays/pause";
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
    let navigationNext;
    let navigationGame;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        addLayoutSpy = sandbox.spy();
        gameImageStub = sandbox.stub();
        gameImageStub.onCall(0).returns("background");
        gameImageStub.onCall(1).returns("title");
        gameButtonSpy = sandbox.spy();
        gameTextStub = sandbox.stub();
        navigationNext = sandbox.stub();
        navigationGame = sandbox.stub();

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
                        resultText: {
                            style: { font: "36px Arial" },
                        },
                    },
                },
            },
            qaMode: { active: false },
        };

        resultsScreen = new Results();
        resultsScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
            keyLookups: {
                resultsScreen: {
                    background: "backgroundImage",
                    title: "titleImage",
                },
            },
        };
        resultsScreen.game = mockGame;
        resultsScreen.context = mockContext;
        resultsScreen.transientData = {
            results: 22,
            characterSelected: 1,
        };
        resultsScreen.preload();
        resultsScreen.navigation = {
            next: navigationNext,
            game: navigationGame,
        };
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

        it("adds a title image", () => {
            const actualImageCall = gameImageStub.getCall(1);
            const expectedImageCall = [0, -150, "titleImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(1);
            assert.deepEqual(addToBackgroundCall.args, ["title"]);
        });

        it("loads the game results", () => {
            const actualTextCall = gameTextStub.getCall(0);
            const expectedResultsData = 22;
            const expectedTextCall = [0, 50, expectedResultsData, { font: "36px Arial" }];
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
        });

        it("adds a signal subscription to the continue button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "continue");
        });

        it("adds a callback for the continue button", () => {
            signalSubscribeSpy.getCall(0).args[0].callback();
            assert(resultsScreen.navigation.next.callCount === 1, "next function should have been called once");
        });

        it("adds a signal subscription to the restart button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(1).args[0].name, "restart");
        });

        it("adds a callback for the restart button", () => {
            signalSubscribeSpy.getCall(1).args[0].callback();
            assert(resultsScreen.navigation.game.callCount === 1, "next function should have been called once");
            sinon.assert.calledWith(resultsScreen.navigation.game, { characterSelected: 1, results: 22 });
        });
    });
});
