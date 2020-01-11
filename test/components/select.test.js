/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as layoutHarness from "../../src/core/debug/layout-debug-draw.js";
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";
import * as Scaler from "../../src/core/scaler.js";
import * as elementBounding from "../../src/core/helpers/element-bounding.js";

import { Select } from "../../src/components/select.js";
import { GelGrid } from "../../src/core/layout/gel-grid.js";
import * as qaMode from "../../src/core/debug/debug-mode.js";
jest.mock("../../src/core/layout/gel-grid.js");
jest.mock("../../src/core/layout/layout.js", () => ({
    addCustomGroup: jest.fn(),
}));

describe("Select Screen", () => {
    let characterSprites;
    let fillRectShapeSpy;
    let selectScreen;
    let mockLayout;
    let mockData;
    let mockBounds;
    let mockTextBounds;
    let mockMetrics;
    let mockCellKeys;
    let defaultTextStyle;
    let unsubscribe = jest.fn();

    beforeEach(() => {
        jest.spyOn(elementBounding, "positionElement").mockImplementation(() => {});
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});

        const mockGelGrid = {
            cellKeys: jest.fn(() => {
                return mockCellKeys;
            }),
            addGridCells: jest.fn(),
            makeAccessible: jest.fn(),
            addCell: jest.fn(),
            removeCell: jest.fn(),
            addToGroup: jest.fn(),
            alignChildren: jest.fn(),
            reset: jest.fn(),
            gridMetrics: jest.fn(),
            resetButtons: jest.fn(),
            resize: jest.fn(),
        };
        GelGrid.mockImplementation(() => mockGelGrid);
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
        mockBounds = {
            x: 32,
            y: 32,
            height: 64,
            width: 64,
        };
        mockTextBounds = {
            ...mockBounds,
        };
        mockLayout = {
            buttons: {
                home: {
                    getBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                audio: {
                    getBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                previous: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                next: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                continue: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
            },
            addCustomGroup: jest.fn(),
        };
        mockMetrics = {
            isMobile: false,
            buttonPad: 12,
            screenToCanvas: jest.fn(x => x),
        };
        mockCellKeys = [];
        fillRectShapeSpy = jest.fn();
        selectScreen = new Select();
        selectScreen.setData(mockData);
        selectScreen.transientData = {};
        selectScreen.scene = { key: "test-select", scene: { events: { on: jest.fn() } } };
        selectScreen.game = { canvas: { parentElement: "parent-element" } };
        selectScreen.navigation = { next: jest.fn() };
        selectScreen.setLayout = jest.fn(() => mockLayout);
        selectScreen.add = {
            graphics: jest.fn(() => ({
                fillRectShape: fillRectShapeSpy,
                clear: jest.fn(),
                fillStyle: jest.fn(),
            })),
            text: jest.fn(() => ({
                ...mockTextBounds,
                getBounds: jest.fn(() => mockTextBounds),
            })),
            image: jest.fn((x, y, imageName) => imageName),
            sprite: jest.fn((x, y, assetName) => {
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
        selectScreen.addAnimations = jest.fn();
        Object.defineProperty(selectScreen, "layout", {
            get: jest.fn(() => mockLayout),
        });

        Scaler.getMetrics = jest.fn(() => mockMetrics);
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe })),
        };

        defaultTextStyle = { align: "center", fontFamily: "ReithSans", fontSize: "24px" };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        const anything = expect.anything();
        beforeEach(() => selectScreen.create());

        test("adds a background image", () => {
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, 0, "test-select.background");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["home", "audio", "pause", "previous", "next", "continue"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            selectScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(selectScreen);
        });

        test("adds listener for scaler", () => {
            selectScreen.create();
            expect(Scaler.onScaleChange.add).toHaveBeenCalled();
        });

        test("rescales title and subtitles when screen scales", () => {
            mockData.config.theme["test-select"].title = {
                visible: true,
                image: {
                    imageId: "",
                },
                text: {
                    value: "title",
                    xOffset: 50,
                    yOffset: 50,
                },
            };

            mockData.config.theme["test-select"].subtitle = {
                visible: true,
                image: {
                    imageId: "",
                },
                text: {
                    value: "title",
                    xOffset: 50,
                    yOffset: 50,
                },
            };

            selectScreen.create();
            const callback = Scaler.onScaleChange.add.mock.calls[0][0];
            jest.clearAllMocks();
            callback();

            expect(elementBounding.positionElement).toHaveBeenCalled();
        });

        test("does not rescale title and subtitles when they are not present in config", () => {
            mockData.config.theme["test-select"].title = {
                visible: true,
                image: {
                    imageId: "",
                },
                text: {
                    value: "",
                    xOffset: 0,
                    yOffset: 0,
                },
            };

            mockData.config.theme["test-select"].subtitle = {
                visible: true,
                image: {
                    imageId: "",
                },
                text: {
                    value: "",
                    xOffset: 0,
                    yOffset: 0,
                },
            };

            selectScreen.create();
            const callback = Scaler.onScaleChange.add.mock.calls[0][0];
            jest.clearAllMocks();
            callback();

            expect(elementBounding.positionElement).not.toHaveBeenCalled();
        });

        describe("titles", () => {
            test("adds a title image when title.visibile is true and an image is specified", () => {
                expect(selectScreen.add.image).toHaveBeenCalledWith(0, -270, "test-select.title");
            });

            test("does not add a title if no config is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title = undefined;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.title");
                expect(selectScreen.add.text).not.toHaveBeenCalled();
            });

            test("does not add a title image when no image is specified", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.image = "";
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.title");
            });

            test("does not add a title image when title.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.visible = false;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.title");
            });

            test("adds title text with default styles when text is supplied but no style is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.text.value = "testTitleText";
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testTitleText", defaultTextStyle);
            });

            test("adds title text with config styles overwriting the default when text is supplied with styling", () => {
                const styling = {
                    id: "titleStyling",
                    fontStyle: "Ariel",
                    ...defaultTextStyle,
                };

                jest.clearAllMocks();
                mockData.config.theme["test-select"].title.visible = true;
                mockData.config.theme["test-select"].title.text.value = "testTitleText";
                mockData.config.theme["test-select"].title.text.styles = styling;
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testTitleText", styling);
            });

            test("does not add a title text when title.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle.text.value = "testText";
                selectScreen.create();
                expect(selectScreen.add.text).not.toHaveBeenCalledWith(anything, anything, "testText");
            });

            test("does not add a title image when title.image is not defined", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].title = {
                    visibile: true,
                    image: { imageId: "" },
                };
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.title");
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
                expect(selectScreen.add.image).toHaveBeenCalledWith(50, -220, "test-select.title");
                expect(selectScreen.add.text).toHaveBeenCalledWith(50, -220, "title", defaultTextStyle);
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
                expect(selectScreen.add.image).toHaveBeenCalledWith(0, -270, "test-select.subtitle");
            });

            test("does not add a subtitle image when subtitle.visible is false", () => {
                mockData.config.theme["test-select"].subtitle.visible = false;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.subtitle");
            });

            test("does not add a subtitle if no config is provided", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle = undefined;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.subtitle");
                expect(selectScreen.add.text).not.toHaveBeenCalled();
            });

            test("does not add a subtitle image when no image is specified", () => {
                mockData.config.theme["test-select"].subtitle.image = "";
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.subtitle");
            });

            test("adds subtitle text with default styles when text is supplied but no style is provided", () => {
                mockData.config.theme["test-select"].subtitle.visible = true;
                mockData.config.theme["test-select"].subtitle.text.value = "testSubtitleText";
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testSubtitleText", defaultTextStyle);
            });

            test("adds subtitle text with config styles overwriting default styles when text is supplied with styling", () => {
                const styling = {
                    id: "subtitleStyling",
                    ...defaultTextStyle,
                };

                mockData.config.theme["test-select"].subtitle.visible = true;
                mockData.config.theme["test-select"].subtitle.text.value = "testSubtitleText";
                mockData.config.theme["test-select"].subtitle.text.styles = styling;
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testSubtitleText", styling);
            });

            test("does not add subtitle text when subtitle.visible is false", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle.visible = false;
                mockData.config.theme["test-select"].subtitle.text.value = "testText";
                selectScreen.create();
                expect(selectScreen.add.text).not.toHaveBeenCalledWith(anything, anything, "testText");
            });

            test("does not add a subtitle image when subtitle.image is not defined", () => {
                jest.clearAllMocks();
                mockData.config.theme["test-select"].subtitle = {
                    visibile: true,
                    image: "",
                };
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(anything, anything, "test-select.subtitle");
            });
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
        });

        test("adds event subscription to the continue button", () => {
            selectScreen.create();
            expect(eventBus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(selectScreen));
            expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
        });

        test("moves to the next game screen when the continue button is pressed", () => {
            selectScreen.create();
            eventBus.subscribe.mock.calls[0][0].callback();
            expect(selectScreen.navigation.next).toHaveBeenCalled();
        });

        test("adds event subscriptions for grid buttons", () => {
            mockCellKeys = ["key1", "key2"];
            selectScreen.create();
            expect(eventBus.subscribe.mock.calls[0][0].name).toBe("key1");
            expect(eventBus.subscribe.mock.calls[1][0].name).toBe("key2");
        });

        test("moves to the next screen when grid cell is pressed", () => {
            mockCellKeys = ["key1", "key2"];
            selectScreen.create();

            eventBus.subscribe.mock.calls[1][0].callback();
            expect(selectScreen.navigation.next).toHaveBeenCalled();
        });

        test("saves choice to transient data", () => {
            mockCellKeys = ["key1"];
            selectScreen.create();

            eventBus.subscribe.mock.calls[0][0].callback();
            expect(selectScreen.transientData["test-select"].choice.title).toBe("key1");
        });
    });

    describe("Safe Area", () => {
        test("Creates a safe area with the correct offsets in desktop mode", () => {
            selectScreen.create();
            selectScreen.layout.buttons = {
                home: { getBounds: () => ({ x: -500, y: -500, height: 10, width: 10 }) }, //top
                previous: { getBounds: () => ({ x: -500, y: -5, height: 10, width: 10 }) }, //left
                next: { getBounds: () => ({ x: 500, y: -5, height: 10, width: 10 }) }, //right
                continue: { getBounds: () => ({ x: 0, y: 500, height: 10, width: 10 }) }, //bottom
            };

            selectScreen.updateSafeArea(mockMetrics);

            expect(selectScreen.safeArea.x).toBe(-470);
            expect(selectScreen.safeArea.y).toBe(-490);
            expect(selectScreen.safeArea.width).toBe(950);
            expect(selectScreen.safeArea.height).toBe(990);
        });

        test("Creates a safe area with the correct offsets in mobile mode", () => {
            selectScreen.create();
            selectScreen.layout.buttons = {
                home: { getBounds: () => ({ x: -500, y: -500, height: 10, width: 10 }) }, //top
                previous: { getBounds: () => ({ x: -500, y: -5, height: 10, width: 10 }) }, //left
                next: { getBounds: () => ({ x: 500, y: -5, height: 10, width: 10 }) }, //right
                continue: { getBounds: () => ({ x: 0, y: 500, height: 10, width: 10 }) }, //bottom
            };
            mockMetrics.isMobile = true;

            selectScreen.updateSafeArea(mockMetrics);

            expect(selectScreen.safeArea.x).toBe(-490);
            expect(selectScreen.safeArea.y).toBe(-490);
            expect(selectScreen.safeArea.width).toBe(990);
            expect(selectScreen.safeArea.height).toBe(990);
        });
    });

    describe("Debug Mode", () => {
        test("Does not add a graphics object if debug unset", () => {
            qaMode.debugMode = jest.fn(() => false);

            selectScreen.create();
            expect(selectScreen.graphics).not.toBeDefined();
        });

        test("Does draw a debug rect if debug unset", () => {
            qaMode.debugMode = jest.fn(() => false);

            selectScreen.create();
            selectScreen.update();
            expect(fillRectShapeSpy).not.toHaveBeenCalled();
        });

        test("draws a safe area rectangle on update when debugMode is enabled", () => {
            qaMode.debugMode = jest.fn(() => true);

            selectScreen.create();
            selectScreen.update();
            expect(fillRectShapeSpy).toHaveBeenCalled();
        });
    });
});
