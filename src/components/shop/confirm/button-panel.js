/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { titleText } from "./prompt-text.js";
import { addText } from "../../../core/layout/text.js";
import { addConfirmButtons } from "./confirm-buttons.js";
import { actions } from "./actions.js";
import { CAMERA_X, CAMERA_Y } from "../../../core/layout/metrics.js";

const getInnerRectBounds = scene => {
	const outerBounds = scene.layout.getSafeArea({}, false);
	const halfWidth = outerBounds.width / 2;
	return {
		x: halfWidth / 2,
		y: 0,
		width: halfWidth * 0.65,
		height: outerBounds.height * 0.6,
	};
};

const getOffsetBounds = (outerBounds, innerBounds) => ({
	...innerBounds,
	y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});
const getButtonX = (x, config) => (config.confirm.buttons.buttonsRight ? x : -x);

const sizeButton = (scene, button, idx, bounds) => {
	const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
	button.setX(CAMERA_X + getButtonX(innerBounds.x, scene.config));
	button.setY(CAMERA_Y + (idx * 200) / 2 + bounds.height / 2 + bounds.y);
	const buttonScaleToEnsureSpacingIsCorrect = 0.8;
	button.setScale((innerBounds.width / button.width) * buttonScaleToEnsureSpacingIsCorrect);
};

const sizeButtons = (scene, buttons, bounds) =>
	buttons.forEach((button, idx) => sizeButton(scene, button, idx, bounds));

const createBuyElements = (container, item) => {
	const scene = container.scene;
	const currencyText = addText(scene, 5, -70, item.price, scene.config).setOrigin(0, 0.5);
	const currencyIcon = scene.add.image(-5, -70, `${scene.assetPrefix}.currencyIcon`).setOrigin(1, 0.5);

	[currencyText, currencyIcon].forEach(obj => container.add(obj));

	return { currencyIcon, currencyText };
};

export const resizeButtonPanel = (scene, panel) => () => {
	const bounds = scene.layout.getSafeArea({}, false);
	const onRight = scene.config.confirm.buttons.buttonsRight;
	onRight ? (bounds.left = 0) : (bounds.width /= 2);
	const newScale = Math.min(bounds.width / panel.container.width, bounds.height / panel.container.height);

	panel.container.setPosition(bounds.centerX, bounds.centerY);
	panel.container.setScale(newScale, newScale);

	sizeButtons(scene, panel.buttons, bounds);

	panel.buttons[1].y += 15;
};

export const createButtonPanel = (scene, item) => {
	const { action } = scene.transientData[scene.scene.key];
	const container = scene.add.container();
	const bounds = scene.layout.getSafeArea({}, false);
	bounds.width = bounds.width / 2;
	bounds.height = 300;
	container.width = 300;
	container.height = 300;

	const title = addText(
		scene,
		0,
		-120,
		titleText[action]({ scene, action, item }),
		scene.config.confirm.prompt,
	).setOrigin(0.5, 0);

	const buttons = addConfirmButtons(
		scene,
		scene.transientData.shop.mode,
		actions[scene.transientData.shop.mode](scene, item),
		item,
	);

	const { currencyIcon, currencyText } = action === "buy" && createBuyElements(container, item);
	container.add(title);

	return {
		container,
		title,
		currencyText,
		currencyIcon,
		buttons,
	};
};
