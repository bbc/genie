import { expect } from "chai";
import * as sinon from "sinon";
import * as accessibleButtons from "../../../src/core/accessibility/accessible-buttons.js";
import * as elementManipulator from "../../../src/core/accessibility/element-manipulator.js";

describe("element manipulator", () => {
    let sandbox, element, button;
    let sequentialCounter = 0;

    const getNewElement = id => {
        return {
            id: id,
            parentElement: {
                removeChild: sandbox.stub(),
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub(),
            classList: {
                add: sandbox.stub(),
                remove: sandbox.stub(),
            },
            style: {
                cursor: "pointer",
            },
        };
    };

    beforeEach(() => {
        sequentialCounter++;
        sandbox = sinon.createSandbox();
        button = {
            elementEvents: {
                click: sandbox.stub(),
                keyup: sandbox.stub(),
            },
        };
        sandbox.stub(accessibleButtons, "findButtonByElementId").returns(button);
        element = getNewElement("home__" + sequentialCounter);
        elementManipulator.hideAndDisableElement(element);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#hideAndDisableElement", () => {
        describe("when element has already been hidden and disabled", () => {
            it("only runs once and no more for that element", () => {
                elementManipulator.hideAndDisableElement(element);
                elementManipulator.hideAndDisableElement(element);
                elementManipulator.hideAndDisableElement(element);

                sandbox.assert.calledOnce(accessibleButtons.findButtonByElementId);
            });
        });

        describe("when element has NOT already been hidden and disabled", () => {
            it("finds the button by element ID", () => {
                sandbox.assert.calledOnce(accessibleButtons.findButtonByElementId);
                sandbox.assert.calledWith(accessibleButtons.findButtonByElementId, element.id);
            });

            it("adds a 'blur' event listener", () => {
                sandbox.assert.calledOnce(element.addEventListener);
            });

            it("adds the hide-focus-ring class to element", () => {
                sandbox.assert.calledOnce(element.classList.add);
            });

            it("adds the hide-focus-ring class to element", () => {
                sandbox.assert.calledOnce(element.classList.add);
            });

            it("sets the cursor style to be default", () => {
                expect(element.style.cursor).to.eq("default");
            });

            it("removes click event from element", () => {
                sandbox.assert.called(element.removeEventListener);
                sandbox.assert.calledWith(element.removeEventListener, "click", button.elementEvents.click);
            });

            it("removes keyup event from element", () => {
                sandbox.assert.called(element.removeEventListener);
                sandbox.assert.calledWith(element.removeEventListener, "keyup", button.elementEvents.keyup);
            });
        });
    });

    describe("#resetElementToDefault", () => {
        let resetElement;

        beforeEach(() => {
            resetElement = element.addEventListener.lastCall.args[1];
            resetElement();
        });

        it("removes the element", () => {
            sandbox.assert.calledOnce(element.parentElement.removeChild.withArgs(element));
        });

        it("removes the blur event listener", () => {
            sandbox.assert.calledOnce(element.removeEventListener.withArgs("blur"));
        });

        it("removes the class 'hide-focus-ring'", () => {
            sandbox.assert.calledOnce(element.classList.remove.withArgs("hide-focus-ring"));
        });

        it("sets the cursor style to pointer", () => {
            expect(element.style.cursor).to.eq("pointer");
        });

        it("re-adds click event listener", () => {
            sandbox.assert.calledOnce(element.addEventListener.withArgs("click", button.elementEvents.click));
        });

        it("re-adds keyup event listener", () => {
            sandbox.assert.calledOnce(element.addEventListener.withArgs("keyup", button.elementEvents.keyup));
        });
    });
});
