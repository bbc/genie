/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";

import { groupLayouts } from "../../../src/core/layout/group-layouts.js";
import { onScaleChange } from "../../../src/core/scaler.js";
import { GelGroup } from "../../../src/core/layout/gel-group.js";
import * as Layout from "../../../src/core/layout/layout.js";
import * as settingsIcons from "../../../src/core/layout/settings-icons.js";

jest.mock("../../../src/core/layout/gel-group.js");

describe("Layout", () => {
	const sixGelButtons = ["achievements", "exit", "howToPlay", "play", "audio", "settings"];
	const expectedNumberOfGroupLayouts = 12;

	let mockGmi;
	let mockRoot;
	let mockJson;
	let mockScene;
	let mockMetrics;
	let mockInputUpAdd;
	let mockGelGroup;
	let mockEventUnsubscribe;
	let settingsIconsUnsubscribeSpy;
	let mockHitAreaBounds;

	beforeEach(() => {
		mockGmi = {
			getAllSettings: jest.fn(() => ({ audio: true, motion: true })),
			shouldDisplayMuteButton: true,
			shouldShowExitButton: true,
		};
		createMockGmi(mockGmi);

		mockRoot = {
			add: jest.fn(),
			addAt: jest.fn(),
			destroy: jest.fn(),
			setScrollFactor: jest.fn(),
		};

		mockJson = {
			theme: {
				mockSceneKey: { "button-overrides": {} },
			},
		};

		mockScene = {
			add: {
				container: jest.fn(() => mockRoot),
			},
			cache: {
				json: {
					get: () => {
						return mockJson;
					},
				},
			},
			scene: {
				key: "mockSceneKey",
			},
			config: mockJson.theme.mockSceneKey,
		};

		mockMetrics = {
			horizontals: jest.fn(),
			safeHorizontals: jest.fn(),
			verticals: jest.fn(),
			isMobile: true,
			screenToCanvas: jest.fn(x => x),
			stageHeight: 800,
			horizontalBorderPad: 16,
			verticalBorderPad: 16,
		};

		mockHitAreaBounds = { left: 0, top: 0, width: 200, height: 100 };
		const mockButton = {
			buttonName: "test_button",
			onInputUp: { add: mockInputUpAdd },
			getHitAreaBounds: jest.fn(() => mockHitAreaBounds),
		};

		mockInputUpAdd = jest.fn();
		mockGelGroup = {
			addButton: jest.fn(config => ({
				buttonName: config,
				config,
				onInputUp: { add: mockInputUpAdd },
				getHitAreaBounds: jest.fn(() => mockHitAreaBounds),
			})),
			iterate: jest.fn(x => {
				x(mockButton);
			}),
			reset: jest.fn(),
			addToGroup: jest.fn(),
			destroy: jest.fn(),
			makeAccessible: jest.fn(),
			addCustomGroup: jest.fn(),
			getBoundingRect: jest.fn(() => mockHitAreaBounds),
			list: [mockButton],
		};
		GelGroup.mockImplementation(() => mockGelGroup);

		settingsIconsUnsubscribeSpy = jest.fn();
		jest.spyOn(settingsIcons, "create").mockImplementation(() => ({ unsubscribe: settingsIconsUnsubscribeSpy }));

		mockEventUnsubscribe = jest.fn();
		jest.spyOn(onScaleChange, "add").mockImplementation(() => ({ unsubscribe: mockEventUnsubscribe }));
	});

	afterEach(() => jest.clearAllMocks());

	describe("Creation", () => {
		test("sets root scrollFactor to zero so camera movement is ignored", () => {
			Layout.create(mockScene, mockMetrics, ["achievements"]);
			expect(mockRoot.setScrollFactor).toHaveBeenCalledWith(0);
		});
		test("adds the correct number of GEL buttons for a given config", () => {
			const layout1 = Layout.create(mockScene, mockMetrics, ["achievements"]);
			expect(Object.keys(layout1.buttons).length).toBe(1);

			const layout2 = Layout.create(mockScene, mockMetrics, ["play", "audio", "settings"]);
			expect(Object.keys(layout2.buttons).length).toBe(3);

			const layout3 = Layout.create(mockScene, mockMetrics, sixGelButtons);
			expect(Object.keys(layout3.buttons).length).toBe(6);
		});

		test("skips the creation of the mute button when gmi.shouldDisplayMuteButton is false", () => {
			mockGmi.shouldDisplayMuteButton = false;
			const layout = Layout.create(mockScene, mockMetrics, sixGelButtons);
			expect(layout.buttons.audio).not.toBeDefined();
		});

		test("skips the creation of the exit button when gmi.shouldShowExitButton is false", () => {
			mockGmi.shouldShowExitButton = false;
			const layout = Layout.create(mockScene, mockMetrics, sixGelButtons);
			expect(layout.buttons.exit).not.toBeDefined();
		});

		test("makes a new group for each group layout", () => {
			const getExpectedParams = callNumber => [
				mockScene,
				mockRoot,
				groupLayouts[callNumber].vPos,
				groupLayouts[callNumber].hPos,
				mockMetrics,
				groupLayouts[callNumber].safe,
				groupLayouts[callNumber].arrangeV,
			];
			Layout.create(mockScene, mockMetrics, sixGelButtons);
			expect(GelGroup).toHaveBeenCalledTimes(groupLayouts.length);
			GelGroup.mock.calls.forEach((call, index) => {
				expect(GelGroup.mock.calls[index]).toEqual(getExpectedParams(index));
			});
		});

		test("adds buttons using the correct tab order", () => {
			const rndOrder = [
				"exit",
				"home",
				"achievements",
				"howToPlay",
				"play",
				"settings",
				"audio",
				"previous",
				"next",
				"continue",
				"restart",
				"back",
				"pause",
			];
			const tabOrder = [
				"exit",
				"home",
				"back",
				"audio",
				"settings",
				"pause",
				"previous",
				"play",
				"next",
				"achievements",
				"restart",
				"continue",
				"howToPlay",
			];

			const layout = Layout.create(mockScene, mockMetrics, rndOrder);
			expect(Object.keys(layout.buttons)).toEqual(tabOrder);
		});

		test("resets the groups after they have been added to the layout", () => {
			Layout.create(mockScene, mockMetrics, []);
			expect(mockGelGroup.reset).toHaveBeenCalledTimes(expectedNumberOfGroupLayouts);
			expect(mockGelGroup.reset).toHaveBeenCalledWith(mockMetrics);
		});

		test("subscribes to the scaler sizeChange event", () => {
			const layout = Layout.create(mockScene, mockMetrics, ["play"]);
			expect(onScaleChange.add).toHaveBeenCalledWith(layout.resize);
		});

		test("creates the settings icons", () => {
			mockScene.config.subtitle = undefined;
			Layout.create(mockScene, mockMetrics, ["play"]);
			expect(settingsIcons.create).toHaveBeenCalledWith(mockGelGroup, ["play"]);
		});

		test("doesn't create the settings icon if there is a subtitle", () => {
			mockScene.config.subtitle = "subtitle";
			Layout.create(mockScene, mockMetrics, ["play"]);
			expect(settingsIcons.create).not.toHaveBeenCalled();
		});
	});

	describe("addCustomGroup Method", () => {
		test("returns group", () => {
			const layout = Layout.create(mockScene, mockMetrics, sixGelButtons);
			const key = "test_key";
			const customGroup = { test_key: "test_value" };

			expect(layout.addCustomGroup(key, customGroup)).toEqual(customGroup);
		});

		test("adds custom group to layout", () => {
			const layout = Layout.create(mockScene, mockMetrics, sixGelButtons);
			const key = "test_key";
			const customGroup = { test_key: "test_value" };
			layout.addCustomGroup(key, customGroup);

			expect(mockRoot.addAt).toHaveBeenCalledWith(customGroup, 0);
		});
	});

	describe("addToGroup Method", () => {
		test("adds items to the correct group", () => {
			const layout = Layout.create(mockScene, mockMetrics, []);
			const testElement = { mock: "element" };

			layout.addToGroup("middleRight", testElement, 1);
			expect(mockGelGroup.addToGroup).toHaveBeenCalledWith(testElement, 1);
		});
	});

	describe("buttons property", () => {
		test("returns the buttons", () => {
			const layout = Layout.create(mockScene, mockMetrics, ["achievements", "exit", "settings"]);
			expect(layout.buttons.achievements).toBeDefined();
			expect(layout.buttons.exit).toBeDefined();
			expect(layout.buttons.settings).toBeDefined();
		});

		test("returns the buttons with accessibility enabled or disabled", () => {
			const layout = Layout.create(
				mockScene,
				mockMetrics,
				["achievements", "exit", "settings"],
				["exit", "blah"],
			);
			expect(layout.buttons.achievements).toBeDefined();
			expect(layout.buttons.achievements.config.accessible).toBe(false);
			expect(layout.buttons.exit).toBeDefined();
			expect(layout.buttons.exit.config.accessible).toBe(true);
			expect(layout.buttons.settings).toBeDefined();
			expect(layout.buttons.settings.config.accessible).toBe(false);
		});
	});

	describe("destroy method", () => {
		beforeEach(() => {
			const layout = Layout.create(mockScene, mockMetrics, ["achievements", "exit", "settings"]);
			layout.destroy();
		});

		test("removes all events on this Layout instance", () => {
			expect(mockEventUnsubscribe).toHaveBeenCalled();
			expect(settingsIconsUnsubscribeSpy).toHaveBeenCalled();
		});

		test("calls destroy on the root", () => {
			expect(mockRoot.destroy).toHaveBeenCalled();
		});
	});

	describe("make accessible method", () => {
		test("calls make accessible method on each group in the layout", () => {
			const layout = Layout.create(mockScene, mockMetrics, ["achievements", "exit", "settings"]);
			layout.makeAccessible();
			expect(mockGelGroup.makeAccessible).toHaveBeenCalled();
		});
	});

	describe("root property", () => {
		test("returns the root", () => {
			const layout = Layout.create(mockScene, mockMetrics, ["achievements", "exit", "settings"]);
			expect(layout.root).toBe(mockRoot);
		});
	});

	describe("removeEvents method", () => {
		test("removes all events on this Layout instance", () => {
			mockScene.config.subtitle = undefined;
			const layout = Layout.create(mockScene, mockMetrics, ["play"]);
			layout.removeEvents();
			expect(mockEventUnsubscribe).toHaveBeenCalled();
			expect(settingsIconsUnsubscribeSpy).toHaveBeenCalled();
		});

		test("removes all events on this Layout instance when subtitle is set", () => {
			mockScene.config.subtitle = "subtitle";
			const layout = Layout.create(mockScene, mockMetrics, ["play"]);
			layout.removeEvents();
			expect(mockEventUnsubscribe).toHaveBeenCalled();
			expect(settingsIconsUnsubscribeSpy).not.toHaveBeenCalled();
		});
	});

	describe("setAction Method", () => {
		test("sets button callback", () => {
			const layout = Layout.create(mockScene, mockMetrics, ["achievements", "exit", "settings"]);
			const buttonCallBack = "testAction";
			layout.setAction("exit", buttonCallBack);
			expect(mockInputUpAdd.mock.calls[0][0]).toBe(buttonCallBack);
			expect(mockInputUpAdd.mock.calls[0][1].create).toBeDefined();
		});
	});

	describe("button overrides", () => {
		test("merges overrides to button config", () => {
			mockJson.theme.mockSceneKey["button-overrides"] = { play: { shiftX: 99, shiftY: 88, group: "topRight" } };
			const layout = Layout.create(mockScene, mockMetrics, ["play"]);

			expect(layout.buttons.play.buttonName.shiftX).toBe(99);
			expect(layout.buttons.play.buttonName.shiftY).toBe(88);
			expect(layout.buttons.play.buttonName.group).toBe("topRight");
		});
	});

	describe("Debug", () => {
		test("draws groups that contain at least 1 item", () => {
			const mockGfx = { lineStyle: jest.fn(), strokeRectShape: jest.fn() };
			const layout = Layout.create(mockScene, mockMetrics, ["play", "home", "achievements"]);

			layout.debug.groups(mockGfx);

			expect(mockGfx.lineStyle).toHaveBeenCalledWith(2, 0x33ff33, 1);
			expect(mockGfx.strokeRectShape).toHaveBeenCalledWith(mockHitAreaBounds);
			expect(mockGfx.strokeRectShape).toHaveBeenCalledTimes(expectedNumberOfGroupLayouts);
		});

		test("draws buttons", () => {
			const mockGfx = { lineStyle: jest.fn(), strokeRectShape: jest.fn() };
			const layout = Layout.create(mockScene, mockMetrics, ["play", "home", "achievements"]);

			layout.debug.buttons(mockGfx);

			expect(mockGfx.lineStyle).toHaveBeenCalledWith(1, 0x3333ff, 1);
			expect(mockGfx.strokeRectShape).toHaveBeenCalledWith(mockHitAreaBounds);
			expect(mockGfx.strokeRectShape).toHaveBeenCalledTimes(expectedNumberOfGroupLayouts);
		});
	});
});
