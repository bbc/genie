/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMeasure } from "../../src/core/debug/measure/measure.js";
import * as createElementsModule from "../../src/core/debug/measure/elements.js";
import * as createMeasureUiModule from "../../src/core/debug/measure/ui.js";

describe("Measure Tool", () => {
	let update;
	let toggleUi;
	let mockParent;

	beforeEach(() => {
		mockParent = {
			add: jest.fn(),
			scene: {
				events: { on: jest.fn(), off: jest.fn(), once: jest.fn() },
				input: {
					keyboard: {
						addKeys: jest.fn(),
					},
				},
			},
		};

		createElementsModule.createElements = jest.fn(() => ({
			rect: { on: jest.fn(), geom: {}, updateDisplayOrigin: jest.fn(), updateData: jest.fn(), input: {} },
			coords: {},
			legend: {},
			handle: { on: jest.fn() },
			updateCoords: jest.fn(),
			toggleUi: jest.fn(),
		}));

		update = jest.fn();
		toggleUi = jest.fn();
		createMeasureUiModule.createMeasureUi = jest.fn(() => ({ update, toggleUi }));
	});

	afterEach(jest.clearAllMocks);

	test("Add shutdown and update events to the current scene if toggled visible", () => {
		toggleUi.mockReturnValue(true);
		createMeasure(mockParent)();

		expect(mockParent.scene.events.on).toHaveBeenCalledWith("update", expect.any(Function), mockParent.scene);
		expect(mockParent.scene.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function), mockParent.scene);
	});

	test("Removes update event to the current scene if toggled invisible", () => {
		toggleUi.mockReturnValue(false);
		createMeasure(mockParent)();

		expect(mockParent.scene.events.off).toHaveBeenCalledWith("update", expect.any(Function), mockParent.scene);
	});
});
