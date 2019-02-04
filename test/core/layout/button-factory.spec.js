/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/core/accessibility/accessibilify";
import * as signal from "../../../src/core/signal-bus.js";

describe("Layout - Button Factory", () => {
    let accessibilifyStub;
    let buttonFactory;
    let gelButtonStub;
    let mockGame;

    const sandbox = sinon.createSandbox();

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
            action: () => {},
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

        it("makes the button accessible", () => {
            expect(accessibilifyStub.called).to.equal(true);
        });

        it("adds defaults actions to the signal bus", () => {
            const defaultAction = sinon.spy();
            const buttonsChannel = "buttonsChannel";
            const config = {
                key: "play",
                action: defaultAction,
                channel: buttonsChannel,
            };
            signal.bus.removeChannel(buttonsChannel);

            buttonFactory.createButton(expectedIsMobile, config);

            signal.bus.publish({ channel: buttonsChannel, name: "play" });
            signal.bus.publish({ channel: buttonsChannel, name: "play" });

            expect(defaultAction.callCount).to.equal(2);

            signal.bus.removeChannel(buttonsChannel);
        });

        it("disables hitArea and input for icons", () => {
            const config = {
                title: "FX Off",
                icon: true,
            };

            const btn = buttonFactory.createButton(false, config);

            expect(btn.hitArea).to.equal(null);
            expect(btn.inputEnabled).to.equal(false);
        });
    });
});
