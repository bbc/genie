/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { calculateMetrics, setResolution, CAMERA_X, CAMERA_Y } from "../../../src/core/layout/metrics.js";

let defaultValues = {
	width: 800,
	height: 600,
};

const getMetrics = newValues => {
	const values = { ...defaultValues, ...newValues };
	return calculateMetrics({ width: values.width, height: values.height });
};

describe("Layout - Calculate Metrics", () => {
	test("returns basic metrics", () => {
		const metrics = getMetrics({});
		expect(metrics.width).toBe(defaultValues.width);
		expect(metrics.height).toBe(defaultValues.height);
		expect(metrics.scale).toBe(1);
	});

	describe("borderPad metric", () => {
		test("sets a vertical border padding of 2% of the longest edge", () => {
			expect(getMetrics({ width: 600, height: 600 }).verticalBorderPad).toBe(16);
			expect(getMetrics({ width: 800, height: 600 }).verticalBorderPad).toBe(16);
			expect(getMetrics({ width: 1000, height: 600 }).verticalBorderPad).toBe(20);
			expect(getMetrics({ width: 1500, height: 600 }).verticalBorderPad).toBe(28);

			expect(getMetrics({ width: 200, height: 600 }).verticalBorderPad).toBe(16);
			expect(getMetrics({ width: 200, height: 800 }).verticalBorderPad).toBe(16);
			expect(getMetrics({ width: 200, height: 1000 }).verticalBorderPad).toBe(16);
		});

		test("sets a vertical border padding of 21 when it is a iPhone 5 (568x320)", () => {
			expect(getMetrics({ width: 568, height: 320 }).verticalBorderPad).toBe(21);
		});

		test("sets a bottom border padding of 58 when it is a iPhone 5 (568x320)", () => {
			expect(getMetrics({ width: 568, height: 320 }).bottomBorderPad).toBe(58);
		});

		test("sets a horizontal border padding of 2% of the longest edge", () => {
			expect(getMetrics({ width: 600, height: 600 }).horizontalBorderPad).toBe(16);
			expect(getMetrics({ width: 800, height: 600 }).horizontalBorderPad).toBe(16);
			expect(getMetrics({ width: 1000, height: 600 }).horizontalBorderPad).toBe(20);
			expect(getMetrics({ width: 1500, height: 600 }).horizontalBorderPad).toBe(28);

			expect(getMetrics({ width: 200, height: 600 }).horizontalBorderPad).toBe(16);
			expect(getMetrics({ width: 200, height: 800 }).horizontalBorderPad).toBe(16);
			expect(getMetrics({ width: 200, height: 1000 }).horizontalBorderPad).toBe(16);
		});
	});

	describe("isMobile metric", () => {
		test("reports as a mobile device if stage width is less than 770 Pixels", () => {
			expect(getMetrics({ width: 769 }).isMobile).toBe(true);
		});

		test("reports as a tablet/desktop device if stage width is greater than or equal to 770 Pixels", () => {
			expect(getMetrics({ width: 771 }).isMobile).toBe(false);
		});
	});

	describe("buttonPad metric", () => {
		test("is 22 if mobile device", () => {
			expect(getMetrics({ width: 500 }).buttonPad).toBe(22);
		});

		test("is 24 if tablet/desktop device", () => {
			expect(getMetrics({ width: 800 }).buttonPad).toBe(24);
		});
	});

	describe("buttonMin metric", () => {
		test("is 42 if mobile device", () => {
			expect(getMetrics({ width: 500 }).buttonMin).toBe(42);
		});

		test("is 64 if tablet/desktop device", () => {
			expect(getMetrics({ width: 800 }).buttonMin).toBe(64);
		});
	});

	describe("hitMin metric", () => {
		test("is 64 if mobile device", () => {
			expect(getMetrics({ width: 500 }).hitMin).toBe(64);
		});

		test("is 70 if tablet/desktop device", () => {
			expect(getMetrics({ width: 800 }).hitMin).toBe(70);
		});
	});

	describe("horizontals metric", () => {
		test("returns horizontals in relation to the width and scale", () => {
			const expectedFor600 = { left: -400, center: 0, right: 400 };
			const expectedFor800 = { left: -400, center: 0, right: 400 };
			const expectedFor1000 = { left: -500, center: 0, right: 500 };
			expect(getMetrics({ width: 600 }).horizontals).toEqual(expectedFor600);
			expect(getMetrics({ width: 800 }).horizontals).toEqual(expectedFor800);
			expect(getMetrics({ width: 1000 }).horizontals).toEqual(expectedFor1000);
		});
	});

	describe("safeHorizontals metric", () => {
		test("returns safe horizontals in relation to the height", () => {
			const expected = { left: -400, center: 0, right: 400 };
			expect(getMetrics({ height: 600 }).safeHorizontals).toEqual(expected);
		});
	});

	describe("verticals metric", () => {
		test("returns verticals in relation to the height", () => {
			const expected = { top: -300, middle: 0, bottom: 300 };
			expect(getMetrics({ height: 600 }).verticals).toEqual(expected);
		});
	});

	describe("screenToCanvas method", () => {
		test("converts screen pixels to canvas pixels", () => {
			expect(getMetrics({ height: 150 }).screenToCanvas(20)).toEqual(80);
			expect(getMetrics({ height: 300 }).screenToCanvas(20)).toEqual(40);
			expect(getMetrics({ height: 600 }).screenToCanvas(20)).toEqual(20);
			expect(getMetrics({ height: 900 }).screenToCanvas(20)).toEqual(20);
		});
	});

	describe("setResolution method", () => {
		test("multiplies canvas width and height by supplied value", () => {
			setResolution(2);
			const metrics = calculateMetrics({ width: 1400, height: 600 });
			expect(metrics.stageWidth).toBe(2800);
			expect(metrics.stageHeight).toBe(1200);
			expect(metrics.horizontals.left).toBe(-1400);
			expect(metrics.horizontals.right).toBe(1400);
		});

		test("Recalculates camera centre", () => {
			setResolution(2);
			expect(CAMERA_X).toBe(1400);
			expect(CAMERA_Y).toBe(600);
		});

		test("Max Aspect ratio sets width", () => {
			setResolution(1.8, 4 / 3, 16 / 9);
			expect(CAMERA_X).toBe(960);
			expect(CAMERA_Y).toBe(540);
		});

		test("Min Aspect ratio sets safeArea to be height * aspect ratio / 2", () => {
			setResolution(1.0, 3 / 4, 16 / 9);
			const metrics = calculateMetrics({ width: 1400, height: 600 });

			expect(metrics.safeHorizontals.left).toBe(-225);
			expect(metrics.safeHorizontals.right).toBe(225);
		});
	});
});
