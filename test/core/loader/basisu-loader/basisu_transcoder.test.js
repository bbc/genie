/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BASIS } from "../../../../src/core/loader/basisu-loader/basis_transcoder.js";
import path from 'path';

describe("BASIS Transcoder", () => {
	afterEach(jest.clearAllMocks);

	test("Generates a basis transcoder object with 79 properties", async () => {
		const basis = await BASIS();
		expect(Object.keys(basis).length).toBe(79);
	});

	test("Fetches the web assembly module", async () => {
		global.fetch = jest.fn(() => Promise.resolve({}));
		const basis = await BASIS();
		expect(path.basename(global.fetch.mock.calls[0][0])).toBe("basis_transcoder.wasm")
	});
});
