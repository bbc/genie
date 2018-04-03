import { expect } from "chai";
import * as sinon from "sinon";
import { accessibilify } from "../../../src/lib/accessibilify/accessibilify";
import * as helperModule from "../../../src/lib/accessibilify/accessible-dom-element";

describe("#accessibilify", () => {
    const gameWidth = 800;
    const gameHeight = 600;

    let mockButton;
    let parentElement;
    let buttonBoundsX;
    let buttonBoundsY;
    let buttonBoundsWidth;
    let buttonBoundsHeight;
    let accessibleDomElement;
    let accessibleDomElementVisible;
    let accessibleDomElementHide;
    let accessibleDomElementShow;
    let onInputOver;
    let onInputOut;
    let activePointer;
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        parentElement = document.createElement("div");
        buttonBoundsX = 50;
        buttonBoundsY = 50;
        buttonBoundsWidth = 200;
        buttonBoundsHeight = 100;
        accessibleDomElementVisible = true;
        accessibleDomElementHide = sandbox.spy();
        accessibleDomElementShow = sandbox.spy();
        onInputOver = sandbox.spy();
        onInputOut = sandbox.spy();
        activePointer = sandbox.spy();
        mockButton = {
            name: "play",
            game: {
                input: {
                    activePointer: activePointer,
                },
                canvas: {
                    parentElement,
                },
                height: gameHeight,
                width: gameWidth,
                scale: {
                    onSizeChange: {
                        add: () => {},
                    },
                },
                state: {
                    onStateChange: {
                        addOnce: () => {},
                    },
                },
                update: {},
            },
            getBounds: () => {
                return {
                    x: buttonBoundsX,
                    y: buttonBoundsY,
                    width: buttonBoundsWidth,
                    height: buttonBoundsHeight,
                };
            },
            events: {
                onInputOver: {
                    dispatch: onInputOver,
                },
                onInputOut: {
                    dispatch: onInputOut,
                },
            },
        };
        accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Initialization", () => {
        it("calls accessibleDomElement once with args", () => {
            accessibilify(mockButton);

            sinon.assert.calledOnce(
                accessibleDomElement.withArgs({
                    id: mockButton.name,
                    ariaLabel: mockButton.name,
                    parent: mockButton.game.canvas.parentElement,
                    onClick: sinon.match.func,
                    onMouseOver: sinon.match.func,
                    onMouseOut: sinon.match.func,
                }),
            );
        });

        describe("with ariaLabel argument", () => {
            it("calls accessibleDomElement once passing in ariaLabel string", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config);

                sinon.assert.calledOnce(
                    accessibleDomElement.withArgs({
                        id: mockButton.name,
                        ariaLabel: "Play Button",
                        parent: mockButton.game.canvas.parentElement,
                        onClick: sinon.match.func,
                        onMouseOver: sinon.match.func,
                        onMouseOut: sinon.match.func,
                    }),
                );
            });
        });

        it("assigns an onSizeChange event", () => {
            const onSizeChange = sandbox.stub(mockButton.game.scale.onSizeChange, "add");

            accessibilify(mockButton);
            sinon.assert.called(onSizeChange);
        });

        it("assigns an onStateChange event", () => {
            const onStateChange = sandbox.stub(mockButton.game.state.onStateChange, "addOnce");

            accessibilify(mockButton);
            sinon.assert.called(onStateChange);
        });

        it("reassigns button's update event", () => {
            expect(typeof mockButton.update).to.equal("undefined");
            accessibilify(mockButton);
            expect(typeof mockButton.update).to.equal("function");
        });

        it("repositions accessibleElement", () => {
            sandbox.restore();
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(mockButton);
            clock.tick(200);
            sinon.assert.called(position.withArgs(mockButton.getBounds()));
        });
    });

    describe("Button Update", () => {
        describe("when button is outside of screen and element is visible", () => {
            it("hides element", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    hide: accessibleDomElementHide,
                });
                buttonBoundsX = -1000;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementHide);
            });
        });

        describe("when button is within the bounds of the screen and element is not visible", () => {
            it("shows element", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    show: accessibleDomElementShow,
                });
                accessibleDomElementVisible = false;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementShow);
            });
        });
    });

    describe("Hover State", () => {
        describe("When mouse over event is fired", () => {
            it("dispatches button onInputOver event", () => {
                accessibilify(mockButton);

                const options = accessibleDomElement.args[0][0];
                options.onMouseOver();
                sinon.assert.calledOnce(onInputOver.withArgs(mockButton, activePointer, false));
            });
        });

        describe("When mouse out event is fired", () => {
            it("dispatches button onInputOut event", () => {
                accessibilify(mockButton);

                const options = accessibleDomElement.args[0][0];
                options.onMouseOut();
                sinon.assert.calledOnce(onInputOut.withArgs(mockButton, activePointer, false));
            });
        });
    });
});
