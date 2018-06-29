import { expect } from "chai";

import { parseUrlParams } from "../../src/core/parseUrlParams";

describe("parseUrlParams", () => {
    it("converts params into object", () => {
        const paramsString = "?qaMode=true&theme=worst-witch&audio=false";
        const expectedOutcome = { qaMode: true, theme: "worst-witch", audio: false };
        expect(parseUrlParams(paramsString)).to.eql(expectedOutcome);
    });

    it("returns empty object for an invalid query string", () => {
        const paramsString = "?qaModetrueaudiofalse";
        expect(parseUrlParams(paramsString)).to.eql({});
    });
});
