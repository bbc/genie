/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange, getMetrics } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";
import { CAMERA_X, CAMERA_Y } from "../layout/metrics.js";

const getHitAreaBounds = button => {
	const sys = button.scene.sys;
	const marginLeft = parseInt(sys.game.canvas.style.marginLeft, 10);
	const marginTop = parseInt(sys.game.canvas.style.marginTop, 10);
	let bounds = button.getHitAreaBounds ? button.getHitAreaBounds() : button.getBounds();
	const metrics = getMetrics();

	return {
		x: (bounds.x + CAMERA_X) * metrics.scale + marginLeft,
		y: (bounds.y + CAMERA_Y) * metrics.scale + marginTop,
		width: bounds.width * metrics.scale,
		height: bounds.height * metrics.scale,
	};
};

const assignEvents = (accessibleElement, button) => {
	const setElementSizeAndPosition = () => {
		if (!button.active) return;
		accessibleElement.position(getHitAreaBounds(button));
	};

	button.setElementSizeAndPosition = setElementSizeAndPosition;

	const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

	let event = onScaleChange.add(resizeAndRepositionElement);
	const _destroy = button.destroy;
	button.destroy = () => {
		event.unsubscribe();
		return _destroy.apply(button);
	};

	resizeAndRepositionElement();
};

const defaults = {
	class: "gel-button",
	onClick: fp.noop,
	onMouseOver: fp.noop,
	onMouseOut: fp.noop,
};

export function accessibilify(button, gameButton = true) {
	const sys = button.scene.sys;
	const scene = button.scene;
	const id = [scene.scene.key, button.config.id].join("__");

	let options = {
		id,
		button,
		"aria-label": button.config.ariaLabel,
	};

	const buttonAction = () => {
		if (!button.input.enabled) return;
		button.emit(Phaser.Input.Events.POINTER_UP);
	};
	const onMouseOver = () => button.emit(Phaser.Input.Events.POINTER_OVER);
	const onMouseOut = () => button.emit(Phaser.Input.Events.POINTER_OUT);

	options = {
		...options,
		...{
			parent: sys.scale.parent,
			onClick: buttonAction,
			onMouseOver,
			onMouseOut: onMouseOut,
		},
	};

	options = { ...defaults, ...options };

	const accessibleElement = accessibleDomElement(options);

	if (gameButton) {
		sys.accessibleButtons.push(button);
	}

	assignEvents(accessibleElement, button);
	button.accessibleElement = accessibleElement;

	a11y.addButton(button);
	a11y.reset();

	return button;
}
