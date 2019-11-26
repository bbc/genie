/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { JSON5Plugin } from "../../../../src/core/loader/json5-loader/json5-plugin.js";
import { JSON5File } from "../../../../src/core/loader/json5-loader/json5-file.js";

/*
describe("JSON5Plugin", () => {
    let mockPluginManager;
    let mockFileConfig;

    beforeEach(() => {
        mockPluginManager = {
            registerFileType: jest.fn(),
        };
        mockFileConfig = {
            type: "webfont",
            key: "reithsans",
            config: {
                custom: {
                    families: ["ReithSans"],
                    urls: ["https://gel.files.bbci.co.uk/r2.302/bbc-reith.css"],
                },
            },
        };
    });
    afterEach(() => jest.clearAllMocks());


    test("addToScene attaches fontLoaderCallback to Phaser Loader", () => {
        const mockScene = {
            sys: {
                load: {
                    webfont: jest.fn(),
                },
            },
        };
        const fontPlugin = new FontPlugin(mockPluginManager);
        fontPlugin.addToScene(mockScene);
        expect(mockScene.sys.load.webfont).toBe(fontPlugin.fontLoaderCallback);
    });
});
*/

describe("JSON5 Plugin", () => {
    let mockPluginManager;
    let mockFileConfig;

    beforeEach(() => {
        mockPluginManager = {
            registerFileType: jest.fn(),
        };
        mockFileConfig = {
            type: "json5",
            key: "testKey",
        };
    });
    afterEach(() => jest.clearAllMocks());

    test("registers json5 file type", () => {
        const json5Plugin = new JSON5Plugin(mockPluginManager);
        expect(mockPluginManager.registerFileType).toHaveBeenCalledWith("json5", json5Plugin.loaderCallback);
    });

    test("JSON5 loader callback adds file to loader", () => {
        const json5Plugin = new JSON5Plugin(mockPluginManager);
        json5Plugin.addFile = jest.fn();
        json5Plugin.cacheManager = { json: {} };
        json5Plugin.loaderCallback(mockFileConfig);
        expect(json5Plugin.addFile).toHaveBeenCalledWith(new JSON5File(json5Plugin, mockFileConfig));
    });

    test("addToScene attaches JSON5LoaderCallback to Phaser Loader", () => {
        const mockScene = {
            sys: {
                load: {
                    json5: jest.fn(),
                },
            },
        };
        const json5Plugin = new JSON5Plugin(mockPluginManager);
        json5Plugin.addToScene(mockScene);
        expect(mockScene.sys.load.json5).toBe(json5Plugin.loaderCallback);
    });
});
