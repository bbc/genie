/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
import * as handlers from "../../../../src/core/layout/scrollable-list/scrollable-list-handlers.js";

let mockGelButton;
let mockRexLabel;
let mockGridSizer;
let mockPanel;

const mockScene = {
    input: { activePointer: { id: 1, upTime: 999 } },
    scale: { displaySize: { height: 600 } },
    layout: { getSafeArea: jest.fn().mockReturnValue({ y: -100 }) },
    sys: { time: { now: 1000 } },
};
const mockSizer = { innerHeight: 300, space: { top: 10 } };
const mockOtherRexLabel = { children: [{}], height: 100 };

describe("Scrollable List handlers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockGelButton = {
            config: { id: "foo" },
            rexContainer: {
                parent: {
                    getTopmostSizer: jest.fn().mockReturnValue(mockSizer),
                },
            },
        };
        mockRexLabel = { children: [mockGelButton], height: 100, setElementSizeAndPosition: jest.fn() };
        mockGridSizer = { getElement: jest.fn().mockReturnValue([mockRexLabel]) };
        mockPanel = {
            getByName: jest.fn().mockReturnValue(mockGridSizer),
            space: { top: 10 },
            setT: jest.fn(),
            minHeight: 120,
            t: 0,
            visible: true,
            isInTouching: jest.fn().mockReturnValue(true),
        };
    });

    describe("handleClickIfVisible()", () => {
        let mockClickHandler = jest.fn();

        test("returns a fn that calls clickHandler if click is inside the panel's Y bounds", () => {
            mockScene.input.y = 300;
            const handler = handlers.handleClickIfVisible(mockGelButton, mockScene, mockClickHandler);
            handler();
            expect(mockClickHandler).toHaveBeenCalled();
        });
        test("returns a fn that does not call clickHandler if click is outside the panel", () => {
            mockScene.input.y = 0;
            const handler = handlers.handleClickIfVisible(mockGelButton, mockScene, mockClickHandler);
            handler();
            expect(mockClickHandler).not.toHaveBeenCalled();
        });
        test("if the panel does not exist yet, guard vs race condition", () => {
            mockGelButton.rexContainer.parent = undefined;
            const handler = handlers.handleClickIfVisible(mockGelButton, mockScene, mockClickHandler);
            handler();
            expect(mockClickHandler).not.toHaveBeenCalled();
        });
        test("if the activePointer id is 0, we have an a11y click, so we return a fn that calls clickHandler", () => {
            mockScene.input = { y: 0, activePointer: { id: 0 } };
            const handler = handlers.handleClickIfVisible(mockGelButton, mockScene, mockClickHandler);
            handler();
            expect(mockClickHandler).toHaveBeenCalled();
        });
        test("if the activePointer id is not 0, but the activePointer upTime is old, we have an a11y click", () => {
            mockScene.input = { y: 0, activePointer: { id: 1, upTime: 500 } };
            const handler = handlers.handleClickIfVisible(mockGelButton, mockScene, mockClickHandler);
            handler();
            expect(mockClickHandler).toHaveBeenCalled();
        });
    });

    describe("updatePanelOnScroll", () => {
        beforeEach(() => {});
        test("calls setElementSizeAndPosition on each GEL button", () => {
            const instance = handlers.updatePanelOnScroll(mockPanel);
            instance();
            expect(mockRexLabel.setElementSizeAndPosition).toHaveBeenCalled();
        });
    });

    describe("updatePanelOnFocus", () => {
        test("sets a t to 0 if focused on the top item & item is off the top edge", () => {
            mockGridSizer = {
                getElement: jest.fn().mockReturnValue([mockRexLabel, mockOtherRexLabel, mockOtherRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn().mockReturnValue(mockGridSizer),
                space: { top: 10 },
                setT: jest.fn(),
                minHeight: 150,
                t: 1,
            };
            const instance = handlers.updatePanelOnFocus(mockPanel);
            instance(mockRexLabel);
            expect(mockPanel.setT.mock.calls[0][0]).toBe(0);
        });
        test("sets t to one if focused on the bottom item & item is off the bottom edge", () => {
            mockGridSizer = {
                getElement: jest.fn().mockReturnValue([mockOtherRexLabel, mockOtherRexLabel, mockRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn().mockReturnValue(mockGridSizer),
                space: { top: 10 },
                setT: jest.fn(),
                minHeight: 150,
                t: 0,
            };
            const instance = handlers.updatePanelOnFocus(mockPanel);
            instance(mockRexLabel);
            expect(mockPanel.setT.mock.calls[0][0]).toBe(1);
        });
        test("does not set t if the item is visible", () => {
            mockGridSizer = {
                getElement: jest.fn().mockReturnValue([mockOtherRexLabel, mockRexLabel, mockOtherRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn().mockReturnValue(mockGridSizer),
                space: { top: 10 },
                setT: jest.fn(),
                minHeight: 150,
                t: 0.5,
            };
            const instance = handlers.updatePanelOnFocus(mockPanel);
            instance(mockRexLabel);
            expect(mockPanel.setT).not.toHaveBeenCalled();
        });
        test("sets t appropriately to bring the focused item into the visible area", () => {
            mockGridSizer = {
                getElement: jest
                    .fn()
                    .mockReturnValue([
                        mockOtherRexLabel,
                        mockOtherRexLabel,
                        mockOtherRexLabel,
                        mockRexLabel,
                        mockOtherRexLabel,
                    ]),
            };
            mockPanel = {
                getByName: jest.fn().mockReturnValue(mockGridSizer),
                space: { top: 10 },
                setT: jest.fn(),
                minHeight: 150,
                t: 0.2,
            };
            const instance = handlers.updatePanelOnFocus(mockPanel);
            instance(mockRexLabel);
            const t = mockPanel.setT.mock.calls[0][0];
            expect(t).toBeLessThan(1);
            expect(t).toBeGreaterThan(0.5);
        });
    });

    describe("updatePanelOnWheel", () => {
        let mockEvent;
        let args;
        beforeEach(() => {
            mockEvent = { stopPropagation: jest.fn() };
            args = [{ deltaY: 1 }, undefined, undefined, undefined, undefined, mockEvent];
        });
        test("is a curried fn that sets t (scroll position) on the panel and stops propagation.", () => {
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn(...args);
            expect(mockPanel.setT).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
        test("does not set t if not visible", () => {
            mockPanel.visible = false;
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn(...args);
            expect(mockPanel.setT).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });
});
