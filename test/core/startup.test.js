/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { domElement } from "../mock/dom-element";

import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as styles from "../../src/core/custom-styles.js";
import { startup } from "../../src/core/startup.js";
import { addGelButton } from "../../src/core/layout/gel-game-objects.js";
import * as debugModeModule from "../../src/core/debug/debug-mode.js";

jest.mock("../../src/core/custom-styles.js");

describe("Startup", () => {
	let mockGmi;
	let mockGame;
	let containerDiv;

	beforeEach(() => {
		mockGmi = { setGmi: jest.fn(), gameContainerId: "some-id", embedVars: { configPath: "test-config-path" } };
		createMockGmi(mockGmi);

		mockGame = { device: { audio: {} } };
		containerDiv = domElement();
		jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
			if (argument === mockGmi.gameContainerId) {
				return containerDiv;
			}
		});
		jest.spyOn(styles, "addCustomStyles");
		jest.spyOn(Phaser, "Game").mockImplementation(() => mockGame);
		jest.spyOn(a11y, "create").mockImplementation(() => {});
		global.window.getGMI = jest.fn().mockImplementation(() => mockGmi);
		global.window.addEventListener = jest.fn();
		global.Phaser.Loader.FileTypesManager.register = jest.fn();

		global.__BUILD_INFO__ = { version: "test version" };
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	test("instantiates the GMI with correct params", () => {
		const config = { screens: {}, settings: "some settings" };

		startup(config);
		expect(gmiModule.setGmi).toHaveBeenCalledWith(config.settings, global.window);
	});

	test("enables mp4 audio support for all devices", () => {
		const config = { screens: {} };

		startup(config);
		expect(mockGame.device.audio.mp4).toBe(true);
	});

	test("instantiates the GMI with an empty object if settings config not provided", () => {
		startup({ screens: {} });
		expect(gmiModule.setGmi).toHaveBeenCalledWith({}, global.window);
	});

	test("injects custom styles to the game container element", () => {
		startup({ screens: {} });
		expect(styles.addCustomStyles).toHaveBeenCalled();
	});

	test("sets up the accessibility layer", () => {
		startup({ screens: {} });
		expect(a11y.create).toHaveBeenCalled();
	});

	describe("Hook errors", () => {
		test("adds an event listener to listen for errors", () => {
			startup({ screens: {} });
			expect(global.window.addEventListener.mock.calls[0][0]).toBe("error");
		});

		test("finds the container div to display errors", () => {
			startup({ screens: {} });
			expect(global.document.getElementById).toHaveBeenCalledWith("some-id");
		});

		describe("Throwing an error", () => {
			let mockContainer;
			let mockPreTag;
			let realCrel;

			beforeEach(() => {
				mockContainer = domElement();
				mockPreTag = domElement();
				mockContainer.appendChild.mockImplementation(() => mockPreTag);
				global.document.getElementById.mockImplementation(() => mockContainer);
				realCrel = global.document.createElement;
				global.document.createElement = jest.fn(tagName => {
					const domEle = domElement();
					domEle.name = tagName;
					return domEle;
				});
				startup({ screens: {} });
				const errorEvent = { error: { message: "There has been an error" } };
				const errorThrown = global.window.addEventListener.mock.calls[0][1];
				errorThrown(errorEvent);
			});

			afterEach(() => {
				jest.clearAllMocks();
				global.document.createElement = realCrel;
			});

			test("appends an error message to the container when an error event is thrown", () => {
				expect(mockContainer.appendChild.mock.calls[1][0].name).toBe("pre");
			});

			test("sets the correct styling on the error message", () => {
				const expectStyles = {
					position: "absolute",
					top: "0",
					left: "0",
					backgroundColor: "black",
					color: "white",
					padding: "2em",
					width: "calc(100% - 2 * 2em)",
					height: "calc(100% - 2 * 2em)",
				};
				expect(mockPreTag.style).toEqual(expectStyles);
			});

			test("sets the correct error message text", () => {
				const expectedError = "Something isn't working:\n\nThere has been an error\n\n";
				expect(mockPreTag.innerText).toBe(expectedError);
			});
		});
	});

	describe("GelButton GameObject Factory", () => {
		test("registers addGelButton gameobject factory with Phaser", () => {
			const regSpy = jest.fn();
			global.Phaser.GameObjects.GameObjectFactory.register = regSpy;
			startup({ screens: {} });
			expect(regSpy).toHaveBeenCalledWith("gelButton", addGelButton);
		});
	});

	describe("DebugMode", () => {
		test("initilialises debug mode", () => {
			const debugCreateSpy = jest.spyOn(debugModeModule, "create");
			startup({ screens: {} });
			expect(debugCreateSpy).toHaveBeenCalledWith(window, mockGame);
		});
	});
});
