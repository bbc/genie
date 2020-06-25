/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getConfig } from "../../../src/core/loader/get-config.js";

describe("Examples Launcher", () => {
    describe("getConfig method", () => {
        test("Gets merged, preloaded configs from file path", () => {
            const mockKeys = ["home", "select", "results"];

            const json = {
                "config-home": { key0: "mockConfig0" },
                "config-select": { key1: "mockConfig1" },
                "config-results": { key2: "mockConfig2" },
            };

            const mockScreen = {
                cache: {
                    json: {
                        get: jest.fn(path => json[path]),
                    },
                },
            };

            expect(getConfig(mockScreen, mockKeys)).toEqual({
                key0: "mockConfig0",
                key1: "mockConfig1",
                key2: "mockConfig2",
            });
        });
    });
});
