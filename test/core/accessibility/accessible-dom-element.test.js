/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element.js";

import { accessibleDomElement } from "../../../src/core/accessibility/accessible-dom-element";

describe("Accessible DOM Element", () => {
    let events;
    let mockElement;
    let options;

    beforeEach(() => {
        events = {};
        mockElement = domElement();
        mockElement.addEventListener.mockImplementation((eventName, event) => {
            events[eventName] = event;
        });
        options = {
            onClick: jest.fn(),
            onMouseOver: jest.fn(),
            onMouseOut: jest.fn(),
        };
        global.document.createElement = jest.fn().mockImplementation(() => mockElement);
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialize", () => {
        test("creates new div mockElement", () => {
            accessibleDomElement(options);
            expect(global.document.createElement).toHaveBeenCalledWith("div");
        });

        test("sets the id to 'play-button", () => {
            options.id = "play-button";
            accessibleDomElement(options);
            expect(mockElement.id).toBe(options.id);
        });

        test("sets the html class if provided", () => {
            options.htmlClass = "gel-button";
            accessibleDomElement(options);
            expect(mockElement.getAttribute("class")).toBe("gel-button");
        });

        test("does not set a html class if none is given", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("class")).not.toBeDefined();
        });

        test("sets tabindex to 0", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("tabindex")).toBe("0");
        });

        test("sets aria-hidden to false by default", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("aria-hidden")).toBe(false);
        });

        test("sets aria-hidden to the given value", () => {
            options.ariaHidden = true;
            accessibleDomElement(options);
            expect(mockElement.getAttribute("aria-hidden")).toBe(true);
        });

        test("does not have an aria-label by default", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("aria-label")).not.toBeDefined();
        });

        test("sets an aria-label if given", () => {
            options.ariaLabel = "Play button";
            accessibleDomElement(options);
            expect(mockElement.getAttribute("aria-label")).toBe(options.ariaLabel);
        });

        test("sets aria-hidden to correct value", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("aria-hidden")).toBe(false);
        });

        test("sets role to correct value", () => {
            accessibleDomElement(options);
            expect(mockElement.getAttribute("role")).toBe("button");
        });

        test("sets style position to absolute", () => {
            accessibleDomElement(options);
            expect(mockElement.style.position).toBe("absolute");
        });

        test("sets cursor to  the correct value", () => {
            accessibleDomElement(options);
            expect(mockElement.style.cursor).toBe("pointer");
        });

        test("sets touch action to prevent iOS tap zoom", () => {
            accessibleDomElement(options);
            expect(mockElement.style.touchAction).toBe("manipulation");
        });

        test("sets inner text to be empty by default", () => {
            accessibleDomElement(options);
            expect(mockElement.innerHTML).toBe("");
        });

        test("sets inner text if given", () => {
            options.text = "Text goes here";
            accessibleDomElement(options);
            expect(mockElement.innerHTML).toBe(options.text);
        });

        test("pressing enter fires the onclick event", () => {
            const keyUpEvent = { key: "Enter" };
            accessibleDomElement(options);
            events.keyup(keyUpEvent);
            expect(options.onClick).toHaveBeenCalled();
        });

        test("pressing space fires the onclick event", () => {
            const keyUpEvent = { key: " " };
            accessibleDomElement(options);
            events.keyup(keyUpEvent);
            expect(options.onClick).toHaveBeenCalled();
        });

        test("click events are handled", () => {
            accessibleDomElement(options);
            events.click();
            expect(options.onClick).toHaveBeenCalled();
        });

        test("mouseover events are handled", () => {
            accessibleDomElement(options);
            events.mouseover();
            expect(options.onMouseOver).toHaveBeenCalled();
        });

        test("mouseleave events are handled", () => {
            accessibleDomElement(options);
            events.mouseleave();
            expect(options.onMouseOut).toHaveBeenCalled();
        });

        test("focus events are handled", () => {
            accessibleDomElement(options);
            events.focus();
            expect(options.onMouseOver).toHaveBeenCalled();
        });

        test("blur events are handled", () => {
            accessibleDomElement(options);
            events.blur();
            expect(options.onMouseOut).toHaveBeenCalled();
        });

        test("touchmove event disables pinch zoom", () => {
            accessibleDomElement(options);
            const touchMoveEvent = { preventDefault: jest.fn() };
            events.touchmove(touchMoveEvent);
            expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
        });

        test("returns a keyup function", () => {
            const mockElement = accessibleDomElement(options);
            const keyUpEvent = { key: "Enter" };
            mockElement.events.keyup(keyUpEvent);
            expect(options.onClick).toHaveBeenCalled();
        });

        test("returns a click function", () => {
            const mockElement = accessibleDomElement(options);
            mockElement.events.click();
            expect(options.onClick).toHaveBeenCalled();
        });
    });

    describe("el property", () => {
        test("returns the new accessible DOM element", () => {
            expect(accessibleDomElement(options).el).toBe(mockElement);
        });
    });

    describe("hiding the mockElement", () => {
        test("hides mockElement when calling hide function on the module", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(mockElement.getAttribute("aria-hidden")).toBe(true);
            expect(mockElement.getAttribute("tabindex")).toBe("-1");
            expect(mockElement.style.visibility).toBe("hidden");
            expect(mockElement.style.display).toBe("none");
        });
    });

    describe("showing the mockElement", () => {
        test("shows mockElement when calling show function on the module", () => {
            mockElement.setAttribute("aria-hidden", "true");
            mockElement.setAttribute("tabindex", "-1");
            mockElement.style.visibility = "hidden";

            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();

            expect(mockElement.getAttribute("aria-hidden")).toBe(false);
            expect(mockElement.getAttribute("tabindex")).toBe("0");
            expect(mockElement.style.visibility).toBe("visible");
            expect(mockElement.style.display).toBe("block");
        });
    });

    describe("checking visibility of mockElement", () => {
        test("calling visible function returns true when mockElement has been created", () => {
            const newAccessibleElement = accessibleDomElement(options);
            expect(newAccessibleElement.visible()).toBe(true);
        });

        test("calling visible function returns true when mockElement is visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();
            expect(newAccessibleElement.visible()).toBe(true);
        });

        test("calling visible function returns false when mockElement is not visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(newAccessibleElement.visible()).toBe(false);
        });
    });

    describe("setting position of mockElement via position function", () => {
        test("sets css values correctly", () => {
            const newAccessibleElement = accessibleDomElement(options);
            const positionOptions = {
                x: 50,
                y: 50,
                width: 200,
                height: 100,
            };
            newAccessibleElement.position(positionOptions);
            expect(mockElement.style.left).toBe("50px");
            expect(mockElement.style.top).toBe("50px");
            expect(mockElement.style.width).toBe("200px");
            expect(mockElement.style.height).toBe("100px");
        });
    });
});
