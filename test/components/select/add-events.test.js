/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addEvents } from "../../../src/components/select/add-events.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("Select Screen addEvents", () => {
	let mockSelect;
	let mockChoices;
	let nextSpy;

	beforeEach(() => {
		jest.spyOn(eventBus, "subscribe");

		mockChoices = [];

		nextSpy = jest.fn();

		mockSelect = {
			scene: { key: "testSceneKey" },
			grid: {
				choices: jest.fn(() => mockChoices),
				showPage: jest.fn(),
				page: 4,
			},
			next: jest.fn(() => nextSpy),
			events: {
				once: jest.fn(),
			},
		};
	});

	afterEach(jest.clearAllMocks);

	test("adds event subscription to the continue button", () => {
		addEvents(mockSelect);
		expect(eventBus.subscribe.mock.calls[0][0].channel).toBe("gel-buttons-testSceneKey");
		expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
	});

	test("moves to the next game screen when the continue button is pressed", () => {
		addEvents(mockSelect);
		eventBus.subscribe.mock.calls[0][0].callback();
		expect(nextSpy).toHaveBeenCalled();
	});

	test("adds event subscriptions for grid buttons", () => {
		mockChoices = [{ id: "key1" }, { id: "key2" }];
		addEvents(mockSelect);
		expect(eventBus.subscribe.mock.calls[0][0].name).toBe("key1");
		expect(eventBus.subscribe.mock.calls[1][0].name).toBe("key2");
	});

	test("moves to the next screen when grid cell is pressed", () => {
		mockChoices = [{ id: "key1" }, { id: "key2" }];
		addEvents(mockSelect);

		eventBus.subscribe.mock.calls[1][0].callback();
		expect(nextSpy).toHaveBeenCalled();
	});

	test("moves to the next page when next page is pressed", () => {
		mockChoices = [{ id: "key1" }, { id: "key2" }];
		addEvents(mockSelect);

		eventBus.subscribe.mock.calls[3][0].callback();
		expect(mockSelect.grid.showPage).toHaveBeenCalledWith(5);
	});

	test("moves to the previous page when next page is pressed", () => {
		mockChoices = [{ id: "key1" }, { id: "key2" }];
		addEvents(mockSelect);

		eventBus.subscribe.mock.calls[4][0].callback();
		expect(mockSelect.grid.showPage).toHaveBeenCalledWith(3);
	});

	test("returns id on cell callback", () => {
		mockChoices = [{ id: "key1" }];
		addEvents(mockSelect);

		const cellCallback = mockSelect.next.mock.calls[0][0];
		expect(cellCallback().id).toBe("key1");
	});
});
