/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ParticlesPlugin } from "../../../../src/core/loader/particles-loader/particles-plugin.js";
import { ParticlesFile } from "../../../../src/core/loader/particles-loader/particles-file.js";

describe("Particles Plugin", () => {
	let mockPluginManager;
	let mockFileConfig;

	beforeEach(() => {
		mockPluginManager = {
			registerFileType: jest.fn(),
		};
		mockFileConfig = {
			type: "particles",
			key: "testKey",
		};
	});
	afterEach(() => jest.clearAllMocks());

	test("registers particles file type", () => {
		const particlesPlugin = new ParticlesPlugin(mockPluginManager);
		expect(mockPluginManager.registerFileType).toHaveBeenCalledWith("particles", particlesPlugin.loaderCallback);
	});

	test("Particles loader callback adds file to loader", () => {
		const particlesPlugin = new ParticlesPlugin(mockPluginManager);
		particlesPlugin.addFile = jest.fn();
		particlesPlugin.cacheManager = { json: {} };
		particlesPlugin.loaderCallback(mockFileConfig);
		expect(particlesPlugin.addFile).toHaveBeenCalledWith(new ParticlesFile(particlesPlugin, mockFileConfig));
	});

	test("addToScene attaches ParticlesLoaderCallback to Phaser Loader", () => {
		const mockScene = {
			sys: {
				load: {
					particles: jest.fn(),
				},
			},
		};
		const particlesPlugin = new ParticlesPlugin(mockPluginManager);
		particlesPlugin.addToScene(mockScene);
		expect(mockScene.sys.load.particles).toBe(particlesPlugin.loaderCallback);
	});
});
