/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as debugMode from "../../../src/core/debug/debug-mode.js";
import * as parseUrlParams from "../../../src/core/parseUrlParams.js";

describe("Debug Mode", () => {
    const game = {};
    const debugModeWindow = {
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

    test("adds __qaMode object to window when parseUrlParams returns true", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: true }));
        debugMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual(debugModeWindow);
    });

    test("adds __qaMode object to window when URL includes www.test.bbc.", () => {
        jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));
        testWindow = {
            location: {
                search: "",
                hostname: "www.test.bbc.com",
            },
            __qaMode: {},
        };
        debugMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual(debugModeWindow);
    });

    test("does not add __qaMode object to window when not correct params or URL", () => {
        jest.fn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));
        debugMode.create(testWindow, game);
        expect(testWindow.__qaMode).toEqual({});
    });

    describe("Debug Mode", () => {
        test("is false when url does not includes parameter 'debug=true'", () => {
            jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));

            expect(debugMode.debugMode()).toEqual(false);
        });

        test("is true when url includes parameter 'debug=true'", () => {
            jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: true }));

            expect(debugMode.debugMode()).toEqual(true);
        });
    });
});
