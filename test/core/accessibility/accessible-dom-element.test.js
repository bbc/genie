/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element.js";

import { accessibleDomElement } from "../../../src/core/accessibility/accessible-dom-element";

describe("Accessible DOM Element", () => {
	let events;
	let mockElement;
	let options;

	beforeEach(() => {
		events = {};
		mockElement = domElement();
		mockElement.addEventListener.mockImplementation((eventName, event) => {
			events[eventName] = event;
		});
		options = {
			onClick: jest.fn(),
			onMouseOver: jest.fn(),
			onMouseOut: jest.fn(),
		};
		global.document.createElement = jest.fn().mockImplementation(() => mockElement);
	});

	afterEach(jest.clearAllMocks);

	describe("Initialize", () => {
		test("creates new div mockElement", () => {
			accessibleDomElement(options);
			expect(global.document.createElement).toHaveBeenCalledWith("div");
		});

		test("sets the id to 'play-button", () => {
			options.id = "play-button";
			accessibleDomElement(options);
			expect(mockElement.getAttribute("id")).toBe(options.id);
		});

		test("sets the html class if provided", () => {
			options.class = "gel-button";
			accessibleDomElement(options);
			expect(mockElement.getAttribute("class")).toBe("gel-button");
		});

		test("does not set a html class if none is given", () => {
			accessibleDomElement(options);
			expect(mockElement.getAttribute("class")).not.toBeDefined();
		});

		test("sets tabindex to 0", () => {
			accessibleDomElement(options);
			expect(mockElement.setAttribute).toHaveBeenCalledWith("tabindex", 0);
		});

		test("sets aria-hidden to the given value", () => {
			options["aria-hidden"] = true;
			accessibleDomElement(options);
			expect(mockElement.getAttribute("aria-hidden")).toBe(true);
		});

		test("does not have an aria-label by default", () => {
			accessibleDomElement(options);
			expect(mockElement.getAttribute("aria-label")).not.toBeDefined();
		});

		test("sets an aria-label if given", () => {
			options["aria-label"] = "Play button";
			accessibleDomElement(options);
			expect(mockElement.getAttribute("aria-label")).toBe("Play button");
		});

		test("does not set aria-hidden by default", () => {
			accessibleDomElement(options);
			expect(mockElement.getAttribute("aria-hidden")).not.toBeDefined();
		});

		test("sets role to correct value", () => {
			accessibleDomElement(options);
			expect(mockElement.getAttribute("role")).toBe("button");
		});

		test("sets style position to absolute", () => {
			accessibleDomElement(options);
			expect(mockElement.style.position).toBe("absolute");
		});

		test("sets cursor to  the correct value", () => {
			accessibleDomElement(options);
			expect(mockElement.style.cursor).toBe("pointer");
		});

		test("sets touch action to prevent iOS tap zoom", () => {
			accessibleDomElement(options);
			expect(mockElement.style.touchAction).toBe("manipulation");
		});

		test("sets pointer events none to prevent firing buttons twice", () => {
			accessibleDomElement(options);
			expect(mockElement.style["pointer-events"]).toBe("none");
		});

		test("sets inner text if given", () => {
			options.text = "Text goes here";
			accessibleDomElement(options);
			expect(mockElement.appendChild).toHaveBeenCalledWith(document.createTextNode("Text goes here"));
		});

		test("pressing enter fires the onclick event", () => {
			const keyUpEvent = { key: "Enter" };
			accessibleDomElement(options);
			events.keyup(keyUpEvent);
			expect(options.onClick).toHaveBeenCalled();
		});

		test("pressing space fires the onclick event", () => {
			const keyUpEvent = { key: " " };
			accessibleDomElement(options);
			events.keyup(keyUpEvent);
			expect(options.onClick).toHaveBeenCalled();
		});

		test("adds click event so that macOS voiceover works", () => {
			accessibleDomElement(options);
			expect(mockElement.addEventListener).toHaveBeenCalledWith("click", options.onClick);
		});

		test("mouseover events are handled", () => {
			accessibleDomElement(options);
			events.mouseover();
			expect(options.onMouseOver).toHaveBeenCalled();
		});

		test("mouseleave events are handled", () => {
			accessibleDomElement(options);
			events.mouseleave();
			expect(options.onMouseOut).toHaveBeenCalled();
		});

		test("focus events are handled", () => {
			accessibleDomElement(options);
			events.focus();
			expect(options.onMouseOver).toHaveBeenCalled();
		});

		test("blur events are handled", () => {
			accessibleDomElement(options);
			events.blur();
			expect(options.onMouseOut).toHaveBeenCalled();
		});

		test("touchmove event disables pinch zoom", () => {
			accessibleDomElement(options);
			const touchMoveEvent = { preventDefault: jest.fn() };
			events.touchmove(touchMoveEvent);
			expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
		});

		test("Adds noop touchstart function so ios voiceover double tap works.", () => {
			accessibleDomElement(options);
			expect(mockElement.addEventListener.mock.calls[7][1]()).not.toBeDefined();
			expect(mockElement.addEventListener).toHaveBeenCalledWith("touchstart", expect.any(Function));
		});

		test("returns a keyup function", () => {
			const mockElement = accessibleDomElement(options);
			const keyUpEvent = { key: "Enter" };
			mockElement.events.keyup(keyUpEvent);
			expect(options.onClick).toHaveBeenCalled();
		});

		test("does not call onClick if options does not have an onClick method", () => {
			delete options.onClick;
			const mockElement = accessibleDomElement(options);
			expect(() => mockElement.events.keyup({ key: "Enter" })).not.toThrow();
		});

		test("does not call onClick when a key that isn't space or escape fires the event", () => {
			const mockElement = accessibleDomElement(options);
			const keyUpEvent = { key: "mockKey" };
			mockElement.events.keyup(keyUpEvent);
			expect(options.onClick).not.toHaveBeenCalled();
		});

		test("returns a click function", () => {
			const mockElement = accessibleDomElement(options);
			mockElement.events.click();
			expect(options.onClick).toHaveBeenCalled();
		});
	});

	describe("el property", () => {
		test("returns the new accessible DOM element", () => {
			expect(accessibleDomElement(options).el).toBe(mockElement);
		});
	});

	describe("setting position of mockElement via position function", () => {
		test("sets css values correctly", () => {
			const newAccessibleElement = accessibleDomElement(options);
			const positionOptions = {
				x: 50,
				y: 50,
				width: 200,
				height: 100,
			};
			newAccessibleElement.position(positionOptions);
			expect(mockElement.style.left).toBe("50px");
			expect(mockElement.style.top).toBe("50px");
			expect(mockElement.style.width).toBe("200px");
			expect(mockElement.style.height).toBe("100px");
		});
	});

	describe("update method", () => {
		test("changes aria label", () => {
			options.button = { config: { ariaLabel: "initial-label" } };

			const accessibleElement = accessibleDomElement(options);
			accessibleElement.button.config.ariaLabel = "updated-label";
			accessibleElement.update();
			expect(accessibleElement.el.getAttribute("aria-label")).toBe("updated-label");
		});

		test("shows element if input disabled", () => {
			options.button = { input: { enabled: true }, config: { ariaLabel: "initial-label" }, visible: true };

			const accessibleElement = accessibleDomElement(options);
			accessibleElement.el.style.visibility = "hidden";
			accessibleElement.update();

			expect(accessibleElement.el.getAttribute("aria-hidden")).toBe(false);
			expect(accessibleElement.el.getAttribute("tabindex")).toBe("0");
			expect(accessibleElement.el.style.display).toBe("block");
			expect(accessibleElement.el.style.visibility).toBe("visible");
		});

		test("does not change aria label if the same as button config's", () => {
			options.button = { config: { ariaLabel: "test-label" }, visible: true };

			const accessibleElement = accessibleDomElement(options);
			accessibleElement.el.setAttribute("aria-label", "test-label");
			jest.clearAllMocks();
			accessibleElement.update();
			expect(accessibleElement.el.setAttribute).not.toHaveBeenCalled();
		});

		test("aria hidden is true if the button config is not set to tabbable", () => {
			options.button = {
				config: { ariaLabel: "test-label", tabbable: false },
				visable: true,
				input: { enabled: false },
			};

			const accessibleElement = accessibleDomElement(options);
			accessibleElement.update();
			expect(accessibleElement.el.setAttribute).toHaveBeenCalledWith("aria-hidden", true);
		});

		test("aria hidden is not set if the button config is set to tabbable", () => {
			options.button = {
				config: { ariaLabel: "test-label", tabbable: true },
				visable: true,
				input: { enabled: false },
			};

			const accessibleElement = accessibleDomElement(options);
			accessibleElement.update();
			expect(accessibleElement.el.getAttribute("aria-hidden")).toBe(undefined);
		});
	});
});
