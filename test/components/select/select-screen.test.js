/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../../src/core/event-bus.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as elementBounding from "../../../src/core/helpers/element-bounding.js";
import { Select } from "../../../src/components/select/select-screen.js";
import { GelGrid } from "../../../src/core/layout/grid/grid.js";

jest.mock("../../../src/components/select/single-item-mode.js");
jest.mock("../../../src/core/screen.js");
jest.mock("../../../src/components/select/single-item-mode.js", () => ({
    create: jest.fn(() => ({
        shutdown: jest.fn(),
    })),
    continueBtn: () => [],
}));
jest.mock("../../../src/core/layout/grid/grid.js");
jest.mock("../../../src/core/layout/layout.js", () => ({
    addCustomGroup: jest.fn(),
}));

jest.mock("../../../src/core/state.js", () => ({
    create: jest.fn(() => ({
        getAll: jest.fn(() => []),
        get: jest.fn(() => ({ state: "locked" })),
    })),
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
    let mockCellIds;
    let mockGelGrid;
    let defaultTextStyle;

    beforeEach(() => {
        jest.spyOn(elementBounding, "positionElement").mockImplementation(() => {});

        mockGelGrid = {
            page: 1,
            cellIds: jest.fn(() => mockCellIds),
            addGridCells: jest.fn(() => []),
            makeAccessible: jest.fn(),
            addCell: jest.fn(),
            removeCell: jest.fn(),
            addToGroup: jest.fn(),
            alignChildren: jest.fn(),
            reset: jest.fn(),
            gridMetrics: jest.fn(),
            resetButtons: jest.fn(),
            getCurrentPageKey: jest.fn(),
            resize: jest.fn(),
            showPage: jest.fn(),
        };
        GelGrid.mockImplementation(() => mockGelGrid);
        mockData = {
            config: {
                theme: {
                    "test-select": {
                        titles: [
                            {
                                type: "image",
                                key: "title",
                            },
                            {
                                type: "text",
                                value: "",
                            },
                            {
                                type: "image",
                                key: "subtitle",
                            },
                            {
                                type: "text",
                                value: "",
                                visible: false,
                            },
                        ],
                        states: {
                            locked: { x: 10, y: 20, asset: "test_asset" },
                        },
                        choices: [
                            { asset: "character1" },
                            { asset: "character2", title: "character_2" },
                            { asset: "character3" },
                        ],
                        rows: 1,
                        columns: 1,
                        ease: "Cubic.easeInOut",
                        duration: 500,
                    },
                    game: {},
                },
            },
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
                    getHitAreaBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                pause: {
                    getHitAreaBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                previous: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                next: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                continue: {
                    accessibleElement: { update: jest.fn(), focus: jest.fn() },
                    getBounds: jest.fn(() => mockBounds),
                    input: {},
                    on: jest.fn(),
                },
            },
            addCustomGroup: jest.fn(),
            getSafeArea: jest.fn(() => "layout safe area"),
        };
        mockMetrics = {
            isMobile: false,
            buttonPad: 12,
            screenToCanvas: jest.fn(x => x),
        };
        mockCellIds = [];
        fillRectShapeSpy = jest.fn();
        selectScreen = new Select();

        const addMocks = screen => {
            screen.setData(mockData);
            screen.transientData = {};
            screen.scene = { key: "test-select", scene: { events: { on: jest.fn() } } };
            screen.game = { canvas: { parentElement: "parent-element" } };
            screen.navigation = { next: jest.fn() };
            screen.setLayout = jest.fn(() => mockLayout);
            screen.add = {
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
                    if (assetName === "test_asset") {
                        return "test-sprite";
                    }
                }),
            };
            screen.events = {
                once: jest.fn(),
            };
            screen.addAnimations = jest.fn();

            screen.context = { theme: mockData.config.theme["test-select"] };

            Object.defineProperty(screen, "layout", {
                get: jest.fn(() => mockLayout),
            });

            screen._data = {
                parentScreens: [],
            };
            screen.scene.run = jest.fn();
            screen.scene.bringToTop = jest.fn();

            screen.singleItemMode = {
                shutdown: jest.fn(),
            };
        };

        addMocks(selectScreen);

        Scaler.getMetrics = jest.fn(() => mockMetrics);
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe: jest.fn() })),
        };

        defaultTextStyle = { align: "center", fontFamily: "ReithSans", fontSize: "24px" };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        test("adds a background image", () => {
            selectScreen.create();
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, 0, "test-select.background");
        });

        test("adds GEL buttons to layout", () => {
            selectScreen.create();
            const expectedButtons = ["home", "pause", "previous", "next"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds listener for scaler", () => {
            selectScreen.create();
            expect(Scaler.onScaleChange.add).toHaveBeenCalled();
        });

        test("rescales all elements when screen scales", () => {
            mockData.config.theme["test-select"].titles = [
                {
                    type: "image",
                    key: "",
                },
                {
                    type: "text",
                    value: "title",
                    xOffset: 50,
                    yOffset: 50,
                },
                {
                    type: "image",
                    key: "",
                },
                {
                    type: "text",
                    value: "title",
                    xOffset: 50,
                    yOffset: 50,
                },
            ];

            selectScreen.create();
            const callback = Scaler.onScaleChange.add.mock.calls[0][0];
            callback();

            expect(elementBounding.positionElement).toHaveBeenCalled();
        });

        test("does not rescale titles when they are not present in config", () => {
            mockData.config.theme["test-select"].titles = [];

            selectScreen.create();
            const callback = Scaler.onScaleChange.add.mock.calls[0][0];
            callback();

            expect(elementBounding.positionElement).not.toHaveBeenCalled();
        });

        describe("titles", () => {
            test("adds a title image when title.visible is true and an image is specified", () => {
                selectScreen.create();
                expect(selectScreen.add.image).toHaveBeenCalledWith(0, -270, "test-select.title");
            });

            test("does not add a titles if no config is provided", () => {
                delete mockData.config.theme["test-select"].titles;
                selectScreen.setData(mockData);
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -270, "test-select.title");
                expect(selectScreen.add.text).not.toHaveBeenCalled();
            });

            test("does not add a title image when no image is specified", () => {
                const noImageTheme = mockData.config.theme["test-select"].titles.filter(x => x.type != "image");
                mockData.config.theme["test-select"].titles = noImageTheme;
                selectScreen.create();
                expect(selectScreen.add.image).not.toHaveBeenCalledWith(0, -270, "test-select.title");
            });

            test("adds title text with default styles when text is supplied but no style is provided", () => {
                mockData.config.theme["test-select"].titles[1] = { type: "text", value: "testTitleText" };
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testTitleText", defaultTextStyle);
            });

            test("adds title text with config styles overwriting the default when text is supplied with styling", () => {
                const styling = {
                    id: "titleStyling",
                    fontStyle: "Ariel",
                    ...defaultTextStyle,
                };

                mockData.config.theme["test-select"].titles[1].value = "testTitleText";
                mockData.config.theme["test-select"].titles[1].styles = styling;
                selectScreen.create();
                expect(selectScreen.add.text).toHaveBeenCalledWith(0, -270, "testTitleText", styling);
            });

            test("does respect offset coordinates provided in config", () => {
                mockData.config.theme["test-select"].titles = [
                    {
                        type: "image",
                        key: "title",
                        xOffset: 50,
                        yOffset: 50,
                    },
                    {
                        type: "text",
                        value: "title",
                        xOffset: 50,
                        yOffset: 50,
                    },
                ];
                selectScreen.create();
                expect(selectScreen.add.image).toHaveBeenCalledWith(50, -220, "test-select.title");
                expect(selectScreen.add.text).toHaveBeenCalledWith(50, -220, "title", defaultTextStyle);
            });

            test("creates a new GEL grid with correct params", () => {
                selectScreen.create();
                const mockConfig = mockData.config.theme["test-select"];
                expect(GelGrid).toHaveBeenCalledWith(selectScreen, mockConfig);
            });
        });

        test("creates grid cells", () => {
            selectScreen.create();
            expect(mockGelGrid.addGridCells).toHaveBeenCalledWith(selectScreen.theme);
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
        });

        test("saves choice to transient data", () => {
            mockCellIds = ["key1"];
            selectScreen.create();

            eventBus.subscribe.mock.calls[0][0].callback();
            expect(selectScreen.transientData["test-select"].choice.title).toBe("key1");
        });
    });

    describe("updateStates method", () => {
        test("updates the overlays for cells with matching id", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];
            selectScreen.states.get = () => ({ id: "id_one", state: "locked" });

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, overlayAsset: "test_asset" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.overlays.set).toHaveBeenCalledWith("state", "test-sprite");
        });

        test("Assigns Phaser properties if properties block exists in config", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    sprite: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, properties: { testProp: "testValue" } },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.sprite.testProp).toBe("testValue");
        });

        test("Adds Aria label if suffix property exists in config", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one", ariaLabel: "testLabel" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    sprite: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, suffix: "testSuffix" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.config.ariaLabel).toBe("testLabel testSuffix");
        });

        test("updates the image if an asset property is available in the config block", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, asset: "test_asset" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.setImage).toHaveBeenCalledWith("test_asset");
        });
    });
    describe("create method without continue button", () => {
        test("adds GEL buttons to layout without continue button", () => {
            const modifiedData = mockData;
            modifiedData.config.theme["test-select"].rows = 2;
            selectScreen.setData(modifiedData);
            selectScreen.create();
            const expectedButtons = ["home", "pause", "previous", "next"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });
    });
    describe("resizing button sprites", () => {
        test("", () => {
            selectScreen.create();

            selectScreen._cells = [{ _id: "id_one", overlays: { set: jest.fn() } }];
        });
    });

    describe("onTransitionStart method", () => {
        test("disables the continue button if current cell state is disabled", () => {
            selectScreen.create();
            selectScreen.currentEnabled = jest.fn(() => false);

            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            onTransitionStartFn();

            expect(mockLayout.buttons.continue.input.enabled).toBe(false);
            expect(mockLayout.buttons.continue.alpha).toBe(0.5);
        });

        test("enables the continue button if current cell state is enabled", () => {
            selectScreen.create();
            selectScreen.currentEnabled = jest.fn(() => true);

            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            onTransitionStartFn();

            expect(mockLayout.buttons.continue.input.enabled).toBe(true);
            expect(mockLayout.buttons.continue.alpha).toBe(1);
        });

        test("updates the accessible dom element", () => {
            selectScreen.create();
            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            onTransitionStartFn();
            expect(mockLayout.buttons.continue.accessibleElement.update).toHaveBeenCalled();
        });

        test("does not error if no continue button", () => {
            selectScreen.create();
            delete mockLayout.buttons.continue;
            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            expect(onTransitionStartFn).not.toThrow();
        });
    });
});
