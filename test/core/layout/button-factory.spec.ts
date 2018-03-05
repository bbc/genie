import { expect } from "chai";
import * as sinon from "sinon";

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";

describe("Layout - Button Factory", () => {
    let buttonFactory: any;
    let gelButtonStub: any;
    let buttonCreateSpy: any;
    let mockGame: any;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        buttonCreateSpy = sandbox.spy();
        gelButtonStub = sandbox.stub(GelButton, "GelButton").callsFake(() => "buttonspy");

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
        buttonFactory = ButtonFactory.create(mockGame);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("create method", () => {
        it("returns correct methods", () => {
            expect(typeof buttonFactory.createButton).to.equal("function");
        });
    });

    describe("createButton method", () => {
        it("returns a GEL button with correct params", () => {
            const expectedIsMobile = false;
            const expectedKey = "buttonKey";
            const button = buttonFactory.createButton(expectedIsMobile, expectedKey);
            const actualParams = gelButtonStub.getCall(0).args;

            expect(actualParams.length).to.equal(5);
            expect(actualParams[0]).to.eql(mockGame);
            expect(actualParams[1]).to.equal(0);
            expect(actualParams[2]).to.equal(0);
            expect(actualParams[3]).to.equal(expectedIsMobile);
            expect(actualParams[4]).to.equal(expectedKey);
        });
    });
});
