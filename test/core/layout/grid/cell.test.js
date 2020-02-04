/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { create, setSize } from "../../../../src/core/layout/grid/cell.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";
import { accessibilify } from "../../../../src/core/accessibility/accessibilify.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");

describe("Grid Cells", () => {
    let mockButton;
    let mockGrid;
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
        };

        mockGrid = {
            _cellSize: [200, 100],
            _config: {
                columns: 2,
                rows: 2,
            },
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
                },
                scene: {
                    key: "scene-key",
                },
            },
        };
    });

    afterEach(jest.clearAllMocks);

    describe("Tabbing when 1 item per page", () => {
        test("adds mouseover event to cell when single item grid", () => {
            mockGrid.cellsPerPage = 1;
            create(mockGrid, {}, 0);

            expect(mockButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        });

        test("does not add mouseover event to cell when multi item grid", () => {
            mockGrid.cellsPerPage = 2;
            create(mockGrid, {}, 0);

            expect(mockButton.on).not.toHaveBeenCalled();
        });

        test("moves to correct page when tabbed to button is not current button", () => {
            mockButton.config.id = "next-button-id";
            create(mockGrid, {}, 0);
            const tabTransitionFn = mockButton.on.mock.calls[0][1];
            tabTransitionFn();

            expect(mockGrid.showPage).toHaveBeenCalledWith(1);
        });

        test("does not change page when tabbed to button is current button", () => {
            mockButton.config.id = "start-button-id";
            create(mockGrid, {}, 0);
            const tabTransitionFn = mockButton.on.mock.calls[0][1];

            tabTransitionFn();

            expect(mockGrid.showPage).not.toHaveBeenCalled();
        });
    });

    describe("addTweens method", () => {
        test("sets the tween duration to zero when motion is off in the GMI", () => {
            motion = false;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({});
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].duration).toBe(0));
        });

        test("sets the tween duration when motion is on in the GMI", () => {
            motion = true;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({ duration: 500 });
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].duration).toBe(500));
        });

        test("sets the correct tween alpha when tweening in", () => {
            motion = true;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({ tweenIn: true });
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].alpha).toStrictEqual({ from: 0, to: 1 }));
        });

        test("sets the correct tween alpha when tweening out", () => {
            motion = true;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({ tweenIn: false });
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].alpha).toStrictEqual({ from: 1, to: 0 }));
        });

        test("sets the correct tween x when forward transition", () => {
            motion = true;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({ goForwards: true });
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: -500 }));
        });

        test("sets the correct tween x when reverse transition", () => {
            motion = true;
            const cell = create(mockGrid, {}, 0);

            cell.addTweens({ goForwards: false });
            const tweenCalls = mockGrid.scene.add.tween.mock.calls;

            tweenCalls.forEach(tweenCall => expect(tweenCall[0].x).toStrictEqual({ from: 0, to: 500 }));
        });
    });

    describe("reset method", () => {
        test("sets cell visibility to false", () => {
            const cell = create(mockGrid, {}, 0);
            cell.reset();

            expect(cell.button.visible).toBe(false);
        });

        test("updates accessible element", () => {
            const cell = create(mockGrid, {}, 0);
            cell.reset();

            expect(mockButton.accessibleElement.update).toHaveBeenCalled();
        });
    });

    describe("makeAccessible method", () => {
        test("calls accessibilify on button", () => {
            const cell = create(mockGrid, {}, 0);
            cell.makeAccessible();

            expect(accessibilify).toHaveBeenCalledWith(mockButton, true);
        });
    });

    describe("setSize method", () => {
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
});
