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
    let mockData;
    let selectScreen;
    let mockGmi;

    beforeEach(() => {
        characterSprites = [{ visible: "" }, { visible: "" }, { visible: "" }];
        mockAccessibleElements = [domElement(), domElement(), domElement()];

        // jest.spyOn(accessibleCarouselElements, "create").mockImplementation(() => mockAccessibleElements);
        // jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});

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
            transientData: {},
            qaMode: { active: false },
            popupScreens: [],
        };

        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        selectScreen = new Select();
        selectScreen.layoutManager = {
            addToBackground: jest.fn(),
            addLayout: jest.fn(),
        };

        selectScreen.scene = { key: "test-select" };
        selectScreen.setData(mockData);
        selectScreen.addLayout = jest.fn();
        selectScreen.navigation = { next: jest.fn() };
        selectScreen.add = {
            image: jest.fn().mockImplementation((x, y, imageName) => imageName),
            button: jest.fn(),
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
            container: jest.fn(),
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

        // TODO P3 Test Harness
        // test("creates a layout harness with correct params", () => {
        //     expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(
        //         mockGame,
        //         mockContext,
        //         selectScreen.layoutManager,
        //     );
        // });

        test("creates sprites for each choice", () => {
            expect(selectScreen.add.sprite).toHaveBeenCalledTimes(3);
            expect(selectScreen.add.sprite.mock.calls[0]).toEqual([0, 0, "test-select.character1"]);
            expect(selectScreen.add.sprite.mock.calls[1]).toEqual([0, 0, "test-select.character2"]);
            expect(selectScreen.add.sprite.mock.calls[2]).toEqual([0, 0, "test-select.character3"]);
        });

        test("adds the choices", () => {
            expect(selectScreen.choiceSprites).toEqual(characterSprites);
        });

        // TODO P3 Accessibility
        // test("creates an accessible carousel for the choices", () => {
        //     expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
        //         "test-select",
        //         selectScreen.choiceSprites,
        //         mockGame.canvas.parentElement,
        //         mockContext.config.theme["test-select"].choices,
        //     );
        // });
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

        // TODO P3 Accessibility
        // test("hides all the accessible elements when the pause button is pressed", () => {
        //     selectScreen.currentIndex = 1;
        //     signal.bus.subscribe.mock.calls[3][0].callback();

        //     expect(selectScreen.accessibleElements.length).toEqual(3);
        //     expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
        //     expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
        //     expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
        // });

        // test("shows the current accessible element when the game is unpaused (by pressing play)", () => {
        //     selectScreen.currentIndex = 2;
        //     signal.bus.subscribe.mock.calls[3][0].callback(); //pauses
        //     signal.bus.subscribe.mock.calls[4][0].callback(); //unpauses

        //     expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
        //     expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
        //     expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(false);
        // });

        describe("previous button", () => {
            test("switches to the last item when the first item is showing", () => {
                selectScreen.currentIndex = 0;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 2).toBeTruthy();
            });

            test("switches to the previous item when any other choice is showing", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(selectScreen.currentIndex === 1).toBeTruthy();
            });

            test("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 2;
                signal.bus.subscribe.mock.calls[0][0].callback();

                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            // TODO P3 Accessibility
            // test("set 'aria-hidden' = true on all the choices except the current one", () => {
            //     selectScreen.currentIndex = 2;
            //     signal.bus.subscribe.mock.calls[0][0].callback();

            //     expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            //     expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
            //     expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            // });

            // test("set display: none on all the choices except the current one", () => {
            //     selectScreen.currentIndex = 2;
            //     signal.bus.subscribe.mock.calls[0][0].callback();

            //     expect(selectScreen.accessibleElements[0].style.display).toEqual("none");
            //     expect(selectScreen.accessibleElements[1].style.display).toEqual("block");
            //     expect(selectScreen.accessibleElements[2].style.display).toEqual("none");
            // });
        });

        describe("next button", () => {
            test("switches to the first item when the last item is showing", () => {
                selectScreen.currentIndex = 3;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 1).toBeTruthy();
            });

            test("switches to the next item when any other choice is showing", () => {
                selectScreen.currentIndex = 1;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.currentIndex === 2).toBeTruthy();
            });

            test("hides all the choices except the current one", () => {
                selectScreen.currentIndex = 0;
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(selectScreen.choiceSprites[0].visible).toBe(false);
                expect(selectScreen.choiceSprites[1].visible).toBe(true);
                expect(selectScreen.choiceSprites[2].visible).toBe(false);
            });

            // TODO P3 Accessibility
            // test("set 'aria-hidden' = true on all the choices except the current one", () => {
            //     selectScreen.currentIndex = 0;
            //     signal.bus.subscribe.mock.calls[1][0].callback();

            //     expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
            //     expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
            //     expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
            // });

            // test("set display: none on all the choices except the current one", () => {
            //     selectScreen.currentIndex = 0;
            //     signal.bus.subscribe.mock.calls[1][0].callback();

            //     expect(selectScreen.accessibleElements[0].style.display).toBe("none");
            //     expect(selectScreen.accessibleElements[1].style.display).toBe("block");
            //     expect(selectScreen.accessibleElements[2].style.display).toBe("none");
            // });
        });
    });
});
