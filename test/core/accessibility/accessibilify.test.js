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
    let mockScene;
    let mockButton;
    let mockButtonBounds;
    let mockAccessibleDomElement;
    let mockHitArea;

    beforeEach(() => {
        jest.spyOn(a11y, "resetElementsInDom").mockImplementation(() => {});
        mockScene = {
            scale: {
                onSizeChange: { add: jest.fn(), remove: jest.fn() },
            },
            scene: { key: "home" },
            sys: {
                accessibleButtons: [],
                game: {
                    canvas: {
                        width: 1400,
                        height: 600,
                        parentElement: domElement(),
                        style: { height: 750, width: 1000, marginLeft: "-375px", marginTop: "25px" },
                    },
                },
                input: { activePointer: jest.fn() },
                scale: { parent: { some: "mockParent" } },
                events: { on: jest.fn(), off: jest.fn() },
            },
            sound: {
                unlock: jest.fn(),
                resumeWebAudio: jest.fn(),
                context: {},
            },
        };
        mockButtonBounds = { x: 20, y: 20 };
        mockHitArea = {
            clone: () => mockButton.input.hitArea,
            get topLeft() {
                return {
                    x: mockButton.input.hitArea.x,
                    y: mockButton.input.hitArea.y,
                    multiply: () => mockButton.input.hitArea.topLeft,
                    add: () => mockButton.input.hitArea.topLeft,
                };
            },
            set topLeft(p) {
                mockButton.input.hitArea.x = p.x;
                mockButton.input.hitArea.y = p.y;
            },
            width: 200,
            height: 100,
            x: 200 / 2,
            y: 100 / 2,
            scale: () => mockButton.input.hitArea,
        };
        mockButton = {
            active: true,
            disableInteractive: jest.fn(),
            emit: jest.fn(),
            name: "__play",
            game: mockScene,
            getTopLeft: () => mockButtonBounds.topLeft,
            toGlobal: p => p,
            destroy: jest.fn(),
            getBounds: jest.fn(() => mockButtonBounds),
            input: { enabled: true, hitArea: mockHitArea },
            events: {
                onInputOver: { dispatch: jest.fn() },
                onInputOut: { dispatch: jest.fn() },
                onInputUp: { dispatch: jest.fn() },
            },
            scene: mockScene,
            update: jest.fn(),
        };
        mockAccessibleDomElement = {
            position: jest.fn(),
            events: { click: "someClickEvent", keyup: "someKeyupEvent" },
            show: jest.fn(),
            hide: jest.fn(),
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
            expect(accessibleDomElementCall.parent).toEqual(mockScene.sys.scale.parent);
        });

        test("calls accessibleDomElement with an aria label when provided in the config", () => {
            const config = { ariaLabel: "aria-label" };
            accessibilify(mockButton, config);
            const accessibleDomElementCall = accessibleDomElement.mock.calls[0][0];
            expect(accessibleDomElementCall.ariaLabel).toBe(config.ariaLabel);
        });

        test("resets the accessible elements in the DOM for this screen", () => {
            accessibilify(mockButton);
            expect(a11y.resetElementsInDom).toHaveBeenCalledWith(mockScene);
        });

        test("adds button to accessibleButtons array when it does not exist yet", () => {
            delete mockScene.sys.accessibleButtons;
            accessibilify(mockButton);
            expect(mockScene.sys.accessibleButtons.length).toBe(1);
        });

        describe("with gameButton argument", () => {
            test("adds the button to an array in the game for the overlay-layout to use", () => {
                const gameButton = true;
                const config = { ariaLabel: "aria-label" };
                accessibilify(mockButton, config, gameButton);
                expect(mockScene.sys.accessibleButtons[0]).toEqual(mockButton);
            });

            test("doesn't add the button to an array in the game for the overlay-layout to use when argument is false", () => {
                const gameButton = false;
                const config = { ariaLabel: "aria-label" };
                accessibilify(mockButton, config, gameButton);
                expect(mockScene.sys.accessibleButtons).toEqual([]);
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

            test("sets the initial size and position when the button is active", () => {
                const expectedButtonBounds = {
                    x: 625,
                    y: 475,
                    width:
                        mockButton.input.hitArea.width *
                        (mockScene.sys.game.canvas.style.height / mockScene.sys.game.canvas.height),
                    height:
                        mockButton.input.hitArea.height *
                        (mockScene.sys.game.canvas.style.height / mockScene.sys.game.canvas.height),
                };
                mockButton.active = true;
                accessibilify(mockButton);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].height).toBe(expectedButtonBounds.height);
            });

            test("sets the initial size and position when the button is active and is not a game button", () => {
                const expectedButtonBounds = {
                    x: 625,
                    y: 475,
                    width: mockButton.input.hitArea.width,
                    height: mockButton.input.hitArea.height,
                };
                mockButton.active = true;
                accessibilify(mockButton, { ariaLabel: "mock" }, false);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[0][0].height).toBe(expectedButtonBounds.height);
            });

            test("does not set the initial size and position when the button is not active", () => {
                mockButton.active = false;
                accessibilify(mockButton);
                expect(mockAccessibleDomElement.position).not.toHaveBeenCalled();
            });

            test("changes the size and position when the scale changes when the button is active", () => {
                const expectedButtonBounds = {
                    x: 1381.25,
                    y: 1043.75,
                    width:
                        mockButton.input.hitArea.width *
                        (mockScene.sys.game.canvas.style.height / mockScene.sys.game.canvas.height),
                    height:
                        mockButton.input.hitArea.height *
                        (mockScene.sys.game.canvas.style.height / mockScene.sys.game.canvas.height),
                };
                mockButton.active = true;
                accessibilify(mockButton);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position.mock.calls[1][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].height).toBe(expectedButtonBounds.height);
            });

            test("changes the size and position when the scale changes when the button is active and is not a game button", () => {
                const expectedButtonBounds = {
                    x: 1381.25,
                    y: 1043.75,
                    width: mockButton.input.hitArea.width,
                    height: mockButton.input.hitArea.height,
                };
                mockButton.active = true;
                accessibilify(mockButton, { ariaLabel: "mock" }, false);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position.mock.calls[1][0].x).toBe(expectedButtonBounds.x);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].y).toBe(expectedButtonBounds.y);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].width).toBe(expectedButtonBounds.width);
                expect(mockAccessibleDomElement.position.mock.calls[1][0].height).toBe(expectedButtonBounds.height);
            });

            test("changes the size and position when the scale changes if the button is active but does not have a hit area", () => {
                mockButton.active = true;
                mockButton.input.hitArea = null;
                accessibilify(mockButton);
                onScaleChange.add.mock.calls[0][0]();
                expect(mockAccessibleDomElement.position.mock.calls[1][0]).toEqual(mockButtonBounds);
            });

            test("does not change the size and position when the scale changes if the button is not active", () => {
                mockButton.active = false;
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

        test("ensures the scene continuously updates the button", () => {
            accessibilify(mockButton);
            expect(mockScene.sys.events.on).toHaveBeenCalledWith(
                global.Phaser.Scenes.Events.UPDATE,
                expect.any(Function),
            );
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
        test("hides when button input is disabled and the button is hidden", () => {
            mockButton.visible = false;
            mockButton.input.enabled = false;
            accessibilify(mockButton);
            mockScene.sys.events.on.mock.calls[0][1]();
            expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
        });

        test("hides when button input is disabled but the button is shown", () => {
            mockButton.visible = true;
            mockButton.input.enabled = false;
            accessibilify(mockButton);
            mockScene.sys.events.on.mock.calls[0][1]();
            expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
        });

        test("hides when button input is enabled but the button is hidden", () => {
            mockButton.visible = false;
            mockButton.input.enabled = true;
            accessibilify(mockButton);
            mockScene.sys.events.on.mock.calls[0][1]();
            expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
        });

        test("does not hide when button input is enabled and the button is shown", () => {
            mockButton.visible = true;
            mockButton.input.enabled = true;
            accessibilify(mockButton);
            mockScene.sys.events.on.mock.calls[0][1]();
            expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
        });
    });

    describe("Click Action", () => {
        test("dispatches the button's onInputUp event", () => {
            accessibilify(mockButton);
            accessibleDomElement.mock.calls[0][0].onClick();
            expect(mockButton.emit).toHaveBeenCalledWith(
                Phaser.Input.Events.POINTER_UP,
                mockButton,
                mockScene.sys.input.activePointer,
                false,
            );
        });

        // test("unlocks the audioContext", () => {
        //     accessibilify(mockButton);
        //     accessibleDomElement.mock.calls[0][0].onClick();
        //     expect(mockScene.sound.unlock).toHaveBeenCalled();
        // });

        // test("calls resumeWebAudio if it is suspended", () => {
        //     mockButton.game.sound.context.state = "suspended";
        //     accessibilify(mockButton);
        //     accessibleDomElement.mock.calls[0][0].onClick();
        //     expect(mockScene.sound.resumeWebAudio).toHaveBeenCalled();
        // });

        // test("does not call resumeWebAudio if it is not suspended", () => {
        //     mockButton.game.sound.context = undefined;
        //     accessibilify(mockButton);
        //     accessibleDomElement.mock.calls[0][0].onClick();
        //     expect(mockScene.sound.resumeWebAudio).not.toHaveBeenCalled();
        // });
    });

    describe("Hover State", () => {
        describe("When mouseover event is fired", () => {
            test("dispatches button onInputOver event", () => {
                accessibilify(mockButton);
                accessibleDomElement.mock.calls[0][0].onMouseOver();
                expect(mockButton.emit).toHaveBeenCalledWith(
                    Phaser.Input.Events.POINTER_OVER,
                    mockButton,
                    mockScene.sys.input.activePointer,
                    false,
                );
            });
        });

        describe("When mouseout event is fired", () => {
            test("dispatches button onInputOut event", () => {
                accessibilify(mockButton);
                accessibleDomElement.mock.calls[0][0].onMouseOut();
                expect(mockButton.emit).toHaveBeenCalledWith(
                    Phaser.Input.Events.POINTER_OUT,
                    mockButton,
                    mockScene.sys.input.activePointer,
                    false,
                );
            });
        });
    });
});
