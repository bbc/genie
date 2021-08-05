/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Pause } from "../../../src/components/overlays/pause";
import { gmi } from "../../../src/core/gmi/gmi";

jest.mock("../../../src/core/gmi/gmi");

describe("Pause Overlay", () => {
	let pauseScreen;
	let mockBoundResumeAllFunction;
	let mockData;

	beforeEach(() => {
		gmi.achievements = { get: () => [] };
		mockBoundResumeAllFunction = {
			some: "mock",
		};
		mockData = {
			addedBy: { scene: { key: "game" } },
			navigation: {
				game: { routes: { restart: "home" } },
				"level-select": { routes: { restart: "home" } },
				pause: { routes: { select: "level-select" } },
			},
			config: {
				pause: {},
				game: {},
			},
		};

		pauseScreen = new Pause();
		pauseScreen.sound = {
			pauseAll: jest.fn(),
			resumeAll: {
				bind: () => mockBoundResumeAllFunction,
			},
		};
		pauseScreen.events = { once: jest.fn() };
		pauseScreen.setData(mockData);
		pauseScreen.setLayout = jest.fn();
		pauseScreen.scene = { key: "pause" };
		pauseScreen.add = {
			image: jest.fn(),
		};
	});

	afterEach(() => jest.clearAllMocks());

	describe("preload method", () => {
		test("pauses all sounds", () => {
			pauseScreen.preload();
			expect(pauseScreen.sound.pauseAll).toHaveBeenCalled();
		});

		test("adds a callback to resume all sounds on shutdown", () => {
			pauseScreen.preload();
			expect(pauseScreen.events.once).toHaveBeenCalledWith("shutdown", mockBoundResumeAllFunction);
		});
	});

	describe("create method", () => {
		test("shows an achievements button when there are achievements", () => {
			gmi.achievements = { get: () => [""] };
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith([
				"home",
				"audio",
				"settings",
				"pausePlay",
				"howToPlay",
				"achievements",
				"levelSelect",
				"pauseReplay",
			]);
		});

		test("does not show a achievements button when there are no achievements", () => {
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith([
				"home",
				"audio",
				"settings",
				"pausePlay",
				"howToPlay",
				"levelSelect",
				"pauseReplay",
			]);
		});

		test("shows select button when not above a select screen", () => {
			mockData.addedBy = { scene: { key: "pause" } };
			mockData.navigation["level-select"] = { routes: {} };
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith([
				"home",
				"audio",
				"settings",
				"pausePlay",
				"howToPlay",
				"levelSelect",
			]);
		});

		test("does not show a select button when above a select screen", () => {
			mockData.addedBy = { scene: { key: "level-select" } };
			mockData.navigation["level-select"] = { routes: {} };
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith(["home", "audio", "settings", "pausePlay", "howToPlay"]);
		});

		test("does not show a select button when no select route defined", () => {
			delete mockData.navigation.pause.routes.select;
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith([
				"home",
				"audio",
				"settings",
				"pausePlay",
				"howToPlay",
				"pauseReplay",
			]);
		});

		test("shows a replay button when the parent screen has a restart route", () => {
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith([
				"home",
				"audio",
				"settings",
				"pausePlay",
				"howToPlay",
				"levelSelect",
				"pauseReplay",
			]);
		});

		test("does not show a replay button when the parent screen has no restart route", () => {
			mockData.addedBy = { scene: { key: "level-select" } };
			mockData.navigation["level-select"] = { routes: {} };
			pauseScreen.create();
			expect(pauseScreen.setLayout).toHaveBeenCalledWith(["home", "audio", "settings", "pausePlay", "howToPlay"]);
		});
	});
});
