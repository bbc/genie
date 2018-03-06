import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as LayoutFactory from "../../../src/core/layout/factory";
import * as Scaler from "../../../src/core/scaler";

describe("Layout - Factory", () => {
    let sandbox: sinon.SinonSandbox;
    let layoutFactory: any;
    let mockGame: any;
    let scalerSpy: any;
    let scalerGetSizeSpy: any;
    let scalerScaleChangeSpy: any;
    let removeAllSpy: any;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        scalerGetSizeSpy = sandbox.spy();
        scalerScaleChangeSpy = sandbox.spy();
        scalerSpy = sandbox.stub(Scaler, "create").returns({
            getSize: scalerGetSizeSpy,
            onScaleChange: {
                add: scalerScaleChangeSpy,
            },
        });
        removeAllSpy = sandbox.spy();
        mockGame = {
            start: sandbox.spy(),
            add: {
                group: sandbox.spy(() => ({
                    addChild: sandbox.spy(),
                    removeAll: removeAllSpy,
                    scale: { set: sandbox.spy() },
                    position: { set: sandbox.spy() },
                })),
            },
            renderer: { resolution: 800 },
            scale: {
                setGameSize: sandbox.spy(),
                setGamePosition: sandbox.spy(),
                scaleMode: sandbox.spy(),
                onSizeChange: { add: sandbox.spy() },
                getParentBounds: sandbox.spy(),
            },
        };
        layoutFactory = LayoutFactory.create(mockGame, document.createElement("div"));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("returns the correct methods", () => {
        expect(layoutFactory.keyLookups).to.eql({});
        assert.exists(layoutFactory.addToBackground);
        assert.exists(layoutFactory.addToForeground);
        assert.exists(layoutFactory.addLayout);
        assert.exists(layoutFactory.removeAll);
        assert.exists(layoutFactory.addLookups);
        assert.exists(layoutFactory.getSize);
    });

    it("Should add 'gelBackground', 'gelGroup' and 'foreground' layers to the phaser game", () => {
        expect(mockGame.add.group.calledWith(undefined, "gelGroup", true)).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "gelBackground")).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "foreground")).to.equal(true);
        expect(mockGame.add.group.callCount).to.equal(3);
    });

    it("creates a scaler with correct params", () => {
        expect(scalerSpy.calledWith(600, mockGame)).to.equal(true);
    });

    // it.only("scales the background", () => {
    //     expect(mockGame.add.group.scale.set.called).to.equal(true);
    //     // expect(mockGame.position.setGamePosition.callCount).to.equal(1);
    // });

    describe("removeAll method", () => {
        it("removes everything from the background", () => {
            layoutFactory.removeAll();
            expect(removeAllSpy.calledWith(true)).to.equal(true);
        });
    });
});
