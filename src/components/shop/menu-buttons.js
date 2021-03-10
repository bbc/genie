/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { addText } from "../../core/layout/text-elem.js";
import { gmi } from "../../core/gmi/gmi.js";
import { createButton } from "../../core/layout/create-button.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";

const defaults = {
    gameButton: true,
    accessible: true,
};

const createMenuButton = scene => buttonText => {
    const id = `${buttonText.toLowerCase()}_menu_button`;
    const ariaLabel = buttonText;
    const action = () => {
        scene.transientData.shop.mode = buttonText.toLowerCase();
        scene.scene.pause();
        scene.addOverlay(scene.scene.key.replace("-menu", "-list"));
        gmi.sendStatsEvent(buttonText === "Shop"? "shopbuy" : "shopmanage", "click", {});
    };

    const config = { ...defaults, title: buttonText, id, ariaLabel, action };

    return makeButton(scene, "menu", config);
};

const makeButton = (scene, buttonType, config) => {
    const channel = buttonsChannel(scene);

    const button = createButton(scene, { ...config, channel, key: scene.config[buttonType].buttons.key });
    setButtonOverlays(scene, button, scene.config[buttonType].buttons, config.title);
    return button;
};

const setButtonOverlays = (scene, button, style, title) =>
    button.overlays.set("caption", addText(scene, 0, 0, title, style).setOrigin(0.5));

const resizeButton = pane => (button, idx) => {
    const right = Boolean(button.scene.config.menu.buttonsRight);
    const bounds = pane.rect.getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const createConfirmButtons = (scene, actionText, confirmCallback, cancelCallback) =>
    [actionText, "Cancel"].map(title => {
        const id = `tx_${title.toLowerCase()}_button`;
        const ariaLabel = title;
        const action = title === "Cancel" ? cancelCallback : confirmCallback;
        const config = { ...defaults, title, id, ariaLabel, action };
        return makeButton(scene, "confirm", config);
    });

export const createMenuButtons = scene => ["Shop", "Manage"].map(createMenuButton(scene));

export const resizeGelButtons = pane => pane.buttons?.forEach(resizeButton(pane));
