/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getDebugScreens } from "../../../src/core/debug/get-debug-screens.js";

describe("getDebugScreens", () => {
    beforeEach(() => {});

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("Returns empty object if not debug mode", () => {
        expect(getDebugScreens(false)).toEqual({});
    });

    test("Returns populated object if debug mode", () => {
        expect(Object.keys(getDebugScreens(true))).toEqual([
            "debug",
            "select1",
            "selectGrid",
            "results1Sec",
            "results10Sec",
            "backgroundAnimations",
        ]);
    });
});
