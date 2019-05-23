/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { parseUrlParams } from "../../src/core/parseUrlParams";

describe("parseUrlParams", () => {
    test("converts params into object", () => {
        const paramsString = "?qaMode=true&theme=worst-witch&audio=false";
        const expectedOutcome = { qaMode: true, theme: "worst-witch", audio: false };
        expect(parseUrlParams(paramsString)).toEqual(expectedOutcome);
    });

    test("returns empty object for an invalid query string", () => {
        const paramsString = "?qaModetrueaudiofalse";
        expect(parseUrlParams(paramsString)).toEqual({});
    });
});
