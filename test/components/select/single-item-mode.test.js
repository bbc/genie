/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as singleItemMode from "../../../src/components/select/single-item-mode.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

jest.mock("../../../src/core/accessibility/accessibility-layer.js");

describe("Select Screen Single Item Mode", () => {
    let mockScene;
    let mockCurrentCell;
    let currentPageKey;

    beforeEach(() => {
        mockScene = {
            layout: {
                buttons: {
                    next: { mock: "next" },
                    previous: { mock: "previous" },
                    continue: { on: jest.fn(), off: jest.fn(), sprite: { setFrame: jest.fn() } },
                },
            },
            _cells: [
                { button: { on: jest.fn(), off: jest.fn(), accessibleElement: { update: jest.fn() }, config: {} } },
                { button: { on: jest.fn(), off: jest.fn(), accessibleElement: { update: jest.fn() }, config: {} } },
            ],
            grid: {
                page: 4,
                showPage: jest.fn(),
                getPageCells: jest.fn(() => [mockCurrentCell]),
                getCurrentPageKey: jest.fn(() => currentPageKey),
            },
            events: {
                once: jest.fn(),
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    });

    afterEach(jest.clearAllMocks);

    test("Returns undefined if continue button is not present", () => {
        delete mockScene.layout.buttons.continue;
        const returnValue = singleItemMode.create(mockScene);
        expect(returnValue).toBe(undefined);
    });

    test("Adds scene resume listener to remove accessible buttons", () => {
        singleItemMode.create(mockScene);
        expect(mockScene.events.on).toHaveBeenCalledWith(Phaser.Scenes.Events.RESUME, expect.any(Function));
    });

    test("Removes continue, next and previous accessible buttons", () => {
        singleItemMode.create(mockScene);
        expect(a11y.removeButton).toHaveBeenCalledWith(mockScene.layout.buttons.continue);
        expect(a11y.removeButton).toHaveBeenCalledWith(mockScene.layout.buttons.next);
        expect(a11y.removeButton).toHaveBeenCalledWith(mockScene.layout.buttons.previous);
        expect(a11y.reset).toHaveBeenCalled();
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

    describe("continueButton", () => {
        test("returns continue button if 1 row and 1 column", () => {
            const btn = singleItemMode.continueBtn({ theme: { rows: 1, columns: 1 } });
            expect(btn).toEqual(["continue"]);
        });

        test("returns empty array if more than 1 row and 1 column", () => {
            const btn = singleItemMode.continueBtn({ theme: { rows: 2, columns: 3 } });
            expect(btn).toEqual([]);
        });
    });

    describe("shutdown method", () => {
        test("is added once to the shutdown event of the scene", () => {
            singleItemMode.create(mockScene);
            expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        });

        test("Removes scene resume listener", () => {
            const SIMode = singleItemMode.create(mockScene);
            SIMode.shutdown();
            expect(mockScene.events.off).toHaveBeenCalledWith(Phaser.Scenes.Events.RESUME, expect.any(Function));
        });

        test("Removes continue button hover events", () => {
            const SIMode = singleItemMode.create(mockScene);
            SIMode.shutdown();
            expect(mockScene.layout.buttons.continue.off).toHaveBeenCalledWith("pointerover", expect.any(Function));
            expect(mockScene.layout.buttons.continue.off).toHaveBeenCalledWith("pointerout", expect.any(Function));
        });

        test("Removes cell hover events for all cells", () => {
            const SIMode = singleItemMode.create(mockScene);
            SIMode.shutdown();
            expect(mockScene._cells[0].button.off).toHaveBeenCalledWith("pointerover", expect.any(Function));
            expect(mockScene._cells[0].button.off).toHaveBeenCalledWith("pointerout", expect.any(Function));
            expect(mockScene._cells[1].button.off).toHaveBeenCalledWith("pointerover", expect.any(Function));
            expect(mockScene._cells[1].button.off).toHaveBeenCalledWith("pointerout", expect.any(Function));
        });
    });
});
