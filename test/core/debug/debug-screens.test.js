/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen, addExampleScreens } from "../../../src/core/debug/debug-screens.js";

describe("getDebugScreens", () => {
    describe("getLauncherScreen", () => {
        test("Returns empty object if not debug mode", () => {
            expect(getLauncherScreen(false)).toEqual({});
        });

        test("Returns debug screen if debug mode", () => {
            expect(Object.keys(getLauncherScreen(true))).toEqual(["debug"]);
        });
    });

    describe("addExampleScreens", () => {
        let mockScreen;

        beforeEach(() => {
            const mockConfig = {
                config: {
                    prefix: "mockPrefix.",
                    files: [{ key: "mockKey1" }],
                },
            };

            const json = {
                "example-files": mockConfig,
                "mockPrefix.mockKey1": { theme: { themeKey: "theme data" } },
                "mockPrefix.mockKey2": { theme: {} },
                "mockPrefix.mockKey3": { theme: {} },
            };

            mockScreen = {
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
        });

        afterEach(jest.clearAllMocks);

        test("Returns debug screen if debug mode", () => {
            addExampleScreens(mockScreen);
            expect(mockScreen.scene.add).toHaveBeenCalled();
            expect(Object.keys(mockScreen.setConfig.mock.calls[0][0])).toEqual(["theme", "navigation"]);

            // Prepends 'debug-' to themes
            expect(Object.keys(mockScreen.setConfig.mock.calls[0][0].theme)[0]).toBe("debug-themeKey");
        });

        test("Does not call a second time (fp.once)", () => {
            addExampleScreens(mockScreen);
            expect(mockScreen.setConfig).not.toHaveBeenCalled();
        });
    });
});
