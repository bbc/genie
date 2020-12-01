/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { handleClickIfVisible } from "./scrollable-list-handlers.js";
import { eventBus } from "../../event-bus.js";
import { overlays1Wide } from "./button-overlays.js";
import { accessibilify } from "../../accessibility/accessibilify.js";
import { collections } from "../../collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const STATES = ["cta", "actioned"];

const createGelButton = (scene, item, title, state, prepTx) => {
    const id = `scroll_button_${item.id}_${title}`;
    const config = scene.config;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel,
        channel: config.eventChannel,
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

    const callback = () => prepTx(item, title);

    const clickEvent = eventBus.subscribe({
        callback: handleClickIfVisible(gelButton, scene, callback),
        channel: gelConfig.channel,
        name: id,
    });
    scene.events.once("shutdown", clickEvent.unsubscribe);

    scaleButton(gelButton, scene.layout, config.listPadding.x);
    makeAccessible(gelButton);
    gelButton.overlays.setAll();
    return gelButton;
};

const scaleButton = (gelButton, layout, space) => {
    const safeArea = layout.getSafeArea({}, false);
    const scaleFactor = (safeArea.width - space * 4) / gelButton.width;
    gelButton.setScale(scaleFactor);
};

const updateButton = button => {
    updateButtonData(button) && updateOverlays(button);
};

const updateButtonData = button => {
    const [itemKey, title] = getItemKeyAndTitle(button);
    const item = collections.get(button.scene.config.paneCollections[title]).get(itemKey);

    const doUpdate = (button, data) => {
        button.item = data;
        return true;
    };

    return fp.isEqual(button.item, item) ? false : doUpdate(button, item);
};

const getState = (item, title) => {
    const isShop = title => (title === "shop" ? true : false);
    const isOwned = item => item.state && item.state === "owned";
    const isEquipped = item => item.state && item.state === "equipped";
    return fp.cond([
        [(i, t) => isShop(t) && !isOwned(i), () => "cta"],
        [(i, t) => isShop(t) && isOwned(i), () => "actioned"],
        [(i, t) => !isShop(t) && !isEquipped(i), () => "cta"],
        [(i, t) => !isShop(t) && isEquipped(i), () => "actioned"],
    ])(item, title);
};

const updateOverlays = button => {
    button.overlays.unsetAll();
    button.overlays.state = getState(button.item, getPaneTitle(button));
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

const makeAccessible = gelButton => accessibilify(gelButton);

export { createGelButton, scaleButton, updateButton, getState };
