import { expect } from "chai";
import * as sinon from "sinon";
import "src/lib/gmi.d";

import * as Sequencer from "src/core/sequencer";

describe.only("Sequencer", () => {
    let sequencer: any;
    let mockGame: any;
    let next: NextScreenFunction;

    const mockContext: any = {
        inState: "inState",
    };
    const mockTransitions: any = [
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
        //sinon.spy(LayoutFactory, "create");
        mockGame = {
            state: { add: sinon.spy(), start: sinon.spy() },
            add: {
                group: sinon.spy(() => ({
                    addChild: sinon.spy(),
                })),
            },
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(),
            },
        };
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions, document.createElement("div"));
        next = mockGame.state.start.getCall(0).args[4];
    });

    it("adds each transition to game state", () => {
        console.log("calls count", mockGame.state.add.callCount);
        expect(mockGame.state.add.callCount).to.equal(3);
        console.log("0", mockGame.state.add.getCall(0).args);
        console.log("1", mockGame.state.add.getCall(1).args);
        console.log("2", mockGame.state.add.getCall(2).args);
        expect(mockGame.state.add.getCall(0).args).to.eql([mockTransitions[0].name, mockTransitions[0].state]);
        expect(mockGame.state.add.getCall(1).args).to.eql([mockTransitions[1].name, mockTransitions[1].state]);
        expect(mockGame.state.add.getCall(2).args).to.eql([mockTransitions[2].name, mockTransitions[2].state]);
    });

    it("starts the current screen", () => {
        expect(mockGame.state.start.callCount).to.equal(1);
        expect(mockGame.state.start.getCall(0).args).to.eql([mockTransitions[0].name, true, false, mockContext, next]);
    });

    describe("getTransitions Method", () => {
        it("returns transitions", () => {
            expect(sequencer.getTransitions()).to.eql(mockTransitions);
        });
    });

    describe("next function", () => {
        it("starts the next screen", () => {
            const expectedNextScreen = mockTransitions[0].nextScreenName();
            next({});
            expect(mockGame.state.start.callCount).to.equal(2);
            expect(mockGame.state.start.getCall(1).args).to.eql([expectedNextScreen, true, false, mockContext]);
        });

        // it("passes the state of the screen to the next screen", () => {
        //     const expectedNextScreen = mockTransitions[0].nextScreenName();
        //     sequencer.next({ score: 200 });
        //     expect(mockGame.state.start.getCall(1).args[3]).to.equal({});
        // });

        it("starts the screen after next when called twice", () => {
            const expectedNextScreen = mockTransitions[1].nextScreenName();
            next({});
            next({});
            expect(mockGame.state.start.callCount).to.equal(3);
            expect(mockGame.state.start.getCall(2).args).to.eql([expectedNextScreen, true, false, mockContext]);
        });
    });
});
