/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

import { createCell, setSize } from "../../../../src/core/layout/grid/cell.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";
import { accessibilify } from "../../../../src/core/accessibility/accessibilify.js";
import * as state from "../../../../src/core/state.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");

describe("Grid Cells", () => {
    let mockButton;
    let mockGrid;
    let mockText;
    let motion;

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
                width: 200,
                height: 100,
            },
            accessibleElement: {
                update: jest.fn(),
            },
            setDisplaySize: jest.fn(),
            overlays: { set: jest.fn() },
        };

        mockText = { setOrigin: jest.fn() };

        mockGrid = {
            _cellSize: [200, 100],
            _config: {
                columns: 2,
                rows: 2,
            },
            _metrics: { metrics: "metrics" },
            getPageCells: jest.fn(() => []),
            getCurrentPageKey: jest.fn(() => "start-button-id"),
            cellIds: jest.fn(() => ["start-button-id", "next-button-id"]),
            showPage: jest.fn(),
            cellsPerPage: 1,
            add: jest.fn(),
            _safeArea: {
                width: 500,
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
            },
        };
    });

    afterEach(jest.clearAllMocks);

    describe("setSize function", () => {
        test("sets correct size of button when button is same size as cell", () => {
            setSize(mockGrid, mockButton);

            expect(mockButton.setDisplaySize).toHaveBeenCalledWith(200, 100);
        });

        test("sets correct size when button is wide aspect", () => {
            mockButton.sprite.width = 400;
            setSize(mockGrid, mockButton);

            expect(mockButton.setDisplaySize).toHaveBeenCalledWith(200, 50);
        });

        test("sets correct size when button is tall aspect", () => {
            mockButton.sprite.width = 10;
            setSize(mockGrid, mockButton);

            expect(mockButton.setDisplaySize).toHaveBeenCalledWith(10, 100);
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

        test("adds the button to the grid", () => {
            createCell(mockGrid, {}, 0);
            expect(mockGrid.add).toHaveBeenCalledWith(mockButton);
        });

        describe("Button text", () => {
            let mockTheme;
            let mockStates;

            beforeEach(() => {
                mockStates = { get: jest.fn() };
                jest.spyOn(state, "create").mockImplementation(() => mockStates);
                mockTheme = {
                    choices: [{ id: "mary", key: "mary", ariaLabel: "Mary", title: "Mary", subtitle: "Is very tall" }],
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
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                const styles = mockTheme.choicesStyling.default.title;
                expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
                    styles.position.x,
                    styles.position.y,
                    mockTheme.choices[0].title,
                    styles.style,
                );
                expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
            });

            test("does not add title text when no default styling is provided", () => {
                delete mockTheme.choicesStyling;
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                expect(mockGrid.scene.add.text).not.toHaveBeenCalled();
                expect(mockText.setOrigin).not.toHaveBeenCalled();
            });

            test("adds title text to the button overlay", () => {
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                expect(mockButton.overlays.set).toHaveBeenCalledWith("titleText", mockText);
            });

            test("adds subtitle text when default styling is provided", () => {
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                const styles = mockTheme.choicesStyling.default.subtitle;
                expect(mockGrid.scene.add.text).toHaveBeenCalledTimes(2);
                expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
                    styles.position.x,
                    styles.position.y,
                    mockTheme.choices[0].subtitle,
                    styles.style,
                );
                expect(mockText.setOrigin).toHaveBeenCalledTimes(2);
            });

            test("does not add subtitle text when no default styling is provided", () => {
                delete mockTheme.choicesStyling.default.subtitle;
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                expect(mockGrid.scene.add.text).toHaveBeenCalledTimes(1);
                expect(mockText.setOrigin).toHaveBeenCalledTimes(1);
            });

            test("adds subtitle text to the button overlay", () => {
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                expect(mockButton.overlays.set).toHaveBeenCalledWith("subtitleText", mockText);
            });

            test("applies a style override to the default styles when the button has a different state", () => {
                mockTheme.choices[0].state = "locked";
                mockStates.get.mockReturnValue(mockTheme.choices[0]);
                mockTheme.choicesStyling.locked = { title: { style: { color: "#000" } } };

                const expectedStyle = fp.merge(mockTheme.choicesStyling.default, mockTheme.choicesStyling.locked);
                createCell(mockGrid, mockTheme.choices[0], 0, mockTheme);
                const styles = mockTheme.choicesStyling.default.title;
                expect(mockGrid.scene.add.text).toHaveBeenCalledWith(
                    styles.position.x,
                    styles.position.y,
                    mockTheme.choices[0].title,
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
                mockButton.config.id = "next-button-id";
                createCell(mockGrid, {}, 0);
                const tabTransitionFn = mockButton.on.mock.calls[0][1];
                tabTransitionFn();

                expect(mockGrid.showPage).toHaveBeenCalledWith(1);
            });

            test("does not change page when tabbed to button is current button", () => {
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

                tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: -500 }));
            });

            test("sets the correct tween x when reverse transition", () => {
                motion = true;
                const cell = createCell(mockGrid, {}, 0);

                cell.addTweens({ goForwards: false });
                const tweenCalls = mockGrid.scene.add.tween.mock.calls;

                tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: 500 }));
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
