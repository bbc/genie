/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../src/core/gmi/gmi.js";
import { nextPage } from "../../src/core/background/pages.js";
import { eventBus } from "../../src/core/event-bus.js";
import { Narrative } from "../../src/components/narrative.js";

jest.mock("../../src/core/background/pages.js");
import * as pagesModule from "../../src/core/background/pages.js";

describe("Narrative Screen", () => {
	let narrativeScreen;
	let mockData;

	beforeEach(() => {
		narrativeScreen = new Narrative();
		mockData = {
			config: { narrative: { achievements: undefined }, home: {}, furniture: [] },
		};

		narrativeScreen.setData(mockData);
		narrativeScreen.scene = { key: "narrative" };
		narrativeScreen.pageIdx = 0;
		narrativeScreen.add = { image: jest.fn() };
		narrativeScreen.setLayout = jest.fn();
		narrativeScreen.navigation = { next: jest.fn() };
		narrativeScreen.addBackgroundItems = jest.fn();
		narrativeScreen.events = {
			once: jest.fn(),
		};
	});

	afterEach(() => jest.clearAllMocks());

	describe("create method", () => {
		beforeEach(() => {
			narrativeScreen.create();
		});

		test("adds GEL buttons to layout", () => {
			const expectedButtons = ["continue", "skip", "pause"];
			expect(narrativeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
		});

		test("adds background items", () => {
			expect(narrativeScreen.addBackgroundItems).toHaveBeenCalled();
		});

		test("Add a shutdown event for skipping audio", () => {
			expect(narrativeScreen.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
		});
	});

	describe("Events", () => {
		beforeEach(() => {
			pagesModule.skip = jest.fn();
			gmi.sendStatsEvent = jest.fn();
			nextPage.mockImplementation(() => () => {});
			jest.spyOn(eventBus, "subscribe");
			narrativeScreen.create();
		});

		describe("Shutdown", () => {
			test("Calls Skip to clear events", () => {
				narrativeScreen.timedItems = "test-string";
				narrativeScreen.events.once.mock.calls[0][1]();
				expect(pagesModule.skip).toHaveBeenCalledWith("test-string");
			});
		});

		describe("Continue button", () => {
			test("has a callback on the event bus", () => {
				expect(eventBus.subscribe.mock.calls[0][0].channel).toBe("gel-buttons-narrative");
				expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
				expect(eventBus.subscribe.mock.calls[0][0].callback).toEqual(expect.any(Function));
			});

			test("navigates to the next page when clicked", () => {
				eventBus.subscribe.mock.calls[0][0].callback({ screen: narrativeScreen });
				expect(nextPage).toHaveBeenCalledWith(narrativeScreen);
			});

			test("fires a stat when clicked", () => {
				eventBus.subscribe.mock.calls[0][0].callback({ screen: narrativeScreen });
				expect(gmi.sendStatsEvent).toHaveBeenCalledWith("narrative", "continue", {
					metadata: `PAG=[${narrativeScreen.pageIdx}]`,
					source: `narrative-${narrativeScreen.scene.key}`,
				});
			});
		});

		describe("Skip button", () => {
			test("fires a stat when clicked", () => {
				eventBus.subscribe.mock.calls[1][0].callback({ screen: narrativeScreen });
				expect(gmi.sendStatsEvent).toHaveBeenCalledWith("narrative", "skip", {
					metadata: `PAG=[${narrativeScreen.pageIdx}]`,
					source: `narrative-${narrativeScreen.scene.key}`,
				});
			});
		});
	});
});
