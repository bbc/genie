/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "./button-overlays.js";
import { collections } from "../../collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const STATES = ["cta", "actioned"];

const createGelButton = (scene, item, title, state) => {
    const id = `scroll_button_${item.id}_${title}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        group: scene.scene.key,
        id,
        key: config.assetKeys.itemBackground,
        scene: scene.assetPrefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    gelButton.item = item;

    gelButton.overlays = {
        ...gelButton.overlays,
        configs: {
            items: config.overlay.items,
            options: config.overlay.options[title],
        },
        setAll: setOverlays(gelButton),
        unsetAll: unsetOverlays(gelButton),
        state: STATES.find(st => st === state),
    };

    scaleButton(gelButton, scene.layout, config.listPadding);
    gelButton.overlays.setAll();
    return gelButton;
};

const scaleButton = (gelButton, layout, padding) => {
    const safeArea = layout.getSafeArea({}, false);
    const horizontalPadding = padding.x * 2 + padding.outerPadFactor * padding.x * 2;
    const scaleFactor = (safeArea.width - horizontalPadding) / gelButton.width;
    gelButton.setScale(scaleFactor);
};

const updateButton = button => updateButtonData(button) && updateOverlays(button);

const updateButtonData = button => {
    const [itemKey, title] = getItemKeyAndTitle(button);
    const item = collections.get(button.scene.config.paneCollections[title]).get(itemKey);

    const doUpdate = (button, data) => {
        button.item = data;
        return true;
    };

    return fp.isEqual(button.item, item) ? false : doUpdate(button, item);
};

const getButtonState = (scene, item, title) => {
    const inventoryItem = collections.get(scene.config.paneCollections.manage).get(item.id);
    const isOwned = inventoryItem => inventoryItem?.qty > 0;
    const isEquipped = inventoryItem => inventoryItem?.state === "equipped";
    const isButtonCta = title === "shop" ? isOwned : isEquipped;
    return isButtonCta(inventoryItem) ? "actioned" : "cta";
};

const updateOverlays = button => {
    button.overlays.unsetAll();
    button.overlays.state = getButtonState(button.scene, button.item, getPaneTitle(button));
    button.overlays.setAll();
};

const getConfigs = button =>
    button.overlays.configs.items.concat(
        button.overlays.configs.options.filter(overlay => overlay.activeStates.includes(button.overlays.state)),
    );

const getItemKeyAndTitle = button => button.config.id.split("_").slice(-2);
const getPaneTitle = button => getItemKeyAndTitle(button).pop();
const setOverlays = button => () => overlays1Wide(button, getConfigs(button));
const unsetOverlays = button => () => Object.keys(button.overlays.list).forEach(key => button.overlays.remove(key));

export { createGelButton, scaleButton, updateButton, getButtonState };
