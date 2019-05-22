/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element.js";

import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("Managing accessible buttons", () => {
    beforeEach(() => a11y.clearAccessibleButtons());
    afterEach(() => jest.clearAllMocks());

    describe("Set up", () => {
        let gameParentElement;
        let element;

        beforeEach(() => {
            gameParentElement = domElement();
            element = domElement();
            jest.spyOn(element, "setAttribute");
            jest.spyOn(global.document, "createElement").mockImplementation(() => element);

            a11y.setup(gameParentElement);
        });

        test("creates and appends the parent DOM element", () => {
            expect(global.document.createElement).toHaveBeenCalledWith("div");
            expect(gameParentElement.appendChild).toHaveBeenCalledWith(element);
            expect(element.id).toEqual("accessibility");
        });

        test("sets the role of the accessibility container div to 'application' (for NVDA/FF tabbing focus)", () => {
            expect(element.setAttribute).toHaveBeenCalledTimes(1);
            expect(element.setAttribute).toHaveBeenCalledWith("role", "application");
        });
    });

    describe("appendElementsToDom Method", () => {
        let el1, el2, el3, button1, button2, button3, screen1, screen2, parentElement;

        beforeEach(() => {
            screen1 = { visibleLayer: "home" };
            screen2 = { visibleLayer: "pause" };
            el1 = { id: "home__play" };
            el2 = { id: "home__pause" };
            el3 = { id: "pause__back" };
            button1 = { accessibleElement: el1 };
            button2 = { accessibleElement: el2 };
            button3 = { accessibleElement: el3 };
            a11y.addToAccessibleButtons(screen1, button1);
            a11y.addToAccessibleButtons(screen1, button2);
            a11y.addToAccessibleButtons(screen2, button3);
            parentElement = domElement();
            jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
                if (argument === "accessibility") {
                    return parentElement;
                }
            });

            a11y.appendElementsToDom(screen1);
        });

        test("appends correct elements to the DOM", () => {
            expect(parentElement.appendChild).toHaveBeenCalledWith(el1);
            expect(parentElement.appendChild).toHaveBeenCalledWith(el2);
            expect(parentElement.appendChild).not.toHaveBeenCalledWith(el3);
        });
    });

    describe("clearElementsFromDom Method", () => {
        let parentElement, el1, el2, el3;

        beforeEach(() => {
            el1 = domElement();
            el2 = domElement();
            el3 = domElement();
            parentElement = {
                childNodes: [el1, el2, el3],
                removeChild: jest.fn(),
            };
            el1.parentElement = parentElement;
            el2.parentElement = parentElement;
            el3.parentElement = parentElement;
            jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
                if (argument === "accessibility") {
                    return parentElement;
                }
            });
            Object.defineProperty(global.document, "activeElement", { get: jest.fn(() => el1) });
            jest.spyOn(elementManipulator, "hideAndDisableElement").mockImplementation(() => {});
            jest.spyOn(Array, "from").mockImplementation(argument => argument);

            a11y.clearElementsFromDom();
        });

        test("clears all accessible elements from the DOM except the currently focused one", () => {
            expect(elementManipulator.hideAndDisableElement).toHaveBeenCalledWith(el1);
            expect(parentElement.removeChild).toHaveBeenCalledTimes(2);
            expect(elementManipulator.hideAndDisableElement).toHaveBeenCalledWith(el1);
            expect(parentElement.removeChild).toHaveBeenCalledWith(el2);
            expect(parentElement.removeChild).toHaveBeenCalledWith(el3);
        });
    });

    describe("removeFromAccessibleButtons Method", () => {
        let button1, button2, button3, screen1;

        test("appends correct elements to the DOM", () => {
            screen1 = { visibleLayer: "home" };
            button1 = { accessibleElement: { id: "home" } };
            button2 = { accessibleElement: { id: "pause" } };
            button3 = { accessibleElement: { id: "back" } };
            a11y.addToAccessibleButtons(screen1, button1);
            a11y.addToAccessibleButtons(screen1, button2);
            a11y.addToAccessibleButtons(screen1, button3);
            a11y.removeFromAccessibleButtons(screen1, button2);

            const buttons = a11y.getAccessibleButtons("home");

            expect(buttons.length).toEqual(2);
            expect(buttons[0].accessibleElement.id).toEqual("home");
            expect(buttons[1].accessibleElement.id).toEqual("back");
        });
    });

    describe("getAccessibleButtons Method", () => {
        let button1, button2, button3, screen1;

        test("returns the correct elements to the DOM", () => {
            screen1 = { visibleLayer: "home" };
            button1 = { accessibleElement: { id: "home" } };
            button2 = { accessibleElement: { id: "pause" } };
            button3 = { accessibleElement: { id: "back" } };
            a11y.addToAccessibleButtons(screen1, button1);
            a11y.addToAccessibleButtons(screen1, button2);
            a11y.addToAccessibleButtons(screen1, button3);

            const buttons = a11y.getAccessibleButtons("home");

            expect(buttons.length).toEqual(3);
            expect(buttons[0].accessibleElement.id).toEqual("home");
            expect(buttons[1].accessibleElement.id).toEqual("pause");
            expect(buttons[2].accessibleElement.id).toEqual("back");
        });
    });
});
