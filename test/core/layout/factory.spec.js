import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as LayoutFactory from "../../../src/core/layout/factory";
import * as Layout from "../../../src/core/layout/layout";
import * as Scaler from "../../../src/core/scaler";

describe("Layout - Factory", () => {
    let sandbox;
    let layoutFactory;
    let mockGame;
    let scalerSpy;
    let scalerMethods;
    let groupMethods;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        scalerMethods = { getSize: sandbox.spy(), onScaleChange: { add: sandbox.spy() } };
        scalerSpy = sandbox.stub(Scaler, "create").returns(scalerMethods);
        groupMethods = {
            addChild: sandbox.spy(),
            removeAll: sandbox.spy(),
            scale: { set: sandbox.spy() },
            position: { set: sandbox.spy() },
        };
        mockGame = {
            start: sandbox.spy(),
            add: {
                group: sandbox.spy(() => groupMethods),
            },
            scale: {
                setGameSize: sandbox.spy(),
                setGamePosition: sandbox.spy(),
                scaleMode: sandbox.spy(),
                onSizeChange: { add: sandbox.spy() },
                getParentBounds: sandbox.spy(),
            },
        };
        layoutFactory = LayoutFactory.create(mockGame);
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

    it("scales the background", () => {
        const onScaleChangeCallback = scalerMethods.onScaleChange.add.getCall(0).args[0];
        const expectedScale = 1;
        onScaleChangeCallback(800, 600, expectedScale);
        expect(groupMethods.scale.set.getCall(0).args).to.eql([expectedScale, expectedScale]);
        expect(groupMethods.position.set.getCall(0).args).to.eql([400, 300]);
    });

    describe("addToBackground method", () => {
        it("adds an Phaser element to the background", () => {
            const mockPhaserElement = { phaser: "element" };
            layoutFactory.addToBackground(mockPhaserElement);
            expect(groupMethods.addChild.calledWith(mockPhaserElement)).to.equal(true);
        });

        it("sets anchor if Phaser element has one", () => {
            const setToSpy = sandbox.spy();
            const mockPhaserElement = { anchor: { setTo: setToSpy } };
            layoutFactory.addToBackground(mockPhaserElement);
            expect(setToSpy.calledWith(0.5, 0.5)).to.equal(true);
        });
    });

    describe("addToForeground method", () => {
        it("adds an Phaser element to the foreground", () => {
            const mockPhaserElement = { someElement: "phaser-element" };
            layoutFactory.addToForeground(mockPhaserElement);
            expect(groupMethods.addChild.calledWith(mockPhaserElement)).to.equal(true);
        });
    });

    describe("addLayout method", () => {
        const mockButtons = "buttons";
        const mockRoot = { root: { phaserElement: "phaserElement" } };
        let layoutStub;

        beforeEach(() => {
            layoutStub = sandbox.stub(Layout, "Layout").returns(mockRoot);
        });

        it("creates a new layout with correct params", () => {
            layoutFactory.addLayout(mockButtons);
            expect(layoutStub.getCall(0).args.length).to.equal(3);
            expect(layoutStub.getCall(0).args[0]).to.eql(mockGame);
            expect(layoutStub.getCall(0).args[1]).to.eql(scalerMethods);
            expect(layoutStub.getCall(0).args[2]).to.eql(mockButtons);
        });

        it("adds the layout root to the background", () => {
            layoutFactory.addLayout(mockButtons);
            expect(groupMethods.addChild.calledWith(mockRoot.root)).to.equal(true);
        });

        it("returns the layout", () => {
            expect(layoutFactory.addLayout(mockButtons)).to.eql(mockRoot);
        });
    });

    describe("removeAll method", () => {
        it("removes everything from the background", () => {
            layoutFactory.removeAll();
            expect(groupMethods.removeAll.calledWith(true)).to.equal(true);
        });
    });

    describe("addLookups method", () => {
        it("adds more keylookups", () => {
            const moreLookups = { more: "lookups" };
            layoutFactory.addLookups(moreLookups);
            expect(layoutFactory.keyLookups).to.eql(moreLookups);
        });
    });

    describe("getSize method", () => {
        it("returns the scaler getSize method", () => {
            layoutFactory.getSize();
            expect(scalerMethods.getSize.called).to.equal(true);
        });
    });
});
