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

    afterEach(() => jest.restoreAllMocks());

    describe("hideAndDisableElement Method", () => {
        beforeEach(() => {
            elementManipulator.hideAndDisableElement(accessibleElement);
        });

        //describe("when element has already been hidden and disabled", () => {
        //    test("only runs once and no more for that element", () => {
        //        elementManipulator.hideAndDisableElement(element);
        //        elementManipulator.hideAndDisableElement(element);
        //        elementManipulator.hideAndDisableElement(element);
        //
        //        expect(accessibleButtons.findButtonByElementId).toHaveBeenCalledTimes(1);
        //    });
        //});

        describe("when element has NOT already been hidden and disabled", () => {
            test("adds a 'blur' event listener", () => {
                expect(accessibleElement.el.addEventListener).toHaveBeenCalledTimes(1);
            });
        });
    });
});
