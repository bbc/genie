/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import Bowser from "../../node_modules/bowser/src/bowser.js";
import { getBrowser } from "../../src/core/browser.js";

describe("Browser", () => {
    let mockUA;
    let mockParser;

    beforeEach(() => {
        mockUA = global.window.navigator.userAgent;
        mockParser = {
            getBrowserName: jest.fn(() => "test-browser-name"),
            getBrowserVersion: jest.fn(() => "test-browser-version"),
            satisfies: jest.fn(() => true),
            getUA: jest.fn(() => mockUA),
        };
        jest.spyOn(Bowser, "getParser").mockImplementation(() => mockParser);
    });

    afterEach(() => jest.clearAllMocks());

    it("gets a parser from Bowser with correct params", () => {
        getBrowser();
        expect(Bowser.getParser).toHaveBeenCalledWith(global.window.navigator.userAgent);
    });

    it("passes through browser name from Bowser", () => {
        const browser = getBrowser();
        expect(browser.name).toBe("test-browser-name");
    });

    it("passes through browser version from Bowser", () => {
        const browser = getBrowser();
        expect(browser.version).toBe("test-browser-version");
    });

    it("sets isSilk property when Amazon Browser", () => {
        mockParser.getBrowserName.mockImplementation(() => "Amazon Silk");
        const browser = getBrowser();
        expect(browser.isSilk).toBe(true);
    });

    it("sets isSilk property when inside an App and using Kindle web View", () => {
        mockUA =
            "Mozilla/5.0 (Linux; Android 5.1.1; KFFOWI Build/LVY48F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Safari/537.36";

        const browser = getBrowser();
        expect(browser.isSilk).toBe(true);
    });

    it("sets forceCanvas to false when not Safari < 10 ", () => {
        mockParser.satisfies = search => !(search.safari && search.safari === "<10");
        const browser = getBrowser();
        expect(browser.forceCanvas).toBe(false);
    });

    it("sets forceCanvas when browser is Safari < 10", () => {
        mockParser.satisfies = jest.fn();
        getBrowser();
        expect(mockParser.satisfies).toHaveBeenCalledWith({ safari: "<10" });
    });
});
