/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontPlugin from "../../../../src/core/loader/font-loader/font-plugin.js";
import FontFile from "../../../../src/core/loader/font-loader/font-file.js";

describe("FontPlugin", () => {
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

	test("registers webfont file type", () => {
		const fontPlugin = new FontPlugin(mockPluginManager);
		expect(mockPluginManager.registerFileType).toHaveBeenCalledWith("webfont", fontPlugin.fontLoaderCallback);
	});

	test("font loader callback adds file to loader", () => {
		const fontPlugin = new FontPlugin(mockPluginManager);
		fontPlugin.addFile = jest.fn();
		fontPlugin.fontLoaderCallback(mockFileConfig);
		expect(fontPlugin.addFile).toHaveBeenCalledWith(new FontFile(fontPlugin, mockFileConfig));
	});

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
