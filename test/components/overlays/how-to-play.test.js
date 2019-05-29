/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0

 */
import { domElement } from "../../mock/dom-element";

import * as HowToPlay from "../../../src/components/overlays/how-to-play";
import * as Book from "../../../src/core/book/book.js";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("How To Play Overlay", () => {
    let mockGame;
    let mockScreen;
    let mockTitle;
    let mockBackground;
    let mockOverlayLayout;
    let mockPipsGroup;
    let panel1Sprite;
    let panel2Sprite;
    let panel3Sprite;
    let mockBook;

    beforeEach(() => {
        mockBook = {
            pages: [{ visible: true }, { visible: false }, { visible: false }],
            destroy: jest.fn(),
        };

        jest.spyOn(signal.bus, "subscribe");
        jest.spyOn(Book, "Start").mockImplementation(() => mockBook);
        jest.spyOn(Book, "PreviousPage").mockImplementation(() => mockBook);
        jest.spyOn(Book, "NextPage").mockImplementation(() => mockBook);
        jest.spyOn(Book, "GoToPage").mockImplementation(() => mockBook);

        mockBackground = { destroy: jest.fn() };
        mockOverlayLayout = {
            addBackground: jest.fn().mockImplementation(() => mockBackground),
            disableExistingButtons: jest.fn(),
            moveGelButtonsToTop: jest.fn(),
            moveToTop: jest.fn(),
        };
        jest.spyOn(OverlayLayout, "create").mockImplementation(() => mockOverlayLayout);

        mockTitle = { destroy: jest.fn() };
        mockScreen = {
            visibleLayer: "how-to-play",
            scene: {
                addToBackground: jest.fn().mockImplementation(item => item),
                removeLast: jest.fn(),
            },
            context: {
                popupScreens: [],
                config: {
                    theme: {
                        "how-to-play": {
                            panels: ["panel1", "panel2", "panel3"],
                        },
                    },
                },
            },
            overlayClosed: {
                dispatch: jest.fn(),
            },
        };

        mockPipsGroup = { add: jest.fn(), callAll: jest.fn() };

        panel1Sprite = { visible: "", destroy: jest.fn(), events: { onDestroy: { add: () => {} } } };
        panel2Sprite = { visible: "", destroy: jest.fn() };
        panel3Sprite = { visible: "", destroy: jest.fn() };

        mockGame = {
            add: {
                image: jest.fn().mockImplementation((x, y, imageName) => {
                    if (imageName === "howToPlay.title") {
                        return mockTitle;
                    }
                    if (imageName === "howToPlay.panel1") {
                        return panel1Sprite;
                    }
                    if (imageName === "howToPlay.panel2") {
                        return panel2Sprite;
                    }
                    if (imageName === "howToPlay.panel3") {
                        return panel3Sprite;
                    }
                    return "background";
                }),
                button: jest.fn(),
                group: jest.fn().mockImplementation(() => mockPipsGroup),
            },
            state: { current: "howToPlay", states: { howToPlay: mockScreen } },
            canvas: domElement(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create method", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

        test("adds the screen to the current screens", () => {
            expect(mockGame.state.states[mockGame.state.current]).toEqual(mockScreen);
        });

        test("adds 'how-to-play' to the popup screens", () => {
            expect(mockScreen.context.popupScreens).toEqual(["how-to-play"]);
        });

        test("creates a new overlay layout manager", () => {
            expect(OverlayLayout.create).toHaveBeenCalledWith(mockGame.state.states.howToPlay);
        });

        test("adds a background image and passes it to the overlay manager", () => {
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "howToPlay.background");
        });

        test("creates a title and adds it to the background", () => {
            expect(mockGame.add.image).toHaveBeenCalledWith(0, -230, "howToPlay.title");
        });

        test("creates a book with correct params", () => {
            const expectedTheme = mockScreen.context.config.theme["how-to-play"];
            expect(Book.Start).toHaveBeenCalledWith(
                "howToPlay",
                expectedTheme,
                mockGame,
                mockScreen,
                mockOverlayLayout,
                expectedTheme.panelText,
            );
        });
    });

    describe("pips", () => {
        test("creates pip sprites for each panel and calculates their position", () => {
            HowToPlay.create({ game: mockGame });
            const pip1 = mockGame.add.button.mock.calls[0];
            const pip2 = mockGame.add.button.mock.calls[1];
            const pip3 = mockGame.add.button.mock.calls[1];

            expect(pip1[0]).toBe(-39);
            expect(pip1[1]).toBe(240);
            expect(pip1[2]).toBe("howToPlay.pipOn");

            expect(pip2[0]).toBe(-8);
            expect(pip2[1]).toBe(240);
            expect(pip2[2]).toBe("howToPlay.pipOff");

            expect(pip3[0]).toBe(-8);
            expect(pip3[1]).toBe(240);
            expect(pip3[2]).toBe("howToPlay.pipOff");
        });

        test("adds the pips group to the background", () => {
            HowToPlay.create({ game: mockGame });
            expect(mockScreen.scene.addToBackground).toHaveBeenCalledWith(mockPipsGroup);
        });

        test("goes to the correct page in the book when a pip is clicked", () => {
            HowToPlay.create({ game: mockGame });
            const pip2Callback = mockGame.add.button.mock.calls[1][3];
            pip2Callback();
            expect(Book.GoToPage).toHaveBeenCalledWith(2, mockBook);
        });

        test("does not move to another page in the book if the clicked pip is on", () => {
            HowToPlay.create({ game: mockGame });
            const pip1Callback = mockGame.add.button.mock.calls[0][3];
            pip1Callback();
            expect(Book.GoToPage).not.toHaveBeenCalled();
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            HowToPlay.create({ game: mockGame });
        });

        test("adds signal subscriptions to the GEL buttons", () => {
            expect(signal.bus.subscribe).toHaveBeenCalledTimes(3);
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe("how-to-play-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("back");
            expect(signal.bus.subscribe.mock.calls[1][0].channel).toBe("how-to-play-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[1][0].name).toBe("previous");
            expect(signal.bus.subscribe.mock.calls[2][0].channel).toBe("how-to-play-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[2][0].name).toBe("next");
        });

        describe("back button click", () => {
            beforeEach(() => {
                jest.spyOn(signal.bus, "removeChannel");
                const clickBackButton = signal.bus.subscribe.mock.calls[0][0].callback;
                clickBackButton();
            });

            test("removes subscribed-to channel for this overlay when the back button is clicked", () => {
                expect(signal.bus.removeChannel).toHaveBeenCalledWith("how-to-play-gel-buttons");
            });

            test("destroys the book", () => {
                expect(mockBook.destroy).toHaveBeenCalled();
            });

            test("destroys the pips group", () => {
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("kill");
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("destroy");
            });

            test("destroys the title and background", () => {
                expect(mockBackground.destroy).toHaveBeenCalledTimes(1);
                expect(mockTitle.destroy).toHaveBeenCalledTimes(1);
            });

            test("dispatches overlayClosed signal on screen", () => {
                expect(mockScreen.overlayClosed.dispatch).toHaveBeenCalled();
            });

            test("removes the scene", () => {
                expect(mockScreen.scene.removeLast).toHaveBeenCalled();
            });
        });

        describe("previous button click", () => {
            beforeEach(() => {
                const clickPreviousButton = signal.bus.subscribe.mock.calls[1][0].callback;
                clickPreviousButton();
            });

            test("switches to the previous page in the book", () => {
                expect(Book.PreviousPage).toHaveBeenCalledWith(mockBook);
            });

            test("destroys the pips group", () => {
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("kill");
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("destroy");
            });

            test("creates a new pips group", () => {
                expect(mockScreen.scene.addToBackground).toHaveBeenCalledTimes(3);
            });
        });

        describe("next button click", () => {
            beforeEach(() => {
                const clickNextButton = signal.bus.subscribe.mock.calls[2][0].callback;
                clickNextButton();
            });

            test("switches to the previous page in the book", () => {
                expect(Book.NextPage).toHaveBeenCalledWith(mockBook);
            });

            test("destroys the pips group", () => {
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("kill");
                expect(mockPipsGroup.callAll).toHaveBeenCalledWith("destroy");
            });

            test("creates a new pips group", () => {
                expect(mockScreen.scene.addToBackground).toHaveBeenCalledTimes(3);
            });
        });
    });
});
