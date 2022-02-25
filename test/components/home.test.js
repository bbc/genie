/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";
import * as debugModeModule from "../../src/core/debug/debug-mode.js";
import { gmi } from "../../src/core/gmi/gmi";
import { Home } from "../../src/components/home";

jest.mock("../../src/core/gmi/gmi");

describe("Home Screen", () => {
	let homeScreen;
	let mockData;

	beforeEach(() => {
		gmi.achievements = { get: () => [] };
		gmi.shouldShowExitButton = true;
		homeScreen = new Home();

		mockData = {
			config: { home: {} },
		};

		homeScreen.setData(mockData);
		homeScreen.scene = { key: "home" };
		homeScreen.add = { image: jest.fn() };
		homeScreen.setLayout = jest.fn();
		homeScreen.navigation = { next: jest.fn() };
	});

	afterEach(() => jest.clearAllMocks());

	describe("create method", () => {
		beforeEach(() => {
			homeScreen.create();
		});

		test("adds GEL buttons to layout", () => {
			const expectedButtons = ["howToPlay", "play", "audio", "settings", "exit"];
			expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});
	});

	describe("Achievements button", () => {
		test("shows an achievement button when there are achievements", () => {
			gmi.achievements = { get: () => [""] };
			homeScreen.create();
			const expectedButtons = ["howToPlay", "play", "audio", "settings", "exit", "achievements"];
			expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});
	});

	describe("Exit button", () => {
		test("Does not shows an exit button when gmi.shouldShowExitButton is false", () => {
			gmi.shouldShowExitButton = false;
			homeScreen.create();
			const expectedButtons = ["howToPlay", "play", "audio", "settings"];
			expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});
	});

	describe("Debug button", () => {
		test("adds the debug button when debugMode is set", () => {
			debugModeModule.isDebug = () => true;
			homeScreen.create();
			const expectedButtons = ["howToPlay", "play", "audio", "settings", "exit", "debug"];
			expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});
	});

	describe("Events", () => {
		beforeEach(() => {
			jest.spyOn(eventBus, "subscribe");
			homeScreen.create();
		});

		test("adds a event subscription to the play button", () => {
			expect(eventBus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(homeScreen));
			expect(eventBus.subscribe.mock.calls[0][0].name).toBe("play");
		});

		test("adds a callback for the play button", () => {
			eventBus.subscribe.mock.calls[0][0].callback();
			expect(homeScreen.navigation.next).toHaveBeenCalledTimes(1);
		});
	});
});
