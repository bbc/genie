import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as Scene from "../../src/core/scene";
import * as Layout from "../../src/core/layout/layout";
import * as Scaler from "../../src/core/scaler.js";

describe("Scene", () => {
    let sandbox;
    let scene;
    let mockGame;
    let groupMethods;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        sandbox.stub(Scaler, "getMetrics").returns("fakeMetrics");

        Scaler.getMetrics = sandbox.stub().returns("fakeMetrics");

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
                setResizeCallback: sandbox.spy(),
                getParentBounds: sandbox.spy(),
            },
            debug: {
                sprite: {
                    position: {
                        set: sandbox.spy(),
                    },
                },
            },
        };
        Scaler.getMetrics = sandbox.spy();
        scene = Scene.create(mockGame);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should add background, root, foreground, unscaled, layers to the phaser game", () => {
        expect(mockGame.add.group.calledWith(undefined, "root", true)).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "unscaled", true)).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "background")).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "foreground")).to.equal(true);
        expect(mockGame.add.group.calledWith(undefined, "debug", true)).to.equal(true);
        expect(mockGame.add.group.callCount).to.equal(5);
    });

    describe("addToBackground method", () => {
        it("adds an Phaser element to the background", () => {
            const mockPhaserElement = { phaser: "element" };
            scene.addToBackground(mockPhaserElement);
            expect(groupMethods.addChild.calledWith(mockPhaserElement)).to.equal(true);
        });

        it("sets anchor if Phaser element has one", () => {
            const setToSpy = sandbox.spy();
            const mockPhaserElement = { anchor: { setTo: setToSpy } };
            scene.addToBackground(mockPhaserElement);
            expect(setToSpy.calledWith(0.5, 0.5)).to.equal(true);
        });
    });

    describe("addToForeground method", () => {
        it("adds an Phaser element to the foreground", () => {
            const mockPhaserElement = { someElement: "phaser-element" };
            scene.addToForeground(mockPhaserElement);
            expect(groupMethods.addChild.calledWith(mockPhaserElement)).to.equal(true);
        });
    });

    describe("addLayout method", () => {
        const mockButtons = "buttons";
        const mockRoot = { root: { phaserElement: "phaserElement" } };
        let layoutStub;

        beforeEach(() => {
            layoutStub = sandbox.stub(Layout, "create").returns(mockRoot);
        });

        it("creates a new layout with correct params", () => {
            scene.addLayout(mockButtons);
            expect(layoutStub.getCall(0).args.length).to.equal(3);
            expect(layoutStub.getCall(0).args[0]).to.eql(mockGame);
            expect(layoutStub.getCall(0).args[2]).to.eql(mockButtons);
        });

        it("adds the layout root to the background", () => {
            scene.addLayout(mockButtons);
            expect(groupMethods.addChild.calledWith(mockRoot.root)).to.equal(true);
        });

        it("returns the layout", () => {
            expect(scene.addLayout(mockButtons)).to.eql(mockRoot);
        });
    });

    describe("getLayouts method", () => {
        it("should return the internal array of layouts", () => {
            const spyDestroy = sandbox.spy();
            const mockLayout = {
                root: sandbox.stub(),
                destroy: spyDestroy,
            };
            sandbox.stub(Layout, "create").returns(mockLayout);

            assert.lengthOf(scene.getLayouts(), 0);
            scene.addLayout(["play", "settings"]);
            assert.lengthOf(scene.getLayouts(), 1);
            scene.addLayout(["pause", "next"]);
            assert.lengthOf(scene.getLayouts(), 2);
        });
    });

    describe("getAccessibleGameButtons method", () => {
        it("should return the correct buttons", () => {
            const spyDestroy = sandbox.spy();
            const mockLayout = {
                root: sandbox.stub(),
                destroy: spyDestroy,
            };
            sandbox.stub(Layout, "create").returns(mockLayout);

            assert.lengthOf(scene.getAccessibleGameButtons(), 0);
        });
    });

    describe("removeAll method", () => {
        it("removes everything from the background", () => {
            scene.removeAll();
            expect(groupMethods.removeAll.calledWith(true)).to.equal(true);
        });

        it("calls destroy from all layouts added", () => {
            const spyDestroy = sandbox.spy();
            const mockLayout = {
                root: sandbox.stub(),
                destroy: spyDestroy,
            };
            sandbox.stub(Layout, "create").returns(mockLayout);

            scene.addLayout(["play", "settings"]);
            scene.addLayout(["pause", "next"]);
            scene.removeAll();

            sinon.assert.calledTwice(spyDestroy);
        });
    });
});
