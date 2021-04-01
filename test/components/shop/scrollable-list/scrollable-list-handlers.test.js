/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
import * as handlers from "../../../../src/components/shop/scrollable-list/scrollable-list-handlers.js";

let mockGelButton;
let mockOtherGelButton;
let mockRexLabel;
let mockOtherRexLabel;
let mockGridSizer;
let mockPanel;

const mockSizer = { innerHeight: 300, space: { top: 10 } };

describe("Scrollable List handlers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockGelButton = {
            setElementSizeAndPosition: jest.fn(),
            config: { id: "foo" },
            rexContainer: {
                parent: {
                    getTopmostSizer: jest.fn(() => mockSizer),
                },
            },
        };
        mockOtherGelButton = {
            setElementSizeAndPosition: jest.fn(),
        };
        mockRexLabel = {
            children: [mockGelButton],
            height: 100,
            setElementSizeAndPosition: jest.fn(),
            setInteractive: jest.fn(() => mockRexLabel),
            disableInteractive: jest.fn(() => mockRexLabel),
        };
        mockOtherRexLabel = { children: [mockOtherGelButton], height: 100 };
        mockGridSizer = { getElement: jest.fn(() => [mockRexLabel]) };
        mockPanel = {
            getByName: jest.fn(() => mockGridSizer),
            space: { top: 10 },
            setT: jest.fn(),
            minHeight: 120,
            t: 0,
            visible: true,
            isInTouching: jest.fn(() => true),
        };
    });

    describe("updatePanelOnFocus", () => {
        test("sets a t to 0 if focused on the top item & item is off the top edge", () => {
            mockGridSizer = {
                getElement: jest.fn(() => [mockRexLabel, mockOtherRexLabel, mockOtherRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn(() => mockGridSizer),
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
                getElement: jest.fn(() => [mockOtherRexLabel, mockOtherRexLabel, mockRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn(() => mockGridSizer),
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
                getElement: jest.fn(() => [mockOtherRexLabel, mockRexLabel, mockOtherRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn(() => mockGridSizer),
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
                getByName: jest.fn(() => mockGridSizer),
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
        test("updates a11y elements position on focus", () => {
            mockGridSizer = {
                getElement: jest.fn(() => [mockRexLabel]),
            };
            mockPanel = {
                getByName: jest.fn(() => mockGridSizer),
                space: { top: 10 },
                setT: jest.fn(),
                minHeight: 150,
                t: 1,
            };
            const update = handlers.updatePanelOnFocus(mockPanel);
            update(mockRexLabel);
            expect(mockGelButton.setElementSizeAndPosition).toHaveBeenCalledTimes(1);
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
        test("does not set T if scrolling is not possible (i.e. list is shorter than pane)", () => {
            mockPanel.minHeight = 200;
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn(...args);
            expect(mockPanel.setT).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
        test("updates a11y elements position on scroll.", () => {
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn(...args);
            expect(mockGelButton.setElementSizeAndPosition).toHaveBeenCalledTimes(1);
        });
    });
});
