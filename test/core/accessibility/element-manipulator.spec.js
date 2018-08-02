import { expect } from "chai";
import * as sinon from "sinon";
import * as accessibleButtons from "../../../src/core/accessibility/accessible-buttons.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("#hideAndDisableElement", () => {
    let sandbox, element, button;

    const getNewElement = id => {
        return {
            id: id,
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub(),
            classList: {
                add: sandbox.stub(),
            },
            style: {
                cursor: "pointer",
            },
        };
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        button = {
            elementEvents: {
                click: sandbox.stub(),
                keyup: sandbox.stub(),
            },
        };
        sandbox.stub(accessibleButtons, "findButtonByElementId").returns(button);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("when element has already been hidden and disabled", () => {
        it("only runs once and no more for that element", () => {
            element = getNewElement("home__abc");
            elementManipulator.hideAndDisableElement(element);
            elementManipulator.hideAndDisableElement(element);
            elementManipulator.hideAndDisableElement(element);

            sandbox.assert.calledOnce(accessibleButtons.findButtonByElementId);
        });
    });

    describe("when element has NOT already been hidden and disabled", () => {
        it("finds the button by element ID", () => {
            element = getNewElement("home__1");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.calledOnce(accessibleButtons.findButtonByElementId);
            sandbox.assert.calledWith(accessibleButtons.findButtonByElementId, element.id);
        });

        it("adds a 'blur' event listener", () => {
            element = getNewElement("home__2");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.calledOnce(element.addEventListener);
        });

        it("adds the hide-focus-ring class to element", () => {
            element = getNewElement("home__3");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.calledOnce(element.classList.add);
        });

        it("adds the hide-focus-ring class to element", () => {
            element = getNewElement("home__4");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.calledOnce(element.classList.add);
        });

        it("sets the cursor style to be default", () => {
            element = getNewElement("home__5");
            elementManipulator.hideAndDisableElement(element);
            expect(element.style.cursor).to.eq("default");
        });

        it("removes click event from element", () => {
            element = getNewElement("home__6");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.called(element.removeEventListener);
            sandbox.assert.calledWith(element.removeEventListener, "click", button.elementEvents.click);
        });

        it("removes keyup event from element", () => {
            element = getNewElement("home__7");
            elementManipulator.hideAndDisableElement(element);
            sandbox.assert.called(element.removeEventListener);
            sandbox.assert.calledWith(element.removeEventListener, "keyup", button.elementEvents.keyup);
        });
    });
});
