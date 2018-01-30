import * as sinon from "sinon";
import * as mock from "test/helpers/mock";

import { Sequencer, ScreenDef } from "src/core/sequencer";
import { Context } from "./startup";

describe("Sequencer", () => {
    let sequencer: Sequencer;
    let mockGame: Phaser.Game;
    let mockContext: Context;
    let mockTransitions: ScreenDef[];

    beforeEach(() => {
        mockGame = {
            state: {
                add: sinon.spy(),
                start: sinon.spy(),
            },
        };
        mockContext = {};
        mockTransitions = [
            {
                name: "testscreen",
            },
        ];
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions);
    });

    describe("getTransitions Method", () => {
        it("returns transitions", done => {
            expect(sequencer.getTransitions).to.equal(mockTransitions);
        });
    });
    // function getElementOrThrow(id: string): HTMLElement {
    //     const e = document.getElementById(id);
    //     if (e) {
    //         return e;
    //     } else {
    //         throw Error("Didn't find " + id);
    //     }
    // }
});
