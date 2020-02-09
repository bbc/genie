/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as singleItemMode from "../../../src/components/select/single-item-mode.js";
describe("Select Screen Single Item Mode", () => {
    let mockScene;
    let mockCurrentCell;

    beforeEach(() => {
        mockScene = {
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
                getPageCells: jest.fn(() => [mockCurrentCell]),
            },
        };
    });

    afterEach(jest.clearAllMocks);

    test("Exits and returns false if continue button is not present", () => {
        delete mockScene.layout.buttons.continue;
        expect(singleItemMode.create(mockScene)).toBe(false);
    });

    test("adds pointerover event to continue button which sets the current cell to hover state", () => {
        mockCurrentCell = { button: { sprite: { setFrame: jest.fn() } } };

        singleItemMode.create(mockScene);

        const pointeroverFn = mockScene.layout.buttons.continue.on.mock.calls[0][1];
        pointeroverFn();

        expect(mockScene.layout.buttons.continue.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        expect(mockCurrentCell.button.sprite.setFrame).toHaveBeenCalledWith(1);
    });

    test("adds pointerout event to continue button which sets the current cell to default state", () => {
        mockCurrentCell = { button: { sprite: { setFrame: jest.fn() } } };
        singleItemMode.create(mockScene);

        const pointeroutFn = mockScene.layout.buttons.continue.on.mock.calls[1][1];
        pointeroutFn();

        expect(mockScene.layout.buttons.continue.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockCurrentCell.button.sprite.setFrame).toHaveBeenCalledWith(0);
    });

    test("adds pointerover event to cells which sets the continue button to hover state", () => {
        singleItemMode.create(mockScene);

        const pointeroverFn = mockScene._cells[0].button.on.mock.calls[0][1];
        pointeroverFn();

        expect(mockScene._cells[0].button.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        expect(mockScene.layout.buttons.continue.sprite.setFrame).toHaveBeenCalledWith(1);
    });

    test("adds pointerout event to cells which sets the continue button to default state", () => {
        singleItemMode.create(mockScene);

        const pointeroutFn = mockScene._cells[0].button.on.mock.calls[1][1];
        pointeroutFn();

        expect(mockScene._cells[0].button.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockScene.layout.buttons.continue.sprite.setFrame).toHaveBeenCalledWith(0);
    });

    test("adds a pointerout event to the last cells which moves the grid to the next page", () => {
        singleItemMode.create(mockScene);
        const pointeroutFn = mockScene._cells[1].button.on.mock.calls[2][1];
        pointeroutFn();

        expect(mockScene._cells[1].button.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
        expect(mockScene.grid.showPage).toHaveBeenCalledWith(5);
    });
});
