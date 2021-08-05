/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

import { createCell, setSize } from "../../../../src/core/layout/grid/cell.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";
import { accessibilify } from "../../../../src/core/accessibility/accessibilify.js";
import * as collectionsModule from "../../../../src/core/collections.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");

describe("Grid Cells", () => {
	let mockButton;
	let mockGrid;
	let mockCells;
	let mockText;
	let motion;
	let desktopCellPadding;

	beforeEach(() => {
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => ({ motion })),
		};

		mockButton = {
			x: 0,
			on: jest.fn(),
			config: {
				id: "next-button-id",
			},
			sprite: {
				width: 184,
				height: 100,
			},
			accessibleElement: {
				update: jest.fn(),
			},
			setDisplaySize: function (width, height) {
				this.displayWidth = width;
				this.displayHeight = height;
			},
			overlays: { set: jest.fn() },
		};

		mockCells = [];

		mockText = { setOrigin: jest.fn() };

		mockGrid = {
			_cellSize: [184, 100],
			_config: {
				columns: 2,
				rows: 2,
			},
			_metrics: { metrics: "metrics" },
			getPageCells: jest.fn(() => mockCells),
			getCurrentPageId: jest.fn(() => "start-button-id"),
			cellIds: jest.fn(() => ["start-button-id", "next-button-id"]),
			showPage: jest.fn(),
			_cellPadding: 24,
			add: jest.fn(),
			_safeArea: {
				width: 600,
			},
			scene: {
				add: {
					gelButton: jest.fn(() => mockButton),
					tween: jest.fn(),
					text: jest.fn(() => mockText),
				},
				scene: {
					key: "scene-key",
				},
				assetPrefix: "scene-key",
			},
		};

		desktopCellPadding = 24;

		collectionsModule.collections = {
			get: jest.fn(() => ({ get: jest.fn() })),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("setSize function", () => {
		test("sets correct size of button when button is same size as cell", () => {
			setSize(mockGrid, mockButton);

			expect(mockButton.displayWidth).toBe(184);
			expect(mockButton.displayHeight).toBe(100);
		});

		test("sets correct size when button is wide aspect", () => {
			mockButton.sprite.width = 368;
			setSize(mockGrid, mockButton);

			expect(mockButton.displayWidth).toBe(184);
			expect(mockButton.displayHeight).toBe(50);
		});

		test("sets correct size when button is tall aspect", () => {
			mockButton.sprite.width = 10;
			setSize(mockGrid, mockButton);

			expect(mockButton.displayWidth).toBe(10);
			expect(mockButton.displayHeight).toBe(100);
		});
	});

	describe("createCell function", () => {
		test("creates a GEL button for the cell", () => {
			createCell(mockGrid, {}, 0);
			const expectedConfig = {
				channel: undefined,
				gameButton: true,
				group: "grid",
				order: 0,
				scene: "scene-key",
				tabbable: false,
			};
			expect(mockGrid.scene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
		});

		test("makes the first button visible when there is more than one cell per page", () => {
			mockGrid.cellsPerPage = 2;
			createCell(mockGrid, {}, 0);
			expect(mockButton.visible).toBe(true);
		});

		test("makes the subsequent buttons invisible when there is more than one cell per page", () => {
			mockGrid.cellsPerPage = 2;
			createCell(mockGrid, {}, 1);
			expect(mockButton.visible).toBe(false);
		});

		test("does not set button visibility when there is only one cell per page", () => {
			mockGrid.cellsPerPage = 1;
			createCell(mockGrid, {}, 0);
			expect(mockButton.visible).not.toBeDefined();
		});

		test("sets a key on the button", () => {
			const expectedKey = "some-button";
			mockGrid.cellsPerPage = 1;
			createCell(mockGrid, { key: expectedKey }, 0);
			expect(mockButton.key).toBe(expectedKey);
		});

		describe("Button text", () => {
			let mockTheme;
			let mockCollection;
			let mockCellConfig = {
				id: "mary",
				key: "mary",
				ariaLabel: "Mary",
				title: "Mary",
				subtitle: "Is very tall",
				state: "locked",
			};

			beforeEach(() => {
				mockCollection = { get: jest.fn(() => mockCellConfig) };
				jest.spyOn(collectionsModule, "initCollection").mockImplementation(() => mockCollection);
				collectionsModule.collections = { get: jest.fn(() => ({ get: jest.fn(() => mockCellConfig) })) };
				mockTheme = {
					choicesStyling: {
						default: {
							title: {
								style: { fontFamily: "ReithSans", fontSize: "18px", color: "#eee" },
								position: { x: 0, y: 68 },
							},
							subtitle: {
								style: { fontFamily: "ReithSans", fontSize: "12px", color: "#fff" },
								position: { x: 0, y: 20 },
							},
						},
					},
				};
			});

			test("adds title text when default styling is provided", () => {
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				const styles = mockTheme.choicesStyling.default.title;
				expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
					styles.position.x,
					styles.position.y,
					mockCellConfig.title,
					styles.style,
				);
				expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
			});

			test("does not add title text when no default styling is provided", () => {
				delete mockTheme.choicesStyling;
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				expect(mockGrid.scene.add.text).not.toHaveBeenCalled();
				expect(mockText.setOrigin).not.toHaveBeenCalled();
			});

			test("adds title text to the button overlay", () => {
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				expect(mockButton.overlays.set).toHaveBeenCalledWith("titleText", mockText);
			});

			test("adds subtitle text when default styling is provided", () => {
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				const styles = mockTheme.choicesStyling.default.subtitle;
				expect(mockGrid.scene.add.text).toHaveBeenCalledTimes(2);
				expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
					styles.position.x,
					styles.position.y,
					mockCellConfig.subtitle,
					styles.style,
				);
				expect(mockText.setOrigin).toHaveBeenCalledTimes(2);
			});

			test("does not add subtitle text when no default styling is provided", () => {
				delete mockTheme.choicesStyling.default.subtitle;
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				expect(mockGrid.scene.add.text).toHaveBeenCalledTimes(1);
				expect(mockText.setOrigin).toHaveBeenCalledTimes(1);
			});

			test("adds subtitle text to the button overlay", () => {
				createCell(mockGrid, mockCellConfig, 0, mockTheme);
				expect(mockButton.overlays.set).toHaveBeenCalledWith("subtitleText", mockText);
			});

			test("applies a style override to the default styles when the button has a different state", () => {
				const choice = { state: "locked", title: "Mary" };
				mockCollection.get.mockReturnValue(choice);
				mockTheme.choicesStyling.locked = { title: { style: { color: "#000" } } };

				const expectedStyle = fp.merge(mockTheme.choicesStyling.default, mockTheme.choicesStyling.locked);
				createCell(mockGrid, choice, 0, mockTheme);
				const styles = mockTheme.choicesStyling.default.title;
				expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
					styles.position.x,
					styles.position.y,
					choice.title,
					expectedStyle.title.style,
				);
			});
		});

		describe("Tabbing when 1 item per page", () => {
			test("adds mouseover event to cell when single item grid", () => {
				mockGrid.cellsPerPage = 1;
				createCell(mockGrid, {}, 0);

				expect(mockButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
			});

			test("does not add mouseover event to cell when multi item grid", () => {
				mockGrid.cellsPerPage = 2;
				createCell(mockGrid, {}, 0);

				expect(mockButton.on).not.toHaveBeenCalled();
			});

			test("moves to correct page when tabbed to button is not current button", () => {
				mockGrid.cellsPerPage = 1;
				mockButton.config.id = "next-button-id";
				createCell(mockGrid, {}, 0);
				const tabTransitionFn = mockButton.on.mock.calls[0][1];
				tabTransitionFn();

				expect(mockGrid.showPage).toHaveBeenCalledWith(1);
			});

			test("does not change page when tabbed to button is current button", () => {
				mockGrid.cellsPerPage = 1;
				mockButton.config.id = "start-button-id";
				createCell(mockGrid, {}, 0);
				const tabTransitionFn = mockButton.on.mock.calls[0][1];

				tabTransitionFn();

				expect(mockGrid.showPage).not.toHaveBeenCalled();
			});
		});

		describe("reset method", () => {
			test("sets cell visibility to false", () => {
				const cell = createCell(mockGrid, {}, 0);
				cell.reset();

				expect(cell.button.visible).toBe(false);
			});

			test("updates accessible element", () => {
				const cell = createCell(mockGrid, {}, 0);
				cell.reset();

				expect(mockButton.accessibleElement.update).toHaveBeenCalled();
			});
		});

		describe("setting cell positions", () => {
			test("getBlankCells is called for the correct page the cell belongs to", () => {
				mockGrid.page = 0;
				mockGrid.cellsPerPage = 3;
				mockGrid._config.columns = 3;
				mockGrid._config.rows = 1;

				const cell = createCell(mockGrid, "testcell", 4);
				cell.reset();
				expect(mockGrid.getPageCells).toHaveBeenCalledWith(1);
			});

			test("last cell on the page is left aligned when set in config and single blank cell is on the page", () => {
				mockGrid.cellsPerPage = 3;
				mockGrid._config.align = "left";
				mockGrid._config.columns = 3;
				mockGrid._config.rows = 1;

				const cell = createCell(mockGrid, "testcell", 1);
				mockCells = [{}, cell];
				mockButton.displayWidth = cell.width;
				cell.reset();

				const expectedPosition = {
					x: 0,
				};

				expect(mockButton.x).toEqual(expectedPosition.x);
			});

			test("last cell on the page is right aligned when set in config and single blank cell is on the page", () => {
				mockGrid.cellsPerPage = 3;
				mockGrid._config.align = "right";
				mockGrid._config.columns = 3;
				mockGrid._config.rows = 1;

				const cell = createCell(mockGrid, "testcell", 1);
				mockCells = [{}, cell];

				mockButton.displayWidth = cell.width;
				cell.reset();
				// console.log("mockButton", mockButton);

				const expectedPosition = {
					x: cell.button.displayWidth / 2 + desktopCellPadding + cell.button.displayWidth / 2,
				};

				expect(mockButton.x).toEqual(expectedPosition.x);
			});

			test("last cell on the page is centre aligned when set in config and single blank cell is on the page", () => {
				mockGrid.cellsPerPage = 3;
				mockGrid._config.align = "center";
				mockGrid._config.columns = 3;
				mockGrid._config.rows = 1;

				const cell = createCell(mockGrid, "testcell", 1);
				mockCells = [{}, cell];

				mockButton.displayWidth = cell.width;
				cell.reset();
				// console.log("cell", cell);

				const expectedPosition = {
					x: desktopCellPadding / 2 + cell.button.displayWidth / 2,
				};

				expect(mockButton.x).toEqual(expectedPosition.x);
			});

			test("last cell on the page is centre aligned when set in config and single cell is on the row", () => {
				mockGrid.cellsPerPage = 3;
				mockGrid._config.align = "center";
				mockGrid._config.columns = 3;
				mockGrid._config.rows = 1;

				const cell = createCell(mockGrid, "testcell", 0);
				mockCells = [cell];

				mockButton.displayWidth = cell.width;
				cell.reset();

				const expectedPosition = {
					x: 0,
				};

				expect(mockButton.x).toEqual(expectedPosition.x);
			});
		});

		describe("addTweens method", () => {
			test("sets the tween duration to zero when motion is off in the GMI", () => {
				motion = false;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({});
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].duration).toBe(0));
			});

			test("sets the tween duration when motion is on in the GMI", () => {
				motion = true;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({ duration: 500 });
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].duration).toBe(500));
			});

			test("sets the correct tween alpha when tweening in", () => {
				motion = true;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({ tweenIn: true });
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].alpha).toStrictEqual({ from: 0, to: 1 }));
			});

			test("sets the correct tween alpha when tweening out", () => {
				motion = true;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({ tweenIn: false });
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].alpha).toStrictEqual({ from: 1, to: 0 }));
			});

			test("sets the correct tween x when forward transition", () => {
				motion = true;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({ goForwards: true });
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: -600 }));
			});

			test("sets the correct tween x when reverse transition", () => {
				motion = true;
				const cell = createCell(mockGrid, {}, 0);

				cell.addTweens({ goForwards: false });
				const tweenCalls = mockGrid.scene.add.tween.mock.calls;

				tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: 600 }));
			});
		});

		describe("makeAccessible method", () => {
			test("calls accessibilify on button", () => {
				const cell = createCell(mockGrid, {}, 0);
				cell.makeAccessible();

				expect(accessibilify).toHaveBeenCalledWith(mockButton, true);
			});
		});
	});
});
