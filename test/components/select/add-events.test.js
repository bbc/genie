/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addEvents } from "../../../src/components/select/add-events.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("Select Screen addEvents", () => {
    let mockSelect;
    let mockCellIds;
    let nextSpy;

    beforeEach(() => {
        jest.spyOn(eventBus, "subscribe");

        mockCellIds = [];

        nextSpy = jest.fn();

        mockSelect = {
            scene: { key: "testSceneKey" },
            grid: {
                cellIds: jest.fn(() => mockCellIds),
                showPage: jest.fn(),
                page: 4,
            },
            next: jest.fn(() => nextSpy),
            events: {
                once: jest.fn(),
            },
        };
    });

    afterEach(jest.clearAllMocks);

    test("adds event subscription to the continue button", () => {
        addEvents(mockSelect);
        expect(eventBus.subscribe.mock.calls[0][0].channel).toBe("gel-buttons-testSceneKey");
        expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
    });

    test("moves to the next game screen when the continue button is pressed", () => {
        addEvents(mockSelect);
        eventBus.subscribe.mock.calls[0][0].callback();
        expect(nextSpy).toHaveBeenCalled();
    });

    test("adds event subscriptions for grid buttons", () => {
        mockCellIds = ["key1", "key2"];
        addEvents(mockSelect);
        expect(eventBus.subscribe.mock.calls[0][0].name).toBe("key1");
        expect(eventBus.subscribe.mock.calls[1][0].name).toBe("key2");
    });

    test("moves to the next screen when grid cell is pressed", () => {
        mockCellIds = ["key1", "key2"];
        addEvents(mockSelect);

        eventBus.subscribe.mock.calls[1][0].callback();
        expect(nextSpy).toHaveBeenCalled();
    });

    test("moves to the next page when next page is pressed", () => {
        mockCellIds = ["key1", "key2"];
        addEvents(mockSelect);

        eventBus.subscribe.mock.calls[3][0].callback();
        expect(mockSelect.grid.showPage).toHaveBeenCalledWith(5);
    });

    test("moves to the previous page when next page is pressed", () => {
        mockCellIds = ["key1", "key2"];
        addEvents(mockSelect);

        eventBus.subscribe.mock.calls[4][0].callback();
        expect(mockSelect.grid.showPage).toHaveBeenCalledWith(3);
    });

    test("returns key on cell callback", () => {
        mockCellIds = ["key1"];
        addEvents(mockSelect);

        const cellCallback = mockSelect.next.mock.calls[0][0];
        expect(cellCallback()).toBe("key1");
    });
});
