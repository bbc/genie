/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as qaMode from "../../../src/core/qa/qa-mode.js";
import * as parseUrlParams from "../../../src/core/parseUrlParams.js";

describe("QAMode", () => {
    const game = {};
    const qaModeWindow = {
        testHarnessLayoutDisplayed: false,
        game: {},
    };

    let testWindow = {
        __qaMode: {},
        location: {
            search: "",
            hostname: "",
        },
    };

    afterEach(() => {
        jest.clearAllMocks();
        testWindow = {
            __qaMode: {},
            location: {
                search: "",
                hostname: "",
            },
        };
    });

    test("is QAMode when parseUrlParams returns true", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ qaMode: true }));
        qaMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual(qaModeWindow);
    });

    test("is QAMode when URL includes www.test.bbc.", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ qaMode: false }));
        testWindow = {
            location: {
                search: "",
                hostname: "www.test.bbc.com",
            },
            __qaMode: {},
        };
        qaMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual(qaModeWindow);
    });

    test("isn't QAMode when not correct params or URL", () => {
        jest.fn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ qaMode: false }));
        qaMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual({});
    });

    test("is debugMode when url does not includes parameter 'debugMode=true'", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debugMode: false }));

        expect(qaMode.debugMode()).toEqual(false);
    });

    test("is debugMode when url includes parameter 'debugMode=true'", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debugMode: true }));

        expect(qaMode.debugMode()).toEqual(true);
    });
});
