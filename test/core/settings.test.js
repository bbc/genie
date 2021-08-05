/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { create as createSettings } from "../../src/core/settings.js";
import { eventBus } from "../../src/core/event-bus.js";

jest.mock("../../src/core/accessibility/accessibility-layer.js");

describe("Settings", () => {
	let mockGame;
	let mockGmi;
	let settings;

	const createGmi = () => {
		mockGmi = { showSettings: jest.fn(() => "show settings"), getAllSettings: jest.fn() };
		createMockGmi(mockGmi);
	};

	beforeEach(() => {
		createGmi();
		jest.spyOn(eventBus, "subscribe").mockImplementation(() => {});
		jest.spyOn(eventBus, "publish").mockImplementation(() => {});

		const layout = [{ buttons: { pause: {} } }];

		mockGame = {
			state: {
				current: "current-screen",
				states: {
					"current-screen": {
						navigation: {
							home: jest.fn(),
							achievements: jest.fn(),
						},
						layoutManager: {
							getLayouts: jest.fn(() => layout),
						},
					},
				},
			},
		};

		settings = createSettings();
	});

	afterEach(() => jest.clearAllMocks());

	describe("show method", () => {
		test("returns GMI show settings", () => {
			const settingsShow = settings.show(mockGame);
			expect(settingsShow).toBe("show settings");
			expect(mockGmi.showSettings).toHaveBeenCalledTimes(1);
		});

		test("publishes a event when a setting has been changed", () => {
			const expectedEvent = {
				channel: "genie-settings",
				name: "audio",
				data: false,
			};
			settings.show(mockGame);
			const onSettingChangedCallback = mockGmi.showSettings.mock.calls[0][0];
			onSettingChangedCallback("audio", false);
			expect(eventBus.publish).toHaveBeenCalledTimes(1);
			expect(eventBus.publish).toHaveBeenCalledWith(expectedEvent);
		});

		test("publishes a event when settings has been closed", () => {
			const expectedEvent = {
				channel: "genie-settings",
				name: "settings-closed",
			};
			settings.show(mockGame);
			const onSettingsClosedCallback = mockGmi.showSettings.mock.calls[0][1];
			onSettingsClosedCallback();
			const publishConfig = eventBus.publish.mock.calls[0][0];
			expect(eventBus.publish).toHaveBeenCalledTimes(1);
			expect(publishConfig.channel).toBe(expectedEvent.channel);
			expect(publishConfig.name).toBe(expectedEvent.name);
		});
	});

	describe("getAllSettings method", () => {
		test("calls GMI get all settings", () => {
			settings.getAllSettings();
			expect(mockGmi.getAllSettings).toHaveBeenCalledTimes(1);
		});
	});
});
