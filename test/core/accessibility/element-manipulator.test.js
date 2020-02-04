/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("element manipulator", () => {
    let accessibleElement;
    let button;
    let sequentialCounter = 0;

    const attributeMap = {
        "aria-label": "test element",
    };

    const getNewElement = id => ({
        el: {
            id: id,
            parentElement: {
                removeChild: jest.fn(),
            },
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            setAttribute: jest.fn().mockImplementation((attribute, value) => {
                attributeMap[attribute] = value;
            }),
            getAttribute: jest.fn().mockImplementation(attribute => {
                return attributeMap[attribute];
            }),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            style: {
                cursor: "pointer",
            },
            button,
        },
        events: {
            click: jest.fn(),
        },
    });

    jest.useFakeTimers();

    beforeEach(() => {
        sequentialCounter++;
        button = {
            elementEvents: {
                click: jest.fn(),
                keyup: jest.fn(),
            },
            input: {
                enabled: true,
            },
        };
        accessibleElement = getNewElement("home__" + sequentialCounter);
    });

    afterEach(jest.clearAllMocks);

    describe("hideAndDisableElement Method", () => {
        beforeEach(() => {
            elementManipulator.hideAndDisableElement(accessibleElement);
        });

        describe("when element has NOT already been hidden and disabled", () => {
            test("adds a 'blur' event listener", () => {
                expect(accessibleElement.el.addEventListener).toHaveBeenCalledTimes(1);
                expect(accessibleElement.el.addEventListener.mock.calls[0][0]).toBe("blur");
            });

            test("removes click and keyup events", () => {
                expect(accessibleElement.el.removeEventListener.mock.calls[0][0]).toBe("click");
                expect(accessibleElement.el.removeEventListener.mock.calls[1][0]).toBe("keyup");
            });

            test("removes blur event onblur and keyup events", () => {
                const onBlur = accessibleElement.el.addEventListener.mock.calls[0][1];
                onBlur();
                expect(accessibleElement.el.removeEventListener.mock.calls[2][0]).toBe("blur");
            });

            test("unparents element on next tick", () => {
                const onBlur = accessibleElement.el.addEventListener.mock.calls[0][1];
                onBlur();
                jest.runAllTimers();
                expect(accessibleElement.el.parentElement.removeChild).toHaveBeenCalledWith(accessibleElement.el);
            });
        });

        describe("when element has already been hidden and disabled", () => {
            test("only runs once and no more for that element", () => {
                elementManipulator.hideAndDisableElement(accessibleElement);
                elementManipulator.hideAndDisableElement(accessibleElement);
                elementManipulator.hideAndDisableElement(accessibleElement);

                expect(accessibleElement.el.addEventListener).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("removeFromParent Method", () => {
        test("calls removeChild on parentElement", () => {
            const removeChildSpy = jest.fn();
            const testEl = { parentElement: { removeChild: removeChildSpy } };

            elementManipulator.removeFromParent(testEl);

            expect(removeChildSpy).toHaveBeenCalledWith(testEl);
        });
    });
});
