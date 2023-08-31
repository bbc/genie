/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisUPlugin } from "../../../../src/core/loader/basisu-loader/basisu-plugin.js";
import { BasisUFile } from "../../../../src/core/loader/basisu-loader/basisu-file.js";

describe("BASISU Plugin", () => {
	let mockPluginManager;
	let mockFileConfig;

	beforeEach(() => {
		mockPluginManager = {
			registerFileType: jest.fn(),
		};
		mockFileConfig = {
			type: "basisu",
			key: "testKey",
		};
	});
	afterEach(jest.clearAllMocks);

	test("registers basisu file type", () => {
		const basisUPlugin = new BasisUPlugin(mockPluginManager);
		expect(mockPluginManager.registerFileType).toHaveBeenCalledWith("basisu", basisUPlugin.loaderCallback);
	});

	test("BASISU loader callback adds file to loader", () => {
		const basisU5Plugin = new BasisUPlugin(mockPluginManager);
		basisU5Plugin.addFile = jest.fn();
		basisU5Plugin.loaderCallback(mockFileConfig);
		expect(basisU5Plugin.addFile).toHaveBeenCalledWith(new BasisUFile(basisU5Plugin, mockFileConfig));
	});

	test("addToScene attaches BASISU LoaderCallback to Phaser Loader", () => {
		const mockScene = {
			sys: {
				load: {
					basisu: jest.fn(),
				},
			},
		};
		const basisU5Plugin = new BasisUPlugin(mockPluginManager);
		basisU5Plugin.addToScene(mockScene);
		expect(mockScene.sys.load.basisu).toBe(basisU5Plugin.loaderCallback);
	});
});
