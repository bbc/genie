import { parseUrlParams } from "src/lib/parseUrlParams";
import { expect } from "chai";

describe("#parseUrlParams", () => {
    let paramsString: string;
    let parsedParams: object;

    beforeEach(() => {
        parsedParams = parseUrlParams(paramsString);
    });

    describe("when function takes a valid URL query string", () => {
        before(() => {
            paramsString = "?qaMode=true&theme=worst-witch&audio=false";
        });

        it("converts params into object", () => {
            const expectedOutcome = { qaMode: true, theme: "worst-witch", audio: false };

            expect(parsedParams).to.eql(expectedOutcome);
        });
    });

    describe("when function takes an invalid URL query string", () => {
        before(() => {
            paramsString = "?qaModetrueaudiofalse";
        });

        it("returns empty object", () => {
            expect(parsedParams).to.eql({});
        });
    });
});
