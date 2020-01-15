/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi";
import * as a11y from "../../../src/core/accessibility/accessibilify.js";

import { GameTest } from "../../../src/components/test-screens/game";

describe("Test Screens - Game", () => {
    let mockGmi;
    let gameTest;
    let mockTextAdd;
    let mockImageAdd;
    let mockTransientData;

    beforeEach(() => {
        jest.spyOn(global.console, "log");
        jest.spyOn(a11y, "accessibilify").mockImplementation(() => {});

        mockGmi = {
            getAllSettings: jest.fn(() => ({ gameData: "gameData" })),
            setGameData: jest.fn(),
        };
        createMockGmi(mockGmi);

        mockTextAdd = {
            setOrigin: jest.fn(() => ({
                setInteractive: jest.fn(() => ({
                    on: jest.fn(),
                })),
            })),
        };

        mockImageAdd = {
            setOrigin: jest.fn(() => ({
                setInteractive: jest.fn(() => ({
                    on: jest.fn(),
                })),
            })),
        };
        mockTransientData = {
            "character-select": { choice: { title: "Penfold" } },
        };
        gameTest = new GameTest();
        gameTest.setLayout = jest.fn();
        gameTest.add = {
            image: jest.fn().mockImplementation(() => mockImageAdd),
            text: jest.fn().mockImplementation(() => mockTextAdd),
        };
        gameTest.setLayout = jest.fn();
        gameTest.scene = {
            key: "game",
        };
        gameTest.navigation = { next: jest.fn() };
        gameTest.setData({ transient: mockTransientData, config: { theme: { game: {} } } });
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create method", () => {
        test("adds a background image", () => {
            gameTest.create();
            expect(gameTest.add.image).toHaveBeenCalledWith(0, 0, "home.background");
        });

        test("adds a title", () => {
            gameTest.create();
            expect(gameTest.add.text).toHaveBeenCalledWith(0, -190, "Game goes here", {
                font: "65px ReithSans",
                fill: "#f6931e",
                align: "center",
            });
        });

        test("positions the title in the center", () => {
            const title = { setOrigin: jest.fn() };
            const expectedTitle = "Game goes here";
            gameTest.add.text.mockImplementation((x, y, text) => {
                return text === expectedTitle ? title : mockTextAdd;
            });
            gameTest.create();
            expect(title.setOrigin).toHaveBeenCalledWith(0.5);
        });

        test("adds a pause GEL button to the layout", () => {
            gameTest.create();
            expect(gameTest.setLayout).toHaveBeenCalledWith(["pause"]);
        });

        describe("Game Buttons", () => {
            describe("Button Images", () => {
                let onEvent;
                let buttonImage;

                beforeEach(() => {
                    global.console.log.mockImplementation(() => {});
                    onEvent = jest.fn();
                    buttonImage = {
                        setOrigin: jest.fn(() => ({
                            setInteractive: jest.fn(() => ({
                                on: onEvent,
                            })),
                        })),
                    };
                    gameTest.add.image.mockImplementation((x, y, buttonKey) => {
                        return buttonKey === "game.basicButton" ? buttonImage : mockImageAdd;
                    });
                    gameTest.create();
                });

                test("adds three basic button images", () => {
                    expect(gameTest.add.image).toHaveBeenCalledWith(0, -70, "game.basicButton");
                    expect(gameTest.add.image).toHaveBeenCalledWith(0, 20, "game.basicButton");
                    expect(gameTest.add.image).toHaveBeenCalledWith(0, 110, "game.basicButton");
                });

                test("positions the basic button images in the center", () => {
                    expect(buttonImage.setOrigin).toHaveBeenCalledTimes(3);
                });

                test("sets a pointerdown event on the button image", () => {
                    const clickButtonCall = onEvent.mock.calls[1][0];
                    expect(clickButtonCall).toBe("pointerup");
                });

                test("saves data to the GMI when a button image is clicked", () => {
                    const clickButton = onEvent.mock.calls[1][1];
                    clickButton(2);
                    expect(mockGmi.setGameData).toHaveBeenCalledWith("buttonPressed", 2);
                });

                test("logs game data to the console when the button image is clicked", () => {
                    const clickButton = onEvent.mock.calls[1][1];
                    clickButton(2);
                    expect(global.console.log).toHaveBeenCalledWith("Data saved to GMI:", "gameData");
                });

                test("navigates to the next screen when button image is clicked", () => {
                    const clickButton = onEvent.mock.calls[1][1];
                    clickButton(2);
                    expect(gameTest.navigation.next).toHaveBeenCalled();
                });
            });

            describe("Button Text", () => {
                let onEventText;
                let buttonText;

                beforeEach(() => {
                    global.console.log.mockImplementation(() => {});
                    onEventText = jest.fn();
                    buttonText = {
                        setOrigin: jest.fn(() => ({
                            setInteractive: jest.fn(() => ({
                                on: onEventText,
                            })),
                        })),
                    };
                    gameTest.add.text.mockImplementation((x, y, text) => {
                        return text.includes("Button ") ? buttonText : mockTextAdd;
                    });
                    gameTest.create();
                });

                test("adds three text labels to the buttons", () => {
                    const expectedButtonStyle = {
                        font: "40px ReithSans",
                        fill: "#fff",
                        align: "center",
                        wordWrap: true,
                        wordWrapWidth: 223,
                    };
                    expect(gameTest.add.text).toHaveBeenCalledWith(0, -70, "Button 1", expectedButtonStyle);
                    expect(gameTest.add.text).toHaveBeenCalledWith(0, 20, "Button 2", expectedButtonStyle);
                    expect(gameTest.add.text).toHaveBeenCalledWith(0, 110, "Button 3", expectedButtonStyle);
                });

                test("positions the text labels in the center", () => {
                    expect(buttonText.setOrigin).toHaveBeenCalledTimes(3);
                });

                test("saves data to the GMI when the button text is clicked", () => {
                    const clickButtonText = onEventText.mock.calls[1][1];
                    clickButtonText(2);
                    expect(mockGmi.setGameData).toHaveBeenCalledWith("buttonPressed", 2);
                });

                test("logs game data to the console when the button text is clicked", () => {
                    const clickButtonText = onEventText.mock.calls[1][1];
                    clickButtonText(2);
                    expect(global.console.log).toHaveBeenCalledWith("Data saved to GMI:", "gameData");
                });

                test("navigates to the next screen when button text is clicked", () => {
                    const clickButtonText = onEventText.mock.calls[1][1];
                    clickButtonText(2);
                    expect(gameTest.navigation.next).toHaveBeenCalled();
                });
            });
        });

        test("adds text stating what character was selected", () => {
            gameTest.create();
            expect(gameTest.add.text).toHaveBeenCalledWith(0, 200, "Character Selected: Penfold", {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            });
        });
    });
});
