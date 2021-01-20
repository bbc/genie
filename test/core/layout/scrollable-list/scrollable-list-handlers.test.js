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
        mockRexLabel = {
            children: [mockGelButton],
            height: 100,
            setElementSizeAndPosition: jest.fn(),
            setInteractive: jest.fn(() => mockRexLabel),
            disableInteractive: jest.fn(() => mockRexLabel),
        };
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

    describe("updatePanelOnScroll", () => {
        beforeEach(() => {});
        test("calls setElementSizeAndPosition on each GEL button", () => {
            const instance = handlers.updatePanelOnScroll(mockPanel);
            instance();
            expect(mockRexLabel.setElementSizeAndPosition).toHaveBeenCalled();
        });

        test("calls setInteractive on each GEL button that is visible", () => {
            const instance = handlers.updatePanelOnScroll(mockPanel);
            instance();
            expect(mockRexLabel.setInteractive).toHaveBeenCalled();
        });

        test("calls disableInteractive on each GEL button that is not visible", () => {
            mockRexLabel.height = 500;
            const instance = handlers.updatePanelOnScroll(mockPanel);
            instance();
            expect(mockRexLabel.disableInteractive).toHaveBeenCalled();
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
        test("is a curried fn that sets t (scroll position) on the panel if visible and touching the pointer", () => {
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn({ deltaY: 1 });
            expect(mockPanel.setT).toHaveBeenCalled();
        });
        test("does not set t if not visible", () => {
            mockPanel.visible = false;
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn({ deltaY: 1 });
            expect(mockPanel.setT).not.toHaveBeenCalled();
        });
        test("does not set t if not touching pointer", () => {
            mockPanel.isInTouching = jest.fn().mockReturnValue(false);
            const onWheelFn = handlers.updatePanelOnWheel(mockPanel);
            onWheelFn({ deltaY: 1 });
            expect(mockPanel.setT).not.toHaveBeenCalled();
        });
    });
});
