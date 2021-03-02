/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { overlays1Wide } from "./button-overlays.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { createButton } from "../../../core/layout/create-button.js";
import { buttonsChannel } from "../../../core/layout/gel-defaults.js";
import { getButtonState } from "./get-button-state.js";

const defaults = {
    gameButton: true,
    key: "itemBackground",
    scrollable: true,
    accessible: true,
};

const getOverlayConfigs = (scene, title) => ({
    items: scene.config.overlay.items,
    options: scene.config.overlay.options[title],
});

const getConfigs = button =>
    getOverlayConfigs(button.scene, button.config.title).items.concat(filterOptionalConfigs(button));

const filterOptionalConfigs = button => {
    const overlayStates = getButtonState(button.scene, button.item, getPaneTitle(button));
    const overlayStateIsInItemState = state => overlayStates.includes(state);
    const overlayConfigs = getOverlayConfigs(button.scene, button.config.title);

    return overlayConfigs.options.filter(overlay => fp.every(overlayStateIsInItemState, overlay.activeInStates));
};

const getItemKeyAndTitle = button => button.config.id.split("_").slice(-2);
const getPaneTitle = button => getItemKeyAndTitle(button).pop();
const setOverlays = button => overlays1Wide(button, getConfigs(button));

export const createListButton = (scene, item, title, action, parent) => {
    const id = `scroll_button_${item.id}_${title}`;
    const ariaLabel = `${item.title} - ${item.description}`;
    const channel = buttonsChannel(scene);
    const group = scene.scene.key;
    const config = { ...defaults, title, id, ariaLabel, scene: scene.assetPrefix, group, channel, action };
    const gelButton = createButton(scene, config);

    gelButton.item = item;
    gelButton.parentContainer = parent //TODO NT hack makes gel buttons calculate correct bounds. Could it be fixed in gel button?...


    const properties = item.state && scene.config.states[item.state] ? scene.config.states[item.state].properties : {};
    Object.assign(gelButton.sprite, properties);

    scaleButton(gelButton, scene.layout, scene.config.listPadding);
    setOverlays(gelButton);
    return gelButton;
};

export const scaleButton = (gelButton, layout, padding) => {
    const safeArea = layout.getSafeArea({}, false);
    const horizontalPadding = padding.x * 2 + padding.outerPadFactor * padding.x * 2;
    const scaleFactor = (safeArea.width - horizontalPadding) / gelButton.width;
    gelButton.setScale(scaleFactor);
};
