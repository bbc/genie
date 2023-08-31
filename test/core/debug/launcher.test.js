/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "../../../src/core/debug/launcher.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as debugScreens from "../../../src/core/debug/debug-screens.js";
import * as examplesModule from "../../../src/core/debug/examples.js";

jest.mock("../../../src/core/debug/debug-screens.js");

describe("Examples Launcher", () => {
	let launcher;

	beforeEach(() => {
		launcher = new Launcher();

		const mockButton = {
			config: {
				id: "testButton",
			},
			overlays: { set: jest.fn() },
			scene: {
				scene: { key: "testKey" },
				sys: { scale: { parent: "mockParent" }, accessibleButtons: [] },
			},
		};

		launcher.add = {
			image: jest.fn(),
			text: jest.fn(() => ({
				setOrigin: jest.fn(),
			})),
			gelButton: jest.fn(() => mockButton),
		};
		launcher.setLayout = jest.fn();
		launcher.navigation = { next: jest.fn(), example1: jest.fn(), example2: jest.fn(), example3: jest.fn() };
		launcher.scene = { key: "launcher", add: jest.fn() };
		launcher.cache = {
			json: {
				get: jest.fn(() => ({ config: { files: [] } })),
			},
		};
		launcher._data = {
			transient: {},
			navigation: {},
			config: {
				theme: {},
			},
		};

		launcher.load = {
			setBaseURL: jest.fn(),
			setPath: jest.fn(),
			pack: jest.fn(),
		};
		debugScreens.addExampleScreens = jest.fn(() => new Promise(resolve => resolve()));
		examplesModule.examples = {
			example1: {
				scene: function () {},
				title: "test title",
				transientData: {
					testKey: "testValue",
				},
				routes: {},
			},
			example2: {
				scene: function () {},
				title: "test title",
				routes: {},
			},
			example3: {
				scene: function () {},
				title: "test title",
				prompt: { title: "foo", default: "bar" },
			},
		};

		eventBus.subscribe = jest.fn();
	});

	describe("create method", () => {
		beforeEach(() => {
			launcher.create();
		});

		test("Intentionally loose test as page not included in final output", () => {
			expect(launcher.add.image).toHaveBeenCalled();
			expect(launcher.add.gelButton).toHaveBeenCalled();
			expect(launcher.setLayout).toHaveBeenCalledWith(["home", "previous", "next"]);
			expect(eventBus.subscribe).toHaveBeenCalled();
		});

		test("Sets transientData if present in example config", () => {
			eventBus.subscribe.mock.calls[3][0].callback();
			expect(launcher._data.transient.example1.testKey).toBe("testValue");
		});

		test("Does not set transientData if absent from example config", () => {
			eventBus.subscribe.mock.calls[5][0].callback();
			expect(launcher._data.transient.testKey).not.toBeDefined();
		});

		test("sets transientData from a prompt if present in example config", () => {
			window.prompt = () => '{ "testKey": "testValue" }';
			eventBus.subscribe.mock.calls[7][0].callback();
			expect(launcher._data.transient.example3.testKey).toBe("testValue");
		});

		test("defaults transientData to an empty object if no value is returned from the prompt and no transientData was provided", () => {
			window.prompt = () => null;
			eventBus.subscribe.mock.calls[7][0].callback();
			expect(launcher._data.transient.example3).toStrictEqual({});
		});

		test("next callback shows current page", () => {
			launcher.showCurrentPage = jest.fn();
			eventBus.subscribe.mock.calls[0][0].callback();
			expect(launcher.showCurrentPage).toHaveBeenCalled();
		});

		test("previous callback shows current page", () => {
			launcher.showCurrentPage = jest.fn();
			eventBus.subscribe.mock.calls[1][0].callback();
			expect(launcher.showCurrentPage).toHaveBeenCalled();
		});

		test("showCurrentPage sets current button visibility", () => {
			const mockPages = [[{ visible: false }], [{ visible: false }], [{ visible: false }]];
			launcher.pages = mockPages;
			launcher.pageIndex = 2;
			launcher.showCurrentPage();
			expect(mockPages[2][0].visible).toBe(true);
		});
	});
});
