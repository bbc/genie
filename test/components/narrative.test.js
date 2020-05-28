/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../src/core/event-bus.js";
import { Narrative } from "../../src/components/narrative.js";

describe("Narrative Screen", () => {
    let narrativeScreen;
    let mockData;

    beforeEach(() => {
        narrativeScreen = new Narrative();

        mockData = {
            config: { theme: { narrative: { achievements: undefined }, home: {}, furniture: [] } },
        };

        narrativeScreen.setData(mockData);
        narrativeScreen.scene = { key: "narrative" };
        narrativeScreen.add = { image: jest.fn() };
        narrativeScreen.setLayout = jest.fn();
        narrativeScreen.navigation = { next: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => {
            narrativeScreen.create();
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["continue", "skip", "pause"];
            expect(narrativeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });
    });

    describe("Events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
            narrativeScreen.create();
        });

        test("adds a callback for the continue button", () => {
            expect(eventBus.subscribe.mock.calls[0][0].channel).toBe("gel-buttons-narrative");
            expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
            expect(eventBus.subscribe.mock.calls[0][0].callback).toEqual(expect.any(Function));
        });
    });
});
