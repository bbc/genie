import { expect } from "chai";
import * as sinon from "sinon";

import * as LayoutFactory from "../../src/core/layout/factory";
import * as Sequencer from "../../src/core/sequencer";

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
        sandbox.stub(LayoutFactory, "create").returns(mockLayout);
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
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions, document.createElement("div"));
        next = mockGame.state.start.getCall(0).args[4];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("adds each transition to game state", () => {
        expect(mockGame.state.add.callCount).to.equal(3);
        expect(mockGame.state.add.getCall(0).args).to.eql([mockTransitions[0].name, mockTransitions[0].state]);
        expect(mockGame.state.add.getCall(1).args).to.eql([mockTransitions[1].name, mockTransitions[1].state]);
        expect(mockGame.state.add.getCall(2).args).to.eql([mockTransitions[2].name, mockTransitions[2].state]);
    });

    it("starts the current screen", () => {
        expect(mockGame.state.start.callCount).to.equal(1);
        expect(mockGame.state.start.getCall(0).args).to.eql([
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
            expect(sequencer.getTransitions()).to.eql(mockTransitions);
        });
    });

    describe("next function", () => {
        it("starts the next screen", () => {
            const expectedNextScreen = mockTransitions[0].nextScreenName();
            next();
            expect(mockGame.state.start.callCount).to.equal(2);
            expect(mockGame.state.start.getCall(1).args).to.eql([
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
            expect(mockLayout.removeAll.calledOnce).to.equal(true);
        });

        it("passes the state of the screen to the next screen", () => {
            const stateObject = { transient: { score: 200 }, persistent: {} };
            next(stateObject);
            expect(mockGame.state.start.getCall(1).args[3].inState).to.eql(stateObject);
        });

        it("starts the screen after next when called twice", () => {
            const expectedNextScreen = mockTransitions[1].nextScreenName();
            next();
            next();
            expect(mockGame.state.start.callCount).to.equal(3);
            expect(mockGame.state.start.getCall(2).args).to.eql([
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
            expect(mockGame.state.start.getCall(1).args[3].inState).to.eql(expectedStateObject);
        });
    });
});
