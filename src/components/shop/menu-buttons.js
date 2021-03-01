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
    key: "menuButtonBackground",
};

const createMenuButton = scene => title => {
    const id = `${title.toLowerCase()}_menu_button`;
    const ariaLabel = title;
    const action = () => {
        scene.transientData.shop.title = title.toLowerCase();
        scene.scene.pause();
        scene.addOverlay(scene.scene.key.replace("-menu", "-list"));
        gmi.setStatsScreen(title === "Shop" ? "shopbuy" : "shopmanage");
    };

    const config = { ...defaults, title, id, ariaLabel, action };

    return makeButton(scene, scene.config.menu.buttons, config);
};

export const createMenuButtons = scene => ["Shop", "Manage"].map(createMenuButton(scene));

export const createConfirmButtons = (scene, actionText, confirmCallback, cancelCallback) =>
    [actionText, "Cancel"].map(title => {
        const id = `tx_${title.toLowerCase()}_button`;
        const ariaLabel = title;
        const action = title === "Cancel" ? cancelCallback : confirmCallback;
        const config = { ...defaults, title, id, ariaLabel, action };
        return makeButton(scene, scene.config.confirm.buttons, config);
    });

const makeButton = (scene, style, config) => {
    const channel = buttonsChannel(scene);
    const group = scene.scene.key;

    const button = createButton(scene, { ...config, channel, group, scene: scene.assetPrefix });
    setButtonOverlays(scene, button, style, config.title);
    return button;
};

const resizeButton = pane => (button, idx) => {
    const right = Boolean(pane.container.scene.config.menu.buttonsRight);
    const bounds = pane.container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = pane => pane.buttons?.forEach(resizeButton(pane));

const setButtonOverlays = (scene, button, style, title) =>
    button.overlays.set("caption", addText(scene, 0, 0, title, style).setOrigin(0.5));
