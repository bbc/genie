import { expect } from "chai";
import * as sinon from "sinon";
import { accessibleDomElement } from "../../../src/lib/accessibilify/accessible-dom-element";

describe("#accessibleDomElement", () => {
    let sandbox;
    let options;
    let createElement;
    let element;
    let parentElement;
    let parentAppendChild;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        element = document.createElement("div");
        parentAppendChild = sandbox.spy();
        parentElement = {
            appendChild: parentAppendChild,
        };
        options = {
            id: "play-button",
            ariaLabel: "Play Button",
            onClick: () => {},
            parent: parentElement,
        };
        createElement = sandbox.stub(document, "createElement").returns(element);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Initialize", () => {
        it("creates new div element", () => {
            accessibleDomElement(options);
            sinon.assert.calledOnce(createElement.withArgs("div"));
        });

        it("sets tabindex to 0", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("tabindex")).to.equal("0");
        });

        it("sets aria-label to correct value", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("aria-label")).to.equal("Play Button");
        });

        it("sets role to correct value", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("role")).to.equal("button");
        });

        it("sets style position to absolute", () => {
            accessibleDomElement(options);
            expect(element.style.position).to.equal("absolute");
        });

        it("adds an event listener for keyup", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("keyup", sinon.match.func));
        });

        it("adds an event listener for click", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("click", sinon.match.func));
        });

        it("appends element to parent element", () => {
            accessibleDomElement(options);
            sinon.assert.calledOnce(parentAppendChild.withArgs(element));
        });
    });

    describe("Accessing the created element", () => {
        it("returns element when calling el function on the module", () => {
            const newAccessibleElement = accessibleDomElement(options);
            expect(newAccessibleElement.el).to.equal(element);
        });
    });

    describe("hiding the element", () => {
        it("hides element when calling hide function on the module", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(element.getAttribute("tabindex")).to.equal("-1");
            expect(element.style.visibility).to.equal("hidden");
        });
    });

    describe("showing the element", () => {
        it("shows element when calling show function on the module", () => {
            element.setAttribute("tabindex", "-1");
            element.style.visibility = "hidden";

            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();

            expect(element.getAttribute("tabindex")).to.equal("0");
            expect(element.style.visibility).to.equal("visible");
        });
    });

    describe("checking visibility of element", () => {
        it("calling visible function returns true when element is visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();
            expect(newAccessibleElement.visible()).to.equal(true);
        });

        it("calling visible function returns false when element is not visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(newAccessibleElement.visible()).to.equal(false);
        });
    });

    describe("setting position of element via position function", () => {
        it("sets css values correctly", () => {
            const newAccessibleElement = accessibleDomElement(options);
            const positionOptions = {
                x: 50,
                y: 50,
                width: 200,
                height: 100,
            };
            newAccessibleElement.position(positionOptions);
            expect(element.style.left).to.equal("50px");
            expect(element.style.top).to.equal("50px");
            expect(element.style.width).to.equal("200px");
            expect(element.style.height).to.equal("100px");
        });
    });

    describe("removing element", () => {
        it("is removed from DOM when calling remove function", () => {
            const remove = sandbox.stub(element, "remove");
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.remove();
            sinon.assert.calledOnce(remove);
        });
    });
});
