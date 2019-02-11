/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as qaMode from "../../../src/core/qa/qa-mode.js";
import * as parseUrlParams from "../../../src/core/parseUrlParams.js";
import * as sinon from "sinon";
import { assert } from "chai";

describe("QAMode", () => {
    const sandbox = sinon.createSandbox();
    const game = {};
    const goToScreen = {};
    let testWindow = {
        __qaMode: {},
        location: {
            search: "",
            hostname: "",
        },
    };
    const qaModeWindow = {
        testHarnessLayoutDisplayed: false,
        goToScreen: {},
        game: {},
    };
    afterEach(() => {
        sandbox.restore();
        testWindow = {
            __qaMode: {},
            location: {
                search: "",
                hostname: "",
            },
        };
    });

    it("is QAMode when parseUrlParams returns true", () => {
        sandbox.stub(parseUrlParams, "parseUrlParams").returns({ qaMode: true });
        qaMode.create(testWindow, game, goToScreen);
        assert.deepEqual(testWindow.__qaMode, qaModeWindow);
    });
    it("is QAMode when URL includes www.test.bbc.", () => {
        sandbox.stub(parseUrlParams, "parseUrlParams").returns({ qaMode: false });
        testWindow = {
            location: {
                search: "",
                hostname: "www.test.bbc.com",
            },
            __qaMode: {},
        };
        qaMode.create(testWindow, game, goToScreen);
        assert.deepEqual(testWindow.__qaMode, qaModeWindow);
    });
    it("isn't QAMode when not correct params or URL", () => {
        sandbox.stub(parseUrlParams, "parseUrlParams").returns({ qaMode: false });
        qaMode.create(testWindow, game, goToScreen);
        assert.deepEqual(testWindow.__qaMode, {});
    });
});
