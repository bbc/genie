/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "./button-overlays.js";
import { collections } from "../../../core/collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const createGelButton = (scene, item, title) => {
    const id = `scroll_button_${item.id}_${title}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        group: scene.scene.key,
        id,
        key: "itemBackground",
        scene: scene.assetPrefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    gelButton.item = item;

    const properties = item.state && config.states[item.state] ? config.states[item.state].properties : {};
    Object.assign(gelButton.sprite, properties);

    gelButton.overlays = {
        ...gelButton.overlays,
        configs: {
            items: config.overlay.items,
            options: config.overlay.options[title],
        },
        setAll: setOverlays(gelButton),
        unsetAll: unsetOverlays(gelButton),
        state: getButtonState(scene, item, title),
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
    const states = [];
    const inventoryItem = collections.get(scene.config.paneCollections.manage).get(item.id);
    const isPurchased = inventoryItem => isItemInStock(inventoryItem);
    const isEquipped = inventoryItem => inventoryItem?.state === "equipped";
    const isButtonCta = title === "shop" ? isPurchased(inventoryItem) : isEquipped(inventoryItem);
    states.push(isButtonCta ? "actioned" : "cta");
    states.push(isItemEquippable(item) ? "equippable" : "consumable");
    states.push(isItemInStock(item) ? "available" : "unavailable");
    states.push(isItemLocked(item, scene.config) ? "locked" : "unlocked");
    return states;
};

const isItemEquippable = item => Boolean(item.slot);
const isItemInStock = item => Boolean(item?.qty > 0);
const isItemLocked = (item, config) => item.state && config.states[item.state] && config.states[item.state].disabled;

const updateOverlays = button => {
    button.overlays.unsetAll();
    button.overlays.state = getButtonState(button.scene, button.item, getPaneTitle(button));
    button.overlays.setAll();
};

const getConfigs = button => button.overlays.configs.items.concat(filterOptionalConfigs(button.overlays));

const filterOptionalConfigs = overlays => {
    const overlayStateIsInItemState = state => overlays.state.includes(state);
    return overlays.configs.options.filter(overlay => fp.every(overlayStateIsInItemState, overlay.activeInStates));
};

const getItemKeyAndTitle = button => button.config.id.split("_").slice(-2);
const getPaneTitle = button => getItemKeyAndTitle(button).pop();
const setOverlays = button => () => overlays1Wide(button, getConfigs(button));
const unsetOverlays = button => () => Object.keys(button.overlays.list).forEach(key => button.overlays.remove(key));

export { createGelButton, scaleButton, updateButton };
