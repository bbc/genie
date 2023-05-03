/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../mock/dom-element";
import { createMockGmi } from "../mock/gmi";

import * as accessibleCarouselElements from "../../src/core/accessibility/accessible-carousel-elements.js";
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";
import { HowToPlay } from "../../src/components/how-to-play.js";

describe("How To Play Screen", () => {
	let mockAccessibleElements;
	let mockHowToPlayData;
	let characterSprites;
	let howToPlayScreen;
	let mockLayout;
	let mockData;
	let mockGmi;

	beforeEach(() => {
		characterSprites = [{ visible: "" }, { visible: "" }, { visible: "" }];
		mockAccessibleElements = [domElement(), domElement(), domElement()];

		jest.spyOn(accessibleCarouselElements, "create").mockReturnValue(mockAccessibleElements);
		mockData = {
			config: {
				"test-select": {
					choices: [
						{ asset: "character1" },
						{ asset: "character2", title: "character_2" },
						{ asset: "character3" },
					],
				},
				game: {},
			},
			popupScreens: [],
		};
		mockHowToPlayData = {
			config: {
				"test-select": {
					choices: [
						{ asset: "character1" },
						{ asset: "character2", title: "character_2" },
						{ asset: "character3" },
					],
				},
				game: {},
			},
			popupScreens: [],
		};

		mockGmi = { sendStatsEvent: jest.fn() };
		createMockGmi(mockGmi);

		mockLayout = {
			buttons: {
				previous: { accessibleElement: { el: { focus: jest.fn() }, update: jest.fn() } },
				next: { accessibleElement: { el: { focus: jest.fn() }, update: jest.fn() } },
			},
		};
		howToPlayScreen = new HowToPlay();
		howToPlayScreen.setData(mockData);
		howToPlayScreen.transientData = {};
		howToPlayScreen.scene = { key: "test-select" };
		howToPlayScreen.game = { canvas: { parentElement: "parent-element" } };
		howToPlayScreen.navigation = { next: jest.fn() };
		howToPlayScreen.setLayout = jest.fn(() => mockLayout);
		Object.defineProperty(howToPlayScreen, "layout", {
			get: jest.fn(() => mockLayout),
		});
		howToPlayScreen.add = {
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

	afterEach(jest.clearAllMocks);

	describe("create method", () => {
		beforeEach(() => howToPlayScreen.create());

		test("adds GEL buttons to layout", () => {
			const expectedButtons = ["overlayBack", "audio", "settings", "previous", "next"];
			expect(howToPlayScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});

		test("creates sprites for each choice", () => {
			expect(howToPlayScreen.add.sprite).toHaveBeenCalledTimes(3);
			expect(howToPlayScreen.add.sprite.mock.calls[0]).toEqual([0, 30, "test-select.character1"]);
			expect(howToPlayScreen.add.sprite.mock.calls[1]).toEqual([0, 30, "test-select.character2"]);
			expect(howToPlayScreen.add.sprite.mock.calls[2]).toEqual([0, 30, "test-select.character3"]);
		});

		test("adds the choices", () => {
			expect(howToPlayScreen.choiceSprites).toEqual(characterSprites);
		});

		test("sets choice sprite position", () => {
			howToPlayScreen.setData(mockHowToPlayData);
			howToPlayScreen.currentIndex = 0;
			jest.clearAllMocks();
			howToPlayScreen.create();

			expect(howToPlayScreen.add.sprite.mock.calls[0]).toEqual([0, 30, "test-select.character1"]);
		});

		test("creates an accessible carousel for the choices", () => {
			expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
				howToPlayScreen.scene.key,
				howToPlayScreen.choiceSprites,
				howToPlayScreen.game.canvas.parentElement,
				mockData.config["test-select"].choices,
			);
		});
	});

	describe("events", () => {
		beforeEach(() => {
			jest.spyOn(eventBus, "subscribe");
			howToPlayScreen.create();
		});

		test("adds event subscriptions to all the buttons", () => {
			expect(eventBus.subscribe).toHaveBeenCalledTimes(5);
			expect(eventBus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(howToPlayScreen));
			expect(eventBus.subscribe.mock.calls[0][0].name).toBe("previous");
			expect(eventBus.subscribe.mock.calls[1][0].channel).toBe(buttonsChannel(howToPlayScreen));
			expect(eventBus.subscribe.mock.calls[1][0].name).toBe("next");
			expect(eventBus.subscribe.mock.calls[2][0].channel).toBe(buttonsChannel(howToPlayScreen));
			expect(eventBus.subscribe.mock.calls[2][0].name).toBe("continue");
			expect(eventBus.subscribe.mock.calls[3][0].channel).toBe(buttonsChannel(howToPlayScreen));
			expect(eventBus.subscribe.mock.calls[3][0].name).toBe("pause");
			expect(eventBus.subscribe.mock.calls[4][0].channel).toBe(buttonsChannel(howToPlayScreen));
			expect(eventBus.subscribe.mock.calls[4][0].name).toBe("play");
		});

		test("moves to the next game screen when the continue button is pressed", () => {
			eventBus.subscribe.mock.calls[2][0].callback();
			expect(howToPlayScreen.navigation.next).toHaveBeenCalled();
		});

		test("fires a score stat to the GMI with when you select an item ", () => {
			howToPlayScreen.currentIndex = 1;
			eventBus.subscribe.mock.calls[2][0].callback();
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("test", "select", {
				metadata: "ELE=[character_2]",
			});
		});

		test("hides all the accessible elements when the pause button is pressed", () => {
			howToPlayScreen.currentIndex = 1;
			eventBus.subscribe.mock.calls[3][0].callback();

			expect(howToPlayScreen.accessibleCarouselElements.length).toEqual(3);
			expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
			expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
			expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
		});

		test("shows the current accessible element when the game is unpaused (by pressing play)", () => {
			howToPlayScreen.currentIndex = 2;
			eventBus.subscribe.mock.calls[3][0].callback(); //pauses
			eventBus.subscribe.mock.calls[4][0].callback(); //unpauses

			expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
			expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(true);
			expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(false);
		});

		describe("previous button", () => {
			test("switches to the last item when the first item is showing", () => {
				howToPlayScreen.currentIndex = 0;
				eventBus.subscribe.mock.calls[0][0].callback();
				expect(howToPlayScreen.currentIndex === 2).toBe(true);
			});

			test("switches to the previous item when any other choice is showing", () => {
				howToPlayScreen.currentIndex = 2;
				eventBus.subscribe.mock.calls[0][0].callback();
				expect(howToPlayScreen.currentIndex === 1).toBe(true);
			});

			test("hides all the choices except the current one", () => {
				howToPlayScreen.currentIndex = 2;
				eventBus.subscribe.mock.calls[0][0].callback();

				expect(howToPlayScreen.choiceSprites[0].visible).toBe(false);
				expect(howToPlayScreen.choiceSprites[1].visible).toBe(true);
				expect(howToPlayScreen.choiceSprites[2].visible).toBe(false);
			});

			test("previous button is disabled when on the first item", () => {
				howToPlayScreen.setData(mockHowToPlayData);
				howToPlayScreen.currentIndex = 0;
				howToPlayScreen.create();
				howToPlayScreen.update();

				expect(howToPlayScreen.layout.buttons.previous.visible).toBe(false);
				expect(howToPlayScreen.layout.buttons.previous.accessibleElement.update).toHaveBeenCalled();
			});

			test("set 'aria-hidden' = true on all the choices except the current one", () => {
				howToPlayScreen.currentIndex = 2;
				eventBus.subscribe.mock.calls[0][0].callback();

				expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
				expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
				expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
			});

			test("set display: none on all the choices except the current one", () => {
				howToPlayScreen.currentIndex = 2;
				eventBus.subscribe.mock.calls[0][0].callback();

				expect(howToPlayScreen.accessibleCarouselElements[0].style.display).toEqual("none");
				expect(howToPlayScreen.accessibleCarouselElements[1].style.display).toEqual("block");
				expect(howToPlayScreen.accessibleCarouselElements[2].style.display).toEqual("none");
			});
		});

		describe("next button", () => {
			test("switches to the first item when the last item is showing", () => {
				howToPlayScreen.currentIndex = 3;
				eventBus.subscribe.mock.calls[1][0].callback();
				expect(howToPlayScreen.currentIndex === 1).toBe(true);
			});

			test("switches to the next item when any other choice is showing", () => {
				howToPlayScreen.currentIndex = 1;
				eventBus.subscribe.mock.calls[1][0].callback();
				expect(howToPlayScreen.currentIndex === 2).toBe(true);
			});

			test("switches to the next item in howtoplay mode", () => {
				howToPlayScreen.setData(mockHowToPlayData);
				howToPlayScreen.create();
				howToPlayScreen.currentIndex = 1;
				eventBus.subscribe.mock.calls[1][0].callback();
				expect(howToPlayScreen.currentIndex === 2).toBe(true);
			});

			test("hides all the choices except the current one", () => {
				eventBus.subscribe.mock.calls[1][0].callback();
				expect(howToPlayScreen.choiceSprites[0].visible).toBe(false);
				expect(howToPlayScreen.choiceSprites[1].visible).toBe(true);
				expect(howToPlayScreen.choiceSprites[2].visible).toBe(false);
			});

			test("next button is not disabled when on the last item by default", () => {
				howToPlayScreen.currentIndex = 2;
				howToPlayScreen.update();

				expect(howToPlayScreen.layout.buttons.next.visible).toBe(true);
			});

			test("next button is disabled when how to play and on the last item", () => {
				howToPlayScreen.setData(mockHowToPlayData);
				howToPlayScreen.create();
				const nextButtonClick = eventBus.subscribe.mock.calls[1][0].callback;
				nextButtonClick();
				nextButtonClick();
				expect(howToPlayScreen.layout.buttons.next.visible).toBe(false);
				expect(howToPlayScreen.layout.buttons.next.accessibleElement.update).toHaveBeenCalled();
			});

			test("set 'aria-hidden' = true on all the choices except the current one", () => {
				howToPlayScreen.currentIndex = 0;
				eventBus.subscribe.mock.calls[1][0].callback();

				expect(mockAccessibleElements[0].attributes["aria-hidden"]).toBe(true);
				expect(mockAccessibleElements[1].attributes["aria-hidden"]).toBe(false);
				expect(mockAccessibleElements[2].attributes["aria-hidden"]).toBe(true);
			});

			test("set display: none on all the choices except the current one", () => {
				howToPlayScreen.currentIndex = 0;
				eventBus.subscribe.mock.calls[1][0].callback();

				expect(howToPlayScreen.accessibleCarouselElements[0].style.display).toBe("none");
				expect(howToPlayScreen.accessibleCarouselElements[1].style.display).toBe("block");
				expect(howToPlayScreen.accessibleCarouselElements[2].style.display).toBe("none");
			});

			test("focus moves to the next arrow when at the start of the items on How To Play", () => {
				howToPlayScreen.setData(mockHowToPlayData);
				howToPlayScreen.create();
				eventBus.subscribe.mock.calls[1][0].callback();
				eventBus.subscribe.mock.calls[0][0].callback();
				expect(howToPlayScreen.layout.buttons.next.accessibleElement.el.focus).toHaveBeenCalledTimes(1);
			});

			test("focus moves to the previous arrow when at the end of the items on How To Play", () => {
				howToPlayScreen.setData(mockHowToPlayData);
				howToPlayScreen.create();
				const nextButtonClick = eventBus.subscribe.mock.calls[1][0].callback;
				nextButtonClick();
				nextButtonClick();
				expect(howToPlayScreen.layout.buttons.previous.accessibleElement.el.focus).toHaveBeenCalledTimes(1);
			});
		});
	});
});
