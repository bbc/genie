import { expect } from "chai";
import * as sinon from "sinon";

import * as LayoutFactory from "../../../src/core/layout/factory";

describe("Layout Factory", () => {
    let sandbox: sinon.SinonSandbox;
    let layoutFactory: any;
    let mockGame: any;
    let removeAllSpy: any;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        removeAllSpy = sinon.spy();
        mockGame = {
            start: sinon.spy(),
            add: {
                group: sinon.spy(() => ({
                    addChild: sinon.spy(),
                    removeAll: removeAllSpy,
                })),
            },
            renderer: { resolution: 800 },
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(),
            },
        };
        layoutFactory = LayoutFactory.create(mockGame, document.createElement("div"));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should add 'gelBackground', 'gelGroup' and 'foreground' layers to the phaser game", () => {
        expect(mockGame.add.group.calledWith(undefined, "gelGroup", true)).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "gelBackground")).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "foreground")).to.equal(true);
        expect(mockGame.add.group.callCount).to.equal(3);
    });

    it("Should add a callback to the scaler.onSizechange method", () => {
        //expect(mockGame.scale.setGameSize.calledWith(undefined, "gelBackground")).to.eql(true);
        expect(mockGame.scale.setGameSize.callCount).to.equal(1);
    });

    describe("removeAll method", () => {
        it("removes everything from the background", () => {
            layoutFactory.removeAll();
            expect(removeAllSpy.calledWith(true)).to.equal(true);
        });
    });
});
