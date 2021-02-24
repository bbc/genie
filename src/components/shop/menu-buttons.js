/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { addText } from "../../core/layout/text-elem.js";
import { gmi } from "../../core/gmi/gmi.js";
import { createButton } from "../../core/layout/button-factory.js";

export const createMenuButtons = scene =>
    ["Shop", "Manage"].map(button => {
        const config = getButtonConfig(button, `${button.toLowerCase()}_menu_button`, scene);
        const action = () => {
            scene.stack(button.toLowerCase());
            gmi.setStatsScreen(button === "Shop" ? "shopbuy" : "shopmanage");
        };
        console.log(1)
        const btn =  makeButton(scene, {...config, action});
        return btn
    });

export const createConfirmButtons = (scene, actionText, confirmCallback, cancelCallback) =>
    [actionText, "Cancel"].map(button => {
        const config = getButtonConfig(button, `tx_${button.toLowerCase()}_button`, scene);
        const action = button === "Cancel" ? cancelCallback : confirmCallback;
        console.log(2)
        return makeButton(scene, {...config, action})
    });

const getButtonConfig = (button, id, scene) => ({
    title: button,
    gameButton: true,
    accessibilityEnabled: true,
    ariaLabel: button,
    channel: "shop",
    group: scene.scene.key,
    id,
    key: "menuButtonBackground",
    scene: scene.assetPrefix,
});

const makeButton = (scene, config) => {
    const button = createButton(scene, config);
    setButtonOverlays(scene, button, config.title);
    return button
};



/*
action: ({ screen }) => {
                const belowScreenKey = getScreenBelow(screen).scene.key;
                screen.navigate(screen.context.navigation[belowScreenKey].routes.restart);
                const params = pushLevelId(screen, ["level", "playagain"]);
                gmi.sendStatsEvent(...params);
            },
 */

const resizeButton = pane => (button, idx) => {
    const right = Boolean(pane.container.scene.config.menu.buttonsRight);
    const bounds = pane.container.list[0].getBounds();
    button.setY(CAMERA_Y + bounds.y + bounds.height / 4 + (idx * bounds.height) / 2);
    const xPos = bounds.x + bounds.width / 2;
    button.setX(CAMERA_X + (right ? xPos : -xPos));
    button.setScale(bounds.width / button.width);
};

export const resizeGelButtons = pane => pane.buttons?.forEach(resizeButton(pane));

const setButtonOverlays = (scene, button, title) =>
    button.overlays.set("caption", addText(scene, 0, 0, title, scene.config.menuButtons).setOrigin(0.5));
