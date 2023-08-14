/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BASIS_FORMAT } from "../../../../src/core/loader/basisu-loader/basis-format";

describe("Basis Universal Format", () => {
	beforeEach(() => {

	});
	afterEach(() => jest.clearAllMocks());


	test("Returns a format map with 15 properties", () => {
		expect(Object.keys(BASIS_FORMAT).length).toBe(15);
	});
});
