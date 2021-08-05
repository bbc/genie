/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { parseUrlParams } from "../../src/core/parse-url-params";

describe("Core - Parse Url Params", () => {
	test("converts params into object", () => {
		const paramsString = "?debug=true&theme=worst-witch&audio=false";
		const expectedOutcome = { debug: true, theme: "worst-witch", audio: false };
		expect(parseUrlParams(paramsString)).toEqual(expectedOutcome);
	});

	test("returns empty object for an invalid query string", () => {
		const paramsString = "?debugtrueaudiofalse";
		expect(parseUrlParams(paramsString)).toEqual({});
	});
});
