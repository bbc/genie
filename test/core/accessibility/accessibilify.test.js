/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

import { domElement } from "../../mock/dom-element";
import { onScaleChange } from "../../../src/core/scaler.js";
import { accessibilify } from "../../../src/core/accessibility/accessibilify.js";
import { accessibleDomElement } from "../../../src/core/accessibility/accessible-dom-element.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

jest.mock("../../../src/core/accessibility/accessible-dom-element.js");

describe("Accessibilify", () => {
    let mockGame;
    let mockButton;
    let mockButtonBounds;
    let mockAccessibleDomElement;

    beforeEach(() => {
        jest.spyOn(a11y, "resetElementsInDom").mockImplementation(() => {});
        mockGame = {
            input: { activePointer: jest.fn() },
            canvas: { parentElement: domElement() },
            height: 600,
            width: 800,
            accessibleButtons: [],
            scale: {
                margin: {},
                onSizeChange: { add: jest.fn(), remove: jest.fn() },
                scaleFactorInversed: { x: 1, y: 1 },
            },
            state: {
                states: { home: { visibleLayer: "home" } },
                current: "home",
            },
            update: {},
            sound: {
                unlock: jest.fn(),
                resumeWebAudio: jest.fn(),
                context: {},
            },
        };
        mockButtonBounds = {
            topLeft: { x: "x", y: "y", multiply: () => mockButtonBounds.topLeft, add: () => mockButtonBounds.topLeft },
            scale: () => mockButtonBounds,
        };
        mockButton = {
            alive: true,
            name: "__play",
            game: mockGame,
            toGlobal: p => p,
            destroy: jest.fn(),
            getBounds: jest.fn(() => mockButtonBounds),
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
                width: 200,
                height: 100,
                x: 200 / 2,
                y: 100 / 2,
                scale: () => mockButton.hitArea,
            },
            input: { enabled: true },
            events: {
                onInputOver: { dispatch: jest.fn() },
                onInputOut: { dispatch: jest.fn() },
                onInputUp: { dispatch: jest.fn() },
            },
            worldScale: { x: 1, y: 1 },
        };
        mockAccessibleDomElement = {
            position: jest.fn(),
            events: { click: "someClickEvent", keyup: "someKeyupEvent" },
        };
        accessibleDomElement.mockImplementation(() => mockAccessibleDomElement);
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialization", () => {
        test("creates an accessibleDomElement with correct params", () => {
            accessibilify(mockButton);
            const accessibleDomElementCall = accessibleDomElement.mock.calls[0][0];
            expect(accessibleDomElementCall.id).toBe("home__play");
            expect(accessibleDomElementCall.htmlClass).toBe("gel-button");
            expect(accessibleDomElementCall.ariaLabel).toBe(mockButton.name);
            expect(accessibleDomElementCall.parent).toEqual(mockGame.canvas.parentElement);
        });

        test("calls accessibleDomElement with an aria label when provided in the config", () => {
            const config = { ariaLabel: "aria-label" };
            accessibilify(mockButton, config);
            const accessibleDomElementCall = accessibleDomElement.mock.calls[0][0];
            expect(accessibleDomElementCall.ariaLabel).toBe(config.ariaLabel);
        });

        test("resets the accessible elements in the DOM for this screen", () => {
            const screenToReset = mockGame.state.states[mockGame.state.current];
            accessibilify(mockButton);
            expect(a11y.resetElementsInDom).toHaveBeenCalledWith(screenToReset);
        });

        describe("with gameButton argument", () => {
            test("adds the button to an array in the game for the overlay-layout to use", () => {
                const gameButton = true;
                const config = { ariaLabel: "aria-label" };
                accessibilify(mockButton, config, gameButton);
                expect(mockButton.game.accessibleButtons[0]).toEqual(mockButton);
            });

            test("doesn't add the button to an array in the game for the overlay-layout to use when argument is false", () => {
                const gameButton = false;
                const config = { ariaLabel: "aria-label" };
                accessibilify(mockButton, config, gameButton);
                expect(mockButton.game.accessibleButtons).toEqual([]);
            });
        });

        describe("Scaling and positioning", () => {
            beforeEach(() => {
                jest.spyOn(onScaleChange, "add").mockImplementation(() => {});
                jest.spyOn(fp, "debounce").mockImplementation((value, callback) => callback);
            });

            test("initially debounces the element", () => {
                accessibilify(mockButton);
                expect(fp.debounce).toHaveBeenCalledTimes(1);
                expect(fp.debounce.mock.calls[0][0]).toBe(200);
            });

            test("sets the initial size and position if the button is alive", () => {
                const expectedButtonBounds = {
                    x: mockButton.hitArea.x,
                    y: mockButton.hitArea.y,
                    width: mockButton.hitArea.width,
                    height: mockButton.hitArea.height,
                    topLeft: mockButton.hitArea.topLeft,
                };
                mockButton.alive = true;
                accessibilify(mockButton);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].height).toBe(expectedButtonBounds.height);
            });

            test("does not set the initial size and position if the button is not alive", () => {
                mockButton.alive = false;
                accessibilify(mockButton);
                expect(mockAccessibleDomElement.position).not.toHaveBeenCalled();
            });

            test("changes the size and position when the scale changes if the button is alive", () => {
                const expectedButtonBounds = {
                    x: mockButton.hitArea.x,
                    y: mockButton.hitArea.y,
                    width: mockButton.hitArea.width,
                    height: mockButton.hitArea.height,
                    topLeft: mockButton.hitArea.topLeft,
                };
                mockButton.alive = true;
                accessibilify(mockButton);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position.mock.calls[1][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].height).toBe(expectedButtonBounds.height);
            });

            test("changes the size and position when the scale changes if the button is alive but does not have a hit area", () => {
                mockButton.alive = true;
                mockButton.hitArea = null;
                accessibilify(mockButton);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position.mock.calls[1][0]).toEqual(mockButtonBounds);
            });

            test("does not change the size and position when the scale changes if the button is not alive", () => {
                mockButton.alive = false;
                accessibilify(mockButton);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position).not.toHaveBeenCalled();
            });

            test("tears down the scale change signal when the button is destroyed", () => {
                const signal = { unsubscribe: jest.fn() };
                onScaleChange.add.mockImplementation(() => signal);
                accessibilify(mockButton);
                mockButton.destroy();
                expect(signal.unsubscribe).toHaveBeenCalled();
            });
        });

        test("assigns DOM element ID to the Phaser button object", () => {
            accessibilify(mockButton);
            expect(mockButton.elementId).toBe("home__play");
        });

        test("assigns element events to the Phaser button object", () => {
            accessibilify(mockButton);
            expect(mockButton.elementEvents.click).toBe("someClickEvent");
            expect(mockButton.elementEvents.keyup).toBe("someKeyupEvent");
        });
    });

    describe("Button Update", () => {
        describe("element visibility", () => {
            test("hides when button input is disabled and the element is visible", () => {
                mockAccessibleDomElement.visible = jest.fn(() => true);
                mockAccessibleDomElement.hide = jest.fn();
                mockButton.input.enabled = false;
                accessibilify(mockButton);
                mockButton.update();
                expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
            });

            test("does not hide when button input is disabled and the element is not visible", () => {
                mockAccessibleDomElement.visible = jest.fn(() => false);
                mockAccessibleDomElement.hide = jest.fn();
                mockButton.input.enabled = false;
                accessibilify(mockButton);
                mockButton.update();
                expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
            });

            test("shows when button input is enabled, the element is not visible, and is within the bounds of the screen ", () => {
                mockAccessibleDomElement.visible = jest.fn(() => false);
                mockAccessibleDomElement.show = jest.fn();
                mockButton.input.enabled = true;
                accessibilify(mockButton);
                mockButton.update();
                expect(mockAccessibleDomElement.show).toHaveBeenCalled();
            });

            test("does not show when button input is enabled and the element is visible", () => {
                mockAccessibleDomElement.visible = jest.fn(() => true);
                mockAccessibleDomElement.show = jest.fn();
                mockButton.input.enabled = true;
                accessibilify(mockButton);
                mockButton.update();
                expect(mockAccessibleDomElement.show).not.toHaveBeenCalled();
            });
        });
    });

    describe("Click Action", () => {
        test("dispatches the button's onInputUp event", () => {
            accessibilify(mockButton);
            accessibleDomElement.mock.calls[0][0].onClick();
            expect(mockButton.events.onInputUp.dispatch).toHaveBeenCalledWith(
                mockButton,
                mockGame.input.activePointer,
                false,
            );
        });

        test("unlocks the audioContext", () => {
            accessibilify(mockButton);
            accessibleDomElement.mock.calls[0][0].onClick();
            expect(mockGame.sound.unlock).toHaveBeenCalled();
        });

        test("calls resumeWebAudio if it is suspended", () => {
            mockButton.game.sound.context.state = "suspended";
            accessibilify(mockButton);
            accessibleDomElement.mock.calls[0][0].onClick();
            expect(mockGame.sound.resumeWebAudio).toHaveBeenCalled();
        });

        test("does not call resumeWebAudio if it is not suspended", () => {
            mockButton.game.sound.context = undefined;
            accessibilify(mockButton);
            accessibleDomElement.mock.calls[0][0].onClick();
            expect(mockGame.sound.resumeWebAudio).not.toHaveBeenCalled();
        });
    });

    describe("Hover State", () => {
        describe("When mouseover event is fired", () => {
            test("dispatches button onInputOver event", () => {
                accessibilify(mockButton);
                accessibleDomElement.mock.calls[0][0].onMouseOver();
                expect(mockButton.events.onInputOver.dispatch).toHaveBeenCalledWith(
                    mockButton,
                    mockGame.input.activePointer,
                    false,
                );
            });
        });

        describe("When mouseout event is fired", () => {
            test("dispatches button onInputOut event", () => {
                accessibilify(mockButton);
                accessibleDomElement.mock.calls[0][0].onMouseOut();
                expect(mockButton.events.onInputOut.dispatch).toHaveBeenCalledWith(
                    mockButton,
                    mockGame.input.activePointer,
                    false,
                );
            });
        });
    });
});
