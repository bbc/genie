/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as accessibleButtons from "../../../src/core/accessibility/accessible-buttons.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("element manipulator", () => {
    let element;
    let button;
    let sequentialCounter = 0;

    const attributeMap = {
        "aria-label": "test element",
    };

    const getNewElement = id => {
        return {
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
        };
    };

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
        jest.spyOn(accessibleButtons, "findButtonByElementId").mockImplementation(() => button);
        element = getNewElement("home__" + sequentialCounter);
    });

    afterEach(() => jest.restoreAllMocks());

    describe("hideAndDisableElement Method", () => {
        beforeEach(() => {
            elementManipulator.hideAndDisableElement(element);
        });

        describe("when element has already been hidden and disabled", () => {
            test("only runs once and no more for that element", () => {
                elementManipulator.hideAndDisableElement(element);
                elementManipulator.hideAndDisableElement(element);
                elementManipulator.hideAndDisableElement(element);

                expect(accessibleButtons.findButtonByElementId).toHaveBeenCalledTimes(1);
            });
        });

        describe("when element has NOT already been hidden and disabled", () => {
            test("adds a 'blur' event listener", () => {
                expect(element.addEventListener).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("resetElementToDefault Method", () => {
        let resetElement;

        beforeEach(() => {
            elementManipulator.hideAndDisableElement(element);
            resetElement = element.addEventListener.mock.calls[element.addEventListener.mock.calls.length - 1][1];
        });

        test("removes the blur event listener", () => {
            resetElement();
            const eventListerCall = element.removeEventListener.mock.calls[2][0];
            expect(eventListerCall).toBe("blur");
        });

        test("removes the element at the start of the next event loop preventing race condition in Chrome (which fires blur events on element removal)", () => {
            jest.useFakeTimers();
            resetElement();
            jest.runAllTimers();

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(element.parentElement.removeChild).toHaveBeenCalledWith(element);
        });
    });

    describe("showElement Method", () => {
        beforeEach(() => {
            elementManipulator.showElement(element);
        });

        test("removes the class 'hide-focus-ring'", () => {
            expect(element.classList.remove).toHaveBeenCalledWith("hide-focus-ring");
        });

        test("sets the cursor style to pointer", () => {
            expect(element.style.cursor).toBe("pointer");
        });

        test("resets the z-index", () => {
            expect(element.style["z-index"]).toBe(0);
        });

        test("re-adds click event listener", () => {
            expect(element.addEventListener).toHaveBeenCalledWith("click", button.elementEvents.click);
        });

        test("re-adds keyup event listener", () => {
            expect(element.addEventListener).toHaveBeenCalledWith("keyup", button.elementEvents.keyup);
        });

        test("re-adds the aria label", () => {
            expect(element.setAttribute).toHaveBeenCalledWith("aria-label", attributeMap["aria-label"]);
        });
    });

    describe("hideElement Method", () => {
        beforeEach(() => {
            elementManipulator.hideElement(element);
        });

        test("finds the button by element ID", () => {
            expect(accessibleButtons.findButtonByElementId).toHaveBeenCalledTimes(1);
            expect(accessibleButtons.findButtonByElementId).toHaveBeenCalledWith(element.id);
        });

        test("adds the hide-focus-ring class to element", () => {
            expect(element.classList.add).toHaveBeenCalledTimes(1);
        });

        test("sets the cursor style to be default", () => {
            expect(element.style.cursor).toBe("default");
        });

        test("moves the element to the bottom", () => {
            expect(element.style["z-index"]).toBe(-1);
        });

        test("clears the aria label", () => {
            expect(element.setAttribute).toHaveBeenCalledWith("aria-label", "");
        });

        test("removes click event from element", () => {
            expect(element.removeEventListener).toHaveBeenCalledWith("click", button.elementEvents.click);
        });

        test("removes keyup event from element", () => {
            expect(element.removeEventListener).toHaveBeenCalledWith("keyup", button.elementEvents.keyup);
        });
    });
});
