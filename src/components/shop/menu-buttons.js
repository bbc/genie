/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { textStyle, addText } from "../../components/shop/shop-layout.js";

export const createMenuButtons = container =>
    ["Shop", "Manage"].map((button, idx) => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, container.scene);
        const callback = () => container.scene.stack(button.toLowerCase());
        return makeButton(container, config, idx, callback);
    });

export const createConfirmButtons = (container, callbackFn) =>
    ["Confirm", "Cancel"].map((button, idx) => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, container.scene);
        const callback = () => callbackFn(button);
        const gelButton = makeButton(container, config, idx, callback);
        button === "Confirm" && (gelButton.setLegal = setLegal(gelButton));
        return gelButton;
    });

const getButtonConfig = (button, id, scene) => ({
    title: button,
    gameButton: true,
    accessibilityEnabled: true,
    ariaLabel: button,
    channel: "shop",
    group: scene.scene.key,
    id,
    key: scene.config.assetKeys.buttonBackground,
    scene: "shop",
});

const makeButton = (container, config, idx, callback) => {
    const scene = container.scene;
    const gelButton = scene.add.gelButton(0, 0, config);
    const event = eventBus.subscribe({ callback, channel: config.channel, name: config.id });
    scene.events.once("shutdown", event.unsubscribe);
    setButtonOverlays(scene, gelButton, config.title);
    return accessibilify(gelButton);
};

const setLegal = button => isLegal => (isLegal ? setEnabled(button) : setDisabled(button));

const setEnabled = btn => {
    Object.assign(btn, { alpha: 1, tint: 0xffffff });
    setA11yEnabled(btn, true);
};

const setDisabled = btn => {
    Object.assign(btn, { alpha: 0.25, tint: 0xff0000 });
    setA11yEnabled(btn, false);
};

const setA11yEnabled = (btn, isEnabled) => {
    btn.input.enabled = isEnabled;
    btn.accessibleElement.update();
};

const resizeButton = container => (button, idx) => {
    const right = Boolean(container.scene.config.menu.buttonsRight);
    const bounds = container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = container => container.buttons.forEach(resizeButton(container));

const setButtonOverlays = (scene, button, title) =>
    // button.overlays.set("caption", scene.add.text(0, 0, title, textStyle(scene.config.styleDefaults)).setOrigin(0.5));
    button.overlays.set("caption", addText(scene, 0, 0, title, {}).setOrigin(0.5));
