/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { cycleMode, getMode } from "../../../../src/core/debug/measure/mode.js";
import * as Scaler from "../../../../src/core/scaler.js";

const getNextMode = () => {
	cycleMode();
	return getMode();
};

const getModeToTest = type => {
	const modes = [1, 2, 3].map(getNextMode);
	return modes.find(mode => mode.type === type);
};

describe("Measure tool modes", () => {
	beforeEach(() => {
		Scaler.getMetrics = () => ({ scale: 0.5 });
		global.window.innerWidth = 1000;
	});

	afterEach(jest.clearAllMocks);

	describe("Cycle Mode", () => {
		test("Moves to next mode", () => {
			const type1 = getMode().type;
			cycleMode();
			expect(getMode().type).not.toBe(type1);
		});
	});

	describe("ABS mode", () => {
		test("Returns absolute values", () => {
			const mockRect = { x: 0, y: 0, width: 100, height: 100 };
			const mode = getModeToTest("ABS");

			expect(mode.type).toBe("ABS");
			expect(mode.x(mockRect)).toBe(700);
			expect(mode.y(mockRect)).toBe(300);
			expect(mode.width(mockRect)).toBe(100);
			expect(mode.height(mockRect)).toBe(100);
		});
	});

	describe("CEN mode", () => {
		test("Returns absolute values", () => {
			const mockRect = { x: 0, y: 0, width: 100, height: 100 };
			const mode = getModeToTest("CEN");

			expect(mode.type).toBe("CEN");
			expect(mode.x(mockRect)).toBe(0);
			expect(mode.y(mockRect)).toBe(0);
			expect(mode.width(mockRect)).toBe(100);
			expect(mode.height(mockRect)).toBe(100);
		});
	});

	describe("WIN mode", () => {
		test("Returns absolute values", () => {
			const mockRect = { x: 0, y: 0, width: 100, height: 100 };
			const mode = getModeToTest("WIN");

			expect(mode.type).toBe("WIN");
			expect(mode.x(mockRect)).toBe(350);
			expect(mode.y(mockRect)).toBe(150);
			expect(mode.width(mockRect)).toBe(50);
			expect(mode.height(mockRect)).toBe(50);
		});
	});
});
