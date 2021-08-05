/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

import { domElement } from "../../mock/dom-element";
import { accessibilify } from "../../../src/core/accessibility/accessibilify.js";
import { accessibleDomElement } from "../../../src/core/accessibility/accessible-dom-element.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as scalerModule from "../../../src/core/scaler.js";

jest.mock("../../../src/core/accessibility/accessible-dom-element.js");

describe("Accessibilify", () => {
	let mockScene;
	let mockButton;
	let mockButtonBounds;
	let mockAccessibleDomElement;
	let mockHitArea;

	beforeEach(() => {
		jest.spyOn(a11y, "reset").mockImplementation(() => {});
		scalerModule.getMetrics = jest.fn(() => ({ width: 0, scale: 1 }));
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
		mockButtonBounds = { x: 20, y: 20, width: 200, height: 100 };
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
			config: {
				id: "play",
			},
			game: mockScene,
			getTopLeft: () => mockButtonBounds.topLeft,
			toGlobal: p => p,
			destroy: jest.fn(),
			getHitAreaBounds: jest.fn(() => mockButtonBounds),
			getBounds: jest.fn(() => mockButtonBounds),
			input: { enabled: true, hitArea: mockHitArea },
			events: {
				onInputOver: { dispatch: jest.fn() },
				onInputOut: { dispatch: jest.fn() },
				onInputUp: { dispatch: jest.fn() },
			},
			scene: mockScene,
			update: jest.fn(),
			scale: 1,
		};
		mockAccessibleDomElement = {
			position: jest.fn(),
			events: { click: "someClickEvent", keyup: "someKeyupEvent" },
			show: jest.fn(),
			hide: jest.fn(),
			visible: jest.fn(),
			el: {
				getAttribute: jest.fn(),
				setAttribute: jest.fn(),
			},
		};
		accessibleDomElement.mockImplementation(() => mockAccessibleDomElement);
	});

	afterEach(() => jest.clearAllMocks());

	describe("Initialization", () => {
		test("creates an accessibleDomElement with correct params", () => {
			accessibilify(mockButton);
			const accessibleDomElementCall = accessibleDomElement.mock.calls[0][0];
			expect(accessibleDomElementCall.id).toBe("home__play");
			expect(accessibleDomElementCall.class).toBe("gel-button");
			expect(accessibleDomElementCall.ariaLabel).toBe(mockButton.config.name);
			expect(accessibleDomElementCall.parent).toEqual(mockScene.sys.scale.parent);
		});

		test("creates an accessibleDomElement with correct params when interactive is false", () => {
			accessibilify(mockButton, true, false);
			const accessibleDomElementCall = accessibleDomElement.mock.calls[0][0];
			expect(accessibleDomElementCall.id).toBe("home__play");
			expect(accessibleDomElementCall.class).toBe("gel-button");
			expect(accessibleDomElementCall.ariaLabel).toBe(mockButton.config.name);
		});

		test("calls accessibleDomElement with an aria label when provided in the config", () => {
			mockButton.config = { ariaLabel: "test aria label" };
			accessibilify(mockButton);
			expect(accessibleDomElement.mock.calls[0][0]["aria-label"]).toBe("test aria label");
		});

		test("resets the accessible elements in the DOM for this screen", () => {
			accessibilify(mockButton);
			expect(a11y.reset).toHaveBeenCalled();
		});

		describe("with gameButton argument", () => {
			test("adds the button to an array in the game for the overlay-layout to use", () => {
				const gameButton = true;
				accessibilify(mockButton, gameButton);
				expect(mockScene.sys.accessibleButtons[0]).toEqual(mockButton);
			});

			test("doesn't add the button to an array in the game for the overlay-layout to use when argument is false", () => {
				const gameButton = false;
				accessibilify(mockButton, gameButton);
				expect(mockScene.sys.accessibleButtons).toEqual([]);
			});
		});

		describe("Scaling and positioning", () => {
			beforeEach(() => {
				scalerModule.onScaleChange.add = jest.fn(() => {});
				jest.spyOn(fp, "debounce").mockImplementation((value, callback) => callback);
			});

			test("initially debounces the element", () => {
				accessibilify(mockButton);
				expect(fp.debounce).toHaveBeenCalledTimes(1);
				expect(fp.debounce.mock.calls[0][0]).toBe(200);
			});

			test("sets the initial size and position when the button is active", () => {
				const expectedButtonBounds = {
					x: 345,
					y: 345,
					width: 200,
					height: 100,
				};
				mockButton.active = true;
				accessibilify(mockButton);
				expect(mockAccessibleDomElement.position.mock.calls[0][0]).toStrictEqual(expectedButtonBounds);
			});

			test("Uses standard getBounds function if getHitAreaBounds is not present (non-gel buttons)", () => {
				delete mockButton.getHitAreaBounds;
				accessibilify(mockButton);
				expect(mockButton.getBounds).toHaveBeenCalled();
			});

			test("does not set the initial size and position when the button is not active", () => {
				mockButton.active = false;
				accessibilify(mockButton);
				expect(mockAccessibleDomElement.position).not.toHaveBeenCalled();
			});

			test("changes the size and position when the scale changes when the button is active", () => {
				const expectedButtonBounds = {
					x: 345,
					y: 345,
					width: 200,
					height: 100,
				};
				mockButton.active = true;
				accessibilify(mockButton);
				scalerModule.onScaleChange.add.mock.calls[0][0]();
				expect(mockAccessibleDomElement.position.mock.calls[1][0]).toStrictEqual(expectedButtonBounds);
			});

			test("changes the size and position when the scale changes when the button is active and is not a game button", () => {
				const expectedButtonBounds = {
					x: 345,
					y: 345,
					width: 200,
					height: 100,
				};
				mockButton.active = true;
				accessibilify(mockButton, false);
				scalerModule.onScaleChange.add.mock.calls[0][0]();
				expect(mockAccessibleDomElement.position.mock.calls[1][0]).toStrictEqual(expectedButtonBounds);
			});

			//test("changes the size and position when the scale changes if the button is active but does not have a hit area", () => {
			//    mockButton.active = true;
			//    mockButton.input.hitArea = null;
			//    accessibilify(mockButton);
			//    scalerModule.onScaleChange.add.mock.calls[0][0]();
			//    expect(mockAccessibleDomElement.position.mock.calls[1][0]).toEqual(mockButtonBounds);
			//});

			test("does not change the size and position when the scale changes if the button is not active", () => {
				mockButton.active = false;
				accessibilify(mockButton);
				scalerModule.onScaleChange.add.mock.calls[0][0]();
				expect(mockAccessibleDomElement.position).not.toHaveBeenCalled();
			});

			test("tears down the scale change event when the button is destroyed", () => {
				const event = { unsubscribe: jest.fn() };
				scalerModule.onScaleChange.add.mockImplementation(() => event);
				accessibilify(mockButton);
				mockButton.destroy();
				expect(event.unsubscribe).toHaveBeenCalled();
			});
		});
	});

	//TODO now part of accesible dom button update
	//describe("Button Update", () => {
	//    describe("Hiding", () => {
	//        test("hides when button is disabled and the accessible element is shown", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(true);
	//            mockButton.input.enabled = false;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
	//        });
	//
	//        test("hides when button is hidden and the accessible element is shown", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(true);
	//            mockButton.visible = false;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).toHaveBeenCalled();
	//        });
	//
	//        test("does not hide when button input is shown and enabled and the accessible element is shown", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(true);
	//            mockButton.input.enabled = true;
	//            mockButton.visible = true;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
	//        });
	//
	//        test("does not hide when button is disabled and the accessible element is hidden", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(false);
	//            mockButton.input.enabled = false;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
	//        });
	//
	//        test("does not hide when button is hidden and the accessible element is hidden", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(false);
	//            mockButton.visible = false;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
	//        });
	//
	//        test("does not hide when button input is shown and enabled and the accessible element is hidden", () => {
	//            mockAccessibleDomElement.visible.mockReturnValue(false);
	//            mockButton.input.enabled = true;
	//            mockButton.visible = true;
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//            expect(mockAccessibleDomElement.hide).not.toHaveBeenCalled();
	//        });
	//
	//        test("Updates aria label if changed", () => {
	//            mockAccessibleDomElement.el.getAttribute.mockReturnValue("test-name");
	//            mockButton.config.ariaLabel = "test-name locked";
	//            accessibilify(mockButton);
	//            mockScene.sys.events.on.mock.calls[0][1]();
	//
	//            expect(mockAccessibleDomElement.el.setAttribute).toHaveBeenCalledWith("aria-label", "test-name locked");
	//        });
	//    });
	//describe("Showing", () => {
	//    test("shows when button is enabled and visible, and the accessible element is hidden", () => {
	//        mockAccessibleDomElement.visible.mockReturnValue(false);
	//        mockButton.input.enabled = true;
	//        mockButton.visible = true;
	//        accessibilify(mockButton);
	//        mockScene.sys.events.on.mock.calls[0][1]();
	//        expect(mockAccessibleDomElement.show).toHaveBeenCalled();
	//    });
	//
	//    //test("does not show when button is disabled and visible, and the accessible element is hidden", () => {
	//    //    mockAccessibleDomElement.visible.mockReturnValue(false);
	//    //    mockButton.input.enabled = false;
	//    //    mockButton.visible = true;
	//    //    accessibilify(mockButton);
	//    //    mockScene.sys.events.on.mock.calls[0][1]();
	//    //    expect(mockAccessibleDomElement.show).not.toHaveBeenCalled();
	//    //});
	//
	//    test("does not show when button is enabled and hidden, and the accessible element is hidden", () => {
	//        mockAccessibleDomElement.visible.mockReturnValue(false);
	//        mockButton.input.enabled = true;
	//        mockButton.visible = false;
	//        accessibilify(mockButton);
	//        mockScene.sys.events.on.mock.calls[0][1]();
	//        expect(mockAccessibleDomElement.show).not.toHaveBeenCalled();
	//    });
	//
	//    test("does not show when button is enabled and visible, and the accessible element is shown", () => {
	//        mockAccessibleDomElement.visible.mockReturnValue(true);
	//        mockButton.input.enabled = true;
	//        mockButton.visible = true;
	//        accessibilify(mockButton);
	//        mockScene.sys.events.on.mock.calls[0][1]();
	//        expect(mockAccessibleDomElement.show).not.toHaveBeenCalled();
	//    });
	//});
	//});

	describe("Click Action", () => {
		test("dispatches the button's onInputUp event", () => {
			accessibilify(mockButton);
			accessibleDomElement.mock.calls[0][0].onClick();
			expect(mockButton.emit).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_UP);
		});

		test("does not dispatches event if input disabled", () => {
			mockButton.input.enabled = false;
			accessibilify(mockButton);
			accessibleDomElement.mock.calls[0][0].onClick();
			expect(mockButton.emit).not.toHaveBeenCalled();
		});
	});

	describe("Hover State", () => {
		describe("When mouseover event is fired", () => {
			test("dispatches button onInputOver event", () => {
				accessibilify(mockButton);
				accessibleDomElement.mock.calls[0][0].onMouseOver();
				expect(mockButton.emit).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_OVER);
			});
		});

		describe("When mouseout event is fired", () => {
			test("dispatches button onInputOut event", () => {
				accessibilify(mockButton);
				accessibleDomElement.mock.calls[0][0].onMouseOut();
				expect(mockButton.emit).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_OUT);
			});
		});
	});
});
