import * as sinon from "sinon";
import { expect } from "chai";
import "src/lib/gmi.d";

import * as StartUp from "src/core/startup";
import * as Sequencer from "src/core/sequencer";

describe("Sequencer", () => {
    let sequencer: any;
    let mockGame: any;
    let mockContext: any;
    let mockTransitions: any;

    beforeEach(() => {
        mockGame = {
            state: {
                add: sinon.spy(),
                start: sinon.spy(),
            },
        };
        mockContext = {
            mockContext: "mockContext",
        };
        mockTransitions = [
            {
                name: "titlescreen",
                state: "titlestate",
            },
            {
                name: "gamescreen",
                state: "gameState",
            },
        ];
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions);
    });

    it("adds each transition to game state", () => {
        expect(mockGame.state.add.callCount).to.equal(2);
        expect(mockGame.state.add.getCall(0).args).to.eql([mockTransitions[0].name, mockTransitions[0].state]);
        expect(mockGame.state.add.getCall(1).args).to.eql([mockTransitions[1].name, mockTransitions[1].state]);
    });

    it("starts the current screen", () => {
        expect(mockGame.state.start.callCount).to.equal(1);
        expect(mockGame.state.start.getCall(0).args[0]).to.equal(mockTransitions[0].name);
        expect(mockGame.state.start.getCall(0).args[1]).to.equal(true);
        expect(mockGame.state.start.getCall(0).args[2]).to.equal(false);
        expect(mockGame.state.start.getCall(0).args[3]).to.eql(mockContext);
        expect(mockGame.state.start.getCall(0).args[4]).to.eql(sequencer.next);
    });

    describe("getTransitions Method", () => {
        it("returns transitions", () => {
            expect(sequencer.getTransitions()).to.equal(mockTransitions);
        });
    });

    // describe("next Method", () => {
    //     it("gets the next screen to transition to", () => {
    //         expect(sequencer.getTransitions()).to.equal(mockTransitions);
    //     });
    // });
});
