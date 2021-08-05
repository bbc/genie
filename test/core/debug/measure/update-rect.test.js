/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { rectUpdateFn } from "../../../../src/core/debug/measure/update-rect.js";

/*
const limit = val => (val < 1 ? 1 : val);

export const rectUpdateFn = (rect, updateCoords) => size => {
    updateCoords(rect);
};

 */

describe("update rect function", () => {
	let rect;
	let updateCoords;
	let delta;

	beforeEach(() => {
		updateCoords = jest.fn();

		rect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			geom: {
				width: 0,
				height: 0,
			},
			updateDisplayOrigin: jest.fn(),
			updateData: jest.fn(),
			input: {
				hitArea: {},
			},
		};

		delta = { x: 10, y: 10, width: 10, height: 10 };
		rectUpdateFn(rect, updateCoords)(delta);
	});

	afterEach(jest.clearAllMocks);

	test("updates position and size and propagates to geom", () => {
		expect(rect.x).toBe(10);
		expect(rect.y).toBe(10);
		expect(rect.width).toBe(10);
		expect(rect.height).toBe(10);
	});

	test("propagates size to geom", () => {
		expect(rect.geom.width).toBe(10);
		expect(rect.geom.height).toBe(10);
	});

	test("updates hitarea", () => {
		expect(rect.input.hitArea).toEqual(rect.geom);
	});

	test("updates display data so click testing events are tested against new size.", () => {
		expect(rect.updateDisplayOrigin).toHaveBeenCalled();
		expect(rect.updateData).toHaveBeenCalled();
	});

	test("Calls update coords callback with update rectangle", () => {
		expect(updateCoords).toHaveBeenCalledWith(rect);
	});

	test("Limits width and height to 1 and 1", () => {
		delta.width = -1000;
		delta.height = -1000;
		rectUpdateFn(rect, updateCoords)(delta);

		expect(rect.width).toBe(1);
		expect(rect.height).toBe(1);
	});
});
