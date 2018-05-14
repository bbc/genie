import { expect } from "chai";
import * as sinon from "sinon";
import { accessibilify } from "../../../src/core/accessibilify/accessibilify";
import * as helperModule from "../../../src/core/accessibilify/accessible-dom-element";

describe("#accessibilify", () => {
    const gameWidth = 800;
    const gameHeight = 600;

    let mockButton;
    let parentElement;
    let buttonBoundsX;
    let buttonBoundsY;
    let buttonBoundsWidth;
    let buttonBoundsHeight;
    let buttonDestroy;
    let accessibleDomElement;
    let accessibleDomElementVisible;
    let accessibleDomElementHide;
    let accessibleDomElementShow;
    let accessibleDomElementPosition;
    let accessibleDomElementRemove;
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
        buttonDestroy = sandbox.spy();
        accessibleDomElementVisible = true;
        accessibleDomElementHide = sandbox.spy();
        accessibleDomElementShow = sandbox.spy();
        onInputOver = sandbox.spy();
        onInputOut = sandbox.spy();
        activePointer = sandbox.spy();
        mockButton = {
            alive: true,
            name: "play",
            toGlobal: x => {
                return x;
            },
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
                        remove: () => {},
                    },
                },
                update: {},
            },
            destroy: buttonDestroy,
            getBounds: () => {
                return {
                    x: buttonBoundsX,
                    y: buttonBoundsY,
                    width: buttonBoundsWidth,
                    height: buttonBoundsHeight,
                };
            },
            hitArea: {
                clone: () => mockButton.hitArea,
                get topLeft() {
                    return { x: mockButton.hitArea.x, y: mockButton.hitArea.y };
                },
                set topLeft(p) {
                    mockButton.hitArea.x = p.x;
                    mockButton.hitArea.y = p.y;
                },
                x: buttonBoundsX,
                y: buttonBoundsY,
                width: buttonBoundsWidth,
                height: buttonBoundsHeight,
                get top() {
                    return mockButton.hitArea.y;
                },
                get bottom() {
                    return mockButton.hitArea.y + mockButton.hitArea.height;
                },
                get left() {
                    return mockButton.hitArea.x;
                },
                get right() {
                    return mockButton.hitArea.x + mockButton.hitArea.width;
                },
            },
            input: { enabled: true },
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
        accessibleDomElementPosition = sandbox.spy();
        accessibleDomElementRemove = sandbox.spy();
        accessibleDomElement.returns({
            position: accessibleDomElementPosition,
            remove: accessibleDomElementRemove,
        });
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

        it("hooks into the button's destroy event", () => {
            accessibilify(mockButton);
            mockButton.destroy();
            sinon.assert.called(accessibleDomElementRemove);
            // Assert original functionality is not completely overridden.
            sinon.assert.called(buttonDestroy);
        });

        it("reassigns button's update event", () => {
            expect(typeof mockButton.update).to.equal("undefined");
            accessibilify(mockButton);
            expect(typeof mockButton.update).to.equal("function");
        });

        it("repositions accessibleElement if button exists", () => {
            sandbox.restore();
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(mockButton);
            clock.tick(200);
            sinon.assert.called(position.withArgs(mockButton.hitArea.clone()));
        });

        it("does NOT reposition accessibleElement if button does not exist", () => {
            sandbox.restore();
            let deadMockButton = mockButton;
            deadMockButton.alive = false;
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(deadMockButton);
            clock.tick(200);
            sinon.assert.notCalled(position);
        });
    });

    describe("Button Update", () => {
        describe("element visibility", () => {
            it("when button is outside of screen and element is visible it should be hidden", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    hide: accessibleDomElementHide,
                    position: () => {},
                });
                mockButton.hitArea.x = -1000;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementHide);
            });
            it("when button input is disabled and the element is visible it should be hidden", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    hide: accessibleDomElementHide,
                    position: () => {},
                });
                mockButton.input.enabled = false;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementHide);
            });
            it("when button has enabled input and is within the bounds of the screen and element is not visible it should be shown", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    show: accessibleDomElementShow,
                    position: () => {},
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
