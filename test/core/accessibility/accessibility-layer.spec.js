import { expect } from "chai";
import * as sinon from "sinon";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("Managing accessible buttons", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        a11y.clearAccessibleButtons();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#setup", () => {
        let createElement;
        let gameParentElement;
        let el;

        before(() => {
            gameParentElement = { appendChild: sandbox.spy() };
            el = { id: "", role: "", setAttribute: sandbox.spy() };
            createElement = sandbox.stub(document, "createElement").returns(el);

            a11y.setup(gameParentElement);
        });

        it("creates and appends the parent DOM element", () => {
            sandbox.assert.calledOnce(createElement.withArgs("div"));
            sandbox.assert.calledOnce(gameParentElement.appendChild.withArgs(el));
            expect(el.id).to.eq("accessibility");
        });

        it("sets the role of the accessibility container div to 'application' (for NVDA/FF tabbing focus)", () => {
            sandbox.assert.calledOnce(el.setAttribute);
            sandbox.assert.calledWith(el.setAttribute, "role", "application");
        });
    });

    describe("#appendElementsToDom", () => {
        let el1, el2, el3, button1, button2, button3, screen1, screen2, parentElement;

        before(() => {
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
            parentElement = { appendChild: sandbox.stub() };
            sandbox
                .stub(document, "getElementById")
                .withArgs("accessibility")
                .returns(parentElement);

            a11y.appendElementsToDom(screen1);
        });

        it("appends correct elements to the DOM", () => {
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el1));
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el2));
            sandbox.assert.notCalled(parentElement.appendChild.withArgs(el3));
        });
    });

    describe("#clearElementsFromDom", () => {
        let parentElement, el1, el2, el3;

        before(() => {
            el1 = {};
            el2 = {};
            el3 = {};
            parentElement = {
                childNodes: [el1, el2, el3],
                removeChild: sandbox.stub(),
            };
            el1.parentElement = parentElement;
            el2.parentElement = parentElement;
            el3.parentElement = parentElement;
            sandbox
                .stub(document, "getElementById")
                .withArgs("accessibility")
                .returns(parentElement);
            Object.defineProperty(document, "activeElement", { get: () => el1 });
            sandbox.stub(elementManipulator, "hideAndDisableElement");
            sandbox
                .stub(Array, "from")
                .withArgs(parentElement.childNodes)
                .returns(parentElement.childNodes);

            a11y.clearElementsFromDom();
        });

        it("clears all accessible elements from the DOM except the currently focused one", () => {
            sandbox.assert.calledOnce(elementManipulator.hideAndDisableElement.withArgs(el1));
            sandbox.assert.calledTwice(parentElement.removeChild);

            sandbox.assert.calledWith(elementManipulator.hideAndDisableElement, el1);
            sandbox.assert.calledWith(parentElement.removeChild, el2);
            sandbox.assert.calledWith(parentElement.removeChild, el3);
        });
    });
});
