import * as sinon from "sinon";
import * as mock from "test/helpers/mock";
import * as chai from "chai";

import * as Sequencer from "src/core/sequencer";

describe("Sequencer", () => {
    let sequencer: { getTransitions: any };
    let mockGame;
    let mockContext;
    let mockTransitions: { name: string }[];

    beforeEach(() => {
        mock.installMockGetGmi();
        mockGame = {
            state: {
                add: sinon.spy(),
                start: sinon.spy(),
            },
        };
        mockContext = {};
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

    afterEach(mock.uninstallMockGetGmi);

    it("adds each transition to game state", () => {
        expect(mockGame.state.add.callCount).to.equal(2);
        expect(mockGame.state.add.getCall(0).args).to.eql([mockTransitions[0].name, mockTransitions[0].state]);
        expect(mockGame.state.add.getCall(1).args).to.eql([mockTransitions[1].name, mockTransitions[1].state]);
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
