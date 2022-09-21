/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontFile from "../../../../src/core/loader/font-loader/font-file.js";

describe("FontFile", () => {
	let mockLoader;
	let mockFileConfig;

	beforeEach(() => {
		mockLoader = {
			nextFile: jest.fn(),
			emit: jest.fn(),
			baseURL: "",
			path: "path/",
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
		Phaser.Loader.GetURL = jest.fn(file => file.url);
	});
	afterEach(() => jest.clearAllMocks());

	test("calls webfontloader with the correct arguments", () => {
		global.WebFont = {
			load: jest.fn(),
		};
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		fontFile.load();
		expect(Phaser.Loader.GetURL).toHaveBeenCalledWith(
			{ url: mockFileConfig.config.custom.urls[0] },
			mockLoader.path,
		);
		expect(global.WebFont.load).toHaveBeenCalledWith(
			expect.objectContaining({
				...mockFileConfig.config,
			}),
		);
		const args = global.WebFont.load.mock.calls[0][0];

		expect(args.active.name).toEqual("bound onLoad");
		expect(args.inactive.name).toEqual("bound onError");
		expect(args.fontactive.name).toEqual("bound onFontActive");
		expect(args.fontinactive.name).toEqual("bound onFontInactive");
	});

	test("calls webfontloader with the correct url when the url provided is relative to the theme directory", () => {
		mockFileConfig.config.custom.urls = ["bbc-reith.css"];
		Phaser.Loader.GetURL = jest.fn((file, path) => path + file.url);
		global.WebFont = {
			load: jest.fn(),
		};
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		fontFile.load();
		expect(Phaser.Loader.GetURL).toHaveBeenCalledWith({ url: "bbc-reith.css" }, mockLoader.path);
		expect(global.WebFont.load).toHaveBeenCalledWith(
			expect.objectContaining({
				custom: {
					families: ["ReithSans"],
					urls: ["path/bbc-reith.css"],
				},
			}),
		);
	});

	test("onLoad calls the phaser loader with the correct arguments", () => {
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		fontFile.onLoad();
		expect(mockLoader.nextFile).toHaveBeenCalledWith(fontFile, true);
	});

	test("onError calls the phaser loader with the correct arguments", () => {
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		fontFile.onError();
		expect(mockLoader.nextFile).toHaveBeenCalledWith(fontFile, false);
	});

	test("fires the phaser loader's event emitter onFontActive with the correct arguments", () => {
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		const expectedArgs = {
			fontFamily: "ReithSans",
			fontVariationDescription: "4n",
		};
		fontFile.onFontActive(expectedArgs.fontFamily, expectedArgs.fontVariationDescription);
		expect(mockLoader.emit).toHaveBeenCalledWith("fontactive", fontFile, expectedArgs);
	});

	test("fires the phaser loader's event emitter onFontInactive with the correct arguments", () => {
		const fontFile = new FontFile(mockLoader, mockFileConfig);
		const expectedArgs = {
			fontFamily: "ReithSans",
			fontVariationDescription: "4n",
		};
		fontFile.onFontInactive(expectedArgs.fontFamily, expectedArgs.fontVariationDescription);
		expect(mockLoader.emit).toHaveBeenCalledWith("fontinactive", fontFile, expectedArgs);
	});
});
