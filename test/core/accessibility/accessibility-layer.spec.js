import { expect } from "chai";
import * as sinon from "sinon";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

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
        let parentElement;

        before(() => {
            parentElement = { innerHTML: "<div id='home__play'></div>" };
            sandbox
                .stub(document, "getElementById")
                .withArgs("accessibility")
                .returns(parentElement);

            a11y.clearElementsFromDom();
        });

        it("clears all accessible elements from the DOM", () => {
            expect(parentElement.innerHTML).to.eq("");
        });
    });
});
