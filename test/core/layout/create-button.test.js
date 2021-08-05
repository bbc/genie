/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createButton } from "../../../src/core/layout/create-button.js";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/core/accessibility/accessibilify";
import { eventBus } from "../../../src/core/event-bus.js";
import * as settingsModule from "../../../src/core/settings.js";

jest.mock("../../../src/core/settings.js");

describe("Layout - Button Factory", () => {
	let mockScene;
	let mockButton;

	beforeEach(() => {
		mockButton = {
			disableInteractive: jest.fn(),
			input: {},
		};
		jest.spyOn(accessibilify, "accessibilify").mockImplementation(() => {});
		jest.spyOn(GelButton, "GelButton").mockImplementation(() => mockButton);

		mockScene = { canvas: () => {}, mockGame: "game", add: { gelButton: jest.fn(() => mockButton) } };
	});

	afterEach(() => jest.clearAllMocks());

	describe("createButton method", () => {
		const expectedKey = "play";
		const config = {
			id: "expectedId",
			ariaLabel: "expectedAriaLabel",
			key: expectedKey,
			action: () => {},
		};

		beforeEach(() => {
			createButton(mockScene, config);
		});

		test("creates a GEL button", () => {
			const actualParams = mockScene.add.gelButton.mock.calls[0];
			expect(actualParams.length).toEqual(3);
			expect(actualParams[0]).toBe(0);
			expect(actualParams[1]).toBe(0);
			expect(actualParams[2]).toEqual(config);
		});

		test("adds defaults actions to the event bus", () => {
			const buttonsChannel = "buttonsChannel";
			const config = {
				id: "play",
				action: jest.fn(),
				channel: buttonsChannel,
			};

			createButton(mockScene, config);

			eventBus.publish({ channel: buttonsChannel, name: "play" });
			eventBus.publish({ channel: buttonsChannel, name: "play" });

			expect(config.action).toHaveBeenCalledTimes(2);
			eventBus.removeChannel(buttonsChannel);
		});

		test("disables hitArea and input for icons", () => {
			const config = {
				title: "FX Off",
				icon: true,
			};

			const btn = createButton(mockScene, config);

			expect(btn.input.hitArea).toBe(null);
			expect(btn.disableInteractive).toHaveBeenCalledTimes(1);
		});

		test("accessibilifies button when accessible is true and icon is false", () => {
			const config = {
				title: "button",
				icon: false,
				accessible: true,
			};

			createButton(mockScene, config);

			expect(accessibilify.accessibilify).toHaveBeenCalledWith(mockButton, false);
		});

		test("accessibilifies button with true when accessible is true, icon is false and gameButton is true", () => {
			const config = {
				title: "button",
				icon: false,
				accessible: true,
				gameButton: true,
			};

			createButton(mockScene, config);

			expect(accessibilify.accessibilify).toHaveBeenCalledWith(mockButton, true);
		});

		test("does not accessibilify button when accessible is false and icon is false", () => {
			const config = {
				title: "button",
				icon: false,
				accessible: false,
			};

			createButton(mockScene, config);

			expect(accessibilify.accessibilify).not.toHaveBeenCalled();
		});
	});

	describe("audio button", () => {
		test("sets audio button config key to audio-on if gmi audio setting is true", () => {
			const mockSettings = { getAllSettings: () => ({ audio: true }) };
			Object.defineProperty(settingsModule, "settings", {
				get: jest.fn(() => mockSettings),
			});

			createButton(mockScene, { id: "audio" });
			expect(mockScene.add.gelButton.mock.calls[0][2].key).toBe("audio-on");
		});

		test("sets audio button config key to audio-off if gmi audio setting is true", () => {
			const mockSettings = { getAllSettings: () => ({ audio: false }) };
			Object.defineProperty(settingsModule, "settings", {
				get: jest.fn(() => mockSettings),
			});

			createButton(mockScene, { id: "audio" });

			expect(mockScene.add.gelButton.mock.calls[0][2].key).toBe("audio-off");
		});
	});
});
