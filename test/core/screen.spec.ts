import { expect } from "chai";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";

describe("Screen", () => {
    let screen: any;
    let mockNext: any;
    let mockLayoutFactory: any;

    const mockContext: any = { inState: "inState" };

    beforeEach(() => {
        mockNext = sinon.spy();
        mockLayoutFactory = sinon.spy();
        screen = new Screen();
        screen.init(mockContext, mockNext, mockLayoutFactory);
    });

    it("sets layoutFactory on the screen", () => {
        expect(screen.layoutFactory).to.eql(mockLayoutFactory);
    });

    it("sets the next function on the screen", () => {
        expect(screen._next).to.eql(mockNext);
    });

    it("sets the context on the screen", () => {
        expect(screen._context).to.eql(mockContext);
    });

    describe("context", () => {
        it("has a getter", () => {
            expect(screen.context).to.eql(mockContext);
        });

        it("has a setter", () => {
            const expectedContext = {
                inState: "inState",
                qaMode: { active: true },
            };
            screen.context.qaMode = { active: true };
            expect(screen.context).to.eql(expectedContext);
        });
    });

    describe("next method", () => {
        it("calls the passed-in next function with the changed state param", () => {
            const changedState = { state: "change" };
            screen.next(changedState);
            expect(mockNext.getCall(0).args).to.eql([changedState]);
        });
    });
});
