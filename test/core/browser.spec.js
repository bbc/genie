/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";

import { rewire, restore } from "../../lib/bowser/bowser.js";
import { getBrowser } from "../../src/core/browser.js";

const mockBowser = {
    getParser: () => ({
        getBrowserName: () => "test-browser-name",
        getBrowserVersion: () => "test-browser-version",
    }),
};

describe("browser", () => {
    afterEach(restore);

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
        const mockSilkBowser = {
            getParser: () => ({
                getBrowserName: () => "Amazon Silk",
                getBrowserVersion: () => "test-browser-version",
            }),
        };

        rewire(mockSilkBowser);
        const browser = getBrowser();
        assert.equal(browser.isSilk, true);
    });
});
