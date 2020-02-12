/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as singleItemMode from "../../../src/components/select/single-item-mode.js";
describe("Select Screen Single Item Mode", () => {
    let mockScene;
    let mockCurrentCell;
    let currentPageKey;

    beforeEach(() => {
        mockScene = {
            layout: {
                buttons: { continue: { on: jest.fn(), sprite: { setFrame: jest.fn() } } },
            },
            _cells: [
                { button: { on: jest.fn(), accessibleElement: { update: jest.fn() }, config: {} } },
                { button: { on: jest.fn(), accessibleElement: { update: jest.fn() }, config: {} } },
            ],
            grid: {
                page: 4,
                showPage: jest.fn(),
                getPageCells: jest.fn(() => [mockCurrentCell]),
                getCurrentPageKey: jest.fn(() => currentPageKey),
            },
            events: {
                once: jest.fn(),
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

    test("sets cells to tabbable and calls update on their accessible element", () => {
        singleItemMode.create(mockScene);

        expect(mockScene._cells[0].button.config.tabbable).toBe(true);
        expect(mockScene._cells[0].button.accessibleElement.update).toHaveBeenCalled();
    });

    test("adds keyboard tab event which moves the grid to the next page if last item is current", () => {
        global.document.addEventListener = jest.fn();
        currentPageKey = "test-page-key";
        mockScene._cells[1].button.key = "test-page-key";

        singleItemMode.create(mockScene);

        const goToStartFn = global.document.addEventListener.mock.calls[0][1];
        goToStartFn({ key: "Tab" });

        expect(global.document.addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
        expect(mockScene.grid.showPage).toHaveBeenCalledWith(0);
    });

    test("does not move to the next page if key is not Tab", () => {
        global.document.addEventListener = jest.fn();
        currentPageKey = "test-page-key";
        mockScene._cells[1].button.key = "test-page-key";

        singleItemMode.create(mockScene);

        const goToStartFn = global.document.addEventListener.mock.calls[0][1];
        goToStartFn({ key: "OtherKey" });
        expect(mockScene.grid.showPage).not.toHaveBeenCalled();
    });

    test("does not move to the next page if current page is not last item", () => {
        global.document.addEventListener = jest.fn();
        currentPageKey = "test-page-key";
        mockScene._cells[1].button.key = "test-page-key-other";

        singleItemMode.create(mockScene);

        const goToStartFn = global.document.addEventListener.mock.calls[0][1];
        goToStartFn({ key: "Tab" });
        expect(mockScene.grid.showPage).not.toHaveBeenCalled();
    });

    test("adds a shutdown event which removes keyboard listener", () => {
        global.document.removeEventListener = jest.fn();

        singleItemMode.create(mockScene);

        const shutDownFn = mockScene.events.once.mock.calls[0][1];
        shutDownFn();

        expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        expect(global.document.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    });
});
