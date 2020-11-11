/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { handleClickIfVisible } from "./scrollable-list-handlers.js";
import { eventBus } from "../../event-bus.js";
import { overlays1Wide } from "./button-overlays.js";
import { accessibilify } from "../../../core/accessibility/accessibilify.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const STATES = ["cta", "actioned"];

const createGelButton = (scene, item, context) => {
    const id = `scroll_button_${item.id}`;
    const config = scene.config;

    const state = "cta"; // pass in initial state later

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel,
        channel: config.eventChannel,
        group: scene.scene.key,
        id,
        key: config.assetKeys.itemBackground,
        scene: config.assetKeys.prefix,
        scrollable: true,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);
    gelButton.overlayConfigs = {
        items: config.overlay.items,
        options: config.overlay.options[context],
    };
    gelButton.item = item;
    gelButton.setOverlays = setOverlays(gelButton);
    gelButton.unsetOverlays = unsetOverlays(gelButton);
    gelButton.state = STATES.find(st => st === state);
    gelButton.toggleState = toggleState(gelButton);
    gelButton.handle = handle(gelButton);

    const callback = () => gelButton.handle();

    eventBus.subscribe({
        callback: handleClickIfVisible(gelButton, scene, callback),
        channel: gelConfig.channel,
        name: id,
    });

    scaleButton(gelButton, scene.layout, config.listPadding.x);
    makeAccessible(gelButton);
    gelButton.setOverlays();
    return gelButton;
};

const scaleButton = (gelButton, layout, space) => {
    const safeArea = layout.getSafeArea({}, false);
    const scaleFactor = (safeArea.width - space * 4) / gelButton.width;
    gelButton.setScale(scaleFactor);
};

const handle = button => () => {
    button.unsetOverlays();
    button.toggleState();
    button.setOverlays();
};

const toggleState = button => () =>
    fp.cond([
        [btn => btn.state === "cta", btn => (btn.state = "actioned")],
        [btn => btn.state === "actioned", btn => (btn.state = "cta")],
    ])(button);

const setOverlays = button => () => {
    const configs = getConfigs(button);
    overlays1Wide({ scene: button.scene, gelButton: button, item: button.item, configs }); // this can be simpler now half this lives on the button
};

const getConfigs = button =>
    button.overlayConfigs.items.concat(
        button.overlayConfigs.options.filter(overlay => overlay.activeStates.includes(button.state)),
    );

const unsetOverlays = button => () => {
    Object.keys(button.overlays.list).forEach(key => button.overlays.remove(key));
};

const makeAccessible = gelButton => accessibilify(gelButton);

export { createGelButton, scaleButton };
