/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";

import { rewire, restore } from "../../lib/bowser/bowser.js";
import { getBrowser } from "../../src/core/browser.js";

const mockParser = {
    getBrowserName: () => "test-browser-name",
    getBrowserVersion: () => "test-browser-version",
    satisfies: () => true,
};

const mockBowser = { getParser: () => mockParser };

describe("browser", () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        restore();
        sandbox.restore();
    });

    it("passes through name from Bowser", () => {
        rewire(mockBowser);
        const browser = getBrowser();
        assert.equal(browser.name, "test-browser-name");
    });

    it("passes through version from Bowser", () => {
        rewire(mockBowser);
        const browser = getBrowser();
        assert.equal(browser.version, "test-browser-version");
    });

    it("sets isSilk property when Amazon Browser", () => {
        const mockSilkBowser = { getParser: () => Object.assign(mockParser, { getBrowserName: () => "Amazon Silk" }) };

        rewire(mockSilkBowser);
        const browser = getBrowser();
        assert.equal(browser.isSilk, true);
    });

    it("sets forceCanvas to false when not Safari < 10 ", () => {
        const mockSafari9 = {
            getParser: () =>
                Object.assign(mockParser, { satisfies: search => !(search.safari && search.safari === "<10") }),
        };

        rewire(mockSafari9);
        const browser = getBrowser();
        assert.equal(browser.forceCanvas, false);
    });

    it("sets forceCanvas when browser is Safari < 10", () => {
        const satisfiesStub = sandbox.stub();
        const mockSilkBrowser = { getParser: () => Object.assign(mockParser, { satisfies: satisfiesStub }) };

        rewire(mockSilkBrowser);
        getBrowser();

        sandbox.assert.calledWith(satisfiesStub, { safari: "<10" });
    });
});
