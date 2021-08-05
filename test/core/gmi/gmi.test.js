/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("GMI", () => {
	let defaultSettings;
	let fakeWindow;
	let fakeGmiObject;

	beforeEach(() => {
		jest.useFakeTimers();
		defaultSettings = {
			pages: [
				{
					title: "Global Settings",
					settings: [
						{
							key: "audio",
							type: "toggle",
							title: "Audio",
							description: "Turn off/on sound and music",
						},
						{
							key: "motion",
							type: "toggle",
							title: "Motion FX",
							description: "Turn off/on motion effects",
						},
					],
				},
			],
		};
		fakeGmiObject = {
			sendStatsEvent: jest.fn(),
			getAllSettings: jest.fn().mockImplementation(() => "settings"),
		};
		fakeWindow = { getGMI: jest.fn().mockImplementation(() => fakeGmiObject) };
		Object.defineProperty(gmiModule, "gmi", fakeGmiObject);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	describe("setGmi method", () => {
		test("instantiates GMI with the default settings", () => {
			gmiModule.setGmi(defaultSettings, fakeWindow);
			const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
			const expectedSettings = { settingsConfig: defaultSettings };
			expect(actualSettings).toEqual(expectedSettings);
		});

		test("instantiates GMI with custom settings if given", () => {
			const customSettings = {
				pages: [
					{
						title: "Custom Settings",
						settings: [
							{
								key: "colourblind",
								type: "toggle",
								title: "Colourblind mode",
								description: "Turn off/on colour palette with increased contrast",
							},
						],
					},
				],
			};

			gmiModule.setGmi(customSettings, fakeWindow);
			const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
			const expectedSettings = {
				settingsConfig: { pages: defaultSettings.pages.concat(customSettings.pages[0]) },
			};
			expect(actualSettings).toEqual(expectedSettings);
		});

		test("instantiates GMI with extra global settings if given", () => {
			const customSettings = {
				pages: [
					{
						title: "Global Settings",
						settings: [
							{
								key: "subtitles",
								type: "toggle",
								title: "Subtitles",
								description: "Turn off/on subtitles",
							},
						],
					},
				],
			};

			gmiModule.setGmi(customSettings, fakeWindow);
			const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
			defaultSettings.pages[0].settings.push(customSettings.pages[0].settings[0]);
			const expectedSettings = { settingsConfig: defaultSettings };
			expect(actualSettings).toEqual(expectedSettings);
		});

		test("instantiates the GMI with default settings only if custom settings are not provided", () => {
			const customSettings = undefined;
			gmiModule.setGmi(customSettings, fakeWindow);
			const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
			const expectedSettings = { settingsConfig: defaultSettings };
			expect(actualSettings).toEqual(expectedSettings);
		});

		test("does not overwrite the default audio and motion global settings when custom globals are provided", () => {
			const customSettings = {
				pages: [
					{
						title: "Global Settings",
						settings: [
							{
								key: "audio",
								type: "unique-input",
								title: "Different title",
								description: "Some custom override for audio (bad)",
							},
							{
								key: "motion",
								type: "unique-input",
								title: "Different title",
								description: "Some custom override for motion (bad)",
							},
						],
					},
				],
			};

			gmiModule.setGmi(customSettings, fakeWindow);
			const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
			const expectedSettings = { settingsConfig: defaultSettings };
			expect(actualSettings).toEqual(expectedSettings);
		});

		test("returns the GMI instance", () => {
			gmiModule.setGmi(defaultSettings, fakeWindow);
			expect(gmiModule.gmi).toEqual(fakeGmiObject);
		});
	});
});
