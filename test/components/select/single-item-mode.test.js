/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as singleItemMode from "../../../src/components/select/single-item-mode.js";
describe("Select Screen Single Item Mode", () => {
    afterEach(jest.clearAllMocks);

    test("Exits and returns false if continue button is not present", () => {
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [{ button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } }],
        };

        delete mockScene.layout.buttons.continue;

        expect(singleItemMode.create(mockScene)).toBe(false);
    });

    test("adds pointerover event to continue button which sets the current cell to hover state", () => {
        const mockCurrentCell = { button: { sprite: { setFrame: jest.fn() } } };
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [{ button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } }],
            grid: {
                getPageCells: jest.fn(() => [mockCurrentCell]),
            },
        };

        singleItemMode.create(mockScene);

        const pointeroverFn = mockScene.layout.buttons.continue.on.mock.calls[0][1];
        pointeroverFn();

        expect(mockScene.layout.buttons.continue.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        expect(mockCurrentCell.button.sprite.setFrame).toHaveBeenCalledWith(1);
    });

    test("adds pointerout event to continue button which sets the current cell to default state", () => {
        const mockCurrentCell = { button: { sprite: { setFrame: jest.fn() } } };
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [{ button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } }],
            grid: {
                getPageCells: jest.fn(() => [mockCurrentCell]),
            },
        };

        singleItemMode.create(mockScene);

        const pointeroutFn = mockScene.layout.buttons.continue.on.mock.calls[1][1];
        pointeroutFn();

        expect(mockScene.layout.buttons.continue.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockCurrentCell.button.sprite.setFrame).toHaveBeenCalledWith(0);
    });

    test("adds pointerover event to cells which sets the continue button to hover state", () => {
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [{ button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } }],
        };

        singleItemMode.create(mockScene);

        const pointeroverFn = mockScene._cells[0].button.on.mock.calls[0][1];
        pointeroverFn();

        expect(mockScene._cells[0].button.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        expect(mockScene.layout.buttons.continue.sprite.setFrame).toHaveBeenCalledWith(1);
    });

    test("adds pointerout event to cells which sets the continue button to default state", () => {
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [{ button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } }],
        };

        singleItemMode.create(mockScene);

        const pointeroutFn = mockScene._cells[0].button.on.mock.calls[1][1];
        pointeroutFn();

        expect(mockScene._cells[0].button.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockScene.layout.buttons.continue.sprite.setFrame).toHaveBeenCalledWith(0);
    });

    test("adds a pointerout event to the last cells which moves the grid to the next page", () => {
        const mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [
                { button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } },
                { button: { on: jest.fn(), accessibleElement: { update: jest.fn() } } },
            ],
            grid: {
                page: 4,
                showPage: jest.fn(),
            },
        };

        singleItemMode.create(mockScene);

        const pointeroutFn = mockScene._cells[1].button.on.mock.calls[2][1];
        pointeroutFn();

        //scene.grid.showPage(scene.grid.page + 1)

        expect(mockScene._cells[1].button.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockScene.grid.showPage).toHaveBeenCalledWith(5);
    });
});
