/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as layoutHarness from "../../src/core/qa/layout-harness.js";
import * as event from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

import { Select } from "../../src/components/select.js";

describe("Select Screen", () => {
    let mockHowToPlayData;
    let characterSprites;
    let selectScreen;
    let mockLayout;
    let mockData;

    beforeEach(() => {
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});

        mockData = {
            config: {
                theme: {
                    "test-select": {
                        displayElement: ["title", "subtitle"],
                        showTitle: true,
                        showSubtitle: true,
                        choices: [
                            { asset: "character1" },
                            { asset: "character2", title: "character_2" },
                            { asset: "character3" },
                        ],
                    },
                    game: {},
                },
            },
            qaMode: { active: false },
            popupScreens: [],
        };
        mockHowToPlayData = {
            config: {
                theme: {
                    "test-select": {
                        howToPlay: true,
                        showTitle: true,
                        showSubtitle: false,
                        choices: [
                            { asset: "character1" },
                            { asset: "character2", title: "character_2" },
                            { asset: "character3" },
                        ],
                    },
                    game: {},
                },
            },
            qaMode: { active: false },
            popupScreens: [],
        };

        mockLayout = {
            buttons: {
                previous: { accessibleElement: { focus: jest.fn() } },
                next: { accessibleElement: { focus: jest.fn() } },
            },
        };
        selectScreen = new Select();
        selectScreen.setData(mockData);
        selectScreen.transientData = {};
        selectScreen.scene = { key: "test-select" };
        selectScreen.game = { canvas: { parentElement: "parent-element" } };
        selectScreen.navigation = { next: jest.fn() };
        selectScreen.setLayout = jest.fn(() => mockLayout);
        selectScreen.add = {
            image: jest.fn().mockImplementation((x, y, imageName) => imageName),
            sprite: jest.fn().mockImplementation((x, y, assetName) => {
                if (assetName === "test-select.character1") {
                    return characterSprites[0];
                }
                if (assetName === "test-select.character2") {
                    return characterSprites[1];
                }
                if (assetName === "test-select.character3") {
                    return characterSprites[2];
                }
            }),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => selectScreen.create());

        test("adds a background image", () => {
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, 0, "test-select.background");
        });

        test("adds a title image when showTitle is true", () => {
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, -170, "test-select.title");
        });

        test("does not add a title image when showTitle is false", () => {
            jest.clearAllMocks();
            mockData.config.theme["test-select"].showTitle = false;
            selectScreen.create();
            expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.title");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["home", "audio", "pause", "previous", "next", "continue"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds GEL buttons to layout when how to play", () => {
            selectScreen.setData(mockHowToPlayData);
            selectScreen.create();
            const expectedButtons = ["overlayBack", "audio", "settings", "previous", "next"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            selectScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(selectScreen);
        });

        test("does not adjust page title position when on how to play", () => {
            expect(selectScreen.add.image.mock.calls[1]).toEqual([0, -170, "test-select.title"]);
        });

        test("adjusts page title position when on how to play and showTitle is true", () => {
            selectScreen.setData(mockHowToPlayData);
            selectScreen.currentIndex = 0;
            jest.clearAllMocks();
            selectScreen.create();

            expect(selectScreen.add.image.mock.calls[1]).toEqual([0, -230, "test-select.title"]);
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(event.bus, "subscribe");
            selectScreen.create();
        });

        // Select Screen - Will want this back once buttons are all set up correctly - JB
        // test("adds event subscriptions to all the buttons", () => {
        //     expect(event.bus.subscribe).toHaveBeenCalledTimes(5);
        //     expect(event.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(selectScreen));
        //     expect(event.bus.subscribe.mock.calls[0][0].name).toBe("previous");
        //     expect(event.bus.subscribe.mock.calls[1][0].channel).toBe(buttonsChannel(selectScreen));
        //     expect(event.bus.subscribe.mock.calls[1][0].name).toBe("next");
        //     expect(event.bus.subscribe.mock.calls[2][0].channel).toBe(buttonsChannel(selectScreen));
        //     expect(event.bus.subscribe.mock.calls[2][0].name).toBe("continue");
        //     expect(event.bus.subscribe.mock.calls[3][0].channel).toBe(buttonsChannel(selectScreen));
        //     expect(event.bus.subscribe.mock.calls[3][0].name).toBe("pause");
        //     expect(event.bus.subscribe.mock.calls[4][0].channel).toBe(buttonsChannel(selectScreen));
        //     expect(event.bus.subscribe.mock.calls[4][0].name).toBe("play");
        // });

        test("adds event subscription to the continue button", () => {
            expect(event.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(selectScreen));
            expect(event.bus.subscribe.mock.calls[0][0].name).toBe("continue");
        });

        test("moves to the next game screen when the continue button is pressed", () => {
            event.bus.subscribe.mock.calls[0][0].callback();
            expect(selectScreen.navigation.next).toHaveBeenCalled();
        });
    });
});
