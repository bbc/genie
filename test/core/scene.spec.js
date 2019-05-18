/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Scene from "../../src/core/scene";
import * as Layout from "../../src/core/layout/layout";
import * as Scaler from "../../src/core/scaler.js";

jest.mock("../../src/core/scaler.js");

describe("Scene", () => {
    let scene;
    let mockGame;
    let groupMethods;

    beforeEach(() => {
        Scaler.getMetrics = "fakeMetrics";
        Scaler.onScaleChange.add = jest.fn();
        Scaler.init = jest.fn();
        groupMethods = {
            addChild: jest.fn(),
            removeAll: jest.fn(),
            scale: { set: jest.fn() },
            position: { set: jest.fn() },
        };
        mockGame = {
            start: jest.fn(),
            add: {
                group: jest.fn(() => groupMethods),
            },
            scale: {
                setGameSize: jest.fn(),
                setGamePosition: jest.fn(),
                scaleMode: jest.fn(),
                setResizeCallback: jest.fn(),
                getParentBounds: jest.fn(),
            },
            debug: {
                sprite: {
                    position: {
                        set: jest.fn(),
                    },
                },
            },
        };
        Scaler.getMetrics = jest.fn();
        scene = Scene.create(mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    it("Should add background, root, foreground, unscaled, layers to the phaser game", () => {
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "root", true);
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "unscaled", true);
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "background");
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "foreground");
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "debug", true);
        expect(mockGame.add.group).toHaveBeenCalledTimes(5);
    });

    describe("addToBackground method", () => {
        it("adds an Phaser element to the background", () => {
            const mockPhaserElement = { phaser: "element" };
            scene.addToBackground(mockPhaserElement);
            expect(groupMethods.addChild).toHaveBeenCalledWith(mockPhaserElement);
        });

        it("sets anchor if Phaser element has one", () => {
            const mockPhaserElement = { anchor: { setTo: jest.fn() } };
            scene.addToBackground(mockPhaserElement);
            expect(mockPhaserElement.anchor.setTo).toHaveBeenCalledWith(0.5, 0.5);
        });
    });

    describe("addToForeground method", () => {
        it("adds an Phaser element to the foreground", () => {
            const mockPhaserElement = { someElement: "phaser-element" };
            scene.addToForeground(mockPhaserElement);
            expect(groupMethods.addChild).toHaveBeenCalledWith(mockPhaserElement);
        });
    });

    describe("addLayout method", () => {
        const mockButtons = "buttons";
        const mockRoot = { root: { phaserElement: "phaserElement" } };
        let layoutStub;

        beforeEach(() => {
            layoutStub = jest.spyOn(Layout, "create").mockImplementation(() => mockRoot);
        });

        it("creates a new layout with correct params", () => {
            scene.addLayout(mockButtons);
            expect(layoutStub.mock.calls[0].length).toEqual(3);
            expect(layoutStub.mock.calls[0][0]).toEqual(mockGame);
            expect(layoutStub.mock.calls[0][2]).toEqual(mockButtons);
        });

        it("adds the layout root to the background", () => {
            scene.addLayout(mockButtons);
            expect(groupMethods.addChild).toHaveBeenCalledWith(mockRoot.root);
        });

        it("returns the layout", () => {
            expect(scene.addLayout(mockButtons)).toEqual(mockRoot);
        });
    });

    describe("getLayouts method", () => {
        it("should return the internal array of layouts", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            expect(scene.getLayouts().length).toBe(0);
            scene.addLayout(["play", "settings"]);
            expect(scene.getLayouts().length).toBe(1);
            scene.addLayout(["pause", "next"]);
            expect(scene.getLayouts().length).toBe(2);
        });
    });

    describe("getAccessibleGameButtons method", () => {
        it("should return the correct buttons", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            expect(scene.getAccessibleGameButtons().length).toBe(0);
        });
    });

    describe("removeAll method", () => {
        it("removes everything from the background", () => {
            scene.removeAll();
            expect(groupMethods.removeAll).toHaveBeenCalledWith(true);
        });

        it("calls destroy from all layouts added", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            scene.addLayout(["play", "settings"]);
            scene.addLayout(["pause", "next"]);
            scene.removeAll();

            expect(mockLayout.destroy).toHaveBeenCalledTimes(2);
        });
    });
});
