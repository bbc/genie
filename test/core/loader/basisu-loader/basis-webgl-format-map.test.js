/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BASIS_WEBGL_FORMAT_MAP } from "../../../../src/core/loader/basisu-loader/basis-webgl-format-map.js";

describe("Basis Webgl Format Map", () => {
	beforeEach(() => {

	});
	afterEach(() => jest.clearAllMocks());


	test("Returns a format map with 11 properties", () => {
		expect(Object.keys(BASIS_WEBGL_FORMAT_MAP).length).toBe(11);
	});
});
