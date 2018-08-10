import { expect } from "chai";
import * as sinon from "sinon";
import { addCustomStyles } from "../../src/core/custom-styles.js";

describe("custom styles", () => {
    const sandbox = sinon.createSandbox();
    let parentElement, styleElement;

    beforeEach(() => {
        styleElement = { innerHTML: "" };
        sandbox
            .stub(document, "createElement")
            .withArgs("style")
            .returns(styleElement);
        parentElement = { appendChild: sandbox.stub() };
        addCustomStyles(parentElement);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#addCustomStyles", () => {
        it("creates a new style element", () => {
            sandbox.assert.calledOnce(document.createElement.withArgs("style"));
        });

        it("fills this element with all custom styles", () => {
            expect(styleElement.innerHTML).to.eq(
                ".hide-focus-ring:focus{outline:none;} .gel-button{ -webkit-user-select: none; }",
            );
        });

        it("appends this style element to the parent element", () => {
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(styleElement));
        });
    });
});
