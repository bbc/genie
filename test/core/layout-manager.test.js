/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as LayoutManager from "../../src/core/layout-manager.js";
import * as Layout from "../../src/core/layout/layout";
import * as Scaler from "../../src/core/scaler.js";

jest.mock("../../src/core/scaler.js");

describe("LayoutManager", () => {
    let layoutManager;
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
        layoutManager = LayoutManager.create(mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    test("Should add background, root, foreground, unscaled, layers to the phaser game", () => {
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "root", true);
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "unscaled", true);
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "background");
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "foreground");
        expect(mockGame.add.group).toHaveBeenCalledWith(undefined, "debug", true);
        expect(mockGame.add.group).toHaveBeenCalledTimes(5);
    });

    describe("addToBackground method", () => {
        test("adds an Phaser element to the background", () => {
            const mockPhaserElement = { phaser: "element" };
            layoutManager.addToBackground(mockPhaserElement);
            expect(groupMethods.addChild).toHaveBeenCalledWith(mockPhaserElement);
        });

        test("sets anchor if Phaser element has one", () => {
            const mockPhaserElement = { anchor: { setTo: jest.fn() } };
            layoutManager.addToBackground(mockPhaserElement);
            expect(mockPhaserElement.anchor.setTo).toHaveBeenCalledWith(0.5, 0.5);
        });
    });

    describe("addToForeground method", () => {
        test("adds an Phaser element to the foreground", () => {
            const mockPhaserElement = { someElement: "phaser-element" };
            layoutManager.addToForeground(mockPhaserElement);
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

        test("creates a new layout with correct params", () => {
            layoutManager.addLayout(mockButtons);
            expect(layoutStub.mock.calls[0].length).toEqual(3);
            expect(layoutStub.mock.calls[0][0]).toEqual(mockGame);
            expect(layoutStub.mock.calls[0][2]).toEqual(mockButtons);
        });

        test("adds the layout root to the background", () => {
            layoutManager.addLayout(mockButtons);
            expect(groupMethods.addChild).toHaveBeenCalledWith(mockRoot.root);
        });

        test("returns the layout", () => {
            expect(layoutManager.addLayout(mockButtons)).toEqual(mockRoot);
        });
    });

    describe("getLayouts method", () => {
        test("returns the internal array of layouts", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            expect(layoutManager.getLayouts().length).toBe(0);
            layoutManager.addLayout(["play", "settings"]);
            expect(layoutManager.getLayouts().length).toBe(1);
            layoutManager.addLayout(["pause", "next"]);
            expect(layoutManager.getLayouts().length).toBe(2);
        });
    });

    describe("getAccessibleGameButtons method", () => {
        test("returns the correct buttons", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            expect(layoutManager.getAccessibleGameButtons().length).toBe(0);
        });
    });

    describe("removeAll method", () => {
        test("removes everything from the background", () => {
            layoutManager.removeAll();
            expect(groupMethods.removeAll).toHaveBeenCalledWith(true);
        });

        test("calls destroy from all layouts added", () => {
            const mockLayout = {
                root: jest.fn(),
                destroy: jest.fn(),
            };
            jest.spyOn(Layout, "create").mockImplementation(() => mockLayout);

            layoutManager.addLayout(["play", "settings"]);
            layoutManager.addLayout(["pause", "next"]);
            layoutManager.removeAll();

            expect(mockLayout.destroy).toHaveBeenCalledTimes(2);
        });
    });
});
