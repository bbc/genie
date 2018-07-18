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
            const createElement = sandbox.stub().returns(el);

            a11y.setup(gameParentElement, createElement);

            sandbox.assert.calledOnce(createElement.withArgs("div"));
            sandbox.assert.calledOnce(gameParentElement.appendChild.withArgs(el));
            expect(el.id).to.eq("accessibility");
        });
    });

    describe("#getAccessibleButtons", () => {
        it("returns accessibleButtons object in its current state", () => {
            const accessibleButtons = a11y.getAccessibleButtons();

            expect(accessibleButtons).to.eql({});
        });
    });

    describe("#addToAccessibleButtons", () => {
        it("adds btn to accessibleButtons object with screen as key", () => {
            const button = sandbox.stub();

            a11y.addToAccessibleButtons("home", button);
            expect(a11y.getAccessibleButtons()).to.eql({
                home: [button],
            });
        });

        it("returns current state of accessibleButtons", () => {
            const button = sandbox.stub();

            expect(a11y.addToAccessibleButtons("home", button)).to.eql({
                home: [button],
            });
        });

        describe(`when accessibleButtons already has at least one button
                  added to this screen`, () => {
            let button1;

            beforeEach(() => {
                button1 = sandbox.stub();
                a11y.addToAccessibleButtons("home", button1);
            });

            it("adds this button to the already existing array", () => {
                const button2 = sandbox.stub();

                a11y.addToAccessibleButtons("home", button2);
                expect(a11y.getAccessibleButtons()).to.eql({ home: [button1, button2] });
            });
        });

        describe("when multiple screens are added", () => {
            let button1;

            beforeEach(() => {
                button1 = sandbox.stub();
                a11y.addToAccessibleButtons("home", button1);
            });

            it("adds buttons under correct screens", () => {
                const button2 = sandbox.stub();
                const button3 = sandbox.stub();

                a11y.addToAccessibleButtons("home", button2);
                a11y.addToAccessibleButtons("pause", button3);

                expect(a11y.getAccessibleButtons()).to.eql({
                    home: [button1, button2],
                    pause: [button3],
                });
            });
        });
    });

    describe("#clearAccessibleButtons", () => {
        it("clears everything from accessibleButtons object", () => {
            const button = sandbox.stub();

            a11y.addToAccessibleButtons("home", button);
            a11y.clearAccessibleButtons();

            expect(a11y.getAccessibleButtons()).to.eql({});
        });

        it("returns current state of accessibleButtons", () => {
            expect(a11y.clearAccessibleButtons()).to.eql({});
        });
    });

    describe("#appendElementsToDom", () => {
        let el1, el2, el3, button1, button2, button3;

        beforeEach(() => {
            el1 = { id: "home__play" };
            el2 = { id: "home__pause" };
            el3 = { id: "pause__back" };
            button1 = { accessibleElement: el1 };
            button2 = { accessibleElement: el2 };
            button3 = { accessibleElement: el3 };
            a11y.addToAccessibleButtons("home", button1);
            a11y.addToAccessibleButtons("home", button2);
            a11y.addToAccessibleButtons("pause", button3);
        });

        it("appends correct elements to the DOM", () => {
            const buttons = a11y.getAccessibleButtons("home");
            const parentElement = { appendChild: sandbox.stub() };
            a11y.appendElementsToDom(buttons, parentElement);

            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el1));
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el2));
            sandbox.assert.notCalled(parentElement.appendChild.withArgs(el3));
        });
    });

    describe("#clearElementsFromDom", () => {
        it("clears all accessible elements from the DOM", () => {
            const parentElement = { innerHTML: "<div id='home__play'></div>" };
            a11y.clearElementsFromDom(parentElement);
            expect(parentElement.innerHTML).to.eq("");
        });
    });

    describe("#resetElementsInDom", () => {
        it("clears down all accessible elements in the dom", () => {
            const parentElement = { innerHTML: "<div id='home__play'></div>" };
            a11y.resetElementsInDom("home", parentElement);
            expect(parentElement.innerHTML).to.eq("");
        });

        it("appends elements to DOM", () => {
            const parentElement = {
                innerHTML: "<div id='home__play'></div>",
                appendChild: sandbox.stub(),
            };
            const el = { id: "home__play" };
            const button = { accessibleElement: el };

            sandbox.stub(a11y, "appendElementsToDom");
            a11y.addToAccessibleButtons("home", button);

            a11y.resetElementsInDom("home", parentElement);
            sandbox.assert.calledOnce(parentElement.appendChild.withArgs(el));
        });
    });
});
