import { expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "../../../src/core/scaler.js";
import { accessibilify } from "../../../src/core/accessibility/accessibilify.js";
import * as helperModule from "../../../src/core/accessibility/accessible-dom-element.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

describe("#accessibilify", () => {
    const gameWidth = 800;
    const gameHeight = 600;

    let onScaleChangeAdd;
    let onScaleChangeUnsubscribe;
    let mockButtonBounds;
    let mockButton;
    let parentElement;
    let buttonBoundsWidth;
    let buttonBoundsHeight;
    let buttonDestroy;
    let accessibleDomElement;
    let accessibleDomElementVisible;
    let accessibleDomElementHide;
    let accessibleDomElementShow;
    let accessibleDomElementPosition;
    let onInputOver;
    let onInputOut;
    let onInputUp;
    let activePointer;
    let touchUnlockSpy;
    let resumeWebAudioSpy;
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.stub(a11y, "resetElementsInDom");
        onScaleChangeUnsubscribe = sandbox.spy();
        onScaleChangeAdd = sandbox.stub(Scaler.onScaleChange, "add").returns({ unsubscribe: onScaleChangeUnsubscribe });
        parentElement = document.createElement("div");
        buttonBoundsWidth = 200;
        buttonBoundsHeight = 100;
        buttonDestroy = sandbox.spy();
        accessibleDomElementVisible = true;
        accessibleDomElementHide = sandbox.spy();
        accessibleDomElementShow = sandbox.spy();
        onInputOver = sandbox.spy();
        onInputOut = sandbox.spy();
        onInputUp = sandbox.spy();
        activePointer = sandbox.spy();
        touchUnlockSpy = sandbox.spy();
        resumeWebAudioSpy = sandbox.spy();
        mockButtonBounds = {
            topLeft: { x: "x", y: "y", multiply: () => mockButtonBounds.topLeft, add: () => mockButtonBounds.topLeft },
            scale: () => mockButtonBounds,
        };
        mockButton = {
            alive: true,
            name: "__play",
            game: {
                input: {
                    activePointer: activePointer,
                },
                canvas: {
                    parentElement,
                },
                height: gameHeight,
                width: gameWidth,
                accessibleButtons: [],
                scale: {
                    margin: {},
                    onSizeChange: {
                        add: () => {},
                        remove: () => {},
                    },
                    scaleFactorInversed: { x: 1, y: 1 },
                },
                state: {
                    states: { home: { visibleLayer: "home" } },
                    current: "home",
                },
                update: {},
                sound: {
                    unlock: touchUnlockSpy,
                    resumeWebAudio: resumeWebAudioSpy,
                    context: {},
                },
            },
            toGlobal: p => p,
            destroy: buttonDestroy,
            getBounds: sandbox.stub().returns(mockButtonBounds),
            hitArea: {
                clone: () => mockButton.hitArea,
                get topLeft() {
                    return {
                        x: mockButton.hitArea.x,
                        y: mockButton.hitArea.y,
                        multiply: () => mockButton.hitArea.topLeft,
                        add: () => mockButton.hitArea.topLeft,
                    };
                },
                set topLeft(p) {
                    mockButton.hitArea.x = p.x;
                    mockButton.hitArea.y = p.y;
                },
                x: -buttonBoundsWidth / 2,
                y: -buttonBoundsHeight / 2,
                width: buttonBoundsWidth,
                height: buttonBoundsHeight,
                scale: () => mockButton.hitArea,
            },
            input: { enabled: true },
            events: {
                onInputOver: {
                    dispatch: onInputOver,
                },
                onInputOut: {
                    dispatch: onInputOut,
                },
                onInputUp: {
                    dispatch: onInputUp,
                },
            },
            worldScale: { x: 1, y: 1 },
        };
        accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement");
        accessibleDomElementPosition = sandbox.spy();
        accessibleDomElement.returns({
            position: accessibleDomElementPosition,
            events: { click: "someClickEvent", keyup: "someKeyupEvent" },
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
                    id: "home__play",
                    htmlClass: "gel-button",
                    ariaLabel: mockButton.name,
                    parent: mockButton.game.canvas.parentElement,
                    onClick: sinon.match.func,
                    onMouseOver: sinon.match.func,
                    onMouseOut: sinon.match.func,
                }),
            );
        });

        it("resets the accessible elements in the DOM", () => {
            accessibilify(mockButton);
            sinon.assert.calledOnce(a11y.resetElementsInDom);
        });

        describe("with ariaLabel argument", () => {
            it("calls accessibleDomElement once passing in ariaLabel string", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config);

                sinon.assert.calledOnce(
                    accessibleDomElement.withArgs({
                        id: "home__play",
                        htmlClass: "gel-button",
                        ariaLabel: "Play Button",
                        parent: mockButton.game.canvas.parentElement,
                        onClick: sinon.match.func,
                        onMouseOver: sinon.match.func,
                        onMouseOut: sinon.match.func,
                    }),
                );
            });
        });

        describe("with gameButton argument", () => {
            it("adds the button to an array in the game for the overlay-layout to use", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config, true);
                expect(mockButton.game.accessibleButtons[0]).to.equal(mockButton);
            });

            it("doesn't add the button to an array in the game for the overlay-layout to use when argument is false", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config, false);
                expect(mockButton.game.accessibleButtons).to.deep.equal([]);
            });
        });

        it("assigns an onSizeChange event", () => {
            accessibilify(mockButton);
            sinon.assert.called(onScaleChangeAdd);
        });

        it("hooks into the button's destroy event", () => {
            accessibilify(mockButton);
            mockButton.destroy();
            sinon.assert.called(onScaleChangeUnsubscribe);
            // Assert original functionality is not completely overridden.
            sinon.assert.called(buttonDestroy);
        });

        it("reassigns button's update event", () => {
            expect(typeof mockButton.update).to.equal("undefined");
            accessibilify(mockButton);
            expect(typeof mockButton.update).to.equal("function");
        });

        it("repositions accessibleElement if button exists", () => {
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement.restore();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(mockButton);
            clock.tick(200);
            sinon.assert.called(position.withArgs(mockButton.hitArea.clone()));
        });

        it("repositions accessibleElement if button exists but does not have a hit area", () => {
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement.restore();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            mockButton.hitArea = null;

            accessibilify(mockButton);
            clock.tick(200);
            sinon.assert.called(mockButton.getBounds);
            sinon.assert.calledWith(position, mockButtonBounds);
        });

        it("does NOT reposition accessibleElement if button does not exist", () => {
            let deadMockButton = mockButton;
            deadMockButton.alive = false;
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement.restore();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(deadMockButton);
            clock.tick(200);
            sinon.assert.notCalled(position);
        });

        it("assigns DOM element ID to the Phaser button object", () => {
            accessibilify(mockButton);

            expect(mockButton.elementId).to.eq("home__play");
        });

        it("assigns element events to the Phaser button object", () => {
            accessibilify(mockButton);

            expect(mockButton.elementEvents.click).to.eq("someClickEvent");
            expect(mockButton.elementEvents.keyup).to.eq("someKeyupEvent");
        });
    });

    describe("Button Update", () => {
        describe("element visibility", () => {
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

    describe("Button Action", () => {
        it("Should dispatch the button's onInputUp event", () => {
            accessibilify(mockButton);

            const options = accessibleDomElement.args[0][0];
            options.onClick();
            sinon.assert.calledOnce(onInputUp);
            sinon.assert.calledWithExactly(onInputUp, mockButton, activePointer, false);
        });

        it("Should unlock the audioContext", () => {
            accessibilify(mockButton);

            const options = accessibleDomElement.args[0][0];
            options.onClick();
            sinon.assert.calledOnce(touchUnlockSpy);
        });

        it("Should call resumeWebAudio if it is suspended", () => {
            mockButton.game.sound.context.state = "suspended";
            accessibilify(mockButton);

            const options = accessibleDomElement.args[0][0];
            options.onClick();
            sinon.assert.calledOnce(resumeWebAudioSpy);
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
