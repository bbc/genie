import { expect } from "chai";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";

describe("Screen", () => {
    let screen: any;
    const mockContext: any = {
        inState: "inState",
    };
    let mockNext: any;

    beforeEach(() => {
        mockNext = sinon.spy();
        screen = new Screen();
        screen.init(mockContext, mockNext);
    });

    it("sets the next function on the screen", () => {
        expect(screen.next).to.eql(mockNext);
    });

    it("sets the context on the screen", () => {
        expect(screen._context).to.eql(mockContext);
    });

    describe("exit method", () => {
        it("calls the next function and passes the changed state", () => {
            const changedState = { state: "change" };
            screen.exit(changedState);
            expect(mockNext.getCall(0).args).to.eql([changedState]);
        });
    });

    // describe("shutdown method", () => {
    //     it("calls cleanUp method", () => {
    //         const cleanUpSpy = sinon.spy(screen, "cleanUp");
    //         screen.shutdown();
    //         expect(cleanUpSpy.callCount).to.equal(1);
    //     });
    // });
});
