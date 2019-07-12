/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
// import * as phaserSplit from "../../../node_modules/phaser-ce/build/custom/phaser-split.js";
import { createMockGmi } from "../../mock/gmi";

import { groupLayouts } from "../../../src/core/layout/group-layouts.js";
import { onScaleChange } from "../../../src/core/scaler.js";
import { Group } from "../../../src/core/layout/group.js";
import * as Layout from "../../../src/core/layout/layout.js";
import * as settingsIcons from "../../../src/core/layout/settings-icons.js";

jest.mock("../../../src/core/layout/group.js");

describe("Layout", () => {
    const sixGelButtons = ["achievements", "exit", "howToPlay", "play", "audio", "settings"];

    let mockGmi;
    let mockGame;
    let mockMetrics;
    let mockInputUpAdd;
    let mockGroup;
    let mockPhaserGroup;
    let mockSignalUnsubscribe;
    let settingsIconsUnsubscribeSpy;

    beforeEach(() => {
        mockGmi = {
            getAllSettings: jest.fn(() => ({ audio: true, motion: true })),
            shouldDisplayMuteButton: true,
            shouldShowExitButton: true,
        };
        createMockGmi(mockGmi);

        mockGame = {
            mock: "game",
            cache: { getJSON: jest.fn().mockReturnValue({ theme: { test: {} } }) },
            state: { current: "test" },
        };
        mockMetrics = {
            horizontals: jest.fn(),
            safeHorizontals: jest.fn(),
            verticals: jest.fn(),
        };

        mockInputUpAdd = jest.fn();
        mockGroup = {
            addButton: jest.fn(name => ({ buttonName: name, onInputUp: { add: mockInputUpAdd } })),
            reset: jest.fn(),
            addToGroup: jest.fn(),
            destroy: jest.fn(),
        };
        Group.mockImplementation(() => mockGroup);
        mockPhaserGroup = { destroy: jest.fn() };
        global.Phaser.Group = jest.fn().mockImplementation(() => mockPhaserGroup);

        settingsIconsUnsubscribeSpy = jest.fn();
        jest.spyOn(settingsIcons, "create").mockImplementation(() => ({ unsubscribe: settingsIconsUnsubscribeSpy }));

        mockSignalUnsubscribe = jest.fn();
        jest.spyOn(onScaleChange, "add").mockImplementation(() => ({ unsubscribe: mockSignalUnsubscribe }));
    });

    afterEach(() => jest.clearAllMocks());

    describe("Creation", () => {
        test("adds the correct number of GEL buttons for a given config", () => {
            const layout1 = Layout.create(mockGame, mockMetrics, ["achievements"]);
            expect(Object.keys(layout1.buttons).length).toBe(1);

            const layout2 = Layout.create(mockGame, mockMetrics, ["play", "audio", "settings"]);
            expect(Object.keys(layout2.buttons).length).toBe(3);

            const layout3 = Layout.create(mockGame, mockMetrics, sixGelButtons);
            expect(Object.keys(layout3.buttons).length).toBe(6);
        });

        test("skips the creation of the mute button when gmi.shouldDisplayMuteButton is false", () => {
            mockGmi.shouldDisplayMuteButton = false;
            const layout = Layout.create(mockGame, mockMetrics, sixGelButtons);
            expect(layout.buttons.audio).not.toBeDefined();
        });

        test("skips the creation of the exit button when gmi.shouldShowExitButton is false", () => {
            mockGmi.shouldShowExitButton = false;
            const layout = Layout.create(mockGame, mockMetrics, sixGelButtons);
            expect(layout.buttons.exit).not.toBeDefined();
        });

        test("creates a new Phaser group for the GEL buttons", () => {
            Layout.create(mockGame, mockMetrics, sixGelButtons);
            expect(global.Phaser.Group).toHaveBeenCalledWith(mockGame, mockGame.world, undefined);
        });

        test("makes a new group for each group layout", () => {
            const getExpectedParams = callNumber => [
                mockGame,
                mockPhaserGroup,
                groupLayouts[callNumber].vPos,
                groupLayouts[callNumber].hPos,
                mockMetrics,
                groupLayouts[callNumber].safe,
                groupLayouts[callNumber].arrangeV,
            ];
            Layout.create(mockGame, mockMetrics, sixGelButtons);
            expect(Group).toHaveBeenCalledTimes(groupLayouts.length);
            Group.mock.calls.forEach((call, index) => {
                expect(Group.mock.calls[index]).toEqual(getExpectedParams(index));
            });
        });

        test("adds buttons using the correct tab order", () => {
            const rndOrder = [
                "exit",
                "home",
                "achievements",
                "howToPlay",
                "play",
                "settings",
                "audio",
                "previous",
                "next",
                "continue",
                "restart",
                "back",
                "pause",
            ];
            const tabOrder = [
                "exit",
                "home",
                "back",
                "audio",
                "settings",
                "pause",
                "previous",
                "play",
                "next",
                "achievements",
                "restart",
                "continue",
                "howToPlay",
            ];

            const layout = Layout.create(mockGame, mockMetrics, rndOrder);
            expect(Object.keys(layout.buttons)).toEqual(tabOrder);
        });

        test("resets the groups after they have been added to the layout", () => {
            Layout.create(mockGame, mockMetrics, []);
            expect(mockGroup.reset).toHaveBeenCalledTimes(11);
            expect(mockGroup.reset).toHaveBeenCalledWith(mockMetrics);
        });

        test("subscribes to the scaler sizeChange signal", () => {
            const layout = Layout.create(mockGame, mockMetrics, ["play"]);
            expect(onScaleChange.add).toHaveBeenCalledWith(layout.resize);
        });

        test("creates the settings icons", () => {
            Layout.create(mockGame, mockMetrics, ["play"]);
            expect(settingsIcons.create).toHaveBeenCalledWith(mockGroup, ["play"]);
        });
    });

    describe("addToGroup Method", () => {
        test("adds items to the correct group", () => {
            const layout = Layout.create(mockGame, mockMetrics, []);
            const testElement = { mock: "element" };

            layout.addToGroup("middleRight", testElement, 1);
            expect(mockGroup.addToGroup).toHaveBeenCalledWith(testElement, 1);
        });
    });

    describe("buttons property", () => {
        test("returns the buttons", () => {
            const layout = Layout.create(mockGame, mockMetrics, ["achievements", "exit", "settings"]);
            expect(layout.buttons.achievements).toBeDefined();
            expect(layout.buttons.exit).toBeDefined();
            expect(layout.buttons.settings).toBeDefined();
        });
    });

    describe("destroy method", () => {
        beforeEach(() => {
            const layout = Layout.create(mockGame, mockMetrics, ["achievements", "exit", "settings"]);
            layout.destroy();
        });

        test("removes all signals on this Layout instance", () => {
            expect(mockSignalUnsubscribe).toHaveBeenCalled();
            expect(settingsIconsUnsubscribeSpy).toHaveBeenCalled();
        });

        test("destroys the group", () => {
            expect(mockPhaserGroup.destroy).toHaveBeenCalled();
        });
    });

    describe("root property", () => {
        test("returns the group", () => {
            const layout = Layout.create(mockGame, mockMetrics, ["achievements", "exit", "settings"]);
            expect(layout.root).toBe(mockPhaserGroup);
        });
    });

    describe("removeSignals method", () => {
        test("removes all signals on this Layout instance", () => {
            const layout = Layout.create(mockGame, mockMetrics, ["play"]);
            layout.removeSignals();
            expect(mockSignalUnsubscribe).toHaveBeenCalled();
            expect(settingsIconsUnsubscribeSpy).toHaveBeenCalled();
        });
    });

    describe("setAction Method", () => {
        test("sets button callback", () => {
            const layout = Layout.create(mockGame, mockMetrics, ["achievements", "exit", "settings"]);
            const buttonCallBack = "testAction";
            layout.setAction("exit", buttonCallBack);
            expect(mockInputUpAdd.mock.calls[0][0]).toBe(buttonCallBack);
            expect(mockInputUpAdd.mock.calls[0][1].create).toBeDefined();
        });
    });

    describe("button overrides", () => {
        test("merges overrides to button config", () => {
            const mockConfig = {
                theme: {
                    test: { "button-overrides": { play: { shiftX: 99, shiftY: 88, group: "topRight" } } },
                },
            };
            mockGame.cache.getJSON = jest.fn().mockReturnValue(mockConfig);

            const layout = Layout.create(mockGame, mockMetrics, ["play"]);

            expect(layout.buttons.play.buttonName.shiftX).toBe(99);
            expect(layout.buttons.play.buttonName.shiftY).toBe(88);
            expect(layout.buttons.play.buttonName.group).toBe("topRight");
        });
    });
});
