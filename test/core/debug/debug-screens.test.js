/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen, addExampleScreens } from "../../../src/core/debug/debug-screens.js";
import * as Config from "../../../src/core/loader/get-config.js";

jest.mock("../../../src/core/loader/get-config.js");

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
            const json = {
                "mockPrefix.mockKey1": "mock1",
                "mockPrefix.mockKey2": "mock2",
                "mockPrefix.mockKey3": "mock3",
            };

            Config.getConfig = jest.fn(path => json[path]);

            mockScreen = {
                setConfig: jest.fn(),
                context: {
                    config: { theme: {} },
                    navigation: {},
                },
                scene: {
                    add: jest.fn(),
                },
            };
        });

        afterEach(jest.clearAllMocks);

        test("Returns debug screen if debug mode", () => {
            addExampleScreens(mockScreen);
            expect(mockScreen.scene.add).toHaveBeenCalled();
            expect(Object.keys(mockScreen.setConfig.mock.calls[0][0])).toEqual(["theme", "navigation"]);
        });

        test("Does not call a second time (fp.once)", () => {
            addExampleScreens(mockScreen);
            expect(mockScreen.setConfig).not.toHaveBeenCalled();
        });
    });
});
