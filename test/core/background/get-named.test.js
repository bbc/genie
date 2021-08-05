import { getNamed } from "../../../src/core/background/get-named.js";

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
describe("getNamed", () => {
	test("returns child if name matches input name", () => {
		const found = { name: "test_found" };
		const child = { name: "test_name" };
		expect(getNamed("test_name")(found, child)).toBe(child);
	});

	test("returns emitter matching name if Particle Manager", () => {
		const found = { name: "test_found" };
		const mockEmitter = { name: "test_emitter" };
		const child = { emitters: { getByName: jest.fn(() => mockEmitter) } };
		expect(getNamed("test_emitter")(found, child)).toBe(mockEmitter);
	});

	test("returns current emitter matching name if Particle Manager", () => {
		const found = { name: "test_found" };
		const child = { emitters: { getByName: jest.fn(() => false) } };
		expect(getNamed("test_emitter_wrong")(found, child)).toBe(found);
	});

	test("returns current found item if no matching name or matching emitter found", () => {
		const found = { name: "test_found" };
		const child = { name: "test_name" };
		expect(getNamed("test_WRONG")(found, child)).toBe(found);
	});
});
