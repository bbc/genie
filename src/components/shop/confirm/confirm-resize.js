/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getInnerRectBounds } from "../shop-layout.js";
import { scaleItemView } from "./item-view.js";
import { CAMERA_X, CAMERA_Y } from "../../../core/layout/metrics.js";

const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});

const scalePrompt = (scene, elems, innerBounds) =>
    elems.prompt.setPosition(getButtonX(innerBounds.x, scene.config), promptY(innerBounds));

const scaleBuyElems = (scene, buyElems, innerBounds) => {
    buyElems.text.setPosition(getButtonX(innerBounds.x + 28, scene.config), currencyY(innerBounds));
    buyElems.currency.setPosition(getButtonX(innerBounds.x - 20, scene.config), currencyY(innerBounds));
};

const sizeConfirmButton = (scene, button, idx, bounds, innerBounds) => {
    button.setY(CAMERA_Y + (idx * innerBounds.height) / 2 + bounds.height / 2 + bounds.y);
    button.setX(CAMERA_X + getButtonX(innerBounds.x, scene.config));
    button.setScale(innerBounds.width / button.width);
};

const sizeConfirmButtons = (scene, confirmButtons, bounds, innerBounds) =>
    confirmButtons.forEach((button, idx) => sizeConfirmButton(scene, button, idx, bounds, innerBounds));

const getButtonX = (x, config) => (config.confirm.buttons.buttonsRight ? x : -x);
const percentOfHeight = (bounds, percent) => (bounds.height / 100) * percent;
const promptY = outerBounds => -percentOfHeight(outerBounds, 37.5);
const currencyY = outerBounds => -percentOfHeight(outerBounds, 22.5);

export const resizeFn = (scene, buyElems, buttons, elems) => () => {
    const bounds = scene.layout.getSafeArea({}, false);
    const onRight = scene.config.confirm.buttons.buttonsRight;
    onRight ? (bounds.left = 0) : (bounds.width /= 2);
    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));

    scalePrompt(scene, elems, innerBounds);
    buyElems && scaleBuyElems(scene, buyElems, innerBounds);

    sizeConfirmButtons(scene, buttons, bounds, innerBounds);
    scaleItemView(scene, elems.itemView);
};
