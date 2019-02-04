/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import { Results } from "../../src/components/results";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Results Screen", () => {
    let resultsScreen;
    let mockGame;
    let mockContext;
    let addToBackgroundSpy;
    let addLayoutSpy;
    let gameImageStub;
    let gameButtonSpy;
    let gameTextStub;
    let navigationNext;
    let navigationGame;

    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(gmiModule, "sendStats");
        sandbox.spy(layoutHarness, "createTestHarnessDisplay");
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
                            style: { font: "36px ReithSans" },
                        },
                    },
                    game: {},
                },
            },
        };

        resultsScreen = new Results();
        resultsScreen.scene = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
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

    describe("create method", () => {
        beforeEach(() => resultsScreen.create());

        it("adds a background image", () => {
            const actualImageCall = gameImageStub.getCall(0);
            const expectedImageCall = [0, 0, "results.background"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["background"]);
        });

        it("adds a title image", () => {
            const actualImageCall = gameImageStub.getCall(1);
            const expectedImageCall = [0, -150, "results.title"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(1);
            assert.deepEqual(addToBackgroundCall.args, ["title"]);
        });

        it("loads the game results", () => {
            const actualTextCall = gameTextStub.getCall(0);
            const expectedResultsData = 22;
            const expectedTextCall = [0, 50, expectedResultsData, { font: "36px ReithSans" }];
            assert.deepEqual(
                actualTextCall.args,
                expectedTextCall,
                "game.add.text should have been called with " + expectedTextCall,
            );
        });

        it("adds GEL buttons to layout", () => {
            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["pause", "restart", "continueGame"];
            assert.deepEqual(actualButtons, expectedButtons);
        });

        it("creates a layout harness with correct params", () => {
            const actualParams = layoutHarness.createTestHarnessDisplay.getCall(0).args;
            const expectedParams = [mockGame, mockContext, resultsScreen.scene];
            sandbox.assert.calledOnce(layoutHarness.createTestHarnessDisplay);
            assert.deepEqual(actualParams, expectedParams);
        });

        it("fires a game complete stat to the GMI with score if given", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("game_complete", { game_score: 22 }));
        });

        it("fires a game complete stat to the GMI with score in string format if given", () => {
            resultsScreen.transientData.results = "450";
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("game_complete", { game_score: 22 }));
        });

        it("fires a game complete stat to the GMI without a score if not provided", () => {
            resultsScreen.transientData.results = null;
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("game_complete"));
        });
    });

    /*
    // TODO the following line should be added back once the overlap issue is resolved NT:04:02:19
    describe("achievements button", () => {
        it("adds the achievement button when theme flag is set", () => {
            resultsScreen.context.config.theme.game.achievements = true;
            resultsScreen.create();

            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["pause", "restart", "continueGame", "achievements"];
            assert.deepEqual(actualButtons, expectedButtons);
        });
    });
    */

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            resultsScreen.create();
        });

        describe("the continue button", () => {
            it("adds a signal subscription", () => {
                assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "continue");
            });

            it("navigates to the next screen", () => {
                signalSubscribeSpy.getCall(0).args[0].callback();
                assert(resultsScreen.navigation.next.callCount === 1, "next function should have been called once");
            });
        });

        describe("the restart button", () => {
            it("adds a signal subscription", () => {
                assert.deepEqual(signalSubscribeSpy.getCall(1).args[0].name, "restart");
            });

            it("restarts the game and passes saved data through", () => {
                signalSubscribeSpy.getCall(1).args[0].callback();
                assert(resultsScreen.navigation.game.callCount === 1, "next function should have been called once");
                sinon.assert.calledWith(resultsScreen.navigation.game, { characterSelected: 1, results: 22 });
            });
        });
    });
});
