import * as sinon from "sinon";
import * as mock from "test/helpers/mock";
import { expect } from "chai";

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
                name: "testscreen",
            },
        ];
        sequencer = Sequencer.create(mockGame, mockContext, mockTransitions);
    });

    afterEach(mock.uninstallMockGetGmi);

    describe("getTransitions Method", () => {
        it("returns transitions", () => {
            expect(sequencer.getTransitions()).to.equal(mockTransitions);
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
