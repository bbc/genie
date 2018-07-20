import { expect } from "chai";
import * as sinon from "sinon";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

describe("managing accessible buttons", () => {
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
        it("creates and appends the parent DOM element", () => {
            const gameParentElement = { appendChild: sandbox.stub() };
            const el = { id: "" };
            const createElement = sandbox.stub(document, "createElement").returns(el);

            a11y.setup(gameParentElement);

            sandbox.assert.calledOnce(createElement.withArgs("div"));
            sandbox.assert.calledOnce(gameParentElement.appendChild.withArgs(el));
            expect(el.id).to.eq("accessibility");
        });
    });

    describe("#appendElementsToDom", () => {
        let el1, el2, el3, button1, button2, button3, screen, screen2, parentElement;

        beforeEach(() => {
            screen = { visibleLayer: "home" };
            screen2 = { visibleLayer: "pause" };
            el1 = { id: "home__play" };
            el2 = { id: "home__pause" };
            el3 = { id: "pause__back" };
            button1 = { accessibleElement: el1 };
            button2 = { accessibleElement: el2 };
            button3 = { accessibleElement: el3 };
            a11y.addToAccessibleButtons(screen, button1);
            a11y.addToAccessibleButtons(screen, button2);
            a11y.addToAccessibleButtons(screen2, button3);
            parentElement = { appendChild: sandbox.stub() };
            sandbox
                .stub(document, "getElementById")
                .withArgs("accessibility")
                .returns(parentElement);
        });

        it("appends correct elements to the DOM", () => {
            a11y.appendElementsToDom(screen);

            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el1));
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el2));
            sandbox.assert.notCalled(parentElement.appendChild.withArgs(el3));
        });
    });

    describe("#clearElementsFromDom", () => {
        let parentElement;

        beforeEach(() => {
            parentElement = { innerHTML: "<div id='home__play'></div>" };
            sandbox
                .stub(document, "getElementById")
                .withArgs("accessibility")
                .returns(parentElement);
        });

        it("clears all accessible elements from the DOM", () => {
            a11y.clearElementsFromDom();
            expect(parentElement.innerHTML).to.eq("");
        });
    });
});
