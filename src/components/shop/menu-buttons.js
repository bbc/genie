/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

// import { getInnerRectBounds } from "../../components/shop/shop-layout.js";
import { accessibilify } from "../../core/accessibility/accessibilify.js";
import { eventBus } from "../../core/event-bus.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "16px",
    resolution: 5,
};

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

const setLegal = button => isLegal => {
    const clearTintAndAlpha = btn => Object.assign(btn, { alpha: 1, tint: 0xffffff });
    const setTintAndAlpha = btn => Object.assign(btn, { alpha: 0.25, tint: 0xff0000 });
    isLegal ? clearTintAndAlpha(button) : setTintAndAlpha(button);
};

const makeButton = (container, config, idx, callback) => {
    const scene = container.scene;
    const gelButton = scene.add.gelButton(0, 0, config);
    const event = eventBus.subscribe({ callback, channel: config.channel, name: config.id });
    scene.events.once("shutdown", event.unsubscribe);
    setButtonOverlays(scene, gelButton, config.title);
    return accessibilify(gelButton);
};

const resizeButton = container => (button, idx) => {
    const right = Boolean(container.scene.config.menu.buttonsRight);
    const bounds = container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    button.setX(CAMERA_X + (right ? bounds.x + bounds.width / 2 : -bounds.x));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = container => container.buttons.forEach(resizeButton(container));

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

const assetKey = (scene, key) => `${scene.assetPrefix}.${scene.config.assetKeys[key]}`;

const setButtonOverlays = (scene, button, title) => {
    const offset = button.width / 4;
    button.overlays.set("caption", scene.add.text(-offset / 2, 0, title, { ...styleDefaults }).setOrigin(0, 0.5));
    button.overlays.set("icon", scene.add.image(-offset, 0, assetKey(scene, "buttonIcon")));
};
