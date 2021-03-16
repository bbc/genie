/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getInnerRectBounds, getSafeArea } from "../shop-layout.js";
import { resizeBackground } from "../backgrounds.js";
import { scaleItemView } from "./item-view.js";
import { CAMERA_X, CAMERA_Y } from "../../../core/layout/metrics.js";

const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});

const scalePrompt = (scene, elems, bounds, innerBounds) =>
    elems.prompt.setPosition(getButtonX(innerBounds.x, scene.config), promptY(bounds));

const scaleBuyElems = (scene, buyElems, bounds, innerBounds) => {
    buyElems.text.setPosition(getButtonX(innerBounds.x + 28, scene.config), currencyY(bounds));
    buyElems.currency.setPosition(getButtonX(innerBounds.x - 20, scene.config), currencyY(bounds));
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

export const resizeFn = (scene, container, buyElems, buttons, elems) => () => {
    const bounds = getSafeArea(scene.layout);
    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
    const yOffset = bounds.height / 2 + bounds.y;
    const xOffset = scene.config.confirm.buttons.buttonsRight ? -0.25 : 0.25;
    const bgSpec = { yOffset, aspect: 0.5, xOffset };
    container.setY(yOffset);
    resizeBackground(elems.background.constructor)(scene, elems.background, bgSpec);
    scalePrompt(scene, elems, bounds, innerBounds);
    buyElems && scaleBuyElems(scene, buyElems, bounds, innerBounds);
    sizeConfirmButtons(scene, buttons, bounds, innerBounds);
    scaleItemView(elems.itemView, scene.config, bounds);
};
