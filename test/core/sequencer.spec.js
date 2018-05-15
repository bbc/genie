import { assert } from "chai";
import * as sinon from "sinon";

import * as Scene from "../../src/core/scene";
import * as Sequencer from "../../src/core/sequencer";
import * as signal from "../../src/core/signal-bus.js";

describe("Sequencer", () => {
    let sequencer;
    let mockGame;
    let mockLayout;
    let next;

    const sandbox = sinon.sandbox.create();
    const mockContext = { inState: { transient: {}, persistent: {} } };
    const mockTransitions = [
        {
            name: "title",
            state: "titlestate",
            nextScreenName: () => "game",
        },
        {
            name: "game",
            state: "gamestate",
            nextScreenName: () => "results",
        },
        {
            name: "results",
            state: "resultsstate",
        },
    ];

    beforeEach(() => {
        mockLayout = { removeAll: sandbox.spy() };
        sandbox.stub(Scene, "create").returns(mockLayout);
        mockGame = {
            state: { add: sandbox.spy(), start: sandbox.spy() },
            add: {
                group: sandbox.spy(() => ({
                    addChild: sandbox.spy(),
                })),
            },
            scale: {
                setGameSize: sandbox.spy(),
                scaleMode: sandbox.spy(),
                onSizeChange: { add: sandbox.spy() },
                getParentBounds: sandbox.spy(),
            },
        };
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions);
        next = mockGame.state.start.getCall(0).args[4];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("adds each transition to game state", () => {
        assert.equal(mockGame.state.add.callCount, 3);
        assert.deepEqual(mockGame.state.add.getCall(0).args, [mockTransitions[0].name, mockTransitions[0].state]);
        assert.deepEqual(mockGame.state.add.getCall(1).args, [mockTransitions[1].name, mockTransitions[1].state]);
        assert.deepEqual(mockGame.state.add.getCall(2).args, [mockTransitions[2].name, mockTransitions[2].state]);
    });

    it("starts the current screen", () => {
        assert.equal(mockGame.state.start.callCount, 1);
        assert.deepEqual(mockGame.state.start.getCall(0).args, [
            mockTransitions[0].name,
            true,
            false,
            mockContext,
            next,
            mockLayout,
        ]);
    });

    describe("getTransitions Method", () => {
        it("returns transitions", () => {
            assert.deepEqual(sequencer.getTransitions(), mockTransitions);
        });
    });

    describe("next function", () => {
        it("clears down all gel button signals", () => {
            const removeChannelSpy = sandbox.spy(signal.bus, "removeChannel");
            next();
            assert.isTrue(removeChannelSpy.withArgs("gel-buttons").calledOnce);
        });

        it("starts the next screen", () => {
            const expectedNextScreen = mockTransitions[0].nextScreenName();
            next();
            assert.equal(mockGame.state.start.callCount, 2);
            assert.deepEqual(mockGame.state.start.getCall(1).args, [
                expectedNextScreen,
                true,
                false,
                mockContext,
                next,
                mockLayout,
            ]);
        });

        it("clears down items from the layout", () => {
            next();
            assert.isTrue(mockLayout.removeAll.calledOnce);
        });

        it("passes the state of the screen to the next screen", () => {
            const stateObject = { transient: { score: 200 }, persistent: {} };
            next(stateObject);
            assert.deepEqual(mockGame.state.start.getCall(1).args[3].inState, stateObject);
        });

        it("starts the screen after next when called twice", () => {
            const expectedNextScreen = mockTransitions[1].nextScreenName();
            next();
            next();
            assert.equal(mockGame.state.start.callCount, 3);
            assert.deepEqual(mockGame.state.start.getCall(2).args, [
                expectedNextScreen,
                true,
                false,
                mockContext,
                next,
                mockLayout,
            ]);
        });

        it("passes the state to the screen after next", () => {
            const firstStateObject = { transient: { character: "The Great Big Hoo" } };
            const secondStateObject = { transient: { score: 200 } };
            const expectedStateObject = { transient: { character: "The Great Big Hoo", score: 200 }, persistent: {} };
            next(firstStateObject);
            next(secondStateObject);
            assert.deepEqual(mockGame.state.start.getCall(1).args[3].inState, expectedStateObject);
        });
    });
});
