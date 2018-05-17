import { expect } from "chai";
import * as sinon from "sinon";

import { Screen } from "../../src/core/screen";

describe("Screen", () => {
    let screen;
    let mockLayoutFactory;
    let transientData;
    let navigation;

    const mockContext = {};
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockLayoutFactory = sandbox.spy();
        transientData = sandbox.stub();
        navigation = {
            loadscreen: sandbox.stub(),
        };

        screen = new Screen();
        screen.game = {
            state: {
                current: "loadscreen",
            },
        };
        screen.init(transientData, mockLayoutFactory, mockContext, navigation);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("sets layoutFactory on the screen", () => {
        expect(screen.layoutFactory).to.eql(mockLayoutFactory);
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
                qaMode: { active: true },
            };
            screen.context.qaMode = { active: true };
            expect(screen.context).to.eql(expectedContext);
        });
    });
});
