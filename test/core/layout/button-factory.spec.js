import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/lib/accessibilify/accessibilify";
import * as signal from "../../../src/core/signal-bus.js";

describe("Layout - Button Factory", () => {
    let accessibilifyStub;
    let buttonFactory;
    let gelButtonStub;
    let mockGame;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        accessibilifyStub = sandbox.stub(accessibilify, "accessibilify");
        gelButtonStub = sandbox.stub(GelButton, "GelButton");

        mockGame = { canvas: () => {}, mockGame: "game" };
        buttonFactory = ButtonFactory.create(mockGame);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("create method", () => {
        it("returns correct methods", () => {
            assert.exists(buttonFactory.createButton);
        });
    });

    describe("createButton method", () => {
        const expectedIsMobile = false;
        const expectedKey = "play";
        const config = {
            id: "expectedId",
            ariaLabel: "expectedAriaLabel",
            key: expectedKey,
        };

        beforeEach(() => {
            buttonFactory.createButton(expectedIsMobile, config);
        });

        it("creates a GEL button", () => {
            const actualParams = gelButtonStub.getCall(0).args;
            expect(actualParams.length).to.equal(5);
            expect(actualParams[0]).to.eql(mockGame);
            expect(actualParams[1]).to.equal(0);
            expect(actualParams[2]).to.equal(0);
            expect(actualParams[3]).to.equal(expectedIsMobile);
            expect(actualParams[4]).to.equal(config);
        });

        // Temporarily comments this out until accessible button DOM elements can be properly cleared down
        // it("makes the button accessible", () => {
        //     expect(accessibilifyStub.called).to.equal(true);
        // });

        it("adds defaults actions to the signal bus", () => {
            const defaultAction = sinon.spy();
            const config = {
                key: "play",
                action: defaultAction,
            };
            signal.bus.removeChannel("gel-buttons");

            buttonFactory.createButton(expectedIsMobile, config);

            signal.bus.publish({ channel: "gel-buttons", name: "play" });
            signal.bus.publish({ channel: "gel-buttons", name: "play" });

            expect(defaultAction.callCount).to.equal(2);

            signal.bus.removeChannel("gel-buttons");
        });
    });
});
