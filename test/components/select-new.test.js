/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as layoutHarness from "../../src/core/qa/layout-harness.js";
import * as event from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

import { Select } from "../../src/components/select-new.js";

describe("Select Screen", () => {
    let mockHowToPlayData;
    let characterSprites;
    let selectScreen;
    let mockLayout;
    let mockData;
    let defaultTextStyle;
    let setOrigin;

    beforeEach(() => {
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});
        setOrigin = jest.fn();
        mockData = {
            config: {
                theme: {
                    "test-select": {
                        title: {
                            image: {
                                imageId: "title",
                            },
                            text: {
                                value: "",
                            },
                            visible: true,
                        },
                        subtitle: {
                            image: {
                                imageId: "subtitle",
                            },
                            text: {
                                value: "",
                            },
                            visible: false,
                        },
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
                        title: {
                            image: {
                                imageId: "title",
                            },
                            text: {
                                value: "",
                            },
                            visible: true,
                        },
                        subtitle: {
                            image: {
                                imageId: "subtitle",
                            },
                            text: {
                                value: "",
                            },
                            visible: false,
                        },
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
            text: jest.fn().mockImplementation((x, y, text, styles) => ({
                setOrigin,
            })),
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

        defaultTextStyle = { align: "center", fontFamily: "Arial", fontSize: "24px" };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => selectScreen.create());

        test("adds a background image", () => {
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, 0, "test-select.background");
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

        describe("titles", () => {
            test("adds a title image when title.visibile is true and an image is specified", () => {
                expect(selectScreen.add.image).toHaveBeenCalledWith(0, -170, "test-select.title");
            });

            test("does not add a title if no config is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title = undefined;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.title");
                expect(selectScreen.add.text).not.toHaveBeenCalled();
            });

            test("does not add a title image when no image is specified", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.image = "";
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.title");
            });

            test("does not add a title image when title.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.visible = false;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.title");
            });

            test("adds title text with default styles when text is supplied but no style is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.text.value = "testTitleText";
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -170, "testTitleText", defaultTextStyle);
                expect(setOrigin).toHaveBeenCalledWith(0.5);
            });

            test("adds title text with config styles when text is supplied with styling", () => {
                const styling = {
                    id: "titleStyling",
                };

                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.visible = true;
                mockData.config.theme["test-select"].title.text.value = "testTitleText";
                mockData.config.theme["test-select"].title.text.styles = styling;
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -170, "testTitleText", styling);
                expect(setOrigin).toHaveBeenCalledWith(0.5);
            });

            test("does not add a title text when title.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle.text.value = "testText";
                selectScreen.create();
                expect(selectScreen.add.text).not.toHaveBeenCalledWith(0, -170, "testText");
            });

            test("does not add a title image when title.image is not defined", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title = {
                    visibile: true,
                    image: { imageId: "" },
                };
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.title");
            });

            test("does respect offset coordinates provided in config", () => {
                mockData.config.theme["test-select"].title = {
                    visible: true,
                    image: {
                        imageId: "title",
                        xOffset: 50,
                        yOffset: 50,
                    },
                    text: {
                        value: "title",
                        xOffset: 50,
                        yOffset: 50,
                    },
                };
                jest.clearAllMocks();
                selectScreen.create();
                expect(selectScreen.add.image).toHaveBeenCalledWith(50, -120, "test-select.title");
                expect(selectScreen.add.text).toHaveBeenCalledWith(50, -120, "title", defaultTextStyle);
            });
        });

        describe("subtitles", () => {
            beforeEach(() => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.visible = false;
                mockData.config.theme["test-select"].subtitle.visible = true;
            });

            test("adds a subtitle image when subtitle.visibile is true", () => {
                selectScreen.create();
                expect(selectScreen.add.image).toHaveBeenCalledWith(0, -170, "test-select.subtitle");
            });

            test("does not add a subtitle image when subtitle.visible is false", () => {
                mockData.config.theme["test-select"].subtitle.visible = false;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.subtitle");
            });

            test("does not add a subtitle if no config is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle = undefined;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith((0, -170, "test-select.subtitle"));
                expect(selectScreen.add.text).not.toHaveBeenCalled();
            });

            test("does not add a subtitle image when no image is specified", () => {
                mockData.config.theme["test-select"].subtitle.image = "";
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.subtitle");
            });

            test("adds subtitle text with default styles when text is supplied but no style is provided", () => {
                mockData.config.theme["test-select"].subtitle.visible = true;
                mockData.config.theme["test-select"].subtitle.text.value = "testSubtitleText";
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -170, "testSubtitleText", defaultTextStyle);
                expect(setOrigin).toHaveBeenCalledWith(0.5);
            });

            test("adds subtitle text with config styles when text is supplied with styling", () => {
                const styling = {
                    id: "subtitleStyling",
                };

                mockData.config.theme["test-select"].subtitle.visible = true;
                mockData.config.theme["test-select"].subtitle.text.value = "testSubtitleText";
                mockData.config.theme["test-select"].subtitle.text.styles = styling;
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -170, "testSubtitleText", styling);
                expect(setOrigin).toHaveBeenCalledWith(0.5);
            });

            test("does not add subtitle text when subtitle.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle.visible = false;
                mockData.config.theme["test-select"].subtitle.text.value = "testText";
                selectScreen.create();
                expect(selectScreen.add.text).not.toHaveBeenCalledWith(0, -170, "testText");
            });

            test("does not add a subtitle image when subtitle.image is not defined", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle = {
                    visibile: true,
                    image: "",
                };
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -170, "test-select.subtitle");
            });
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(event.bus, "subscribe");
            selectScreen.create();
        });

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
