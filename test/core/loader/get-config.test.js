/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getConfig } from "../../../src/core/loader/get-config.js";

describe("Examples Launcher", () => {
    describe("getConfig method", () => {
        test("Gets merged, preloaded configs from file path", () => {
            const mockConfig = {
                config: {
                    prefix: "mockPrefix.",
                    files: [{ key: "mockKey1" }, { key: "mockKey2" }, { key: "mockKey3" }],
                },
            };

            const json = {
                "config/path": mockConfig,
                "mockPrefix.mockKey1": { key1: "mockConfig1" },
                "mockPrefix.mockKey2": { key2: "mockConfig2" },
                "mockPrefix.mockKey3": { key3: "mockConfig3" },
            };

            const mockScreen = {
                cache: {
                    json: {
                        get: jest.fn(path => json[path]),
                    },
                },
            };

            expect(getConfig(mockScreen, "config/path")).toEqual({
                key1: "mockConfig1",
                key2: "mockConfig2",
                key3: "mockConfig3",
            });
        });
    });
});
