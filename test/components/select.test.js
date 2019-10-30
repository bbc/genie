/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../mock/dom-element";
import { createMockGmi } from "../mock/gmi";

import * as accessibleCarouselElements from "../../src/core/accessibility/accessible-carousel-elements.js";
import * as layoutHarness from "../../src/core/qa/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

import { Select } from "../../src/components/select";

describe("Select Screen", () => {
    let mockAccessibleElements;
    let mockHowToPlayData;
    let characterSprites;
    let selectScreen;
    let mockLayout;
    let mockData;
    let mockGmi;

    beforeEach(() => {
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});

        characterSprites = [{ visible: "" }, { visible: "" }, { visible: "" }];
        mockAccessibleElements = [domElement(), domElement(), domElement()];

        jest.spyOn(accessibleCarouselElements, "create").mockReturnValue(mockAccessibleElements);
        mockData = {
            config: {
                theme: {
                    "test-select": {
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

        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

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
        selectScreen.addLayout = jest.fn(() => mockLayout);
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

        test("adds a title image", () => {
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, -170, "test-select.title");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["home", "audio", "pauseNoReplay", "previous", "next", "continue"];
            expect(selectScreen.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds GEL buttons to layout when how to play", () => {
            selectScreen.setData(mockHowToPlayData);
            selectScreen.create();
            const expectedButtons = ["overlayBack", "audio", "settings", "previous", "next"];
            expect(selectScreen.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates sprites for each choice", () => {
            expect(selectScreen.add.sprite).toHaveBeenCalledTimes(3);
            expect(selectScreen.add.sprite.mock.calls[0]).toEqual([0, 0, "test-select.character1"]);
            expect(selectScreen.add.sprite.mock.calls[1]).toEqual([0, 0, "test-select.character2"]);
            expect(selectScreen.add.sprite.mock.calls[2]).toEqual([0, 0, "test-select.character3"]);
        });

        test("adds the choices", () => {
            expect(selectScreen.choiceSprites).toEqual(characterSprites);
        });

        test("creates a layout harness with correct params", () => {
            selectScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(selectScreen);
        });

        test("does not adjust page title position when on how to play", () => {
            expect(selectScreen.add.image.mock.calls[1]).toEqual([0, -170, "test-select.title"]);
        });

        test("adjusts page title position when on how to play", () => {
            selectScreen.setData(mockHowToPlayData);
            selectScreen.currentIndex = 0;
            jest.clearAllMocks();
            selectScreen.create();

            expect(selectScreen.add.image.mock.calls[1]).toEqual([0, -230, "test-select.title"]);
        });

        test("does not adjust choice sprite position when on how to play", () => {
            expect(selectScreen.add.sprite.mock.calls[0]).toEqual([0, 0, "test-select.character1"]);
        });

        test("adjusts choice sprite position when on how to play", () => {
            selectScreen.setData(mockHowToPlayData);
            selectScreen.currentIndex = 0;
            jest.clearAllMocks();
            selectScreen.create();

            expect(selectScreen.add.sprite.mock.calls[0]).toEqual([0, 30, "test-select.character1"]);
        });

        test("creates an accessible carousel for the choices", () => {
            expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
                selectScreen.scene.key,
                selectScreen.choiceSprites,
                selectScreen.game.canvas.parentElement,
                mockData.config.theme["test-select"].choices,
            );
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "subscribe");
            selectScreen.create();
        });

        test("adds signal subscriptions to all the buttons", () => {
            expect(signal.bus.subscribe).toHaveBeenCalledTimes(5);
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(selectScreen));
            expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("previous");
            expect(signal.bus.subscribe.mock.calls[1][0].channel).toBe(buttonsChannel(selectScreen));
            expect(signal.bus.subscribe.mock.calls[1][0].name).toBe("next");
            expect(signal.bus.subscribe.mock.calls[2][0].channel).toBe(buttonsChannel(selectScreen));
            expect(signal.bus.subscribe.mock.calls[2][0].name).toBe("continue");
            expect(signal.bus.subscribe.mock.calls[3][0].channel).toBe(buttonsChannel(selectScreen));
            expect(signal.bus.subscribe.mock.calls[3][0].name).toBe("pause");
            expect(signal.bus.subscribe.mock.calls[4][0].channel).toBe(buttonsChannel(selectScreen));
            expect(signal.bus.subscribe.mock.calls[4][0].name).toBe("play");
        });

        test("moves to the next game screen when the continue button is pressed", () => {
            signal.bus.subscribe.mock.calls[2][0].callback();
            expect(selectScreen.navigation.next).toHaveBeenCalled();
        });

        test("fires a score stat to the GMI with when you select an item ", () => {
            selectScreen.currentIndex = 1;
            signal.bus.subscribe.mock.calls[2][0].callback();
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("test", "select", {
                metadata: "ELE=[character_2]",
            });
        });

        test("hides all the accessible elements when the pause button is pressed", () => {
            selectScreen.currentIndex = 1;
            signal.bus.subscribe.mock.calls[3][0].callback();

            expect(selectScreen.accessibleCarouselElements.length).toEqual(3);
            expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
        });

        test("shows the current accessible element when the game is unpaused (by pressing play)", () => {
            selectScreen.currentIndex = 2;
            signal.bus.subscribe.mock.calls[3][0].callback(); //pauses
            signal.bus.subscribe.mock.calls[4][0].callback(); //unpauses

            expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(false);
        });

        describe("previous button", () => {
            test("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 0;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 2).toBe(true);
            });

            test("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 1).toBe(true);
            });

            test("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            test("previous button is not disabled when on the first item by default", () => {
                selectScreen.currentIndex = 0;
                selectScreen.update();

                expect(selectScreen.buttonLayout.buttons.previous.visible).toBe(true);
            });

            test("previous button is disabled when how to play and on the first item", () => {
                selectScreen.setData(mockHowToPlayData);
                selectScreen.currentIndex = 0;
                selectScreen.create();
                selectScreen.update();

                expect(selectScreen.buttonLayout.buttons.previous.visible).toBe(false);
            });

            test("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
                expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
                expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            });

            test("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(selectScreen.accessibleCarouselElements[0].style.display).toEqual("none");
                expect(selectScreen.accessibleCarouselElements[1].style.display).toEqual("block");
                expect(selectScreen.accessibleCarouselElements[2].style.display).toEqual("none");
            });
        });

        describe("next button", () => {
            test("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 1).toBe(true);
            });

            test("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 2).toBe(true);
            });

            test("switches to the next item in howtoplay mode", () => {
                selectScreen.setData(mockHowToPlayData);
                selectScreen.create();
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 2).toBe(true);
            });

            test("hides all the choices except the current one", () => {
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            test("next button is not disabled when on the last item by default", () => {
                selectScreen.currentIndex = 2;
                selectScreen.update();

                expect(selectScreen.buttonLayout.buttons.next.visible).toBe(true);
            });

            test("next button is disabled when how to play and on the last item", () => {
                selectScreen.setData(mockHowToPlayData);
                selectScreen.create();
                const nextButtonClick = signal.bus.subscribe.mock.calls[1][0].callback;
                nextButtonClick();
                nextButtonClick();
                expect(selectScreen.buttonLayout.buttons.next.visible).toBe(false);
            });

            test("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 0;
                signal.bus.subscribe.mock.calls[1][0].callback();

                expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
                expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
                expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            });

            test("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 0;
                signal.bus.subscribe.mock.calls[1][0].callback();

                expect(selectScreen.accessibleCarouselElements[0].style.display).toBe("none");
                expect(selectScreen.accessibleCarouselElements[1].style.display).toBe("block");
                expect(selectScreen.accessibleCarouselElements[2].style.display).toBe("none");
            });

            test("focus moves to the next arrow when at the start of the items on How To Play", () => {
                selectScreen.setData(mockHowToPlayData);
                selectScreen.create();
                signal.bus.subscribe.mock.calls[1][0].callback();
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.buttonLayout.buttons.next.accessibleElement.focus).toHaveBeenCalledTimes(1);
            });

            test("focus moves to the previous arrow when at the end of the items on How To Play", () => {
                selectScreen.setData(mockHowToPlayData);
                selectScreen.create();
                const nextButtonClick = signal.bus.subscribe.mock.calls[1][0].callback;
                nextButtonClick();
                nextButtonClick();
                expect(selectScreen.buttonLayout.buttons.previous.accessibleElement.focus).toHaveBeenCalledTimes(1);
            });
        });
    });
});
