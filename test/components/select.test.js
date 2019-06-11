/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../mock/dom-element";

import { createMockGmi } from "../mock/gmi";
import { Select } from "../../src/components/select";
import * as accessibleCarouselElements from "../../src/core/accessibility/accessible-carousel-elements.js";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

describe("Select Screen", () => {
    let characterSprites;
    let mockAccessibleElements;
    let mockGame;
    let mockContext;
    let selectScreen;
    let mockGmi;

    beforeEach(() => {
        characterSprites = [{ visible: "" }, { visible: "" }, { visible: "" }];
        mockAccessibleElements = [domElement(), domElement(), domElement()];

        jest.spyOn(accessibleCarouselElements, "create").mockImplementation(() => mockAccessibleElements);
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});

        mockGame = {
            add: {
                image: jest.fn().mockImplementation((x, y, imageName) => imageName),
                button: jest.fn(),
                sprite: jest.fn().mockImplementation((x, y, assetName) => {
                    if (assetName === "characterSelect.character1") {
                        return characterSprites[0];
                    }
                    if (assetName === "characterSelect.character2") {
                        return characterSprites[1];
                    }
                    if (assetName === "characterSelect.character3") {
                        return characterSprites[2];
                    }
                }),
            },
            state: { current: "characterSelect" },
            canvas: { parentElement: {} },
        };

        mockContext = {
            config: {
                theme: {
                    characterSelect: {
                        choices: [{ asset: "character1" }, { asset: "character2" }, { asset: "character3" }],
                    },
                    game: {},
                },
            },
            qaMode: { active: false },
            popupScreens: [],
        };

        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        selectScreen = new Select();
        selectScreen.scene = {
            addToBackground: jest.fn(),
            addLayout: jest.fn(),
        };

        selectScreen.game = mockGame;
        selectScreen.context = mockContext;
        selectScreen.navigation = { next: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => selectScreen.create());

        test("adds a background image", () => {
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "characterSelect.background");
            expect(selectScreen.scene.addToBackground).toHaveBeenCalledWith("characterSelect.background");
        });

        test("adds a title image", () => {
            expect(mockGame.add.image).toHaveBeenCalledWith(0, -150, "characterSelect.title");
            expect(selectScreen.scene.addToBackground).toHaveBeenCalledWith("characterSelect.title");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["home", "audio", "pauseNoReplay", "previous", "next", "continue"];
            expect(selectScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(
                mockGame,
                mockContext,
                selectScreen.scene,
            );
        });

        test("creates sprites for each choice", () => {
            expect(mockGame.add.sprite).toHaveBeenCalledTimes(3);
            expect(mockGame.add.sprite.mock.calls[0]).toEqual([0, 0, "characterSelect.character1"]);
            expect(mockGame.add.sprite.mock.calls[1]).toEqual([0, 0, "characterSelect.character2"]);
            expect(mockGame.add.sprite.mock.calls[2]).toEqual([0, 0, "characterSelect.character3"]);
        });

        test("adds each sprite to the background", () => {
            expect(selectScreen.scene.addToBackground).toHaveBeenCalledWith(characterSprites[0]);
            expect(selectScreen.scene.addToBackground).toHaveBeenCalledWith(characterSprites[1]);
            expect(selectScreen.scene.addToBackground).toHaveBeenCalledWith(characterSprites[2]);
        });

        test("adds the choices", () => {
            expect(selectScreen.choiceSprites).toEqual(characterSprites);
        });

        test("creates an accessible carousel for the choices", () => {
            expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
                "characterSelect",
                selectScreen.choiceSprites,
                mockGame.canvas.parentElement,
                mockContext.config.theme.characterSelect.choices,
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
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("previous");
            expect(signal.bus.subscribe.mock.calls[1][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[1][0].name).toBe("next");
            expect(signal.bus.subscribe.mock.calls[2][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[2][0].name).toBe("continue");
            expect(signal.bus.subscribe.mock.calls[3][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[3][0].name).toBe("pause");
            expect(signal.bus.subscribe.mock.calls[4][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[4][0].name).toBe("play");
        });

        test("moves to the next game screen when the continue button is pressed", () => {
            selectScreen.currentIndex = 1;
            signal.bus.subscribe.mock.calls[2][0].callback();
            expect(selectScreen.navigation.next).toHaveBeenCalledWith({ characterSelected: 1 });
        });

        test("fires a score stat to the GMI with when you select an item ", () => {
            selectScreen.currentIndex = 1;
            signal.bus.subscribe.mock.calls[2][0].callback();
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("characterSelect", "select", {
                metadata: "ELE=[character1]",
            });
        });

        test("hides all the accessible elements when the pause button is pressed", () => {
            selectScreen.currentIndex = 1;
            signal.bus.subscribe.mock.calls[3][0].callback();

            expect(selectScreen.accessibleElements.length).toEqual(3);
            expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
        });

        test("shows the current accessible element when the game is unpaused (by pressing play)", () => {
            selectScreen.currentIndex = 3;
            signal.bus.subscribe.mock.calls[3][0].callback(); //pauses
            signal.bus.subscribe.mock.calls[4][0].callback(); //unpauses

            expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
            expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(false);
        });

        describe("previous button", () => {
            test("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 3).toBeTruthy();
            });

            test("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 1).toBeTruthy();
            });

            test("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            test("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
                expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
                expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            });

            test("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(selectScreen.accessibleElements[0].style.display).toEqual("none");
                expect(selectScreen.accessibleElements[1].style.display).toEqual("block");
                expect(selectScreen.accessibleElements[2].style.display).toEqual("none");
            });
        });

        describe("next button", () => {
            test("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 1).toBeTruthy();
            });

            test("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 3).toBeTruthy();
            });

            test("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            test("set 'aria-hidden' = true on all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();

                expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
                expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
                expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            });

            test("set display: none on all the choices except the current one", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();

                expect(selectScreen.accessibleElements[0].style.display).toBe("none");
                expect(selectScreen.accessibleElements[1].style.display).toBe("block");
                expect(selectScreen.accessibleElements[2].style.display).toBe("none");
            });
        });
    });
});
