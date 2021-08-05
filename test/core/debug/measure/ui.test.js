/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMeasureUi } from "../../../../src/core/debug/measure/ui.js";
import * as createElementsModule from "../../../../src/core/debug/measure/elements.js";

describe("createMeasureUi Method", () => {
	let mockContainer;
	let mockRect;
	let mockHandle;
	let updateCoordsSpy;

	beforeEach(() => {
		mockRect = {
			on: jest.fn(),
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			geom: {},
			updateDisplayOrigin: jest.fn(),
			updateData: jest.fn(),
			input: {
				hitArea: {},
			},
		};

		mockHandle = { on: jest.fn() };

		updateCoordsSpy = jest.fn();

		createElementsModule.createElements = jest.fn(() => ({
			rect: mockRect,
			coords: {},
			legend: {},
			handle: mockHandle,
			updateCoords: updateCoordsSpy,
			toggleUi: jest.fn(),
		}));

		const mockKeys = {
			c: { on: jest.fn() },
		};

		const mockScene = {
			input: {
				keyboard: {
					addKeys: jest.fn(() => mockKeys),
				},
			},
		};

		mockContainer = {
			scene: mockScene,
			add: jest.fn(),
		};
	});

	afterEach(jest.clearAllMocks);

	test("creates update and toggleUi methods", () => {
		const ui = createMeasureUi(mockContainer);

		expect(ui.toggleUi).toStrictEqual(expect.any(Function));
		expect(ui.update).toStrictEqual(expect.any(Function));
	});

	test("adds a drag update position method", () => {
		createMeasureUi(mockContainer);
		const dragUpdate = mockRect.on.mock.calls[0];

		expect(dragUpdate[0]).toBe("drag");

		dragUpdate[1](null, 50, 100);
		expect(mockRect.x).toBe(50);
		expect(mockRect.y).toBe(100);
		expect(updateCoordsSpy).toHaveBeenCalled();
	});

	test("adds a drag size method to the ui handle", () => {
		createMeasureUi(mockContainer);
		const dragSize = mockHandle.on.mock.calls[0];

		expect(dragSize[0]).toBe("drag");

		dragSize[1](null, 50, 100);
		expect(mockRect.width).toBe(55);
		expect(mockRect.height).toBe(105);
		expect(updateCoordsSpy).toHaveBeenCalled();
	});
});
