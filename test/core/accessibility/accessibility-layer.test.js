/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element.js";

import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("Managing accessible buttons", () => {
    beforeEach(() => a11y.clearButtons());
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
        let el1, el2, el3, fakeEl, fakeButton, button1, button2, button3, screen1, screen2, parentElement;

        beforeEach(() => {
            screen1 = { scene: { key: "home" } };
            screen2 = { scene: { key: "pause" } };
            el1 = { id: "home__play" };
            el2 = { id: "home__pause" };
            el3 = { id: "pause__back" };
            fakeEl = {};
            button1 = { accessibleElement: el1 };
            button2 = { accessibleElement: el2 };
            button3 = { accessibleElement: el3 };
            fakeButton = { accessibleElement: fakeEl };
            parentElement = domElement();
            jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
                if (argument === "accessibility") {
                    return parentElement;
                }
            });
        });

        test("appends correct elements to the DOM", () => {
            a11y.addButton(screen1, button1);
            a11y.addButton(screen1, button2);
            a11y.addButton(screen2, button3);
            a11y.appendToDom(screen1);
            expect(parentElement.appendChild).toHaveBeenCalledWith(el1);
            expect(parentElement.appendChild).toHaveBeenCalledWith(el2);
            expect(parentElement.appendChild).not.toHaveBeenCalledWith(el3);
        });

        test("only appends elements with accessible element", () => {
            a11y.addButton(screen1, button1);
            a11y.addButton(screen1, button2);
            a11y.addButton(screen1, fakeButton);
            a11y.appendToDom(screen1);
            expect(parentElement.appendChild).toHaveBeenCalledWith(el1);
            expect(parentElement.appendChild).toHaveBeenCalledWith(el2);
            expect(parentElement.appendChild).not.toHaveBeenCalledWith(fakeEl);
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

            a11y.clear();
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
            screen1 = { scene: { key: "home" } };
            button1 = { accessibleElement: { id: "home" } };
            button2 = { accessibleElement: { id: "pause" } };
            button3 = { accessibleElement: { id: "back" } };
            a11y.addButton(screen1, button1);
            a11y.addButton(screen1, button2);
            a11y.addButton(screen1, button3);
            a11y.removeButtons(screen1, button2);

            const buttons = a11y.getAccessibleButtons("home");

            expect(buttons.length).toEqual(2);
            expect(buttons[0].accessibleElement.id).toEqual("home");
            expect(buttons[1].accessibleElement.id).toEqual("back");
        });

        test("does nothing if the button does not exist", () => {
            screen1 = { scene: { key: "home" } };
            button1 = { accessibleElement: { id: "home" } };
            button2 = { accessibleElement: { id: "pause" } };
            button3 = { accessibleElement: { id: "back" } };
            a11y.addButton(screen1, button1);
            a11y.addButton(screen1, button2);
            a11y.addButton(screen1, button3);
            a11y.removeButtons(screen1, { some: "fakeButton" });

            const buttons = a11y.getAccessibleButtons("home");

            expect(buttons.length).toEqual(3);
            expect(buttons[0].accessibleElement.id).toEqual("home");
            expect(buttons[1].accessibleElement.id).toEqual("pause");
            expect(buttons[2].accessibleElement.id).toEqual("back");
        });
    });

    describe("getAccessibleButtons Method", () => {
        let button1, button2, button3, screen1;

        test("returns the correct elements to the DOM", () => {
            screen1 = { scene: { key: "home" } };
            button1 = { accessibleElement: { id: "home" } };
            button2 = { accessibleElement: { id: "pause" } };
            button3 = { accessibleElement: { id: "back" } };
            a11y.addButton(screen1, button1);
            a11y.addButton(screen1, button2);
            a11y.addButton(screen1, button3);

            const buttons = a11y.getAccessibleButtons("home");

            expect(buttons.length).toEqual(3);
            expect(buttons[0].accessibleElement.id).toEqual("home");
            expect(buttons[1].accessibleElement.id).toEqual("pause");
            expect(buttons[2].accessibleElement.id).toEqual("back");
        });

        test("returns an empty array if there are no buttons", () => {
            const buttons = a11y.getAccessibleButtons("random");
            expect(buttons).toEqual([]);
        });
    });

    describe("resetElementsInDom Method", () => {
        test("clears elements from the DOM, then appends the elements to the DOM", () => {
            const screen1 = { scene: { key: "home" } };
            const button1 = { accessibleElement: { id: "home" } };
            const parentElement = domElement();
            jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
                if (argument === "accessibility") {
                    return parentElement;
                }
            });
            a11y.addButton(screen1, button1);

            const expectedButtons = a11y.getAccessibleButtons("home");
            a11y.reset(screen1);
            const buttons = a11y.getAccessibleButtons("home");
            expect(buttons).toBe(expectedButtons);
        });
    });

    describe("clearAccessibleButtons Method", () => {
        test("clears all the accessible buttons for a screen", () => {
            const screen1 = { scene: { key: "home" } };
            const button1 = { accessibleElement: { id: "home" } };
            a11y.addButton(screen1, button1);

            const expectedButtons = [];
            a11y.clearButtons(screen1);
            const buttons = a11y.getAccessibleButtons("home");
            expect(buttons).toEqual(expectedButtons);
        });
    });
});
