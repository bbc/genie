/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getInputFn } from "../../../../src/core/debug/measure/get-input-fn.js";

describe("Measure Tool Get input", () => {
	let keys;
	let mockTime;

	beforeEach(() => {
		keys = {
			x: { isDown: false },
			z: { isDown: false },
			up: { isDown: false },
			down: { isDown: false },
			left: { isDown: false },
			right: { isDown: false },
		};

		mockTime = 0;
		global.Date.now = jest.fn(() => mockTime);
	});

	afterEach(jest.clearAllMocks);

	test("Returns zero delta if no keys pressed", () => {
		expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 0, y: 0 });
	});

	test("Returns 10 * position delta if cursors pressed", () => {
		keys.up.isDown = true;
		keys.right.isDown = true;

		expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 10, y: -10 });
	});

	test("Returns size delta * 10 if x and cursors pressed", () => {
		keys.x.isDown = true;
		keys.up.isDown = true;
		keys.right.isDown = true;

		expect(getInputFn(keys)()).toEqual({ height: -10, width: 10, x: 0, y: 0 });
	});

	test("Returns position delta if z and cursors pressed", () => {
		mockTime = 1000;
		keys.z.isDown = true;
		keys.up.isDown = true;
		keys.right.isDown = true;

		expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 1, y: -1 });
	});

	test("Returns 0,0,0,0 if x pressed and less than 100 ms since last call", () => {
		mockTime = 99;
		keys.z.isDown = true;
		keys.down.isDown = true;
		keys.right.isDown = true;

		expect(getInputFn(keys)()).toEqual({ height: 0, width: 0, x: 0, y: 0 });
	});
});
