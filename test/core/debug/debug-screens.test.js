/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen, addExampleScreens } from "../../../src/core/debug/debug-screens.js";

describe("getDebugScreens", () => {
    beforeEach(() => {});

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getLauncherScreen", () => {
        test("Returns empty object if not debug mode", () => {
            expect(getLauncherScreen(false)).toEqual({});
        });

        test("Returns debug screen if debug mode", () => {
            expect(Object.keys(getLauncherScreen(true))).toEqual(["debug"]);
        });
    });

    describe("addExampleScreens", () => {
        test("Returns debug screen if debug mode", () => {
            const mockConfig = {
                config: {
                    prefix: "mockPrefix.",
                    files: [{ key: "mockKey1" }, { key: "mockKey2" }, { key: "mockKey3" }],
                },
            };

            const json = {
                "example-files": mockConfig,
                "mockPrefix.mockKey1": { theme: {} },
            };

            const mockScreen = {
                setConfig: jest.fn(),
                context: {
                    config: { theme: {} },
                    navigation: {},
                },
                scene: {
                    add: jest.fn(),
                },
                cache: {
                    json: {
                        get: jest.fn(path => json[path]),
                    },
                },
            };

            addExampleScreens(mockScreen);

            expect(mockScreen.scene.add).toHaveBeenCalled();
            expect(Object.keys(mockScreen.setConfig.mock.calls[0][0])).toEqual(["theme", "navigation"]);
        });
    });
});
